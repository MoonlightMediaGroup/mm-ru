# deals/models.py
from django.db import models
from users.models import User
from services.models import Service, Work

class Deal(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    )
    
    buyer = models.ForeignKey(User, related_name='buy_deals', on_delete=models.CASCADE)
    seller = models.ForeignKey(User, related_name='sell_deals', on_delete=models.CASCADE)
    service = models.ForeignKey(Service, null=True, blank=True, on_delete=models.CASCADE)
    work = models.ForeignKey(Work, null=True, blank=True, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.buyer} -> {self.seller}: {self.price}"