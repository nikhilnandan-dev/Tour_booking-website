from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Booking
import uuid
from tours.models import Tour
from .serializers import BookingSerializer
from tours.models import Tour




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

# 🔍 VERIFY BOOKING ONLY (CORE FEATURE)
@api_view(['GET'])
def verify_booking(request, token):
    try:
        booking = None

        # 🔍 Try UUID (QR)
        try:
            booking = Booking.objects.get(qr_token=uuid.UUID(str(token)))
        except (ValueError, Booking.DoesNotExist):
            pass

        # 🔍 Try ID
        if booking is None:
            try:
                booking = Booking.objects.get(id=int(token))
            except (ValueError, Booking.DoesNotExist):
                pass

        # ❌ Not found → invalid QR
        if booking is None:
            return Response({
                "valid": False,
                "reason": "Invalid QR Code"
            })

        # 🔴 Already used (MOST IMPORTANT CHECK)
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

        # ✅ MARK USED (CRITICAL)
        booking.is_used = True
        booking.save()
        booking.refresh_from_db()

        return Response({
            "valid": True,
            "tour": booking.tour.name,
            "user": booking.user.username,
            "people": booking.number_of_people
        })

    except Exception as e:
        print("VERIFY ERROR:", e)
        return Response({
            "valid": False,
            "reason": "Invalid QR Code"
        })
        
        

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
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def booking_stats(request):
    total = Booking.objects.count()
    active = Booking.objects.filter(is_cancelled=False, is_used=False).count()
    cancelled = Booking.objects.filter(is_cancelled=True).count()
    used = Booking.objects.filter(is_used=True).count()

    return Response({
        "total": total,
        "active": active,
        "cancelled": cancelled,
        "used": used
    })
    


@api_view(['GET'])
def all_bookings(request):
    bookings = Booking.objects.all().order_by('-id')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)