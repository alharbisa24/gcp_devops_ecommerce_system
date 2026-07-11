import uuid
from datetime import datetime
from typing import List

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from models.orders import Order, OrderItem
from schemas import OrderCreate, OrderStatusUpdate, OrderUpdate


class OrderNotFoundError(Exception):
    pass


class OrderPersistenceError(Exception):
    pass


def _generate_order_number() -> str:
    return uuid.uuid4().hex.upper()[:12]


def _calculate_totals(items: List[OrderItem]) -> float:
    return sum(item.price * item.quantity for item in items)


def create_order(db: Session, payload: OrderCreate) -> Order:
    order_items = [
        OrderItem(
            item_id=item.item_id,
            title=item.title,
            price=item.price,
            quantity=item.quantity,
            image=item.image,
            model=item.model,
            subtotal=item.price * item.quantity,
        )
        for item in payload.items
    ]

    order = Order(
        order_number=_generate_order_number(),
        user_id=payload.user_id,
        user_email=payload.user_email,
        user_name=payload.user_name,
        shipping_address=payload.shipping_address,
        status="completed",
        total_amount=_calculate_totals(order_items),
        completed_at=datetime.utcnow(),
        items=order_items,
    )

    try:
        db.add(order)
        db.commit()
        db.refresh(order)
        return order
    except SQLAlchemyError as exc:
        db.rollback()
        raise OrderPersistenceError from exc


def list_orders(db: Session, limit: int = 50, offset: int = 0):
    return db.query(Order).order_by(Order.created_at.desc()).offset(offset).limit(limit).all()


def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()


def get_order_by_number(db: Session, order_number: str):
    return db.query(Order).filter(Order.order_number == order_number).first()


def update_order(db: Session, order_id: int, payload: OrderUpdate):
    order = get_order(db, order_id)
    if not order:
        raise OrderNotFoundError

    order.user_email = payload.user_email
    order.user_name = payload.user_name
    order.shipping_address = payload.shipping_address

    try:
        db.commit()
        db.refresh(order)
        return order
    except SQLAlchemyError as exc:
        db.rollback()
        raise OrderPersistenceError from exc


def update_order_status(db: Session, order_id: int, status: str):
    order = get_order(db, order_id)
    if not order:
        raise OrderNotFoundError

    order.status = status
    if status == "completed":
        order.completed_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(order)
        return order
    except SQLAlchemyError as exc:
        db.rollback()
        raise OrderPersistenceError from exc
