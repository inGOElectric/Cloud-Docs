from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from rest_framework import serializers





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
from .serializers import (
    JobCardMediaSerializer,
    JobCardSerializer,
    PartsReplacementSerializer,
    ServiceBookingMediaSerializer,
    ServiceBookingSerializer,
    ServiceComplaintSerializer,
    VehicleInspectionSerializer,
    WorkLogSerializer,
)


def normalized_role(user):
    return str(getattr(user, "role", "")).strip().upper().replace(" ", "_")


class ServiceBookingViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceBookingSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["post"], url_path="create-job-card")
    def create_job_card(self, request, pk=None):
        booking = self.get_object()

        if normalized_role(request.user) not in ["ADMIN", "SERVICE_ADVISOR"]:
            return Response(
                {"detail": "Only admin or service advisor can create job cards."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if hasattr(booking, "job_card"):
            return Response(
                {"detail": "Job card already exists for this booking."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not booking.vehicle:
            return Response(
                {"detail": "This booking does not have a selected vehicle."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_type = request.data.get("service_type")
        service_in_datetime = request.data.get("service_in_datetime")
        assigned_technician = request.data.get("assigned_technician")
        remarks = request.data.get("remarks", "")

        if not service_type or not service_in_datetime:
            return Response(
                {"detail": "service_type and service_in_datetime are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        job_card = JobCard.objects.create(
            job_card_number=f"JC-PENDING-{booking.id}-{int(timezone.now().timestamp())}",
            customer=booking.customer,
            vehicle=booking.vehicle,
            service_booking=booking,
            service_type=service_type,
            service_in_datetime=service_in_datetime,
            assigned_technician_id=assigned_technician or None,
            remarks=remarks,
        )
        job_card.job_card_number = f"JC-{job_card.id}"
        job_card.save(update_fields=["job_card_number", "updated_at"])

        booking.complaints.update(job_card=job_card)

        booking.status = ServiceBooking.Status.CLAIMED
        booking.save()

        serializer = JobCardSerializer(job_card)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    

    def get_queryset(self):
        user = self.request.user
        role = normalized_role(user)

        if role in ["ADMIN", "SERVICE_ADVISOR"]:
            return ServiceBooking.objects.all().order_by("-created_at")

        if role == "CUSTOMER":
            return ServiceBooking.objects.filter(customer=user).order_by("-created_at")

        if role == "TECHNICIAN":
            return ServiceBooking.objects.filter(claimed_by=user).order_by("-created_at")

        return ServiceBooking.objects.none()

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class JobCardViewSet(viewsets.ModelViewSet):
    serializer_class = JobCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = normalized_role(user)

        if role in ["ADMIN", "SERVICE_ADVISOR"]:
            return JobCard.objects.all().order_by("-created_at")

        if role == "CUSTOMER":
            return JobCard.objects.filter(customer=user).order_by("-created_at")

        if role == "TECHNICIAN":
            return JobCard.objects.filter(assigned_technician=user).order_by("-created_at")

        return JobCard.objects.none()
    
    def partial_update(self, request, *args, **kwargs):
        job_card = self.get_object()

        if job_card.status == JobCard.Status.CLOSED:
            return Response(
                {"detail": "Cannot edit a closed job card."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_reading_update = (
            "odometer" in request.data or "battery_voltage" in request.data
        )

        if is_reading_update and (
            job_card.odometer is not None or job_card.battery_voltage is not None
        ):
            return Response(
                {"detail": "Odometer and battery voltage are already saved."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().partial_update(request, *args, **kwargs)


    @action(detail=True, methods=["post"], url_path="close")
    def close_job_card(self, request, pk=None):
        job_card = self.get_object()

        if normalized_role(request.user) not in ["ADMIN", "SERVICE_ADVISOR", "TECHNICIAN"]:
            return Response(
                {"detail": "You do not have permission to close this job card."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if job_card.status == JobCard.Status.CLOSED:
            return Response(
                {"detail": "Job card is already closed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not job_card.inspections.exists():
            return Response(
                {"detail": "Inspection must be submitted before closing job card."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not job_card.work_logs.filter(status=WorkLog.Status.COMPLETED).exists():
            return Response(
                {"detail": "At least one completed work log is required before closing job card."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        has_unresolved_parts = job_card.parts_replacements.filter(
            status__in=[
                PartsReplacement.Status.PENDING,
                PartsReplacement.Status.APPROVED,
            ]
        ).exists()

        if has_unresolved_parts:
            return Response(
                {"detail": "All spare part requests must be rejected or issued before closing job card."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        job_card.status = JobCard.Status.CLOSED
        job_card.closed_at = timezone.now()
        job_card.save(update_fields=["status", "closed_at", "updated_at"])

        serializer = JobCardSerializer(job_card)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="save-readings")
    def save_readings(self, request, pk=None):
        job_card = self.get_object()

        if normalized_role(request.user) not in ["ADMIN", "SERVICE_ADVISOR", "TECHNICIAN"]:
            return Response(
                {"detail": "You do not have permission to save readings."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if job_card.status == JobCard.Status.CLOSED:
            return Response(
                {"detail": "Cannot add readings to a closed job card."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if job_card.odometer is not None and job_card.battery_voltage is not None:
            return Response(
                {"detail": "Odometer and battery voltage are already saved."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        odometer = request.data.get("odometer")
        battery_voltage = request.data.get("battery_voltage")

        if odometer in [None, ""] or battery_voltage in [None, ""]:
            return Response(
                {"detail": "Odometer and battery voltage are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            odometer = int(odometer)
            battery_voltage = float(battery_voltage)
        except (TypeError, ValueError):
            return Response(
                {"detail": "Enter valid odometer and battery voltage values."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if odometer < 0:
            return Response(
                {"detail": "Odometer cannot be negative."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if battery_voltage <= 0:
            return Response(
                {"detail": "Battery voltage must be greater than zero."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        job_card.odometer = odometer
        job_card.battery_voltage = battery_voltage
        job_card.save(update_fields=["odometer", "battery_voltage", "updated_at"])

        serializer = JobCardSerializer(job_card)
        return Response(serializer.data, status=status.HTTP_200_OK)




class ServiceComplaintViewSet(viewsets.ModelViewSet):
    queryset = ServiceComplaint.objects.all().order_by("-created_at")
    serializer_class = ServiceComplaintSerializer
    permission_classes = [IsAuthenticated]


class VehicleInspectionViewSet(viewsets.ModelViewSet):
    queryset = VehicleInspection.objects.all().order_by("-created_at")
    serializer_class = VehicleInspectionSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        job_card = serializer.validated_data.get("job_card")
        component_name = serializer.validated_data.get("component_name")

        if job_card.status == JobCard.Status.CLOSED:
            raise serializers.ValidationError(
                "Cannot add inspection to a closed job card."
            )

        if job_card.inspections.filter(component_name=component_name).exists():
            raise serializers.ValidationError(
                "This inspection component is already submitted for this job card."
            )

        serializer.save()



def can_manage_parts(user):
    return normalized_role(user) in ["ADMIN", "SERVICE_ADVISOR"] or user.is_staff or user.is_superuser

class PartsReplacementViewSet(viewsets.ModelViewSet):
    queryset = PartsReplacement.objects.all().order_by("-created_at")
    serializer_class = PartsReplacementSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        job_card = serializer.validated_data.get("job_card")

        if job_card.status == JobCard.Status.CLOSED:
            raise serializers.ValidationError(
                "Cannot request spare parts for a closed job card."
            )

        serializer.save(
            requested_by=self.request.user,
            status=PartsReplacement.Status.PENDING,
        )

    @action(detail=True, methods=["post"], url_path="approve")
    def approve(self, request, pk=None):
        part_request = self.get_object()

        if not can_manage_parts(request.user):

            return Response(
                {"detail": "Only admin or service advisor can approve requests."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if part_request.status != PartsReplacement.Status.PENDING:
            return Response(
                {"detail": "Only pending requests can be approved."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        part_request.status = PartsReplacement.Status.APPROVED
        part_request.approved_by = request.user
        part_request.approved_at = timezone.now()
        part_request.save(update_fields=["status", "approved_by", "approved_at"])

        serializer = self.get_serializer(part_request)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        part_request = self.get_object()

        if not can_manage_parts(request.user):

            return Response(
                {"detail": "Only admin or service advisor can reject requests."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if part_request.status != PartsReplacement.Status.PENDING:
            return Response(
                {"detail": "Only pending requests can be rejected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        part_request.status = PartsReplacement.Status.REJECTED
        part_request.approved_by = request.user
        part_request.approved_at = timezone.now()
        part_request.save(update_fields=["status", "approved_by", "approved_at"])

        serializer = self.get_serializer(part_request)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="issue")
    def issue(self, request, pk=None):
        part_request = self.get_object()

        if not can_manage_parts(request.user):

            return Response(
                {"detail": "Only admin or service advisor can issue parts."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if part_request.status != PartsReplacement.Status.APPROVED:
            return Response(
                {"detail": "Only approved requests can be issued."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        part_request.status = PartsReplacement.Status.ISSUED
        part_request.replaced_at = timezone.now()
        part_request.save(update_fields=["status", "replaced_at"])

        serializer = self.get_serializer(part_request)
        return Response(serializer.data)




class WorkLogViewSet(viewsets.ModelViewSet):
    queryset = WorkLog.objects.all().order_by("-created_at")
    serializer_class = WorkLogSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        job_card = serializer.validated_data.get("job_card")

        if job_card.status == JobCard.Status.CLOSED:
            raise serializers.ValidationError(
                "Cannot add work log to a closed job card."
            )

        role = normalized_role(self.request.user)

        if role != "TECHNICIAN":
            raise serializers.ValidationError(
                "Only technician can add work logs."
            )

        if job_card.assigned_technician and job_card.assigned_technician != self.request.user:
            raise serializers.ValidationError(
                "Only the assigned technician can add work logs for this job card."
            )

        serializer.save(
            technician=job_card.assigned_technician or self.request.user,
            status=WorkLog.Status.IN_PROGRESS,
            completed_at=None,
        )

    @action(detail=True, methods=["post"], url_path="complete")
    def complete(self, request, pk=None):
        work_log = self.get_object()

        if work_log.status == WorkLog.Status.COMPLETED:
            return Response(
                {"detail": "Work log is already completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        work_log.status = WorkLog.Status.COMPLETED
        work_log.completed_at = timezone.now()
        work_log.save(update_fields=["status", "completed_at"])

        serializer = self.get_serializer(work_log)
        return Response(serializer.data)







class JobCardMediaViewSet(viewsets.ModelViewSet):
    queryset = JobCardMedia.objects.all().order_by("-uploaded_at")
    serializer_class = JobCardMediaSerializer
    permission_classes = [IsAuthenticated]


class ServiceBookingMediaViewSet(viewsets.ModelViewSet):
    queryset = ServiceBookingMedia.objects.all().order_by("-created_at")
    serializer_class = ServiceBookingMediaSerializer
    permission_classes = [IsAuthenticated]
