from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Feedback as FeedbackModel
from models import Request as RequestModel
from models import Skill as SkillModel
from models import User as UserModel
from models import UserSkill as UserSkillModel
from schemas import (
    FeedbackCreate,
    FeedbackOut,
    MatchOut,
    RequestCreate,
    RequestOut,
    SkillCreate,
    SkillOut,
    StatsOut,
    UserCreate,
    UserLogin,
    UserOut,
    UserSkillCreate,
    UserSkillOut,
    UserUpdate,
)

# Crea le tabelle nel database (se non esistono)
Base.metadata.create_all(bind=engine)

# Usa bcrypt per criptare le password (senza JWT)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title="SkillSwap API")

# Abilita CORS per permettere al frontend di chiamare il backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://192.168.1.45:5173",
        "http://192.168.1.47:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── FUNZIONI DI SUPPORTO ──

def hash_password(password: str) -> str:
    """Cripta la password con bcrypt."""
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    """Verifica la password confrontandola con l'hash salvato."""
    return pwd_context.verify(password, hashed)


def _user_to_out(user: UserModel, db: Session) -> UserOut:
    """Converte un oggetto User in UserOut includendo le skill collegate."""
    skills = db.scalars(
        select(UserSkillModel).where(UserSkillModel.user_id == user.id)
    ).all()
    skills_out = []
    for us in skills:
        skill = db.get(SkillModel, us.skill_id)
        skills_out.append(UserSkillOut(
            id=us.id,
            user_id=us.user_id,
            skill_id=us.skill_id,
            category=us.category,
            level=us.level,
            skill_name=skill.name if skill else "",
        ))
    return UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        bio=user.bio,
        location=user.location,
        level=user.level,
        image_url=user.image_url,
        skills=skills_out,
    )


# ── ENDPOINT GENERALE ──

@app.get("/health")
def health_check():
    """Endpoint per testare se il server è vivo."""
    return {"status": "ok"}


# ── ENDPOINT UTENTI (nessun JWT, usiamo solo l'ID) ──

@app.post("/auth/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = next(get_db())):
    """Registra un nuovo utente e lo restituisce subito (nessun token)."""
    # Controlla se l'email è già usata
    existing = db.scalar(select(UserModel).where(UserModel.email == payload.email))
    if existing:
        raise HTTPException(status_code=409, detail="Email già registrata")

    user = UserModel(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _user_to_out(user, db)


@app.post("/auth/login", response_model=UserOut)
def login(payload: UserLogin, db: Session = next(get_db())):
    """Login: restituisce l'utente se email+password sono corretti."""
    user = db.scalar(select(UserModel).where(UserModel.email == payload.email))
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email o password errati")

    return _user_to_out(user, db)


@app.get("/auth/me", response_model=UserOut)
def get_me(user_id: int = Query(..., description="ID dell'utente loggato"), db: Session = next(get_db())):
    """Restituisce il profilo dell'utente loggato."""
    user = db.get(UserModel, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    return _user_to_out(user, db)


@app.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = next(get_db())):
    """Restituisce il profilo completo di un utente (con le sue skill)."""
    user = db.get(UserModel, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    return _user_to_out(user, db)


@app.put("/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, payload: UserUpdate, db: Session = next(get_db())):
    """Aggiorna i dati del profilo utente (bio, location, level, image_url, name)."""
    user = db.get(UserModel, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    # Aggiorna solo i campi forniti
    if payload.name is not None:
        user.name = payload.name
    if payload.bio is not None:
        user.bio = payload.bio
    if payload.location is not None:
        user.location = payload.location
    if payload.level is not None:
        user.level = payload.level
    if payload.image_url is not None:
        user.image_url = payload.image_url

    db.commit()
    db.refresh(user)
    return _user_to_out(user, db)


# ── RICERCA UTENTI ──

@app.get("/users/search", response_model=list[MatchOut])
def search_users(q: str = Query("", description="Testo da cercare"), db: Session = next(get_db())):
    """Cerca utenti per nome o skill (match parziale)."""
    if not q:
        return []

    # Cerca per nome utente
    users = db.scalars(
        select(UserModel).where(UserModel.name.ilike(f"%{q}%"))
    ).all()

    # Cerca anche per nome skill
    skill_match = db.scalars(
        select(SkillModel).where(SkillModel.name.ilike(f"%{q}%"))
    ).all()
    if skill_match:
        skill_ids = [s.id for s in skill_match]
        user_skills = db.scalars(
            select(UserSkillModel).where(UserSkillModel.skill_id.in_(skill_ids))
        ).all()
        extra_user_ids = {us.user_id for us in user_skills}
        for uid in extra_user_ids:
            u = db.get(UserModel, uid)
            if u and u not in users:
                users.append(u)

    return [_user_to_match(u, db) for u in users]


@app.get("/users/matches", response_model=list[MatchOut])
def get_matches(db: Session = next(get_db())):
    """Restituisce tutti gli utenti come potenziali match."""
    users = db.scalars(select(UserModel)).all()
    return [_user_to_match(u, db) for u in users]


def _user_to_match(user: UserModel, db: Session) -> MatchOut:
    """Converte un utente in formato Match, separando le skill in offerte/cercate."""
    # Calcola rating medio dai feedback ricevuti
    avg_rating = db.scalar(
        select(func.avg(FeedbackModel.rating)).where(FeedbackModel.to_user_id == user.id)
    )
    rating = round(float(avg_rating), 2) if avg_rating else None

    # Legge le skill collegate
    user_skills = db.scalars(
        select(UserSkillModel).where(UserSkillModel.user_id == user.id)
    ).all()

    offerte = []
    cercate = []
    for us in user_skills:
        skill = db.get(SkillModel, us.skill_id)
        name = skill.name if skill else ""
        if us.category == "offer":
            offerte.append(name)
        else:
            cercate.append(name)

    return MatchOut(
        id=user.id,
        name=user.name,
        email=user.email,
        location=user.location,
        level=user.level,
        rating=rating,
        image_url=user.image_url,
        offerte=offerte,
        cercate=cercate,
    )


# ── ENDPOINT SKILL (gestione delle competenze globali) ──

@app.get("/skills", response_model=list[SkillOut])
def list_skills(db: Session = next(get_db())):
    """Restituisce l'elenco di tutte le skill disponibili."""
    skills = db.scalars(select(SkillModel).order_by(SkillModel.name)).all()
    return skills


@app.post("/skills", response_model=SkillOut, status_code=status.HTTP_201_CREATED)
def create_skill(payload: SkillCreate, db: Session = next(get_db())):
    """Crea una nuova skill globale."""
    existing = db.scalar(select(SkillModel).where(SkillModel.name == payload.name))
    if existing:
        raise HTTPException(status_code=409, detail="Skill già esistente")
    skill = SkillModel(name=payload.name)
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill


# ── ENDPOINT USER-SKILL (collegare skill a un utente) ──

@app.get("/users/{user_id}/skills", response_model=list[UserSkillOut])
def get_user_skills(user_id: int, db: Session = next(get_db())):
    """Restituisce tutte le skill collegate a un utente."""
    user_skills = db.scalars(
        select(UserSkillModel).where(UserSkillModel.user_id == user_id)
    ).all()
    result = []
    for us in user_skills:
        skill = db.get(SkillModel, us.skill_id)
        result.append(UserSkillOut(
            id=us.id,
            user_id=us.user_id,
            skill_id=us.skill_id,
            category=us.category,
            level=us.level,
            skill_name=skill.name if skill else "",
        ))
    return result


@app.post("/users/{user_id}/skills", response_model=UserSkillOut, status_code=status.HTTP_201_CREATED)
def add_user_skill(user_id: int, payload: UserSkillCreate, db: Session = next(get_db())):
    """Collega una skill a un utente con categoria (offer/search) e livello."""
    # Verifica che la skill esista
    skill = db.get(SkillModel, payload.skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill non trovata")

    # Evita duplicati (stessa skill + stessa categoria)
    existing = db.scalar(
        select(UserSkillModel).where(
            UserSkillModel.user_id == user_id,
            UserSkillModel.skill_id == payload.skill_id,
            UserSkillModel.category == payload.category,
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Skill già aggiunta in questa categoria")

    us = UserSkillModel(
        user_id=user_id,
        skill_id=payload.skill_id,
        category=payload.category,
        level=payload.level,
    )
    db.add(us)
    db.commit()
    db.refresh(us)
    return UserSkillOut(
        id=us.id,
        user_id=us.user_id,
        skill_id=us.skill_id,
        category=us.category,
        level=us.level,
        skill_name=skill.name,
    )


@app.delete("/users/{user_id}/skills/{us_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user_skill(user_id: int, us_id: int, db: Session = next(get_db())):
    """Rimuove una skill da un utente."""
    us = db.scalar(
        select(UserSkillModel).where(
            UserSkillModel.id == us_id,
            UserSkillModel.user_id == user_id,
        )
    )
    if not us:
        raise HTTPException(status_code=404, detail="Skill non trovata per questo utente")
    db.delete(us)
    db.commit()


# ── ENDPOINT STATS ──

@app.get("/stats/home", response_model=StatsOut)
def get_home_stats(db: Session = next(get_db())):
    """Restituisce le statistiche per la homepage."""
    utenti_attivi = db.scalar(select(func.count(UserModel.id)))
    sessioni_completate = db.scalar(
        select(func.count(RequestModel.id)).where(RequestModel.status == "completed")
    )
    skill_disponibili = db.scalar(select(func.count(SkillModel.id)))
    avg_rating = db.scalar(select(func.avg(FeedbackModel.rating)))

    return StatsOut(
        utenti_attivi=utenti_attivi or 0,
        sessioni_completate=sessioni_completate or 0,
        skill_disponibili=skill_disponibili or 0,
        rating_medio=round(float(avg_rating), 2) if avg_rating else 0,
    )


# ── ENDPOINT RICHIESTE ──

@app.post("/requests", response_model=RequestOut, status_code=status.HTTP_201_CREATED)
def send_request(payload: RequestCreate, from_user_id: int = Query(...), db: Session = next(get_db())):
    """Invia una richiesta di collaborazione a un altro utente."""
    if payload.to_user_id == from_user_id:
        raise HTTPException(status_code=400, detail="Non puoi inviare richiesta a te stesso")

    existing = db.scalar(
        select(RequestModel).where(
            RequestModel.from_user_id == from_user_id,
            RequestModel.to_user_id == payload.to_user_id,
            RequestModel.status.in_(["pending", "accepted"]),
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Richiesta già esistente")

    req = RequestModel(from_user_id=from_user_id, to_user_id=payload.to_user_id)
    db.add(req)
    db.commit()
    db.refresh(req)
    return _request_out(req, db)


@app.put("/requests/{req_id}/accept", response_model=RequestOut)
def accept_request(req_id: int, user_id: int = Query(...), db: Session = next(get_db())):
    """Accetta una richiesta ricevuta."""
    req = db.get(RequestModel, req_id)
    if not req or req.to_user_id != user_id:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Richiesta non in attesa")
    req.status = "accepted"
    db.commit()
    db.refresh(req)
    return _request_out(req, db)


@app.put("/requests/{req_id}/decline", response_model=RequestOut)
def decline_request(req_id: int, user_id: int = Query(...), db: Session = next(get_db())):
    """Rifiuta una richiesta ricevuta."""
    req = db.get(RequestModel, req_id)
    if not req or req.to_user_id != user_id:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Richiesta non in attesa")
    req.status = "declined"
    db.commit()
    db.refresh(req)
    return _request_out(req, db)


@app.put("/requests/{req_id}/complete", response_model=RequestOut)
def complete_request(req_id: int, user_id: int = Query(...), db: Session = next(get_db())):
    """Segna una richiesta come completata."""
    req = db.get(RequestModel, req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    if req.from_user_id != user_id and req.to_user_id != user_id:
        raise HTTPException(status_code=403, detail="Non sei parte di questa richiesta")
    if req.status != "accepted":
        raise HTTPException(status_code=400, detail="La richiesta deve essere prima accettata")
    req.status = "completed"
    db.commit()
    db.refresh(req)
    return _request_out(req, db)


@app.delete("/requests/{req_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_request(req_id: int, user_id: int = Query(...), db: Session = next(get_db())):
    """Cancella una richiesta (solo chi l'ha inviata)."""
    req = db.get(RequestModel, req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    if req.from_user_id != user_id:
        raise HTTPException(status_code=403, detail="Puoi cancellare solo le tue richieste")
    db.delete(req)
    db.commit()


@app.get("/requests/mine", response_model=list[RequestOut])
def get_my_requests(user_id: int = Query(...), db: Session = next(get_db())):
    """Restituisce tutte le richieste dell'utente (inviate e ricevute)."""
    reqs = db.scalars(
        select(RequestModel).where(
            (RequestModel.from_user_id == user_id) | (RequestModel.to_user_id == user_id)
        ).order_by(RequestModel.created_at.desc())
    ).all()
    return [_request_out(r, db) for r in reqs]


@app.get("/requests/pending", response_model=list[RequestOut])
def get_pending_requests(user_id: int = Query(...), db: Session = next(get_db())):
    """Restituisce le richieste in sospeso ricevute dall'utente."""
    reqs = db.scalars(
        select(RequestModel).where(
            RequestModel.to_user_id == user_id,
            RequestModel.status == "pending",
        ).order_by(RequestModel.created_at.desc())
    ).all()
    return [_request_out(r, db) for r in reqs]


def _request_out(req: RequestModel, db: Session) -> RequestOut:
    """Converte una Request in RequestOut con i nomi degli utenti."""
    from_user = db.get(UserModel, req.from_user_id)
    to_user = db.get(UserModel, req.to_user_id)
    return RequestOut(
        id=req.id,
        from_user_id=req.from_user_id,
        to_user_id=req.to_user_id,
        status=req.status,
        created_at=req.created_at,
        from_user_name=from_user.name if from_user else "",
        to_user_name=to_user.name if to_user else "",
    )


# ── ENDPOINT FEEDBACK ──

@app.post("/feedback", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
def submit_feedback(payload: FeedbackCreate, from_user_id: int = Query(...), db: Session = next(get_db())):
    """Invia un feedback per una richiesta completata."""
    req = db.get(RequestModel, payload.request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    if req.status != "completed":
        raise HTTPException(status_code=400, detail="Puoi recensire solo richieste completate")
    if req.from_user_id != from_user_id and req.to_user_id != from_user_id:
        raise HTTPException(status_code=403, detail="Non sei parte di questa richiesta")

    existing = db.scalar(
        select(FeedbackModel).where(
            FeedbackModel.request_id == payload.request_id,
            FeedbackModel.from_user_id == from_user_id,
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Hai già recensito questa richiesta")

    fb = FeedbackModel(
        from_user_id=from_user_id,
        to_user_id=payload.to_user_id,
        request_id=payload.request_id,
        rating=payload.rating,
        comment=payload.comment or "",
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return _feedback_out(fb, db)


@app.get("/users/{user_id}/feedback", response_model=list[FeedbackOut])
def get_user_feedback(user_id: int, db: Session = next(get_db())):
    """Restituisce tutti i feedback ricevuti da un utente."""
    fbs = db.scalars(
        select(FeedbackModel).where(FeedbackModel.to_user_id == user_id).order_by(FeedbackModel.created_at.desc())
    ).all()
    return [_feedback_out(fb, db) for fb in fbs]


def _feedback_out(fb: FeedbackModel, db: Session) -> FeedbackOut:
    """Converte un Feedback in FeedbackOut con il nome del mittente."""
    from_user = db.get(UserModel, fb.from_user_id)
    return FeedbackOut(
        id=fb.id,
        from_user_id=fb.from_user_id,
        to_user_id=fb.to_user_id,
        request_id=fb.request_id,
        rating=fb.rating,
        comment=fb.comment,
        created_at=fb.created_at,
        from_user_name=from_user.name if from_user else "",
    )
