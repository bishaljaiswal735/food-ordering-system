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
        fields =   [
            'id',
            'first_name',
            'last_name',
            'email',
            'mobile',
            'password',
        ]
       

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_mobile(self, value):
        if User.objects.filter(mobile=value).exists():
            raise serializers.ValidationError("Mobile already exists")
        return value
    def validate_first_name(self, value):
         return value.strip().capitalize()
    

    def validate_last_name(self, value):
          return value.strip().capitalize()


    def create(self,validated_data):
        password = validated_data.pop('password')

        # remove M2M if present
        validated_data.pop('groups', None)
        validated_data.pop('user_permissions', None)

        first_name = validated_data.get('first_name', '')
        last_name = validated_data.get('last_name', '')

        import uuid
        username = (first_name + last_name).lower() or 'user'
        username = f"{username}_{uuid.uuid4().hex[:6]}"

        user = User(username=username, **validated_data)
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

class OrderSerializer(serializers.ModelSerializer):
    food = FoodSerializer()
    class Meta:
        model = Order
        fields = ['id','food', 'quantity']

class PaymentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all()
    )
    order_address = serializers.CharField(write_only = True)
    class Meta:
        model = PaymentDetail
        fields = [
            'id',
            'user',
            'order_number',
            'payment_mode',
            'card_number',
            'expiry_date',
            'cvv',
            'payment_date',
            'order_address',
        ]
    
    def create(self, validated_data):
        validated_data.pop('order_address', None)
        payment = PaymentDetail.objects.create(**validated_data)
        return payment
    
class OrderAddressSerializer(serializers.ModelSerializer):
    order_final_status = serializers.SerializerMethodField()
    class Meta:
        model = OrderAddress
        fields = '__all__'

    def get_order_final_status(self, obj):
        return obj.order_final_status or 'waiting for restaurant confirmtion'