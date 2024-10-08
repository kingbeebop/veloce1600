from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from ..models import Car
from ..serializers import CarSerializer

class CustomPagination(PageNumberPagination):
    page_size = 20  # Default page size
    page_size_query_param = 'page_size'  # Allow clients to set the page size
    max_page_size = 100  # Maximum page size limit

class CarList(generics.ListCreateAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    pagination_class = CustomPagination  # Use custom pagination class

class CarDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
