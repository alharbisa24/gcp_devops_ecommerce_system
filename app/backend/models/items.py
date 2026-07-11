from sqlalchemy import Column, Integer, String

from db import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True)
    image = Column(String(255))
    title = Column(String(100))
    model = Column(String(100))
    description = Column(String(255))
    price = Column(Integer)
    storage = Column(Integer)
    chip = Column(String(100))
    display = Column(String(100))
    color = Column(String(100))


Car = Item