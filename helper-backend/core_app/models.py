from django.db import models


class ListItem(models.Model):
    user = models.ManyToManyField('auth.User', related_name='user')
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def is_owner(self, user):
        return self.user.filter(id=user.id).exists()


class TodoItem(models.Model):
    list_id = models.ForeignKey(ListItem, on_delete=models.CASCADE, related_name='list_id', null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    completed_at = models.DateTimeField(null=True, blank=True)
    will_be_completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def is_owner(self, user):
        return self.list_id.user.filter(id=user.id).exists()
