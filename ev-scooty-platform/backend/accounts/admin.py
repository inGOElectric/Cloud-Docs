from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomerProfile, User

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "phone", "is_active", "is_staff")
    list_filter = ("role", "is_active", "is_staff")

    fieldsets = UserAdmin.fieldsets + (
        ("EV Platform Details", {"fields": ("role", "phone")}),
    )
@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "gst_number", "created_at")
    search_fields = ("user__username", "user__phone", "gst_number")

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = db_field.remote_field.model.objects.filter(
                role="CUSTOMER"
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

