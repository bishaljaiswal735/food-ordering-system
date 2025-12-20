from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model =  Category
        fields = '__all__' 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  User
        fields = '__all__' 

class FoodSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    image = serializers.ImageField(required = False)
    class Meta:
        model =  Food
        fields = ['id','category','category_name','item_name','item_price','item_description','image','item_quantity','is_available','creation_date'] 