from django.urls import path, include
from rest_framework.routers import DefaultRouter
from complaints.views import DistrictViewSet, TalukViewSet, ComplaintViewSet, AnalyticsView, NotificationViewSet, AgencyStockViewSet, BulkStockUploadView

router = DefaultRouter()
router.register(r'districts', DistrictViewSet)
router.register(r'taluks', TalukViewSet)
router.register(r'items', ComplaintViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'stock', AgencyStockViewSet, basename='stock')

urlpatterns = [
    path('stock/bulk-upload/', BulkStockUploadView.as_view(), name='bulk-stock-upload'),
    path('stats/analytics/', AnalyticsView.as_view(), name='analytics'),
    path('', include(router.urls)),
]
