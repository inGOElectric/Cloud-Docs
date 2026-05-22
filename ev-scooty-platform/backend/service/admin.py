from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()

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


@admin.register(ServiceBooking)
class ServiceBookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer",
        "vehicle_part",
        "service_type",
        "preferred_date",
        "time_slot",
        "status",
        "claimed_by",
        "created_at",
    )
    list_filter = ("status", "service_type", "preferred_date")
    search_fields = ("customer__username", "customer__phone", "vehicle_part", "service_type")
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "customer":
            kwargs["queryset"] = db_field.remote_field.model.objects.filter(
                role="CUSTOMER"
            )

        if db_field.name == "claimed_by":
            kwargs["queryset"] = db_field.remote_field.model.objects.filter(
                role="TECHNICIAN"
            )

        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(JobCard)
class JobCardAdmin(admin.ModelAdmin):
    list_display = (
        "job_card_number",
        "customer",
        "vehicle",
        "service_type",
        "status",
        "assigned_technician",
        "created_at",
    )
    list_filter = ("status", "service_type", "created_at")
    search_fields = (
        "job_card_number",
        "customer__username",
        "vehicle__vin_number",
        "vehicle__registration_number",
    )
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "assigned_technician":
            kwargs["queryset"] = db_field.remote_field.model.objects.filter(
                role="TECHNICIAN"
            )

        if db_field.name == "customer":
            kwargs["queryset"] = db_field.remote_field.model.objects.filter(
                role="CUSTOMER"
            )

        return super().formfield_for_foreignkey(db_field, request, **kwargs)




@admin.register(ServiceComplaint)
class ServiceComplaintAdmin(admin.ModelAdmin):
    list_display = ("id", "job_card", "category", "work_type", "created_at")
    list_filter = ("category", "work_type", "created_at")
    search_fields = ("job_card__job_card_number", "description")


@admin.register(VehicleInspection)
class VehicleInspectionAdmin(admin.ModelAdmin):
    list_display = ("id", "job_card", "component_name", "condition", "created_at")
    list_filter = ("condition", "component_name")


@admin.register(PartsReplacement)
class PartsReplacementAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "job_card",
        "complaint",
        "part_name",
        "part_number",
        "quantity",
        "status",
        "requested_by",
        "approved_by",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = (
        "part_name",
        "part_number",
        "job_card__job_card_number",
        "complaint__description",
    )



@admin.register(WorkLog)
class WorkLogAdmin(admin.ModelAdmin):
    list_display = ("id", "job_card", "task_name", "technician", "status", "started_at", "completed_at")
    list_filter = ("status", "technician")
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "technician":
            kwargs["queryset"] = User.objects.filter(role="TECHNICIAN")
        return super().formfield_for_foreignkey(db_field, request, **kwargs)



@admin.register(JobCardMedia)
class JobCardMediaAdmin(admin.ModelAdmin):
    list_display = ("id", "job_card", "file_type", "context", "uploaded_at")
    list_filter = ("file_type", "context")


@admin.register(ServiceBookingMedia)
class ServiceBookingMediaAdmin(admin.ModelAdmin):
    list_display = ("id", "service_booking", "file_type", "uploaded_by", "created_at")
    list_filter = ("file_type", "created_at")
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "customer":
            kwargs["queryset"] = db_field.remote_field.model.objects.filter(
                role="CUSTOMER"
            )

        if db_field.name == "claimed_by":
            kwargs["queryset"] = db_field.remote_field.model.objects.filter(
                role="TECHNICIAN"
            )

        return super().formfield_for_foreignkey(db_field, request, **kwargs)

