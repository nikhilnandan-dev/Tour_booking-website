from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_booking),
    path('my/', views.my_bookings),   # THIS MUST EXIST
]