from django.db import models

class Owner(models.Model):
    name = models.CharField(max_length=100)
    contact_info = models.EmailField()
    address = models.TextField(blank=True)

    def __str__(self):
        return self.name
