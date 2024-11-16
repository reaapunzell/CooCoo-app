from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Province model
class Province(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# City model
class City(models.Model):
    name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name="cities")

    def __str__(self):
        return f"{self.name}, {self.province.name}"


# Product model
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50, null=True, blank=True)  # E.g., kg, bags, liters
    available_quantity = models.IntegerField()
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    delivery_information = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


# Group model
class Group(models.Model):
    name = models.CharField(max_length=100, default="Untitled Group")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='groups')
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_groups')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='groups', null=True)
    target_goal = models.PositiveIntegerField(help_text="Target quantity to reach the discounted price.")
    current_progress = models.PositiveIntegerField(default=0, help_text="Current quantity achieved by participants.")
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('closed', 'Closed'), ('completed', 'Completed')], default='open')

    def __str__(self):
        return f"{self.name} - {self.city}"


# Participant model
class Participant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='participants')
    quantity = models.PositiveIntegerField()
    amount_contributed = models.DecimalField(max_digits=10, decimal_places=2)
    joined_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[('joined', 'Joined'), ('left', 'Left')], default='joined')

    def __str__(self):
        return f"{self.user} in {self.group.name}"


# Order model
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    zip_code = models.CharField(max_length=10)
    street = models.CharField(max_length=255)
    shipping_method = models.CharField(max_length=50)  # E.g., Standard, Express
    payment_method = models.CharField(max_length=50)  # E.g., Card, Cash on Delivery
    card_number = models.CharField(max_length=16, blank=True, null=True)  # For card payments
    expiry_date = models.CharField(max_length=5, blank=True, null=True)   # Format: MM/YY
    cvv = models.CharField(max_length=4, blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user}"

