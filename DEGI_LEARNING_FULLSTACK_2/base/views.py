import json, secrets, string, uuid
import google.generativeai as genai
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.utils import timezone
from .models import Profile, Course, Purchase, ContactMessage, CourseCompletion, StudentStreak, Lesson, LessonProgress, CourseReview, CourseTimeTracker, StudentParent
from .forms import SignupForm, PurchaseForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
import io

def index(request):
    return render(request, 'index.html')

def explore(request):
    courses = Course.objects.all()
    return render(request, 'explore_page/explore_page.html', {'courses': courses})

def parent_dashboard(request):
    if not request.user.is_authenticated:
        return redirect('login_page')
        
    # Standard role checks
    if not hasattr(request.user, 'profile') or request.user.profile.user_type != 'parent':
        if hasattr(request.user, 'profile') and request.user.profile.user_type == 'student':
            return redirect('student_dashboard')
        return redirect('index')
        
    return render(request, 'parent_dashboard/parent_dashboard.html')

def course_detail(request, pk):
    course = get_object_or_404(Course, pk=pk)
    has_purchased = False
    has_reviewed = False
    if request.user.is_authenticated:
        has_purchased = Purchase.objects.filter(student=request.user, course=course).exists()
        has_reviewed = CourseReview.objects.filter(student=request.user, course=course).exists()
        
    reviews = course.reviews.all().order_by('-created_at')

    return render(request, 'course_detail.html', {
        'course': course, 
        'has_purchased': has_purchased,
        'reviews': reviews,
        'has_reviewed': has_reviewed,
    })

def api_courses(request):
    courses = Course.objects.all()
    courses_data = [
        {
            "id": course.id,
            "title": course.name,
            "price": float(course.price) if course.price else 0,
            "img": course.get_image_url(),
            "description": course.description,
            "author": "Bokify Instructors",
            "category": "all",
            "level": "all",
            "rating": float(course.average_rating())
        } for course in courses
    ]
    return JsonResponse({'status': 'success', 'courses': courses_data})

def api_add_course(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        price = request.POST.get('price')
        description = request.POST.get('description', '')
        image = request.FILES.get('image')
        
        course = Course.objects.create(
            name=name,
            price=price,
            description=description,
            image=image
        )
        return JsonResponse({'status': 'success', 'course_id': course.id})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

def api_edit_course(request):
    if request.method == 'POST':
        course_id = request.POST.get('id')
        try:
            course = Course.objects.get(id=course_id)
            course.name = request.POST.get('name', course.name)
            course.price = request.POST.get('price', course.price)
            course.description = request.POST.get('description', course.description)
            image = request.FILES.get('image')
            if image:
                course.image = image
            course.save()
            return JsonResponse({'status': 'success'})
        except Course.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Course not found'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

def api_delete_course(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            course_id = data.get('id')
            course = Course.objects.get(id=course_id)
            course.delete()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})

def login_page(request):
    return render(request, 'login_dashboard/login.html')

def student_dashboard(request):
    """
    Renders the student dashboard with their purchased courses and real-time progress.
    """
    if not request.user.is_authenticated:
        return redirect('login_page')
        
    # Redirect parents to their own dashboard if they hit this URL
    if hasattr(request.user, 'profile') and request.user.profile.user_type == 'parent':
        return redirect('parent_dashboard')
    if hasattr(request.user, 'profile') and request.user.profile.user_type == 'admin':
        return redirect('admin_dashboard')
        
    purchases = Purchase.objects.filter(student=request.user).select_related('course')
    
    # Enrich each purchase with progress data and the first lesson ID for quick access
    for purchase in purchases:
        first_lesson = Lesson.objects.filter(course=purchase.course).order_by('order').first()
        purchase.first_lesson_id = first_lesson.id if first_lesson else None
        
        # Get progress stats
        total = Lesson.objects.filter(course=purchase.course).count()
        completed = LessonProgress.objects.filter(
            student=request.user, 
            lesson__course=purchase.course, 
            completed=True
        ).count()
        
        purchase.progress_percent = int((completed / total * 100) if total > 0 else 0)
        purchase.completed_lessons = completed
        purchase.total_lessons = total

    cert_count = 0
    for purchase in purchases:
        if purchase.progress_percent == 100:
            cert_count += 1

    return render(request, 'login_dashboard/student/student_dashboard.html', {
        'purchases': purchases,
        'course_count': purchases.count(),
        'cert_count': cert_count
    })

def admin_dashboard(request):
    if not request.user.is_authenticated or not hasattr(request.user, 'profile') or request.user.profile.user_type != 'admin':
        return redirect('login_page')
    students = Profile.objects.filter(user_type='student')
    purchases = Purchase.objects.all()
    messages = ContactMessage.objects.all()
    return render(request, 'login_dashboard/admin/admin_dashboard.html', {
        'students': students,
        'purchases': purchases,
        'messages': messages,
        'courses_count': Course.objects.count(),
        'sales_count': purchases.count()
    })

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
        form = SignupForm(data)
        if not form.is_valid():
            error_msg = list(form.errors.values())[0][0]
            return JsonResponse({'status': 'error', 'message': error_msg}, status=400)
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']
        full_name = form.cleaned_data['fullName']
        user_type = data.get('user_type', 'student')
        if User.objects.filter(username=email).exists():
            return JsonResponse({'status': 'error', 'message': 'An account with this email already exists.'}, status=400)
        user = User.objects.create_user(username=email, email=email, password=password, first_name=full_name)
        Profile.objects.create(user=user, user_type=user_type)
        login(request, user)
        return JsonResponse({'status': 'success'})
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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)
        form = PurchaseForm(data)
        if not form.is_valid():
            error_msg = list(form.errors.values())[0][0]
            return JsonResponse({'status': 'error', 'message': error_msg}, status=400)
        course_obj = form.cleaned_data['course_name']
        if Purchase.objects.filter(student=request.user, course=course_obj).exists():
            return JsonResponse({'status': 'error', 'message': 'You have already purchased this course.'}, status=400)
        purchase = Purchase.objects.create(
            student=request.user,
            course=course_obj,
            price=form.cleaned_data['price'],
            bill_id=form.cleaned_data['bill_id']
        )
        return JsonResponse({'status': 'success', 'bill_id': purchase.bill_id})
    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)

def api_my_courses(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'})
    streak, created = StudentStreak.objects.get_or_create(student=request.user)
    if not created:
        streak.update_streak()
    purchases = Purchase.objects.filter(student=request.user).select_related('course')
    courses_data = []
    completed_courses_count = 0
    for p in purchases:
        course = p.course
        total_lessons = Lesson.objects.filter(course=course).count()
        completed_lessons = LessonProgress.objects.filter(student=request.user, lesson__course=course, completed=True).count()
        progress = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
        if progress == 100:
            completed_courses_count += 1
        courses_data.append({
            "id": course.id,
            "title": course.name,
            "description": course.description,
            "img": course.get_image_url(),
            "purchase_date": p.purchase_date.strftime("%b %d, %Y"),
            "progress": progress
        })
    stats = {
        "course_count": purchases.count(),
        "streak": streak.streak_count,
        "hours_learned": sum(int(c['progress'] * 0.1) for c in courses_data),
        "certificates": completed_courses_count
    }
    return JsonResponse({'status': 'success', 'courses': courses_data, 'stats': stats})

@csrf_exempt
def api_update_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
        
    if request.method == 'POST':
        user = request.user
        full_name = request.POST.get('full_name')
        if full_name:
            names = full_name.split(' ', 1)
            user.first_name = names[0]
            if len(names) > 1:
                user.last_name = names[1]
            else:
                user.last_name = ""
        email = request.POST.get('email')
        if email:
            user.email = email
        password = request.POST.get('password')
        if password:
            user.set_password(password)
            from django.contrib.auth import update_session_auth_hash
            update_session_auth_hash(request, user)
        user.save()
        profile, _ = Profile.objects.get_or_create(user=user)
        phone = request.POST.get('phone')
        if phone is not None:
            profile.phone = phone
        bio = request.POST.get('bio')
        if bio is not None:
            profile.bio = bio
        avatar = request.FILES.get('avatar')
        if avatar:
            profile.avatar = avatar
        profile.save()
        return JsonResponse({
            'status': 'success', 
            'avatar_url': profile.avatar.url if profile.avatar else None,
            'message': 'Profile updated successfully'
        })
    return JsonResponse({'status': 'error', 'message': 'Invalid method'}, status=405)

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

def api_course_lessons(request, course_id):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
    course = get_object_or_404(Course, pk=course_id)
    has_access = Purchase.objects.filter(student=request.user, course=course).exists()
    if not has_access:
        return JsonResponse({'status': 'error', 'message': 'You have not purchased this course.'}, status=403)
    lessons = Lesson.objects.filter(course=course).order_by('order')
    lessons_data = []
    for lesson in lessons:
        lessons_data.append({
            'id': lesson.id,
            'title': lesson.title,
            'order': lesson.order,
            'video_url': lesson.video_url or '',
            'pdf_url': lesson.pdf_file.url if lesson.pdf_file else '',
        })
    return JsonResponse({
        'status': 'success',
        'course': {'id': course.id, 'title': course.name},
        'lessons': lessons_data
    })

def lesson_player(request, course_id, lesson_id):
    if not request.user.is_authenticated:
        return redirect('login_page')
    course = get_object_or_404(Course, pk=course_id)
    if lesson_id == 0:
        first_lesson = Lesson.objects.filter(course=course).order_by('order').first()
        if not first_lesson:
             return HttpResponse("No lessons yet for this course.", status=404)
        return redirect('lesson_player', course_id=course.id, lesson_id=first_lesson.id)
    lesson = get_object_or_404(Lesson, pk=lesson_id, course=course)
    all_lessons = Lesson.objects.filter(course=course).order_by('order')
    has_access = Purchase.objects.filter(student=request.user, course=course).exists()
    if not has_access:
        return redirect('course_detail', pk=course_id)
    tracker, _ = CourseTimeTracker.objects.get_or_create(user=request.user, course=course)
    tracker.time_spent += 1
    tracker.save()
    lesson_list = list(all_lessons)
    current_index = next((i for i, l in enumerate(lesson_list) if l.id == lesson.id), 0)
    prev_lesson = lesson_list[current_index - 1] if current_index > 0 else None
    next_lesson = lesson_list[current_index + 1] if current_index < len(lesson_list) - 1 else None
    completed_lesson_ids = set()
    if request.user.is_authenticated:
        completed_lesson_ids = set(LessonProgress.objects.filter(
            student=request.user, lesson__in=all_lessons, completed=True
        ).values_list('lesson_id', flat=True))
    return render(request, 'lesson_player.html', {
        'course': course,
        'lesson': lesson,
        'all_lessons': all_lessons,
        'prev_lesson': prev_lesson,
        'next_lesson': next_lesson,
        'lesson_count': len(lesson_list),
        'current_index': current_index + 1,
        'completed_lesson_ids': completed_lesson_ids,
        'is_completed': lesson.id in completed_lesson_ids,
    })

@csrf_exempt
def api_mark_lesson_completed(request, course_id, lesson_id):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
    course = get_object_or_404(Course, pk=course_id)
    lesson = get_object_or_404(Lesson, pk=lesson_id, course=course)
    has_access = Purchase.objects.filter(student=request.user, course=course).exists()
    if not has_access:
        return JsonResponse({'status': 'error', 'message': 'No access to this course.'}, status=403)
    progress, created = LessonProgress.objects.get_or_create(student=request.user, lesson=lesson)
    progress.completed = True
    progress.completed_at = timezone.now()
    progress.save()
    return JsonResponse({'status': 'success', 'message': 'Lesson marked as completed'})

@csrf_exempt
def api_add_course_review(request, course_id):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'POST required'}, status=405)
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
    course = get_object_or_404(Course, pk=course_id)
    if not Purchase.objects.filter(student=request.user, course=course).exists():
        return JsonResponse({'status': 'error', 'message': 'You must purchase this course to review it.'}, status=403)
    if CourseReview.objects.filter(student=request.user, course=course).exists():
        return JsonResponse({'status': 'error', 'message': 'You have already reviewed this course.'}, status=400)
    try:
        data = json.loads(request.body)
        rating = int(data.get('rating', 0))
        comment = data.get('comment', '').strip()
        if rating < 1 or rating > 5:
            return JsonResponse({'status': 'error', 'message': 'Rating must be between 1 and 5.'}, status=400)
        CourseReview.objects.create(
            course=course,
            student=request.user,
            rating=rating,
            comment=comment
        )
        return JsonResponse({'status': 'success', 'message': 'Review submitted successfully.'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

def download_certificate(request, course_id):
    if not request.user.is_authenticated:
        return redirect('login_page')
    course = get_object_or_404(Course, id=course_id)
    total_lessons = Lesson.objects.filter(course=course).count()
    completed_lessons = LessonProgress.objects.filter(student=request.user, lesson__course=course, completed=True).count()
    if total_lessons == 0 or completed_lessons < total_lessons:
        return HttpResponse("You haven't completed all lessons yet. Completion required for certificate.", status=403)
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=landscape(A4))
    width, height = landscape(A4)
    p.setStrokeColor(colors.HexColor("#00f5c4"))
    p.setLineWidth(10)
    p.rect(20, 20, width-40, height-40, stroke=1, fill=0)
    p.setStrokeColor(colors.HexColor("#2e3250"))
    p.setLineWidth(1)
    p.rect(35, 35, width-70, height-70, stroke=1, fill=0)
    p.setFont("Helvetica-Bold", 45)
    p.setFillColor(colors.HexColor("#1a1d27"))
    p.drawCentredString(width/2, height - 120, "CERTIFICATE OF COMPLETION")
    p.setFont("Helvetica", 18)
    p.drawCentredString(width/2, height - 200, "This is to certify that")
    p.setFont("Helvetica-Bold", 35)
    p.setFillColor(colors.HexColor("#7c6bff"))
    student_full_name = f"{request.user.first_name} {request.user.last_name}" if request.user.first_name else request.user.username
    p.drawCentredString(width/2, height - 260, student_full_name.upper())
    p.setFont("Helvetica", 18)
    p.setFillColor(colors.HexColor("#1a1d27"))
    p.drawCentredString(width/2, height - 320, f"has successfully completed the course:")
    p.setFont("Helvetica-Bold", 28)
    p.drawCentredString(width/2, height - 380, course.name.upper())
    p.setFont("Helvetica", 16)
    today = timezone.now().strftime("%B %d, %Y")
    p.drawCentredString(width/2, height - 440, f"Completed on {today}")
    p.setFont("Helvetica-Oblique", 14)
    p.drawCentredString(width/2, height - 520, "Verified by Bokify Learning Platform")
    p.showPage()
    p.save()
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{course.name}_Certificate.pdf"'
    return response

def api_parent_dashboard(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
    try:
        if request.user.profile.user_type != "parent":
            return JsonResponse({"error": "Unauthorized"}, status=403)
    except Profile.DoesNotExist:
        return JsonResponse({"error": "Profile not found"}, status=404)
    links = StudentParent.objects.filter(parent=request.user).select_related('student')
    children_data = []
    for link in links:
        child = link.student
        enrollments = Purchase.objects.filter(student=child).select_related('course')
        courses_data = []
        for enrollment in enrollments:
            course = enrollment.course
            total_lessons = Lesson.objects.filter(course=course).count()
            completed_lessons = LessonProgress.objects.filter(
                student=child, 
                lesson__course=course, 
                completed=True
            ).count()
            progress_pct = int((completed_lessons / total_lessons) * 100) if total_lessons > 0 else 0
            tracker = CourseTimeTracker.objects.filter(user=child, course=course).first()
            minutes = tracker.time_spent if tracker else 0
            courses_data.append({
                'course_id': course.id,
                'course_name': course.name,
                'progress_percent': progress_pct,
                'time_spent_minutes': minutes,
                'last_accessed': tracker.last_accessed.strftime("%Y-%m-%d %H:%M") if tracker else "Never"
            })
        children_data.append({
            'child_id': child.id,
            'child_name': f"{child.first_name} {child.last_name}".strip() or child.username,
            'enrolled_courses': courses_data
        })
    return JsonResponse({
        'status': 'success',
        'parent_name': f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username,
        'children': children_data
    })

@csrf_exempt
def api_generate_link_code(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
    if request.user.profile.user_type != 'student':
        return JsonResponse({'status': 'error', 'message': 'Only students can generate a link code.'}, status=403)
    alphabet = string.ascii_uppercase + string.digits
    while True:
        code = ''.join(secrets.choice(alphabet) for i in range(8))
        if not Profile.objects.filter(link_code=code).exists():
            break
    profile = request.user.profile
    profile.link_code = code
    profile.save()
    return JsonResponse({'status': 'success', 'link_code': code})

@csrf_exempt
def api_connect_child(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)
    try:
        if request.user.profile.user_type != "parent":
            return JsonResponse({"error": "Unauthorized"}, status=403)
    except Profile.DoesNotExist:
        return JsonResponse({"error": "Profile not found"}, status=404)
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Only POST allowed.'}, status=405)
    try:
        data = json.loads(request.body)
        code = data.get('link_code')
    except:
        return JsonResponse({'status': 'error', 'message': 'Invalid data format.'}, status=400)
    if not code:
        return JsonResponse({'status': 'error', 'message': 'Link code is required.'}, status=400)
    student_profile = Profile.objects.filter(link_code=code.upper(), user_type='student').first()
    if not student_profile:
        return JsonResponse({'status': 'error', 'message': 'Invalid or expired link code.'}, status=404)
    student_user = student_profile.user
    if StudentParent.objects.filter(parent=request.user, student=student_user).exists():
        return JsonResponse({'status': 'error', 'message': 'You are already linked to this student.'}, status=400)
    StudentParent.objects.create(parent=request.user, student=student_user)
    student_profile.link_code = None
    student_profile.save()
    return JsonResponse({
        'status': 'success', 
        'message': f"Successfully linked to student: {student_user.username}"
    })

@csrf_exempt
def api_checkout(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Please login to complete purchase'}, status=401)
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
        cart_items = data.get('cart', [])
        if not cart_items:
            return JsonResponse({'status': 'error', 'message': 'Cart is empty'}, status=400)
        purchased_count = 0
        for item in cart_items:
            course_id = item.get('id')
            course = None
            if course_id:
                course = Course.objects.filter(id=course_id).first()
            else:
                course = Course.objects.filter(name=item.get('title')).first()
            if course:
                obj, created = Purchase.objects.get_or_create(
                    student=request.user,
                    course=course,
                    defaults={
                        'price': course.price or 0,
                        'bill_id': f"BOK-{uuid.uuid4().hex[:10].upper()}"
                    }
                )
                if created:
                    purchased_count += 1
        return JsonResponse({
            'status': 'success', 
            'message': f'Successfully enrolled in {purchased_count} new courses!',
            'redirect': '/student-dashboard/'
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@login_required
@csrf_exempt
def api_ask_doubt(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)
    try:
        data = json.loads(request.body)
        question = data.get('question')
        history = data.get('history', [])
        course_id = data.get('course_id')
        lesson_id = data.get('lesson_id')
        if not question:
            return JsonResponse({'status': 'error', 'message': 'Question is required'}, status=400)
        course = get_object_or_404(Course, id=course_id)
        lesson = get_object_or_404(Lesson, id=lesson_id)
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        model = genai.GenerativeModel('models/gemini-flash-lite-latest')
        chat = model.start_chat(history=history)
        prompt = f"""(System Context: Student is in Course "{course.name}" - Lesson "{lesson.title}". Role: Elite Bokify Tutor.) Question: {question}"""
        response = chat.send_message(prompt)
        return JsonResponse({
            'status': 'success',
            'answer': response.text
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

from datetime import date

@login_required
def download_full_course_pdf(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    is_enrolled = Purchase.objects.filter(student=request.user, course=course).exists()
    if not is_enrolled:
        return HttpResponse("Access Denied. You must enroll in this course to download the full guide.", status=403)
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{course.name.replace(" ", "_")}_Total_Guide.pdf"'
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=100, bottomMargin=72)
    styles = getSampleStyleSheet()
    elements = []
    title_style = ParagraphStyle(name='CoverTitle', parent=styles['Heading1'], alignment=TA_CENTER, fontSize=36, spaceAfter=20, textColor='#1e293b')
    sub_title_style = ParagraphStyle(name='CoverSub', parent=styles['Normal'], alignment=TA_CENTER, fontSize=16, textColor='#64748b')
    lesson_head_style = ParagraphStyle(name='LessonHead', parent=styles['Heading1'], fontSize=22, spaceAfter=15, textColor='#0f172a', borderPadding=10)
    elements.append(Spacer(1, 150))
    elements.append(Paragraph(course.name, title_style))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(f"Presented to: {request.user.first_name} {request.user.last_name}", sub_title_style))
    elements.append(Paragraph(f"Download Date: {date.today().strftime('%b %d, %Y')}", sub_title_style))
    elements.append(PageBreak())
    elements.append(Paragraph("Table of Contents", styles['Heading1']))
    elements.append(Spacer(1, 20))
    lessons = course.lessons.all().order_by('order')
    for i, lesson in enumerate(lessons, 1):
        elements.append(Paragraph(f"{i}. {lesson.title}", styles['Normal']))
        elements.append(Spacer(1, 8))
    elements.append(PageBreak())
    for lesson in lessons:
        elements.append(Paragraph(f"CHAPTER: {lesson.title}", lesson_head_style))
        elements.append(Spacer(1, 12))
        if lesson.content:
            text_blocks = lesson.content.split('\n')
            for block in text_blocks:
                if block.strip():
                    elements.append(Paragraph(block.strip(), styles['Normal']))
        else:
            elements.append(Paragraph("Welcome to this lesson! Detailed reading notes are currently in development for this module.", styles['Italic']))
        elements.append(PageBreak())
    def add_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('Helvetica', 9)
        canvas.setStrokeColor('#cbd5e1')
        canvas.line(72, 50, A4[0]-72, 50)
        canvas.drawString(72, 35, "Generated from Bokify — Your Elite Learning Path")
        canvas.drawRightString(A4[0]-72, 35, f"Page {doc.page}")
        canvas.restoreState()
    doc.build(elements, onFirstPage=add_footer, onLaterPages=add_footer)
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response

@login_required
def download_lesson_pdf(request, lesson_id):
    lesson = get_object_or_404(Lesson, id=lesson_id)
    enrolled = Purchase.objects.filter(student=request.user, course=lesson.course).exists()
    if not enrolled:
        return HttpResponse("Unauthorized. You must purchase this course to download the notes.", status=403)
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{lesson.title.replace(" ", "_")}_Notes.pdf"'
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='CenterTitle', parent=styles['Heading1'], alignment=TA_CENTER, fontSize=24, spaceAfter=20, textColor='#000000'))
    styles.add(ParagraphStyle(name='LessonBody', parent=styles['Normal'], fontSize=12, leading=18, spaceAfter=12))
    elements = []
    elements.append(Paragraph(lesson.title, styles['CenterTitle']))
    elements.append(Paragraph(f"Course: {lesson.course.name}", styles['Heading3']))
    elements.append(Spacer(1, 24))
    if lesson.content:
        text_blocks = lesson.content.split('\n')
        for block in text_blocks:
            if block.strip():
                elements.append(Paragraph(block.strip(), styles['LessonBody']))
    else:
        elements.append(Paragraph("Welcome to this lesson! Please watch the attached video for full instructions. Detailed text notes haven't been added to this lesson yet.", styles['Italic']))
    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response

@login_required
def api_admin_stats(request):
    try:
        from django.utils import timezone
        from django.db.models import Sum, Count
        if not hasattr(request.user, 'profile') or request.user.profile.user_type != 'admin':
            return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)
        purchases = Purchase.objects.all().select_related('student', 'course').order_by('-purchase_date')
        all_purchases = list(purchases)
        students_count = Profile.objects.filter(user_type='student').count()
        courses_count = Course.objects.count()
        sales_count = len(all_purchases)
        total_revenue = sum(float(p.price or 0) for p in all_purchases)
        avg_order = total_revenue / sales_count if sales_count > 0 else 0
        orders_list = []
        for p in all_purchases[:10]:
            orders_list.append({
                'studentName': f"{p.student.first_name} {p.student.last_name}".strip() or p.student.username,
                'course': p.course.name if p.course else "General",
                'amount': f"₹{p.price or 0}",
                'date': p.purchase_date.strftime("%b %d, %Y"),
                'status': 'Complete'
            })
        students_list = []
        profiles = Profile.objects.filter(user_type='student').select_related('user')
        for p_obj in profiles:
            p_courses = Purchase.objects.filter(student=p_obj.user).count()
            students_list.append({
                'name': f"{p_obj.user.first_name} {p_obj.user.last_name}".strip() or p_obj.user.username,
                'email': p_obj.user.email,
                'courses': p_courses,
                'joined': p_obj.user.date_joined.strftime("%b %d, %Y"),
                'status': 'Active' if p_obj.user.is_active else 'Inactive'
            })
        days_7 = []
        for i in range(6, -1, -1):
            days_7.append(timezone.now().date() - timezone.timedelta(days=i))
        labels = [d.strftime('%b %d') for d in days_7]
        chart_values = []
        daily_map = {}
        for p in all_purchases:
            d_key = p.purchase_date.date()
            daily_map[d_key] = daily_map.get(d_key, 0) + float(p.price or 0)
        for d in days_7:
            chart_values.append(daily_map.get(d, 0.0))
        return JsonResponse({
            'status': 'success',
            'stats': {
                'total_students': students_count,
                'total_revenue': total_revenue,
                'sales_count': sales_count,
                'avg_order': avg_order,
                'courses_count': courses_count
            },
            'chart_data': {
                'labels': labels,
                'data': chart_values
            },
            'students': students_list,
            'orders': orders_list
        })
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
