from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class OrderItemBase(BaseModel):
    item_id: int
    title: str
    price: float
    quantity: int = Field(gt=0)
    image: Optional[str] = None
    model: Optional[str] = None


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemResponse(OrderItemBase):
    id: int
    subtotal: float

    model_config = ConfigDict(from_attributes=True)


class OrderBase(BaseModel):
    user_id: Optional[int] = None
    user_email: str
    user_name: str
    shipping_address: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderUpdate(OrderBase):
    shipping_address: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: str


class OrderResponse(OrderBase):
    id: int
    order_number: str
    status: str
    total_amount: float
    items: List[OrderItemResponse]
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
