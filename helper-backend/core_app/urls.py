from django.urls import path

from core_app import views

urlpatterns = [
    path('todo/all', views.get_todo_items, name='get-todo-items'),
    path('todo/<int:todo_id>', views.get_todo_item, name='get-todo-item'),
    path('todo/create', views.create_todo_item, name='create-todo-item'),
    path('todo/<int:todo_id>/update', views.update_todo_item, name='update-todo-item'),
    path('todo/<int:todo_id>/toggle-as-complete', views.toggle_mark_as, name='mark-as-complete'),
    path('todo/<int:todo_id>/delete', views.delete_todo_item, name='delete-todo-item'),
    path('list/all', views.get_list_items, name='get-list-items'),
    path('list/create', views.create_list_item, name='create-list-items'),
    path('list/<int:list_id>', views.get_list_item, name='get-list-item'),
    path('list/<int:list_id>/delete', views.delete_list_item, name='delete-list-item'),
    path('list/invite', views.invite_user, name='invite_user'),
]
