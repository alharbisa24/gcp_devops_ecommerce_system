from sqlalchemy.orm import Session

from models.items import Item


def create_item(
    db: Session,
    *,
    image: str,
    title: str,
    model: str,
    description: str,
    price: int,
    storage: int,
    chip: str,
    display: str,
    color: str,
) -> Item:
    db_item = Item(
        image=image,
        title=title,
        model=model,
        description=description,
        price=price,
        storage=storage,
        chip=chip,
        display=display,
        color=color,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_all_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Item).offset(skip).limit(limit).all()


def get_item_by_id(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()


def update_item(db: Session, item_id: int, item_data: dict):
    db_item = get_item_by_id(db, item_id)
    if not db_item:
        return None

    for field, value in item_data.items():
        if hasattr(db_item, field):
            setattr(db_item, field, value)

    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int):
    db_item = get_item_by_id(db, item_id)
    if not db_item:
        return None

    db.delete(db_item)
    db.commit()
    return db_item
