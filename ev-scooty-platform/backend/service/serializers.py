from rest_framework import serializers
from accounts.models import User
from vehicles.models import Vehicle


from .models import (
    JobCard,
    JobCardMedia,
    PartsReplacement,
    ServiceBooking,
    ServiceBookingMedia,
    ServiceComplaint,
    VehicleInspection,
    WorkLog,
)

class ServiceComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceComplaint
        fields = "__all__"




class VehicleInspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleInspection
        fields = "__all__"

class WorkLogSerializer(serializers.ModelSerializer):
    technician = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="TECHNICIAN"),
        required=False,
        allow_null=True,
    )
    technician_username = serializers.CharField(source="technician.username", read_only=True)
    complaint_description = serializers.CharField(
        source="complaint.description",
        read_only=True,
    )

    class Meta:
        model = WorkLog
        fields = "__all__"


class PartsReplacementSerializer(serializers.ModelSerializer):
    requested_by_username = serializers.CharField(
        source="requested_by.username",
        read_only=True,
    )
    approved_by_username = serializers.CharField(
        source="approved_by.username",
        read_only=True,
    )

    class Meta:
        model = PartsReplacement
        fields = "__all__"
        read_only_fields = (
            "requested_by",
            "approved_by",
            "approved_at",
            "created_at",
        )


class JobCardSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="CUSTOMER")
    )
    assigned_technician = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="TECHNICIAN"),
        required=False,
        allow_null=True,
    )
    vehicle = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all()
    )

    complaints = ServiceComplaintSerializer(many=True, read_only=True)
    inspections = VehicleInspectionSerializer(many=True, read_only=True)
    work_logs = WorkLogSerializer(many=True, read_only=True)
    parts_replacements = PartsReplacementSerializer(many=True, read_only=True)

    customer_username = serializers.CharField(
        source="customer.username",
        read_only=True,
    )
    vehicle_vin = serializers.CharField(
        source="vehicle.vin_number",
        read_only=True,
    )
    assigned_technician_username = serializers.CharField(
        source="assigned_technician.username",
        read_only=True,
    )

    class Meta:
        model = JobCard
        fields = "__all__"


class ServiceBookingSerializer(serializers.ModelSerializer):
    claimed_by = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="TECHNICIAN"),
        required=False,
        allow_null=True,
    )

    customer_username = serializers.CharField(source="customer.username", read_only=True)
    claimed_by_username = serializers.CharField(source="claimed_by.username", read_only=True)
    complaints = ServiceComplaintSerializer(many=True, read_only=True)
    vehicle_vin = serializers.CharField(source="vehicle.vin_number", read_only=True)
    vehicle_model = serializers.CharField(source="vehicle.model", read_only=True)
    job_card_id = serializers.SerializerMethodField()
    job_card_number = serializers.SerializerMethodField()

    def get_job_card_id(self, obj):
        if hasattr(obj, "job_card"):
            return obj.job_card.id
        return None

    def get_job_card_number(self, obj):
        if hasattr(obj, "job_card"):
            return obj.job_card.job_card_number
        return None


    class Meta:
        model = ServiceBooking
        fields = (
            "id",
            "customer",
            "customer_username",
            "vehicle",
            "vehicle_vin",
            "vehicle_model",
            "vehicle_part",
            "service_type",
            "preferred_date",
            "time_slot",
            "notes",
            "status",
            "viewed_by_admin_at",
            "claimed_by",
            "claimed_by_username",
            "complaints",
            "created_at",
            "job_card_id",
            "job_card_number",

            

        )
        read_only_fields = (
            "customer",
            "customer_username",
            "claimed_by_username",
            "created_at",
        )





class JobCardMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCardMedia
        fields = "__all__"


class ServiceBookingMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceBookingMedia
        fields = "__all__"

