from datetime import datetime
from typing import Optional

from djapy import Schema
from pydantic import constr


class ListItemSchema(Schema):
    id: int
    title: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class ListItemCreateSchema(Schema):
    title: constr(min_length=1)

class TodoItemSchema(Schema):
    id: int
    title: str
    description: str
    completed_at: Optional[datetime]
    will_be_completed_at: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]


class TodoItemCreateSchema(Schema):
    title: constr(min_length=1)
    list_id: int
    description: Optional[str] = ''
    will_be_completed_at: datetime


class TodoItemUpdateSchema(Schema):
    title: Optional[str] = None
    description: Optional[str] = None
    will_be_completed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class UserInviteSchema(Schema):
    username: str
    list_id: int
