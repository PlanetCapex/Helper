from django.contrib import admin

from core_app.models import TodoItem


# Register your models here.
@admin.register(TodoItem)
class TodoItemAdmin(admin.ModelAdmin):
    pass
