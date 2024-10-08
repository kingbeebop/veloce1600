from django.db import models
from django.contrib.auth.models import User

class Car(models.Model):
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    vin = models.CharField(max_length=17, unique=True)
    mileage = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    features = models.TextField(blank=True)
    condition = models.CharField(max_length=50, choices=[
        ('new', 'New'),
        ('used', 'Used'),
        ('classic', 'Classic'),
    ])
    image = models.ImageField(upload_to='cars/images/', blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # Link to User
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"
