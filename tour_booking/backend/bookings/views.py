from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer
from tours.models import Tour


@api_view(['GET'])
def verify_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)

        # ❌ Cancelled
        if booking.is_cancelled:
            return Response({
                "valid": False,
                "reason": "Booking Cancelled"
            }, status=400)

        # ❌ Already used
        if booking.is_used:
            return Response({
                "valid": False,
                "reason": "Already Used"
            }, status=400)

        # ✅ Mark as used
        booking.is_used = True
        booking.save()

        return Response({
            "valid": True,
            "tour": booking.tour.name,
            "user": booking.user.username,
            "people": booking.number_of_people
        })

    except Booking.DoesNotExist:
        return Response({
            "valid": False,
            "reason": "Booking Not Found"
        }, status=404)

# ❌ CANCEL BOOKING (NOT DELETE)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)

        booking.is_cancelled = True
        booking.save()

        return Response({"message": "Booking cancelled"})

    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)


# 📋 GET USER BOOKINGS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


# ➕ CREATE BOOKING
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