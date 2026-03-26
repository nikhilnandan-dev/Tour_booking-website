from rest_framework import serializers
from .models import Booking
from tours.serializers import TourSerializer

class BookingSerializer(serializers.ModelSerializer):
    tour = TourSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'tour', 'number_of_people', 'is_cancelled', 'is_used', 'created_at']
        