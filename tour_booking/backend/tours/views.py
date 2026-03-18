from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Tour
from .serializers import TourSerializer
from django.http import HttpResponse

@api_view(['GET'])
def get_tours(request):
    tours = Tour.objects.all()
    serializer = TourSerializer(tours, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_tour(request, pk):
    try:
        tour = Tour.objects.get(id=pk)
        serializer = TourSerializer(tour)
        return Response(serializer.data)
    except Tour.DoesNotExist:
        return Response({'error': 'Tour not found'}, status=404)
    
    from django.http import HttpResponse

def home(request):
    return HttpResponse("Backend running")
