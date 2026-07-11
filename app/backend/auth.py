import hashlib
import os
import secrets
import time
from typing import Optional

from sqlalchemy.orm import Session

from models.users import User

SECRET_KEY = os.getenv("SECRET_KEY")
def create_access_token(user: User) -> str:
    payload = {"sub": user.id, "exp": int(time.time()) + 3600}
    raw_string = f"{payload['sub']}:{payload['exp']}:{SECRET_KEY}"
    return f"{payload['sub']}:{payload['exp']}:{hashlib.sha256(raw_string.encode()).hexdigest()}"

def decode_access_token(token: str) -> Optional[int]:
    try:
        user_id_str, exp_str, signature = token.split(":", 2)
    except ValueError:
        return None

    expected_signature = hashlib.sha256(f"{user_id_str}:{exp_str}:{SECRET_KEY}".encode()).hexdigest()
    if secrets.compare_digest(signature, expected_signature):
        if int(exp_str) > int(time.time()):
            return int(user_id_str)

    return None


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    derived_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"pbkdf2_sha256$100000${salt.hex()}${derived_key.hex()}"


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        _, iterations, salt_hex, digest_hex = hashed_password.split("$", 3)
    except ValueError:
        return False

    iterations = int(iterations)
    salt = bytes.fromhex(salt_hex)
    hash_value = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        iterations,
    )
    return secrets.compare_digest(hash_value.hex(), digest_hex)


def register_user(
    db: Session,
    *,
    email: str,
    username: str,
    full_name: Optional[str],
    password: str,
) -> User:
    existing_user = (
        db.query(User).filter((User.email == email) | (User.username == username)).first()
    )
    if existing_user:
        raise ValueError("User with this email or username already exists")

    user = User(
        email=email,
        username=username,
        full_name=full_name,
        hashed_password=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email_or_username: str, password: str) -> Optional[User]:
    user = (
        db.query(User)
        .filter((User.email == email_or_username) | (User.username == email_or_username))
        .first()
    )
    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user
