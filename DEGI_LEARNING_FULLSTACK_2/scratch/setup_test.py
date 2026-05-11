import os
import django
import sys

# Setup Django
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learning_platform.settings')
django.setup()

from django.contrib.auth.models import User
from base.models import Profile, Course, Purchase, Lesson

def setup_test_user():
    username = 'tester'
    password = 'password123'
    
    # Create User
    user, created = User.objects.get_or_create(username=username)
    user.set_password(password)
    user.save()
    
    # Create Profile
    Profile.objects.update_or_create(user=user, defaults={'user_type': 'student'})
    
    # Ensure a course exists
    course = Course.objects.first()
    if not course:
        course = Course.objects.create(name="Test Course", description="Test Description", price=100)
        Lesson.objects.create(course=course, title="Test Lesson", order=1, video_url="https://youtube.com/embed/dQw4w9WgXcQ")

    # Enroll in course
    Purchase.objects.get_or_create(student=user, course=course, defaults={'price': course.price, 'bill_id': 'TEST-BILL'})
    
    print(f"User {username} created and enrolled in {course.name}")

if __name__ == "__main__":
    setup_test_user()
