import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware

from crud import (
    OrderNotFoundError,
    OrderPersistenceError,
    create_order,
    get_order,
    get_order_by_number,
    list_orders,
    list_orders_by_user,
    update_order,
    update_order_status,
)
from db import Base, engine, get_db
from models.orders import Order, OrderItem  # noqa: F401
from schemas import OrderCreate, OrderResponse, OrderStatusUpdate, OrderUpdate


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)





app = FastAPI(title="Order Service")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok"}




@app.post("/orders", response_model=OrderResponse, status_code=201)
def create_new_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        return create_order(db, order)
    except OrderPersistenceError:
        logger.error("Order creation failed")
        raise HTTPException(status_code=503, detail="Unable to create order") from None


@app.get("/orders", response_model=list[OrderResponse])
def get_orders(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    try:
        return list_orders(db, limit=limit, offset=offset)
    except SQLAlchemyError:
        logger.error("Order listing failed")
        raise HTTPException(status_code=503, detail="Unable to retrieve orders") from None


@app.get("/orders/user/{user_id}", response_model=list[OrderResponse])
def get_user_orders(
    user_id: int,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    try:
        return list_orders_by_user(db, user_id=user_id, limit=limit, offset=offset)
    except SQLAlchemyError:
        logger.error("User order listing failed")
        raise HTTPException(status_code=503, detail="Unable to retrieve user orders") from None


@app.get("/orders/by-number/{order_number}", response_model=OrderResponse)
def get_order_by_order_number(order_number: str, db: Session = Depends(get_db)):
    order = get_order_by_number(db, order_number)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.get("/orders/{order_id}", response_model=OrderResponse)
def get_order_details(order_id: int, db: Session = Depends(get_db)):
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.patch("/orders/{order_id}", response_model=OrderResponse)
def update_order_details(order_id: int, payload: OrderUpdate, db: Session = Depends(get_db)):
    try:
        return update_order(db, order_id, payload)
    except OrderNotFoundError:
        raise HTTPException(status_code=404, detail="Order not found") from None
    except OrderPersistenceError:
        logger.error("Order update failed")
        raise HTTPException(status_code=503, detail="Unable to update order") from None


@app.patch("/orders/{order_id}/status", response_model=OrderResponse)
def change_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)):
    try:
        return update_order_status(db, order_id, payload.status)
    except OrderNotFoundError:
        raise HTTPException(status_code=404, detail="Order not found") from None
    except OrderPersistenceError:
        logger.error("Order status update failed")
        raise HTTPException(status_code=503, detail="Unable to update order status") from None
