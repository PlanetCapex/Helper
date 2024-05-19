from typing import Dict

from django.contrib.auth import authenticate, login, get_user_model
from django.views.decorators.csrf import csrf_exempt
from djapy import djapify, Schema, djapy_auth, SessionAuth
from djapy.schema.user import UserSchema
from typing_extensions import TypedDict


class MessageOut(TypedDict):
    message: str
    message_type: str
    alias: str


class LoginSchema(Schema):
    username: str
    password: str


class RegisterSchema(Schema):
    username: str
    password: str


class InLine(TypedDict):
    inline: Dict[str, str]


User = get_user_model()


@djapify(allowed_method='POST')
@csrf_exempt
def register_user(request, data: RegisterSchema, *args, **kwargs) -> {200: MessageOut, 400: InLine}:
    user = User.objects.create_user(data.username, password=data.password)
    user.user_permissions.add(2)
    user.save()
    login(request, user)

    return {
        "message": "User logged in successfully.",
        "message_type": "success",
        "alias": "login_success",
    }


@djapify(allowed_method='POST')
@csrf_exempt
def login_for_session(request, data: LoginSchema, *args, **kwargs) -> {200: MessageOut, 400: InLine}:
    try:
        if data.username:
            user = User.objects.get(username=data.username)
        else:
            user = User.objects.get(email=data.email)
    except User.DoesNotExist or User.MultipleObjectsReturned:
        return 400, {
            "inline": {
                "username": "User with this username does not exist.",
                "email": "User with this email does not exist."
            }
        }

    if not user.check_password(data.password):
        return 400, {
            "inline": {
                "password": "Password is incorrect."
            }
        }

    login(request, user)

    return {
        "message": "User logged in successfully.",
        "message_type": "success",
        "alias": "login_success",
    }


@djapify
@djapy_auth(SessionAuth)
def get_user(request, *args, **kwargs) -> UserSchema:
    return request.user
