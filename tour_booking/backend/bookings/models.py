from django.db import models
from django.contrib.auth.models import User
from tours.models import Tour
import uuid

class Booking(models.Model):
    booking_id = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    number_of_people = models.IntegerField()
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='confirmed')

    def save(self, *args, **kwargs):
        if not self.booking_id:
            self.booking_id = 'BK' + str(uuid.uuid4().hex[:6]).upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.booking_id