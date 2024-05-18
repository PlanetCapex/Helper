from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('data/', include('core_app.urls'), name="data"),
    path('user/', include('authentication.urls'), name="user"),
    path('admin/', admin.site.urls),

]
