from rest_framework import serializers

from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Vehicle
        fields = (
            "id",
            "owner",
            "owner_username",
            "vin_number",
            "model",
            "registration_number",
            "battery_number",
            "motor_number",
            "charger_number",
            "warranty_status",
            "image_url",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "owner",
            "owner_username",
            "created_at",
            "updated_at",
        )
