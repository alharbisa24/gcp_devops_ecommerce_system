from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from starlette.middleware.cors import CORSMiddleware

import auth
from crud import (
    create_item,
    delete_item,
    get_all_items,
    get_item_by_id,
    update_item,
)
from db import Base, engine, get_db
from models.items import Item  # noqa: F401
from models.users import User  # noqa: F401
from schemas import ItemCreate, ItemResponse, ItemUpdate, TokenResponse, UserCreate, UserLogin, UserResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/register", response_model=UserResponse, status_code=201)
def register_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    try:
        created_user = auth.register_user(
            db,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            password=user.password,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return created_user


@app.post("/login", response_model=TokenResponse)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    authenticated_user = auth.authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = auth.create_access_token(authenticated_user)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": authenticated_user,
    }


@app.post("/items", response_model=ItemResponse, status_code=201)
def create_new_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
):
    return create_item(
        db=db,
        image=item.image,
        title=item.title,
        model=item.model,
        description=item.description,
        price=item.price,
        storage=item.storage,
        chip=item.chip,
        display=item.display,
        color=item.color,
    )


@app.get("/items", response_model=list[ItemResponse])
def list_items(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    return get_all_items(db, skip=skip, limit=limit)


@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = get_item_by_id(db, item_id)

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    return item


@app.put("/items/{item_id}", response_model=ItemResponse)
def update_existing_item(
    item_id: int,
    item: ItemUpdate,
    db: Session = Depends(get_db),
):
    updated_item = update_item(db, item_id, item.model_dump(exclude_unset=True))

    if not updated_item:
        raise HTTPException(status_code=404, detail="Item not found")

    return updated_item


@app.delete("/items/{item_id}")
def delete_existing_item(item_id: int, db: Session = Depends(get_db)):
    deleted_item = delete_item(db, item_id)

    if not deleted_item:
        raise HTTPException(status_code=404, detail="Item not found")

    return {"message": "Item deleted successfully", "id": deleted_item.id}


