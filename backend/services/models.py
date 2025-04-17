# services/models.py
from django.db import models
from users.models import User

class Service(models.Model):
    SERVICE_TYPES = (
        ('songwriting', 'Songwriting'),
        ('cover_design', 'Cover Design'),
        ('social_media_design', 'Social Media Design'),
        ('beat_production', 'Beat Production'),
        ('mixing', 'Mixing'),
        ('other', 'Other'),
    )
    
    seller = models.ForeignKey(User, related_name='services', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=2000)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    service_type = models.CharField(max_length=50, choices=SERVICE_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Work(models.Model):
    STATUS_CHOICES = (
        ('online', 'Online'),
        ('offline', 'Offline'),
    )
    
    seller = models.ForeignKey(User, related_name='works', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=2000)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    file = models.FileField(upload_to='works/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='online')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title