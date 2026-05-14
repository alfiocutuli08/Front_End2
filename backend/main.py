from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from auth import create_access_token, get_current_user, hash_password, verify_password
from database import Base, engine, get_db
from models import Feedback as FeedbackModel
from models import Request as RequestModel
from models import User
from schemas import (
    FeedbackCreate,
    FeedbackOut,
    RequestCreate,
    RequestOut,
    Token,
    UserCreate,
    UserLogin,
    UserRead,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkillSwap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://192.168.1.45:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


# ── AUTH ──


@app.post("/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.scalar(select(User).where(User.email == payload.email))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return Token(access_token=create_access_token(str(user.id)))


@app.post("/auth/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    return Token(access_token=create_access_token(str(user.id)))


@app.get("/auth/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user


# ── USERS ──


@app.get("/users/{user_id}/public", response_model=UserRead)
def get_public_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ── REQUESTS ──


@app.post("/requests", response_model=RequestOut, status_code=status.HTTP_201_CREATED)
def send_request(
    payload: RequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.to_user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot send request to yourself")

    existing = db.scalar(
        select(RequestModel).where(
            RequestModel.from_user_id == current_user.id,
            RequestModel.to_user_id == payload.to_user_id,
            RequestModel.status.in_(["pending", "accepted"]),
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Request already exists")

    req = RequestModel(from_user_id=current_user.id, to_user_id=payload.to_user_id)
    db.add(req)
    db.commit()
    db.refresh(req)
    return _request_out(req, current_user, db)


@app.put("/requests/{req_id}/accept", response_model=RequestOut)
def accept_request(
    req_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.get(RequestModel, req_id)
    if not req or req.to_user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Request is not pending")
    req.status = "accepted"
    db.commit()
    db.refresh(req)
    return _request_out(req, current_user, db)


@app.put("/requests/{req_id}/decline", response_model=RequestOut)
def decline_request(
    req_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.get(RequestModel, req_id)
    if not req or req.to_user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Request is not pending")
    req.status = "declined"
    db.commit()
    db.refresh(req)
    return _request_out(req, current_user, db)


@app.put("/requests/{req_id}/complete", response_model=RequestOut)
def complete_request(
    req_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.get(RequestModel, req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.from_user_id != current_user.id and req.to_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your request")
    if req.status != "accepted":
        raise HTTPException(status_code=400, detail="Request must be accepted first")
    req.status = "completed"
    db.commit()
    db.refresh(req)
    return _request_out(req, current_user, db)


@app.delete("/requests/{req_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_request(
    req_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.get(RequestModel, req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.from_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Can only cancel your own requests")
    db.delete(req)
    db.commit()


@app.get("/requests/mine", response_model=list[RequestOut])
def get_my_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reqs = db.scalars(
        select(RequestModel).where(
            (RequestModel.from_user_id == current_user.id) | (RequestModel.to_user_id == current_user.id)
        ).order_by(RequestModel.created_at.desc())
    ).all()
    return [_request_out(r, current_user, db) for r in reqs]


@app.get("/requests/pending", response_model=list[RequestOut])
def get_pending_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reqs = db.scalars(
        select(RequestModel).where(
            RequestModel.to_user_id == current_user.id,
            RequestModel.status == "pending",
        ).order_by(RequestModel.created_at.desc())
    ).all()
    return [_request_out(r, current_user, db) for r in reqs]


def _request_out(req: RequestModel, _current_user: User, db: Session) -> RequestOut:
    from_user = db.get(User, req.from_user_id)
    to_user = db.get(User, req.to_user_id)
    return RequestOut(
        id=req.id,
        from_user_id=req.from_user_id,
        to_user_id=req.to_user_id,
        status=req.status,
        created_at=req.created_at,
        from_user_name=from_user.name if from_user else "",
        to_user_name=to_user.name if to_user else "",
    )


# ── FEEDBACKS ──


@app.post("/feedback", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
def submit_feedback(
    payload: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.get(RequestModel, payload.request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "completed":
        raise HTTPException(status_code=400, detail="Can only review completed requests")
    if req.from_user_id != current_user.id and req.to_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your request")

    existing = db.scalar(
        select(FeedbackModel).where(
            FeedbackModel.request_id == payload.request_id,
            FeedbackModel.from_user_id == current_user.id,
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Already reviewed this request")

    fb = FeedbackModel(
        from_user_id=current_user.id,
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
def get_user_feedback(user_id: int, db: Session = Depends(get_db)):
    fbs = db.scalars(
        select(FeedbackModel).where(FeedbackModel.to_user_id == user_id).order_by(FeedbackModel.created_at.desc())
    ).all()
    return [_feedback_out(fb, db) for fb in fbs]


def _feedback_out(fb: FeedbackModel, db: Session) -> FeedbackOut:
    from_user = db.get(User, fb.from_user_id)
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
