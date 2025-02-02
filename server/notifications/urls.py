from django.urls import path
from .views import NotificationListView, MarkNotificationAsReadView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:notification_id>/mark-as-read/', MarkNotificationAsReadView.as_view(), name='mark-notification-as-read'),
]
