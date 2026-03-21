from rest_framework import serializers
from .models import Booking

# 👇 THIS is the connection
from tours.serializers import TourSerializer

class BookingSerializer(serializers.ModelSerializer):
    tour = TourSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'