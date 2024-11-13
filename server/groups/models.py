# groups/models.py
from django.db import models
from django.conf import settings

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    available_quantity = models.IntegerField()
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    delivery_information = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Group(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='groups')
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    target_goal = models.IntegerField(help_text="Target quantity to reach the discounted price.")
    current_progress = models.IntegerField(default=0, help_text="Current quantity achieved by participants.")
    status = models.CharField(max_length=50, choices=[('open', 'Open'), ('closed', 'Closed'), ('completed', 'Completed')], default='open')
    end_date = models.DateTimeField()

    def __str__(self):
        return f"Group for {self.product.name} by {self.organizer}"

class Participant(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    amount_contributed = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=[('joined', 'Joined'), ('left', 'Left')], default='joined')
    join_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} in {self.group}"

