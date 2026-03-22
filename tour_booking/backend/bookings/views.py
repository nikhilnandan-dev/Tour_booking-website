from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from tours.models import Tour
from tours.serializers import TourSerializer

@api_view(['GET'])
def verify_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)

        return Response({
            "valid": True,
            "tour": booking.tour.name,
            "user": booking.user.username,
            "people": booking.number_of_people
        })

    except Booking.DoesNotExist:
        return Response({
            "valid": False
        }, status=404)
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)
        booking.delete()
        return Response({"message": "Booking deleted"})
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    user = request.user
    tour_id = request.data.get('tour')
    people = request.data.get('number_of_people')

    try:
        tour = Tour.objects.get(id=tour_id)
    except Tour.DoesNotExist:
        return Response({"error": "Tour not found"}, status=404)

    booking = Booking.objects.create(
        user=user,
        tour=tour,
        number_of_people=people
    )

    return Response({
        "message": "Booking successful",
        "booking_id": booking.id
    })