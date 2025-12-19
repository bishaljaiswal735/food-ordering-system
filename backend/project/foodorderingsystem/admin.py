from django.contrib import admin
from .models import User,Category,Food

# Register your models here.
admin.site.register(User)
admin.site.register(Category)
admin.site.register(Food)