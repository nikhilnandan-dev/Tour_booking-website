from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_booking),
    path('my/', views.my_bookings),
    path('delete/<int:booking_id>/', views.delete_booking),
]