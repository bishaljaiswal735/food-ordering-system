from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username = username,password = password)
    if user is not None and user.is_staff:
       return Response({'message':"login Successfully",'username':username}, status = status.HTTP_200_OK) 
    return Response({"message":"Invalid Credential"}, status = status.HTTP_401_UNAUTHORIZED)


class AddFetchCategory(APIView):
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
         name = serializer.data['first_name']
         print(name)
         return Response({"message":"Registered Successfully!!"}, status = status.HTTP_201_CREATED)
      return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)