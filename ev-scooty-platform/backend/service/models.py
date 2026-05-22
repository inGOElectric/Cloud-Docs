from django.conf import settings
from django.db import models
from accounts.models import User


class ServiceBooking(models.Model):
    class Status(models.TextChoices):
        NEW = "NEW", "New"
        CLAIMED = "CLAIMED", "Claimed"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="service_bookings",
    )

    vehicle = models.ForeignKey(
        "vehicles.Vehicle",
        on_delete=models.CASCADE,
        related_name="service_bookings",
        null=True,
        blank=True,
    )

    vehicle_part = models.CharField(max_length=100)
    service_type = models.CharField(max_length=100)
    preferred_date = models.DateTimeField()
    time_slot = models.CharField(max_length=50)
    notes = models.TextField(blank=True)

    

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )
    viewed_by_admin_at = models.DateTimeField(null=True, blank=True)

    claimed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="claimed_service_bookings",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer} - {self.service_type} - {self.status}"


class JobCard(models.Model):
    class Status(models.TextChoices):
        OPEN = "OPEN", "Open"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        CLOSED = "CLOSED", "Closed"

    class ServiceType(models.TextChoices):
        GENERAL = "GENERAL", "General"
        COMPLAINT = "COMPLAINT", "Complaint"
        BATTERY = "BATTERY", "Battery"
        CHARGER = "CHARGER", "Charger"
        PAID_SERVICE_REPAIRABLE = "PAID_SERVICE_REPAIRABLE", "Paid Service Repairable"
        PAID_SERVICE_WARRANTY = "PAID_SERVICE_WARRANTY", "Paid Service Warranty"
        SPARES_DISPATCH = "SPARES_DISPATCH", "Spares Dispatch"

    job_card_number = models.CharField(max_length=100, unique=True)

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_cards",
    )
    vehicle = models.ForeignKey(
        "vehicles.Vehicle",
        on_delete=models.CASCADE,
        related_name="job_cards",
    )

    service_booking = models.OneToOneField(
        ServiceBooking,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="job_card",
    )

    service_in_datetime = models.DateTimeField()
    service_type = models.CharField(max_length=50, choices=ServiceType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)

    odometer = models.PositiveIntegerField(null=True, blank=True)
    battery_voltage = models.FloatField(null=True, blank=True)
    remarks = models.TextField(blank=True)

    assigned_technician = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_job_cards",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.job_card_number


class ServiceComplaint(models.Model):
    class Category(models.TextChoices):
        BATTERY = "Battery", "Battery"
        BRAKES = "Brakes", "Brakes"
        SUSPENSION = "Suspension", "Suspension"
        CHARGER = "Charger", "Charger"
        ELECTRONICS = "Electronics", "Electronics"
        DISPLAY = "Display", "Display"
        POWER = "Power", "Power"
        OTHERS = "Others", "Others"

    class WorkType(models.TextChoices):
        PAID = "PAID", "Paid"
        COMPLAINT = "COMPLAINT", "Complaint"
        WARRANTY = "WARRANTY", "Warranty"

    service_booking = models.ForeignKey(
    ServiceBooking,
    on_delete=models.CASCADE,
    related_name="complaints",
    null=True,
    blank=True,
)

    job_card = models.ForeignKey(
    JobCard,
    on_delete=models.CASCADE,
    related_name="complaints",
    null=True,
    blank=True,
)

    category = models.CharField(max_length=50, choices=Category.choices)
    work_type = models.CharField(max_length=50, choices=WorkType.choices)
    description = models.TextField()
    viewed_by_admin_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.work_type}"


class VehicleInspection(models.Model):
    class Condition(models.TextChoices):
        OK = "OK", "OK"
        REPAIRABLE = "REPAIRABLE", "Repairable"
        DAMAGED = "DAMAGED", "Damaged"


    job_card = models.ForeignKey(
        JobCard,
        on_delete=models.CASCADE,
        related_name="inspections",
    )
    component_name = models.CharField(max_length=100)
    condition = models.CharField(max_length=20, choices=Condition.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.component_name} - {self.condition}"


class PartsReplacement(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        ISSUED = "ISSUED", "Issued"

    job_card = models.ForeignKey(
        JobCard,
        on_delete=models.CASCADE,
        related_name="parts_replacements",
    )
    complaint = models.ForeignKey(
        ServiceComplaint,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="parts_requests",
    )
    requested_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="parts_requests",
    )
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_parts_requests",
    )
    part_name = models.CharField(max_length=150)
    part_number = models.CharField(max_length=100, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    reason = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    replaced_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)



class WorkLog(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"

    job_card = models.ForeignKey(
        JobCard,
        on_delete=models.CASCADE,
        related_name="work_logs",
    )

    complaint = models.ForeignKey(
        ServiceComplaint,
        on_delete=models.CASCADE,
        related_name="work_logs",
        null=True,
        blank=True,
    )

    technician = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="work_logs",
    )

    task_name = models.CharField(max_length=150)
    description = models.TextField(blank=True)

    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.task_name


class JobCardMedia(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = "IMAGE", "Image"
        VIDEO = "VIDEO", "Video"

    class Context(models.TextChoices):
        INSPECTION = "INSPECTION", "Inspection"
        COMPLAINT = "COMPLAINT", "Complaint"
        PART_REPLACEMENT = "PART_REPLACEMENT", "Part Replacement"
        GENERAL = "GENERAL", "General"

    job_card = models.ForeignKey(
        JobCard,
        on_delete=models.CASCADE,
        related_name="media",
    )
    file = models.FileField(upload_to="job_cards/")
    file_type = models.CharField(max_length=20, choices=MediaType.choices)
    context = models.CharField(max_length=50, choices=Context.choices, default=Context.GENERAL)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.job_card} - {self.file_type}"


class ServiceBookingMedia(models.Model):
    service_booking = models.ForeignKey(
        ServiceBooking,
        on_delete=models.CASCADE,
        related_name="media",
    )
    file = models.FileField(upload_to="service_bookings/")
    file_type = models.CharField(max_length=50)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.service_booking} - {self.file_type}"
