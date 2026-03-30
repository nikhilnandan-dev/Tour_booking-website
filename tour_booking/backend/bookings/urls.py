from django.urls import path
from .views import verify_booking, create_booking, my_bookings, delete_booking, booking_stats, all_bookings

urlpatterns = [
    path('verify/<uuid:token>/', verify_booking),
    path('create/', create_booking),
    path('my/', my_bookings),
    path('delete/<int:booking_id>/', delete_booking),

    # 🔥 ADMIN
    path('stats/', booking_stats),
    path('all/', all_bookings),
]