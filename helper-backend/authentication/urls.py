from django.urls import path

from authentication import views

urlpatterns = [
    path('get-user', views.get_user, name='get-user'),
    path('login', views.login_for_session, name='login-for-session'),
    path('register', views.register_user, name='register_user'),
]
