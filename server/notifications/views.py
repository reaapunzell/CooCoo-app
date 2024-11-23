from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .utils import send_sms_notification

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
        data = [
            {
                "id": n.id,
                "type": n.notification_type,
                "message": n.message,
                "created_at": n.created_at,
                "is_read": n.is_read,
            }
            for n in notifications
        ]
        return Response(data)


class SendSMSNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Send SMS Notification",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'phone_number': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="The recipient's phone number, including country code."
                ),
                'message': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="The message to send via SMS."
                ),
            },
            required=['phone_number', 'message']
        ),
        responses={
            200: openapi.Response(
                description="SMS successfully sent",
                examples={
                    "application/json": {"success": "SMS sent successfully."}
                },
            ),
            400: openapi.Response(
                description="Invalid input",
                examples={
                    "application/json": {"error": "Phone number and message are required."}
                },
            ),
            500: openapi.Response(
                description="Server error",
                examples={
                    "application/json": {"error": "An error occurred while sending the SMS."}
                },
            ),
        },
    )
    def post(self, request):
        """
        Sends an SMS notification to the specified phone number.
        """
        phone_number = request.data.get("phone_number")
        message = request.data.get("message")

        if not phone_number or not message:
            return Response({"error": "Phone number and message are required."}, status=400)

        try:
            send_sms_notification(phone_number, message)
            return Response({"success": "SMS sent successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

