from rest_framework import serializers
from .models import Booking
from tours.models import Tour

class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = ['id', 'name', 'price', 'location']  # 🔥 include all needed


class BookingSerializer(serializers.ModelSerializer):
    tour = TourSerializer()  # 🔥 nested object

    class Meta:
        model = Booking
        fields = '__all__'