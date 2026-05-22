from rest_framework import serializers

from .models import TestRide


class TestRideSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestRide
        fields = "__all__"
