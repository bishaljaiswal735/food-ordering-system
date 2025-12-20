from rest_framework import serializers
from .models import *

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model =  Category
        fields = '__all__' 

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    class Meta:
        model =  User
        fields = '__all__' 

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_mobile(self, value):
        if User.objects.filter(mobile=value).exists():
            raise serializers.ValidationError("Mobile already exists")
        return value
    def create(self,validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class FoodSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name", read_only=True)
    image = serializers.ImageField(required = False)
    is_available = serializers.BooleanField(required=False, default = True)
    class Meta:
        model =  Food
        fields = ['id','category','category_name','item_name','item_price','item_description','image','item_quantity','is_available','creation_date'] 