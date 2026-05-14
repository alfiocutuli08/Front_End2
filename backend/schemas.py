from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── SCHEMI UTENTE ──

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=4, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    bio: str | None = None
    location: str | None = None
    level: str | None = None
    image_url: str | None = None
    skills: list["UserSkillOut"] = []

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: str | None = None
    bio: str | None = None
    location: str | None = None
    level: str | None = None
    image_url: str | None = None


# ── SCHEMI SKILL ──

class SkillCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)


class SkillOut(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


# ── SCHEMI USER-SKILL ──

class UserSkillCreate(BaseModel):
    skill_id: int
    category: str = Field(pattern="^(offer|search)$")   # solo "offer" o "search"
    level: str = Field(pattern="^(Principiante|Intermedio|Avanzato)$")


class UserSkillOut(BaseModel):
    id: int
    user_id: int
    skill_id: int
    category: str
    level: str
    skill_name: str = ""   # Popolato dal backend con il nome della skill

    model_config = {"from_attributes": True}


# ── SCHEMI RICHIESTA ──

class RequestCreate(BaseModel):
    to_user_id: int


class RequestOut(BaseModel):
    id: int
    from_user_id: int
    to_user_id: int
    status: str
    created_at: datetime
    from_user_name: str = ""
    to_user_name: str = ""

    model_config = {"from_attributes": True}


# ── SCHEMI FEEDBACK ──

class FeedbackCreate(BaseModel):
    to_user_id: int
    request_id: int
    rating: int = Field(ge=1, le=5)
    comment: str = Field(default="", max_length=500)


class FeedbackOut(BaseModel):
    id: int
    from_user_id: int
    to_user_id: int
    request_id: int
    rating: int
    comment: str | None
    created_at: datetime
    from_user_name: str = ""

    model_config = {"from_attributes": True}


# ── STATS ──

class StatsOut(BaseModel):
    utenti_attivi: int = 0
    sessioni_completate: int = 0
    skill_disponibili: int = 0
    rating_medio: float = 0


# ── MATCH (per la ricerca) ──

class MatchOut(BaseModel):
    id: int
    name: str
    email: str
    location: str | None = None
    level: str | None = None
    rating: float | None = None
    image_url: str | None = None
    offerte: list[str] = []
    cercate: list[str] = []
