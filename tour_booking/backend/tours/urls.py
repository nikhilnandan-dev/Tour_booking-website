from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_tours),
    path('<int:pk>/', views.get_tour),
    
]