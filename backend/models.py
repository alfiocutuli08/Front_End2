from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


# ── TABELLA UTENTI ──
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(80))          # Nome visibile
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)  # Usato per login
    hashed_password: Mapped[str] = mapped_column(String(255))  # Password criptata con bcrypt
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Bio, posizione, livello e immagine profilo (opzionali)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(String(100), nullable=True)
    level: Mapped[str | None] = mapped_column(String(30), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Relazioni con altre tabelle
    sent_requests = relationship("Request", foreign_keys="Request.from_user_id", back_populates="from_user")
    received_requests = relationship("Request", foreign_keys="Request.to_user_id", back_populates="to_user")
    given_feedback = relationship("Feedback", foreign_keys="Feedback.from_user_id", back_populates="from_user")
    received_feedback = relationship("Feedback", foreign_keys="Feedback.to_user_id", back_populates="to_user")
    skills = relationship("UserSkill", back_populates="user")  # Skill collegate all'utente


# ── TABELLA SKILL (competenze disponibili nel sistema) ──
class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)  # Nome della skill (es. "React")


# ── TABELLA PONTE: associa una skill a un utente ──
class UserSkill(Base):
    __tablename__ = "user_skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id: Mapped[int] = mapped_column(Integer, ForeignKey("skills.id"), nullable=False)
    category: Mapped[str] = mapped_column(String(20))   # "offer" = la offre, "search" = la cerca
    level: Mapped[str] = mapped_column(String(30))       # Principiante / Intermedio / Avanzato

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill")


# ── TABELLA RICHIESTE DI COLLABORAZIONE ──
class Request(Base):
    __tablename__ = "requests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    from_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    to_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending | accepted | declined | completed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    from_user = relationship("User", foreign_keys=[from_user_id], back_populates="sent_requests")
    to_user = relationship("User", foreign_keys=[to_user_id], back_populates="received_requests")


# ── TABELLA FEEDBACK (dati dopo il completamento) ──
class Feedback(Base):
    __tablename__ = "feedbacks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    from_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    to_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    request_id: Mapped[int] = mapped_column(Integer, ForeignKey("requests.id"), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)      # Da 1 a 5
    comment: Mapped[str] = mapped_column(Text, nullable=True)         # Commento opzionale
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    from_user = relationship("User", foreign_keys=[from_user_id], back_populates="given_feedback")
    to_user = relationship("User", foreign_keys=[to_user_id], back_populates="received_feedback")
    request = relationship("Request")
