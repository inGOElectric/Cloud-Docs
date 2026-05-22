from rest_framework.routers import DefaultRouter

from .views import (
    JobCardMediaViewSet,
    JobCardViewSet,
    PartsReplacementViewSet,
    ServiceBookingMediaViewSet,
    ServiceBookingViewSet,
    ServiceComplaintViewSet,
    VehicleInspectionViewSet,
    WorkLogViewSet,
)

router = DefaultRouter()
router.register("bookings", ServiceBookingViewSet, basename="service-bookings")
router.register("job-cards", JobCardViewSet, basename="job-cards")
router.register("complaints", ServiceComplaintViewSet, basename="service-complaints")
router.register("inspections", VehicleInspectionViewSet, basename="vehicle-inspections")
router.register("parts", PartsReplacementViewSet, basename="parts-replacements")
router.register("work-logs", WorkLogViewSet, basename="work-logs")
router.register("job-card-media", JobCardMediaViewSet, basename="job-card-media")
router.register("booking-media", ServiceBookingMediaViewSet, basename="service-booking-media")

urlpatterns = router.urls
