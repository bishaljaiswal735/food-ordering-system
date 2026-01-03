from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
import random
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse


# Create your views here.
@api_view(["POST"])
def admin_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if user is not None and user.is_staff:
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "message": "login Successfully",
                "username": username,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )
    return Response(
        {"message": "Invalid Credential"}, status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(["POST"])
def logout_session(request):
    logout(request._request)  # destroys session server-side
    return Response({"message": "Logged out"})


@api_view(["GET"])
def random_foods(request):
    foods = Food.objects.order_by("?")[:9]
    serializer = FoodSerializer(foods, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
def add_carts(request):
    food_id = request.data.get("foodId")
    user_id = request.data.get("userId")
    try:
        order = Order.objects.get(food__id=food_id, user__id=user_id)
        order.quantity += 1
        order.save()
        return Response({"message": "already exist ot cart and quantity added on it "})
    except ObjectDoesNotExist:
        food = Food.objects.get(id=food_id)
        user = User.objects.get(id=user_id)
        order = Order.objects.create(food=food, user=user)
        return Response({"message": "Items added succesfully"})


@api_view(["GET"])
def get_cart_items(request, user_id):
    order = Order.objects.filter(
        user__id=user_id, is_order_placed=False
    ).select_related("food")
    if order.exists():
        serializer = OrderSerializer(order, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"message": "There is no cart item related to this user"})


@api_view(["PATCH"])
def cart_update_quantity(request):
    order_id = request.data.get("order_id")
    try:
        order = Order.objects.get(id=order_id, is_order_placed=False)
        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "successfully added quantity"})
    except:
        return Response({"message": "laura happening"})


@api_view(["DELETE"])
def cart_delete(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        order.delete()
        return Response({"message": "order deleted successfully!!!"})
    except ObjectDoesNotExist:
        return Response({"message": "oops!!! something went wrong "})


@api_view(["GET"])
def order_list(request, user_id):
    orders = OrderAddress.objects.filter(user__id=user_id).order_by("-order_time")
    serializer = OrderAddressSerializer(orders, many=True)
    return Response(serializer.data)


class AddFetchCategory(APIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminUser()]
        return []

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "category is created"}, status=status.HTTP_201_CREATED
            )
        return Response(
            {"message": "category is not created"}, status=status.HTTP_400_BAD_REQUEST
        )


class CategoryDetail(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, id):
        try:
            category = Category.objects.get(id=id)
            serializer = CategorySerializer(category, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
            return Response(
                {"message": "updated successfully"}, status=status.HTTP_200_OK
            )
        except:
            return Response(
                {"message": "something went wrong"}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, id):
        try:
            category = Category.objects.get(id=id)
            category.delete()
            return Response(
                {"message": "deleted successfully"}, status=status.HTTP_200_OK
            )
        except:
            return Response(
                {"message": "something went wrong"}, status=status.HTTP_404_NOT_FOUND
            )

    def get(self, request, id):
        try:
            category = Category.objects.get(id=id)
            serializer = CategorySerializer(category)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(
                {"message": "something went wrong"}, status=status.HTTP_404_NOT_FOUND
            )


class AddFetchFood(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminUser()]
        return [AllowAny()]

    def get(self, request):
        query = request.GET.get("q", "")
        if query:
            foods = Food.objects.filter(item_name__icontains=query)
        else:
            foods = Food.objects.all()
        serializer = FoodSerializer(foods, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = FoodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Food is created"}, status=status.HTTP_201_CREATED
            )
        return Response(
            {"message": "Something is wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


class FoodDetail(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == "DELETE" or self.request.method == "PATCH":
            return [IsAdminUser()]
        return [AllowAny()]

    def patch(self, request, pk):
        try:
            food = Food.objects.get(id=pk)
        except Food.DoesNotExist:
            return Response(
                {"message": "Food not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = FoodSerializer(food, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Food updated successfully"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
        item = get_object_or_404(Food, id=pk)
        serializer = FoodSerializer(item)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def delete(self, request, pk):
        try:
            item = Food.objects.get(id=pk)
            item.delete()
            return Response(
                {"message": "deleted successfully"}, status=status.HTTP_200_OK
            )
        except:
            return Response(
                {"message": "something went wrong"}, status=status.HTTP_404_NOT_FOUND
            )


class AddFetchUser(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAdminUser()]
        return [AllowAny()]

    def get(self, request):
        user = User.objects.filter(~Q(is_staff=True))
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Registered Successfully!!"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(
                {"message": "deleted successfully"}, status=status.HTTP_200_OK
            )
        except ObjectDoesNotExist:
            return Response({"message": "User not found"}, status=404)


@api_view(["POST"])
def user_login(request):
    identifier = request.data.get("identifier")
    password = request.data.get("password")
    if not identifier or not password:
        return Response(
            {"message": "Identifier and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = User.objects.get(Q(email=identifier) | Q(mobile=identifier))
        if user.check_password(password):
            return Response(
                {
                    "message": "Login Successfully!!",
                    "userId": user.id,
                    "first_name": user.first_name,
                    "username": user.username,
                },
                status=status.HTTP_202_ACCEPTED,
            )
        return Response(
            {"message": "Invalid Credential!!"}, status=status.HTTP_401_UNAUTHORIZED
        )
    except ObjectDoesNotExist:
        return Response(
            {"message": "Not registerd this user!!"}, status=status.HTTP_400_BAD_REQUEST
        )


def make_unique_order_number():
    while True:
        num = str(random.randint(1000000, 9999999))
        if not OrderAddress.objects.filter(order_number=num):
            return num


class PaymentView(APIView):
    def get(self, request):
        pass

    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get("user")
            orders = Order.objects.filter(user=user, is_order_placed=False)
            order_number = make_unique_order_number()
            orders.update(order_number=order_number, is_order_placed=True)
            order_address = serializer.validated_data.get("order_address")
            OrderAddress.objects.create(
                user=user, order_number=order_number, address=order_address
            )
            serializer.validated_data["order_number"] = order_number
            serializer.save()
            return Response({"message": "order is placed "})
        return Response(serializer.error)


class OrderAddressView(APIView):
    def get(self, request, order_number):
        objects = get_object_or_404(OrderAddress, order_number=order_number)
        serializer = OrderAddressSerializer(objects)
        return Response(serializer.data)


class UserView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except:
            return Response({"message": "there is no this user in db"})

    def patch(self, request, user_id):
        user = User.objects.get(id=user_id)  # fetch object
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=400)


class AdminCheckAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"ok": True})


from .serializers import WishlistSerializer


@api_view(["POST"])
def add_to_wishlist(request):
    user_id = request.data.get("user_id")
    food_id = request.data.get("food_id")
    Wishlist.objects.get_or_create(user_id=user_id, food_id=food_id)
    return Response({"message": "Added to wishlist"}, status=201)


@api_view(["GET"])
def get_wishlist(request, user_id):
    wishlist_items = Wishlist.objects.filter(user_id=user_id).select_related("food")
    serializer = WishlistSerializer(wishlist_items, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def remove_from_wishlist(request):
    user_id = request.data.get("user_id")
    food_id = request.data.get("food_id")
    try:
        Wishlist.objects.get(user_id=user_id, food_id=food_id).delete()
        return Response({"message": "Removed from wishlist"}, status=200)
    except Wishlist.DoesNotExist:
        return Response({"message": "Item not found in wishlist"}, status=404)


@api_view(["GET"])
def food_rating_summary(request, food_id):
    from django.db.models import Count, Avg

    reviews = Review.objects.filter(food_id=food_id)
    rating_summary = (
        reviews.values("rating").annotate(count=Count("rating")).order_by("-rating")
    )
    average = reviews.aggregate(average=Avg("rating"))["average"] or 0

    total_reviews = reviews.count()
    return Response(
        {
            "average": round(average, 1),
            "total_reviews": total_reviews,
            "breakdown": {entry["rating"]: entry["count"] for entry in rating_summary},
        }
    )


@api_view(["GET"])
def orders_item_list(request, order_number):
    items = Order.objects.filter(order_number=order_number).select_related("food")
    serializer = OrderSerializer(items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


from django.template.loader import render_to_string


def generate_invoice_html(request, order_number):
    orders = Order.objects.select_related("food").filter(
        order_number=order_number, is_order_placed=True
    )
    address = get_object_or_404(OrderAddress, order_number=order_number)

    grand_total = 0
    order_data = []

    for order in orders:
        total_price = float(order.food.item_price) * order.quantity
        grand_total += total_price
        order_data.append(
            {"food": order.food, "quantity": order.quantity, "total_price": total_price}
        )

    html_content = render_to_string(
        "invoice_template.html",
        {
            "order_number": order_number,
            "orders": order_data,
            "address": address,
            "grand_total": grand_total,
        },
    )

    return HttpResponse(html_content)


@api_view(["PATCH"])
def change_password(request, user_id):
    user = get_object_or_404(User, id=user_id)
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    if user.check_password(current_password):
        user.set_password(new_password)
        user.save()
        return Response({"message": "updated succesfully"}, status=status.HTTP_200_OK)
    return Response({"message": "invalid password"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def orders_not_confirmed(request):
    order = OrderAddress.objects.filter(order_final_status__isnull=True).order_by(
        "-order_time"
    )
    serializers = OrderAddressSerializer(order, many=True)
    return Response(serializers.data)


@api_view(["GET"])
def orders_confirmed(request):
    order = OrderAddress.objects.filter(order_final_status="Order Confirmed").order_by(
        "-order_time"
    )
    serializers = OrderAddressSerializer(order, many=True)
    return Response(serializers.data)


@api_view(["GET"])
def orders_not_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status__isnull=True).order_by(
        "-order_time"
    )
    serializer = OrderAddressSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def orders_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status="Order Confirmed").order_by(
        "-order_time"
    )
    serializer = OrderAddressSerializer(
        orders, many=True
    )  # same serializer if fields match
    return Response(serializer.data)


@api_view(["GET"])
def foodbeing_prepared(request):
    orders = OrderAddress.objects.filter(
        order_final_status="Food being Prepared"
    ).order_by("-order_time")
    serializer = OrderAddressSerializer(
        orders, many=True
    )  # same serializer if fields match
    return Response(serializer.data)


@api_view(["GET"])
def food_pickup(request):
    orders = OrderAddress.objects.filter(order_final_status="Food Pickup").order_by(
        "-order_time"
    )
    serializer = OrderSerializer(orders, many=True)  # same serializer if fields match
    return Response(serializer.data)


@api_view(["GET"])
def food_delivered(request):
    orders = OrderAddress.objects.filter(order_final_status="Food Delivered").order_by(
        "-order_time"
    )
    serializer = OrderSerializer(orders, many=True)  # same serializer if fields match
    return Response(serializer.data)


@api_view(["GET"])
def order_cancelled(request):
    orders = OrderAddress.objects.filter(order_final_status="Order Cancelled").order_by(
        "-order_time"
    )
    serializer = OrderSerializer(orders, many=True)  # same serializer if fields match
    return Response(serializer.data)


@api_view(["GET"])
def all_orders(request):
    orders = OrderAddress.objects.all().order_by("-order_time")
    serializer = OrderSerializer(orders, many=True)  # same serializer if fields match
    return Response(serializer.data)


@api_view(["POST"])
def order_report_between_dates(request):
    from_date = request.data.get("from_date")
    to_date = request.data.get("to_date")
    status_filter = request.data.get("status")

    if not from_date or not to_date:
        return Response({"error": "Both dates are required"}, status=400)

    queryset = OrderAddress.objects.filter(order_time__date__range=[from_date, to_date])

    if status_filter == "not_confirmed":
        queryset = queryset.filter(order_final_status__isnull=True)
    elif status_filter != "all":
        queryset = queryset.filter(order_final_status=status_filter)

    serializer = OrderAddressSerializer(queryset.order_by("-order_time"), many=True)
    return Response(serializer.data)


@api_view(["GET"])
def order_view_detail(request, order_number):
    orders = Order.objects.filter(order_number=order_number).select_related("user")
    food_ids = orders.values_list("food", flat=True)
    foods = Food.objects.filter(id__in=food_ids)
    order_address = get_object_or_404(OrderAddress, order_number=order_number)
    tracking = FoodTracking.objects.filter(order__order_number=order_number)
    return Response(
        {
            "order": OrderSerializer(orders, many=True).data,
            "foods": FoodSerializer(foods, many=True).data,
            "order_address": OrderAddressSerializer(order_address).data,
            "tracking": TrackingSerializer(tracking, many=True).data,
        }
    )


from rest_framework.parsers import JSONParser


@api_view(["POST"])
@parser_classes([JSONParser])
def update_order_status(request):
    order_number = request.data.get("order_number")
    new_status = request.data.get("status")
    remark = request.data.get("remark")

    try:
        address = OrderAddress.objects.get(order_number=order_number)
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response(
                {"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Save status update in tracking
        FoodTracking.objects.create(
            order=order, remark=remark, status=new_status, order_cancelled_by_user=False
        )

        # Update final status
        address.order_final_status = new_status
        address.save()

        return Response({"message": "Order status updated successfully."})
    except OrderAddress.DoesNotExist:
        return Response(
            {"error": "Invalid order number"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def search_order(request):
    identifier = request.GET.get("q", "")
    orders = OrderAddress.objects.filter(order_number__icontains=identifier)
    serializer = OrderAddressSerializer(orders, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


from django.utils.timezone import now, timedelta
from django.db.models import Sum, F, FloatField
from django.db.models.functions import Cast


@api_view(["GET"])
def dashboard_metrics(request):
    today = now().date()
    start_week = today - timedelta(days=today.weekday())
    start_month = today.replace(day=1)
    start_year = today.replace(month=1, day=1)

    def get_sales_total(start_date):
        # Get order_numbers from PaymentDetail after start_date
        paid_orders = PaymentDetail.objects.filter(
            payment_date__gte=start_date
        ).values_list("order_number", flat=True)

        # Join with Order model and calculate total sale amount
        total = (
            Order.objects.filter(order_number__in=paid_orders)
            .annotate(
                total_price=F("quantity") * Cast(F("food__item_price"), FloatField())
            )
            .aggregate(sale_amount=Sum("total_price"))["sale_amount"]
            or 0.0
        )

        return round(total, 2)

    data = {
        "total_orders": OrderAddress.objects.count(),
        "new_orders": OrderAddress.objects.filter(
            order_final_status__isnull=True
        ).count(),
        "confirmed_orders": OrderAddress.objects.filter(
            order_final_status="Order Confirmed"
        ).count(),
        "food_preparing": OrderAddress.objects.filter(
            order_final_status="Food being Prepared"
        ).count(),
        "food_pickup": OrderAddress.objects.filter(
            order_final_status="Food Pickup"
        ).count(),
        "food_delivered": OrderAddress.objects.filter(
            order_final_status="Food Delivered"
        ).count(),
        "cancelled_orders": OrderAddress.objects.filter(
            order_final_status="Order Cancelled"
        ).count(),
        "total_users": User.objects.count(),
        "total_categories": Category.objects.count(),
        "total_reviews": Review.objects.count(),
        "total_wishlists": Wishlist.objects.count(),
        "today_sales": get_sales_total(today),
        "week_sales": get_sales_total(start_week),
        "month_sales": get_sales_total(start_month),
        "year_sales": get_sales_total(start_year),
    }
    return Response(data)


from django.db.models.functions import TruncMonth, TruncWeek
from django.db.models import Sum
from collections import defaultdict


@api_view(["GET"])
def monthly_sales_summary(request):
    # Step 1: Get placed orders with total price per order_number
    orders = (
        Order.objects.filter(is_order_placed=True)
        .values("order_number")
        .annotate(
            total_price=Sum("food__item_price")
        )  # item_price is string now, we'll cast next
    )

    # Step 2: Convert to usable map {order_number: total_price}
    order_price_map = {
        order["order_number"]: float(order["total_price"])
        for order in orders
        if order["order_number"]
    }

    # Step 3: Get order dates from OrderAddress
    addresses = (
        OrderAddress.objects.filter(order_number__in=order_price_map.keys())
        .annotate(month=TruncMonth("order_time"))
        .values("month", "order_number")
    )

    # Step 4: Sum total sales per month
    month_totals = defaultdict(float)
    for addr in addresses:
        order_number = addr["order_number"]
        month = addr["month"].strftime("%b") if addr["month"] else "Unknown"
        month_totals[month] += order_price_map.get(order_number, 0)

    # Step 5: Return formatted result
    result = [
        {"month": month, "sales": round(sales, 2)}
        for month, sales in month_totals.items()
    ]
    return Response(result)


@api_view(["GET"])
def top_selling_food(request):
    top_sells = (
        Order.objects.values("food__item_name")
        .annotate(total_quantity=Sum("quantity"))
        .order_by("-total_quantity")[:5]
    )
    return Response(top_sells)


@api_view(["GET"])
def weekly_sales_summary(request):
    # Step 1: Get all placed orders and total price per order
    orders = (
        Order.objects.filter(is_order_placed=True)
        .values("order_number")
        .annotate(total_price=Sum("food__item_price"))
    )

    # Step 2: Create a map of order_number -> price
    order_price_map = {
        order["order_number"]: float(order["total_price"])
        for order in orders
        if order["order_number"]
    }

    # Step 3: Get weeks from OrderAddress
    addresses = (
        OrderAddress.objects.filter(order_number__in=order_price_map.keys())
        .annotate(week=TruncWeek("order_time"))
        .values("week", "order_number")
    )

    # Step 4: Group by week
    weekly_totals = defaultdict(float)
    for addr in addresses:
        order_number = addr["order_number"]
        week = addr["week"].strftime("Week %W") if addr["week"] else "Unknown"
        weekly_totals[week] += order_price_map.get(order_number, 0)

    # Step 5: Return result
    result = [
        {"week": week, "sales": round(total, 2)}
        for week, total in weekly_totals.items()
    ]
    return Response(result)


@api_view(["GET"])
def track_order(request, order_number):
    # Get the first order item (as reference) for this order_number
    sample_order = Order.objects.filter(
        order_number=order_number, is_order_placed=True
    ).first()

    if not sample_order:
        return Response({"message": "Order not found or not yet placed."}, status=404)

    tracking_entries = FoodTracking.objects.filter(order=sample_order).order_by(
        "status_date"
    )
    serializer = TrackingSerializer(tracking_entries, many=True)
    return Response(serializer.data)
