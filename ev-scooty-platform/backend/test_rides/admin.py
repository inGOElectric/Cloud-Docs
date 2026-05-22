from django.contrib import admin

from .models import TestRide


@admin.register(TestRide)
class TestRideAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "phone",
        "bike_name",
        "location",
        "date",
        "time_slot",
        "status",
        "is_viewed",
        "created_at",
    )
    list_filter = ("status", "is_viewed", "bike_name", "date")
    search_fields = ("full_name", "phone", "email", "bike_name", "location")
