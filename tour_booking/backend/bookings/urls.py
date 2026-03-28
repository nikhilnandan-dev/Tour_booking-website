from django.urls import path
from . import views
from .views import admin_cancel, all_bookings, booking_stats, mark_used, verify_booking

urlpatterns = [
    path('create/', views.create_booking),
    path('my/', views.my_bookings),
    path('delete/<int:booking_id>/', views.delete_booking),
    path('verify/<uuid:token>/', verify_booking),
    path('stats/', views.booking_stats),
    path('all/', all_bookings),
    path('mark-used/<int:booking_id>/', mark_used),
    path('admin-cancel/<int:booking_id>/', admin_cancel),
]