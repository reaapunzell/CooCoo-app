#from django.db.models.signals import post_save
#from django.dispatch import receiver
#from .models import Notification
#from groups.models import Group, Participant
#from payments.models import Payment

#@receiver(post_save, sender=Participant)
#def notify_user_on_join(sender, instance, created, **kwargs):
    #if created:
        #Notification.objects.create(
            #user=instance.user,
            #message=f"You have successfully joined the group '{instance.group.name}'."
        #)

#@receiver(post_save, sender=Payment)
###def notify_user_on_payment(sender, instance, created, **kwargs):
    #if created:
        #Notification.objects.create(
            #user=instance.user,
            #message=f"Your payment of {instance.amount} for '{instance.group.name}' is pending."
        #)
   # elif instance.payment_status == 'success':
        #Notification.objects.create(
            #user=instance.user,
            #message=f"Your payment of {instance.amount} for '{instance.group.name}' was successful."
        #)
    #elif instance.payment_status == 'failed':
        #Notification.objects.create(
            #user=instance.user,
            #message=f"Your payment of {instance.amount} for '{instance.group.name}' failed. Please try again."
        #)

#@receiver(post_save, sender=Group)
#def notify_users_on_group_progress(sender, instance, **kwargs):
    #if instance.current_progress >= instance.target_goal:
        #for participant in instance.participants.all():
            #Notification.objects.create(
                #user=participant.user,
                #message=f"The group '{instance.name}' has reached its target goal!"
            #)
