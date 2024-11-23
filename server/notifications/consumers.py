import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.group_name = f"notifications_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("action") == "mark_read":
            notification_id = data.get("notification_id")
            try:
                notification = await self._mark_notification_as_read(notification_id)
                await self.send(text_data=json.dumps({"success": True, "notification": notification}))
            except Exception as e:
                await self.send(text_data=json.dumps({"success": False, "error": str(e)}))

    async def send_notification(self, event):
        notification = event["message"]
        await self.send(text_data=json.dumps(notification))

    @staticmethod
    async def _mark_notification_as_read(notification_id):
        from notifications.models import Notification
        notification = Notification.objects.get(id=notification_id)
        notification.is_read = True
        notification.save()
        return {
            "id": notification.id,
            "type": notification.notification_type,
            "message": notification.message,
            "created_at": notification.created_at.isoformat(),
            "is_read": notification.is_read,
        }

