from django.contrib import admin
from django.urls import path, include
from tours.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/tours/', include('tours.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/users/', include('users.urls')),   
    
]