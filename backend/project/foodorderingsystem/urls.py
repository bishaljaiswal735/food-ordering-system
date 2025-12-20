
from django.contrib import admin
from django.urls import path,include
from . import views
from .views import *

urlpatterns = [
    path("login/", views.login),
    path("add-fetch-category/", AddFetchCategory.as_view()),
    path("add-fetch-food/", AddFetchFood.as_view())
    # path("user-detail/", UserDetail.as_view())



]
