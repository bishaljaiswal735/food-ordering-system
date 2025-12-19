
from django.contrib import admin
from django.urls import path,include
from . import views
from .views import *

urlpatterns = [
    path("login/", views.login),
    path("add-category/", AddCategory.as_view())


]
