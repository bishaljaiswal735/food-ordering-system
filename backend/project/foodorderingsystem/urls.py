
from django.contrib import admin
from django.urls import path,include
from . import views
from .views import *

urlpatterns = [
    path("admin-login/", views.admin_login),
    path("add-fetch-category/", AddFetchCategory.as_view()),
    path("add-fetch-food/", AddFetchFood.as_view()),
    path("random_foods/",views.random_foods),
    path('add-fetch-user/',AddFetchUser.as_view()),
    path('user-login/',views.user_login),
    path('session-logout/',views.logout_session),
    path('food-detail/<int:pk>', FoodDetail.as_view())
]
