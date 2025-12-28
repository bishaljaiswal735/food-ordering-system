from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate,login,logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated,AllowAny, IsAdminUser
from rest_framework.authentication import BasicAuthentication,SessionAuthentication
import random
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username = username,password = password)
    if user is not None and user.is_staff:
       refresh = RefreshToken.for_user(user)
       return Response({'message':"login Successfully",'username':username,"access": str(refresh.access_token),
            "refresh": str(refresh)}, status = status.HTTP_200_OK) 
    return Response({"message":"Invalid Credential"}, status = status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_session(request):
    logout(request._request)  # destroys session server-side
    return Response({"message": "Logged out"})

@api_view(['GET'])
def random_foods(request):
    foods = Food.objects.order_by('?')[:9]
    serializer = FoodSerializer(foods, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_carts(request):
    food_id = request.data.get('foodId')
    user_id = request.data.get('userId')
    try:
      order = Order.objects.get(food__id = food_id,user__id = user_id)
      order.quantity += 1
      order.save()
      return Response({'message':"already exist ot cart and quantity added on it "})
    except ObjectDoesNotExist:
      food = Food.objects.get(id = food_id)
      user = User.objects.get(id = user_id)
      order = Order.objects.create(food = food,user = user)
      return Response({'message':"Items added succesfully"})
    
@api_view(['GET'])  
def get_cart_items(request,user_id):
      order = Order.objects.filter(user__id = user_id,is_order_placed = False).select_related('food')
      if order.exists():
         serializer = OrderSerializer(order,many = True)
         return Response(serializer.data,status=status.HTTP_200_OK)
      return Response({'message':'There is no cart item related to this user'})

@api_view(['PUT'])  
def cart_update_quantity(request):
      order_id = request.data.get('order_id')
      quantity = request.data.get('quantity')
      try:
         order = Order.objects.get(id = order_id,is_order_placed = False)
         order.quantity = quantity
         order.save()
         return Response({'message':"successfully added quantity"})
      except:
         return Response({'message':"laura happening"})
      
@api_view(['DELETE'])
def cart_delete(request,order_id):
   try:
      order = Order.objects.get(id = order_id)
      order.delete()
      return Response({"message":"order deleted successfully!!!"})
   except ObjectDoesNotExist:
            return Response({"message":"oops!!! something went wrong "})
   
@api_view(['GET'])  
def order_list(request, user_id):
     orders = OrderAddress.objects.filter(user__id = user_id).order_by('-order_time')
     serializer = OrderAddressSerializer(orders, many = True)
     return Response(serializer.data)


class AddFetchCategory(APIView):
  def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return []
  def get(self, request):
     categories = Category.objects.all()
     serializer = CategorySerializer(categories,many = True)
     return Response(serializer.data,status=status.HTTP_200_OK)

  def post(self, request):
   serializer = CategorySerializer(data = request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({'message':'category is created'}, status=status.HTTP_201_CREATED)
   return Response({'message': 'category is not created'},status=status.HTTP_400_BAD_REQUEST)
  
class AddFetchFood(APIView):
   parser_classes = [MultiPartParser, FormParser]

   def get_authenticators(self):
         if self.request.method == 'POST' or self.request.method == 'PUT' or self.request.method == 'DELETE' or self.request.method == 'PATCH':
          return [SessionAuthentication()]
         return []
   
   def get_permissions(self):
      if self.request.method == 'POST' or self.request.method == 'PUT' or self.request.method == 'DELETE' or self.request.method == 'PATCH':
         return [IsAdminUser()]
      return [AllowAny()]
   
   def get(self,request):
      query = request.GET.get('q','')
      if query:
         foods = Food.objects.filter(item_name__icontains = query)
      else:
         foods = Food.objects.all()
      serializer = FoodSerializer(foods, many= True)
      return Response(serializer.data,status=status.HTTP_200_OK)
   
   def post(self,request):
      serializer = FoodSerializer(data = request.data)
      if serializer.is_valid():
         serializer.save()
         return Response({"message":"Food is created"}, status = status.HTTP_201_CREATED)
      return Response({"message":"Something is wrong"}, status = status.HTTP_400_BAD_REQUEST)

class FoodDetail(APIView):
   def get(self,request,pk):
      item = get_object_or_404(Food, id = pk )
      serializer = FoodSerializer(item)
      return Response(serializer.data, status = status.HTTP_202_ACCEPTED)


class AddFetchUser(APIView):
   def post(self, request):
      serializer = UserSerializer(data = request.data)
      if serializer.is_valid():
         serializer.save()
         return Response({"message":"Registered Successfully!!"}, status = status.HTTP_201_CREATED)
      return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
   

@api_view(['POST'])
def user_login(request):
    identifier = request.data.get('identifier')
    password = request.data.get('password')
    if not identifier or not password:
        return Response(
            {'message': 'Identifier and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
       user = User.objects.get(Q(email = identifier) | Q(mobile = identifier))
       if user.check_password(password):
          return Response({'message':'Login Successfully!!','userId':user.id,'first_name':user.first_name,'username':user.username},status=status.HTTP_202_ACCEPTED)
       return Response({'message':"Invalid Credential!!"}, status = status.HTTP_401_UNAUTHORIZED)
    except ObjectDoesNotExist:
       return Response({'message':"Not registerd this user!!"}, status = status.HTTP_400_BAD_REQUEST)
    
def make_unique_order_number():
    while True:
        num = str(random.randint(1000000,9999999))
        if not OrderAddress.objects.filter(order_number=num):
           return num 
         
class PaymentView(APIView):
   def get(self,request):
      pass

   def post(self,request):
      serializer = PaymentSerializer(data = request.data)
      if serializer.is_valid():
         user = serializer.validated_data.get('user')
         orders = Order.objects.filter(user = user)
         order_number = make_unique_order_number()
         orders.update( order_number=order_number,is_order_placed=True)
         order_address = serializer.validated_data.get('order_address')
         OrderAddress.objects.create(user = user, order_number = order_number, address = order_address)
         serializer.validated_data['order_number'] = order_number
         serializer.save()
         return Response({'message':"order is placed "})
      return Response(serializer.error)

class OrderAddressView(APIView):
   def get(self, request, order_number):
      objects = get_object_or_404(OrderAddress,order_number = order_number)
      serializer = OrderAddressSerializer(objects)
      return Response(serializer.data)

      
class UserView(APIView):
   def get(self,request,user_id):
      try:
         user = User.objects.get(id = user_id)
         serializer = UserSerializer(user)
         return Response(serializer.data)
      except:
         return Response({'message':"there is no this user in db"})
   
   def patch(self,request,user_id):
      user = User.objects.get(id=user_id)   # fetch object
      serializer = UserSerializer(
            user,
            data=request.data,
            partial = True
        )

      if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

      return Response(serializer.errors, status=400)
   
class AdminCheckAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"ok": True})
