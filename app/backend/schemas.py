from typing import Optional

from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    email: str
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ItemBase(BaseModel):
    image: Optional[str] = None
    title: Optional[str] = None
    model: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    storage: Optional[int] = None
    chip: Optional[str] = None
    display: Optional[str] = None
    color: Optional[str] = None


class ItemCreate(ItemBase):
    image: str
    title: str
    model: str
    description: str
    price: int
    storage: int
    chip: str
    display: str
    color: str


class ItemUpdate(ItemBase):
    pass


class ItemResponse(ItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
