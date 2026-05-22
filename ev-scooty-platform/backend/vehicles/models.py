from django.conf import settings
from django.db import models


class Vehicle(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vehicles",
    )

    vin_number = models.CharField(max_length=100, unique=True)
    model = models.CharField(max_length=100)

    registration_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
    )
    battery_number = models.CharField(max_length=100, blank=True)
    motor_number = models.CharField(max_length=100, blank=True)
    charger_number = models.CharField(max_length=100, blank=True)
    warranty_status = models.CharField(max_length=100, blank=True)
    image_url = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.model} - {self.vin_number}"
