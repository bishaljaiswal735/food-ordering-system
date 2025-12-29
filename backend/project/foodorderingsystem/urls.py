
from django.contrib import admin
from django.urls import path,include
from . import views
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin-login/", views.admin_login),
    path("admin-check/", AdminCheckAPIView.as_view()),
    path("add-fetch-category/", AddFetchCategory.as_view()),
    path("category-detail/<int:id>/", CategoryDetail.as_view()),
    path("add-fetch-food/", AddFetchFood.as_view()),
    path("random_foods/",views.random_foods),
    path('add-fetch-user/',AddFetchUser.as_view()),
    path('user-login/',views.user_login),
    path('session-logout/',views.logout_session),
    path('food-detail/<int:pk>/', FoodDetail.as_view()),
    path('cart/add/', add_carts),
    path('cart/cart-list/<int:user_id>', get_cart_items),
    path('cart/update-quantity/',cart_update_quantity),
    path('cart/delete/<int:order_id>',cart_delete),
    path('order/<int:user_id>/',order_list),
    path('order_address/<str:order_number>/',OrderAddressView.as_view()),
    path('profile/<int:user_id>/',UserView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path('wishlist/<int:user_id>/', get_wishlist, name='get_wishlist'),
    path('food-rating-summary/<int:food_id>/',food_rating_summary),

]
