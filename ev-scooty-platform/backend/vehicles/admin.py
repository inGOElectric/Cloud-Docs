from django.contrib import admin

from .models import Vehicle


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "owner",
        "model",
        "vin_number",
        "registration_number",
        "warranty_status",
        "created_at",
    )
    search_fields = (
        "model",
        "vin_number",
        "registration_number",
        "owner__username",
        "owner__phone",
    )
    list_filter = ("model", "warranty_status", "created_at")

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "owner":
            kwargs["queryset"] = db_field.remote_field.model.objects.filter(
                role="CUSTOMER"
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
