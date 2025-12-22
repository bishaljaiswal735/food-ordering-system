from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    mobile = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.username

class Category(models.Model):
    category_name = models.CharField(max_length=100)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.category_name
    
class Food(models.Model):
    category = models.ForeignKey(Category,on_delete=models.CASCADE)
    item_name = models.CharField(max_length=50)
    item_price = models.DecimalField(max_digits=10,decimal_places=2)
    item_description = models.TextField(max_length=500,null = True,blank = True)
    image = models.ImageField(upload_to='food_images/', null = True, blank = True)
    item_quantity = models.CharField(max_length=50)
    is_available = models.BooleanField(default=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.item_name} {self.item_quantity}"