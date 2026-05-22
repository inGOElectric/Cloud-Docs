from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Vehicle
from .serializers import VehicleSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "ADMIN":
            return Vehicle.objects.all().order_by("-created_at")

        if user.role == "CUSTOMER":
            return Vehicle.objects.filter(owner=user).order_by("-created_at")

        return Vehicle.objects.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
