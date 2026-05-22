from django.db import models


class TestRide(models.Model):
    class BikeName(models.TextChoices):
        FLEE_LOW_SPEED = "Flee-low-speed", "Flee-low-speed"
        FLEE_HIGH_SPEED = "Flee-high-speed", "Flee-high-speed"

    class TimeSlot(models.TextChoices):
        SLOT_11 = "11:00 AM", "11:00 AM"
        SLOT_12 = "12:00 PM", "12:00 PM"
        SLOT_1 = "1:00 PM", "1:00 PM"

    class Status(models.TextChoices):
        CONFIRMED = "CONFIRMED", "Confirmed"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    bike_name = models.CharField(max_length=100, choices=BikeName.choices)
    location = models.CharField(max_length=150)
    date = models.DateTimeField()
    time_slot = models.CharField(max_length=50, choices=TimeSlot.choices)

    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)

    address = models.TextField(blank=True)
    feedback = models.TextField(blank=True)
    rating = models.PositiveIntegerField(null=True, blank=True)

    status = models.CharField(
        max_length=50,
        choices=Status.choices,
        default=Status.CONFIRMED,
    )
    is_viewed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.bike_name}"
