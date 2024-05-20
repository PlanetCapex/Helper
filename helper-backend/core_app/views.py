from typing import List


from django.http import HttpResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from djapy import djapify, djapy_auth
from djapy.pagination import paginate, CursorPagination


from django.contrib.auth import get_user_model
from authentication.schema import TodoItemSchema, TodoItemCreateSchema, TodoItemUpdateSchema
from authentication.schema import ListItemSchema, ListItemCreateSchema, UserInviteSchema
from errors.exception import MessageOut
from .models import TodoItem, ListItem
from datetime import datetime, timedelta

from djapy.core.auth import SessionAuth


AUTH_MECHANISM = SessionAuth


User = get_user_model()


@djapify
@paginate(CursorPagination)
def get_list_items(request, **kwargs) -> List[ListItemSchema]:
    list_items = ListItem.objects.filter(user=request.user)
    if not list_items:
        return None
    return list_items


@djapify
@paginate(CursorPagination)
def get_todo_items(request, **kwargs) -> List[TodoItemSchema]:
    todo_items = TodoItem.objects.filter(list_id=request.GET['list_id'])
    return todo_items


def get_list_by_id(list_id):
    try:
        list_item = ListItem.objects.get(id=list_id)
        return list_item
    except:
        raise MessageOut(
            "List item not found",
            "list_item_not_found",
            "error"
        )


def get_todo_by_id(todo_id):
    try:
        todo_item = TodoItem.objects.get(id=todo_id)
        return todo_item
    except:
        raise MessageOut(
            "Todo item not found",
            "todo_item_not_found",
            "error"
        )


@djapify
def get_list_item(request, list_id: int) -> ListItemSchema:
    list_item = get_list_by_id(list_id)
    if list_item.is_owner(request.user):
        return list_item
    raise MessageOut(
        "You are not allowed to view this item",
        "todo_item_not_found",
        "error"
    )


@djapify
def get_todo_item(request, todo_id: int) -> TodoItemSchema:
    todo_item = get_todo_by_id(todo_id)

    if todo_item.is_owner(request.user):
        return todo_item
    raise MessageOut(
        "You are not allowed to view this item",
        "todo_item_not_found",
        "error"
    )


@djapify(allowed_method="POST")
@djapy_auth(AUTH_MECHANISM, permissions=["core_app.change_todoitem"])
def create_list_item(request, data: ListItemCreateSchema) -> ListItemSchema:
    list_item = ListItem.objects.create(**data.model_dump())
    list_item.user.add(request.user)
    return list_item


@djapify(allowed_method="POST", auth=None)
def create_todo_item(request, data: TodoItemCreateSchema) -> TodoItemSchema:
    todo_item = TodoItem()
    todo_item.title = data.title
    todo_item.will_be_completed_at = data.will_be_completed_at
    todo_item.list_id = ListItem.objects.get(id=data.list_id)
    todo_item.save()
    return todo_item


@djapify(allowed_method="PUT")
@djapy_auth(AUTH_MECHANISM, permissions=["core_app.change_todoitem"])
@csrf_exempt
def update_todo_item(request, todo_id: int, data: TodoItemUpdateSchema) -> TodoItemSchema:
    todo_item = get_todo_by_id(todo_id)
    if data.title:
        todo_item.title = data.title
    if data.description:
        todo_item.description = data.description
    if data.completed_at:
        todo_item.completed_at = data.completed_at
    if data.will_be_completed_at:
        todo_item.will_be_completed_at = data.will_be_completed_at
    todo_item.save()
    return todo_item


@djapify(allowed_method="PATCH")
@djapy_auth(AUTH_MECHANISM, permissions=["core_app.change_todoitem"])
@csrf_exempt
def delete_todo_item(request, todo_id: int, data: TodoItemUpdateSchema):
    try:
        todo_item = get_todo_by_id(todo_id)
        todo_item.delete()
    except:
        return HttpResponse('400')
    return HttpResponse('200')


@djapify(allowed_method="PATCH")
@djapy_auth(AUTH_MECHANISM, permissions=["core_app.change_todoitem"])
@csrf_exempt
def delete_list_item(request, list_id: int):
    try:
        list_item = get_list_by_id(list_id)
        list_item.delete()
    except:
        return HttpResponse('400')
    return HttpResponse('200')


@djapify(allowed_method="PATCH")
@djapy_auth(AUTH_MECHANISM, permissions=["core_app.change_todoitem"])
def toggle_mark_as(request, todo_id: int) -> TodoItemSchema:
    todo_item = get_todo_by_id(todo_id)
    todo_item.completed_at = timezone.now() + timedelta(hours=3) if todo_item.completed_at is None else None
    todo_item.save()
    return todo_item


@djapify(allowed_method="POST")
@djapy_auth(AUTH_MECHANISM, permissions=["core_app.change_todoitem"])
def invite_user(request, data: UserInviteSchema):
    try:
        user = User.objects.get(username=data.username)
    except:
        return HttpResponse('400')
    list_item = ListItem.objects.get(id=data.list_id)
    list_item.user.add(user)
    return HttpResponse('200')
