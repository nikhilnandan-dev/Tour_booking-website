from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Booking
import uuid
from tours.models import Tour
from .serializers import BookingSerializer


# ✅ USER BOOKINGS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


# 🔍 VERIFY BOOKING (QR / ID)
@api_view(['GET'])
def verify_booking(request, token):
    try:
        booking = None

        # 🔍 Try QR token
        try:
            booking = Booking.objects.get(qr_token=uuid.UUID(str(token)))
        except (ValueError, Booking.DoesNotExist):
            pass

        # 🔍 Try ID fallback
        if booking is None:
            try:
                booking = Booking.objects.get(id=int(token))
            except (ValueError, Booking.DoesNotExist):
                pass

        # ❌ Not found
        if booking is None:
            return Response({
                "valid": False,
                "reason": "Invalid QR Code"
            })

        # 🔴 Already used
        if booking.is_used:
            return Response({
                "valid": False,
                "reason": "Ticket Already Used"
            })

        # 🔴 Cancelled
        if booking.is_cancelled:
            return Response({
                "valid": False,
                "reason": "Cancelled Ticket"
            })

        # ✅ FIRST TIME → mark used
        booking.is_used = True
        booking.save()

        return Response({
    "valid": True,
    "tour": booking.tour.name,
    "location": booking.tour.location,
    "price": booking.tour.price,
    "user": booking.user.username,
    "people": booking.number_of_people
})

    except Exception as e:
        print("VERIFY ERROR:", e)
        return Response({
            "valid": False,
            "reason": "Invalid QR Code"
        })


# ✅ CREATE BOOKING
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    user = request.user
    tour_id = request.data.get('tour')
    people = request.data.get('number_of_people')

    if not tour_id or not people:
        return Response({"error": "Missing data"}, status=400)

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


# ❌ CANCEL BOOKING
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_booking(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, user=request.user)

        booking.is_cancelled = True
        booking.save()

        return Response({
            "message": "Booking cancelled successfully"
        })

    except Booking.DoesNotExist:
        return Response({
            "error": "Booking not found"
        }, status=404)


# 📊 ADMIN STATS
@api_view(['GET'])
def booking_stats(request):
    total = Booking.objects.count()

    active = Booking.objects.filter(
        is_cancelled=False,
        is_used=False
    ).count()

    cancelled = Booking.objects.filter(
        is_cancelled=True
    ).count()

    used = Booking.objects.filter(
        is_used=True,
        is_cancelled=False
    ).count()

    return Response({
        "total": total,
        "active": active,
        "cancelled": cancelled,
        "used": used
    })


# 📋 ALL BOOKINGS (ADMIN)
@api_view(['GET'])
def all_bookings(request):
    bookings = Booking.objects.all().order_by('-id')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


# ✅ MARK USED (MANUAL ADMIN)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_used(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)

        if booking.is_cancelled:
            return Response({
                "error": "Cannot mark cancelled ticket as used"
            }, status=400)

        if booking.is_used:
            return Response({
                "message": "Already marked as used"
            })

        booking.is_used = True
        booking.save()

        return Response({
            "message": "Marked as used successfully"
        })

    except Booking.DoesNotExist:
        return Response({
            "error": "Booking not found"
        }, status=404)