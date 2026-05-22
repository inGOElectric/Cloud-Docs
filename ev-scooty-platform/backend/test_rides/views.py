from django.shortcuts import render

# Create your views here.
from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import TestRide
from .serializers import TestRideSerializer


class TestRideViewSet(viewsets.ModelViewSet):
    queryset = TestRide.objects.all().order_by("-created_at")
    serializer_class = TestRideSerializer

    def get_permissions(self):
        if self.action in ["create", "slots_range"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["get"], url_path="slots-range")
    def slots_range(self, request):
        start_value = request.query_params.get("startDate")
        end_value = request.query_params.get("endDate")
        time_slots = [choice[0] for choice in TestRide.TimeSlot.choices]

        def parse_date(value, fallback):
            if not value:
                return fallback
            try:
                return datetime.fromisoformat(value.replace("Z", "+00:00")).date()
            except ValueError:
                return fallback

        today = timezone.localdate()
        start_date = parse_date(start_value, today)
        end_date = parse_date(end_value, today + timedelta(days=60))

        booked_rides = TestRide.objects.exclude(status=TestRide.Status.CANCELLED).filter(
            date__date__gte=start_date,
            date__date__lte=end_date,
        )

        booked = {
            (ride.date.date().isoformat(), ride.time_slot)
            for ride in booked_rides
        }

        days = []
        current = start_date

        while current <= end_date:
            days.append(
                {
                    "date": current.isoformat(),
                    "slots": [
                        {
                            "time": slot,
                            "isBooked": (current.isoformat(), slot) in booked,
                        }
                        for slot in time_slots
                    ],
                }
            )
            current += timedelta(days=1)

        return Response(days)
