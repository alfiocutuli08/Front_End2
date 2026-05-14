from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = {"from_attributes": True}


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
