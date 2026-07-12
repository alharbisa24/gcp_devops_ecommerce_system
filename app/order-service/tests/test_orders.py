import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db import Base
from crud import create_order, get_order_by_number, list_orders, list_orders_by_user
from schemas import OrderCreate, OrderItemCreate


class OrderServiceTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(bind=self.engine)
        self.Session = sessionmaker(bind=self.engine)

    def test_create_order_and_retrieve(self):
        db = self.Session()
        payload = OrderCreate(
            user_id=1,
            user_email="buyer@example.com",
            user_name="Buyer Name",
            shipping_address="123 Market St",
            items=[
                OrderItemCreate(item_id=10, title="iPhone 15", price=999.99, quantity=1),
                OrderItemCreate(item_id=11, title="AirPods Pro", price=249.99, quantity=2),
            ],
        )

        order = create_order(db, payload)
        self.assertIsNotNone(order.id)
        self.assertEqual(order.status, "completed")
        self.assertEqual(order.total_amount, 999.99 + 249.99 * 2)

        retrieved = get_order_by_number(db, order.order_number)
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.id, order.id)
        self.assertEqual(len(retrieved.items), 2)

        all_orders = list_orders(db)
        self.assertEqual(len(all_orders), 1)
        self.assertEqual(all_orders[0].id, order.id)

        user_orders = list_orders_by_user(db, 1)
        self.assertEqual(len(user_orders), 1)
        self.assertEqual(user_orders[0].id, order.id)

        db.close()


if __name__ == "__main__":
    unittest.main()
