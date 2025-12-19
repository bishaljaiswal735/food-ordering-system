from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import *
from .serializers import *

# Create your views here.
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username = username,password = password)
    if user is not None and user.is_staff:
       return Response({'message':"login Successfully",'username':username}, status = status.HTTP_200_OK) 
    return Response({"message":"Invalid Credential"}, status = status.HTTP_401_UNAUTHORIZED)


class AddCategory(APIView):
  def post(self, request):
   serializer = CategorySerializer(data = request.data)
   if serializer.is_valid():
      serializer.save()
      return Response({'message':'category is created'}, status=status.HTTP_201_CREATED)
   return Response({'message': 'category is not created'},status=status.HTTP_400_BAD_REQUEST)