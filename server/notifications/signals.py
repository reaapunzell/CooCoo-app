from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from groups.models import GroupMember, Group

@receiver(post_save, sender=GroupMember)
def notify_group_join(sender, instance, created, **kwargs):
    if created:
        message = f"{instance.user.first_name} joined the group {instance.group.name}."
        Notification.objects.create(
            user=instance.group.creator,  # Notify the group creator
            notification_type="group_join",
            message=message,
        )

@receiver(post_save, sender=Group)
def notify_goal_reached(sender, instance, **kwargs):
    if instance.is_goal_reached:  # Assuming you have an `is_goal_reached` field
        message = f"The group {instance.name} has reached its participant goal!"
        for member in instance.members.all():
            Notification.objects.create(
                user=member.user,
                notification_type="group_goal_reached",
                message=message,
            )

