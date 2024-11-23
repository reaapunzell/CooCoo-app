from django.urls import path
from .views import NotificationListView, SendSMSNotificationView

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notifications_list'),
    path('notifications/sms/', SendSMSNotificationView.as_view(), name='send_sms_notification'),
]

