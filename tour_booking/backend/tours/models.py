from django.db import models

class Tour(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    itinerary = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to='tour_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name