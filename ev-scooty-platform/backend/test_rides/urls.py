from rest_framework.routers import DefaultRouter

from .views import TestRideViewSet

router = DefaultRouter()
router.register("", TestRideViewSet, basename="test-rides")

urlpatterns = router.urls
