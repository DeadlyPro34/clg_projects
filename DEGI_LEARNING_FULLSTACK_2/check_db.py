import os
import django
import sys

# Setup Django environment
sys.path.append('c:\\Users\\AKHIL\\OneDrive\\Desktop\\DEGI_LEARNING_FULLSTACK')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learning_platform.settings')
django.setup()

from base.models import Purchase, Course, Profile, Lesson, LessonProgress
from django.contrib.auth.models import User
from django.utils import timezone
import random

def check_and_seed():
    print("--- Bokify DB Diagnostic ---")
    
    # 1. Check Purchases
    p_count = Purchase.objects.count()
    print(f"Current Purchases: {p_count}")
    
    # 2. Check Students
    s_count = Profile.objects.filter(user_type='student').count()
    print(f"Current Students: {s_count}")
    
    # 3. Check Admin Profiles
    admin_email = "admin@bokify.com"
    admin = User.objects.filter(username=admin_email).first()
    if admin:
        profile, _ = Profile.objects.get_or_create(user=admin)
        if profile.user_type != 'admin':
            profile.user_type = 'admin'
            profile.save()
            print(f"Status: Ensured {admin_email} is 'admin'")
    
    student_email = "admin.sbj@bokify.com"
    student = User.objects.filter(username=student_email).first()
    if student:
        profile, _ = Profile.objects.get_or_create(user=student)
        profile.user_type = 'student'
        profile.save()
        print(f"Status: Ensured {student_email} is 'student'")

    # 4. Seed Data if Empty
    if p_count == 0:
        print("SEEDING: Database is empty. Adding 3 test sales...")
        courses = Course.objects.all()
        if not courses.exists():
            print("ERROR: No courses found to seed sales. Please add a course first!")
            return

        # Create/Get a test student
        student_user, _ = User.objects.get_or_create(username='test_student@bokify.com', email='test_student@bokify.com')
        student_profile, _ = Profile.objects.get_or_create(user=student_user, user_type='student')
        
        for i in range(3):
            course = random.choice(courses)
            Purchase.objects.get_or_create(
                student=student_user,
                course=course,
                price=course.price,
                purchase_date=timezone.now()
            )
        print("SUCCESS: Seeded 3 sales into the database.")
    
    print("\nCheck finished. Refresh your dashboard!")

if __name__ == "__main__":
    check_and_seed()
