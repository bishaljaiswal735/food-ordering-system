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


# Create your views here.
@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username = username,password = password)
    if user is not None and user.is_staff:
       login(request._request,user)
       return Response({'message':"login Successfully",'username':username}, status = status.HTTP_200_OK) 
    return Response({"message":"Invalid Credential"}, status = status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_session(request):
    logout(request._request)  # destroys session server-side
    return Response({"message": "Logged out"})

class AddFetchCategory(APIView):
  def get_authenticators(self):
     if self.request.method == "POST" or self.request.method == "DELETE" or self.request.method == "PUT" or self.request.method == "PATCH":
        return [SessionAuthentication()]
     return []
  
  def get_permissions(self):
     if self.request.method == "POST" or self.request.method == "DELETE" or self.request.method == "PUT" or self.request.method == "PATCH":
        return [IsAdminUser()]
     return [AllowAny]
  
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

@api_view(['GET'])
def random_foods(request):
    foods = Food.objects.order_by('?')[:9]
    serializer = FoodSerializer(foods, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

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
    