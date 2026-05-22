from django.contrib.auth.models import AbstractUser
from django.db import models




class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        SERVICE_ADVISOR = "SERVICE_ADVISOR", "Service Advisor"
        TECHNICIAN = "TECHNICIAN", "Technician"
        CUSTOMER = "CUSTOMER", "Customer"
        SALES = "SALES", "Sales"
        SUPPLY_CHAIN = "SUPPLY_CHAIN", "Supply Chain"

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.CUSTOMER,
    )
    phone = models.CharField(max_length=20, blank=True)

class CustomerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="customer_profile",
    )
    address = models.TextField(blank=True)
    gst_number = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username
