from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('apiv1/data/', include('core_app.urls'), name="data"),
    path('apiv1/user/', include('authentication.urls'), name="user"),
    path('apiv1/admin/', admin.site.urls),

]
