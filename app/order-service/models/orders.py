from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, relationship

from db import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    subtotal = Column(Float, nullable=False)
    image = Column(String(255), nullable=True)
    model = Column(String(100), nullable=True)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    order_number = Column(String(32), unique=True, nullable=False)
    user_id = Column(Integer, nullable=True)
    user_email = Column(String(255), nullable=False)
    user_name = Column(String(255), nullable=False)
    shipping_address = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="pending")
    total_amount = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    items = relationship("OrderItem", backref="order", cascade="all, delete-orphan")
