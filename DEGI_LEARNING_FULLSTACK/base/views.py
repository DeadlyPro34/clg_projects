import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from .models import Profile, Course, Purchase, ContactMessage, CourseCompletion
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, 'index.html')

def explore(request):
    return render(request, 'explore_page/explore_page.html')

def login_page(request):
    return render(request, 'login_dashboard/login.html')

def student_dashboard(request):
    if not request.user.is_authenticated:
        return redirect('login_page')
    purchases = Purchase.objects.filter(student=request.user)
    return render(request, 'login_dashboard/student/student_dashboard.html', {'purchases': purchases})

def admin_dashboard(request):
    if not request.user.is_authenticated or not hasattr(request.user, 'profile') or request.user.profile.user_type != 'admin':
        return redirect('login_page')
    students = Profile.objects.filter(user_type='student')
    purchases = Purchase.objects.all()
    messages = ContactMessage.objects.all()
    total_revenue = sum(p.price for p in purchases)
    return render(request, 'login_dashboard/admin/admin_dashboard.html', {
        'students': students,
        'purchases': purchases,
        'messages': messages,
        'total_revenue': total_revenue,
        'courses_count': Course.objects.count(),
        'sales_count': purchases.count()
    })

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        # Using email as username for authentication
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            user_type = 'student'
            if hasattr(user, 'profile'):
                user_type = user.profile.user_type
            return JsonResponse({'status': 'success', 'user_type': user_type})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)

@csrf_exempt
def api_signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('fullName')
        user_type = 'student' # Default to student for signup form
        if 'admin' in email.lower(): # Simple logic for demo purposes if needed
            user_type = 'admin'
        
        try:
            user = User.objects.create_user(username=email, email=email, password=password, first_name=full_name)
            Profile.objects.create(user=user, user_type=user_type)
            return JsonResponse({'status': 'success'})
        except IntegrityError:
            return JsonResponse({'status': 'error', 'message': 'User already exists'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)

@csrf_exempt
def api_contact(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        ContactMessage.objects.create(
            name=data.get('name'),
            email=data.get('email'),
            message=data.get('message')
        )
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)

@csrf_exempt
def api_purchase(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
        data = json.loads(request.body)
        Purchase.objects.create(
            student=request.user,
            course_name=data.get('course_name'),
            price=data.get('price'),
            bill_id=data.get('bill_id')
        )
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)

@csrf_exempt
def api_complete_course(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
        data = json.loads(request.body)
        CourseCompletion.objects.create(
            student=request.user,
            course_name=data.get('course_name')
        )
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)

def logout_view(request):
    logout(request)
    return redirect('index')

def api_get_purchases(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
    purchases = Purchase.objects.filter(student=request.user).values()
    return JsonResponse({'status': 'success', 'purchases': list(purchases)})

def api_get_messages(request):
    if not request.user.is_authenticated or request.user.profile.user_type != 'admin':
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
    messages = ContactMessage.objects.all().values()
    return JsonResponse({'status': 'success', 'messages': list(messages)})
