import os
import django
import sys

# Setup Django environment
sys.path.append('c:\\Users\\AKHIL\\OneDrive\\Desktop\\DEGI_LEARNING_FULLSTACK')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learning_platform.settings')
django.setup()

from base.models import Profile, Purchase, Course
from django.contrib.auth.models import User
from django.utils import timezone

def fix():
    # 1. Find Akhil
    username = "admin.sbj@bokify.com"
    user = User.objects.filter(username=username).first()
    
    if not user:
        print(f"ERROR: User '{username}' not found.")
        return

    # 2. Update his Profile to Student and set first name
    profile, _ = Profile.objects.get_or_create(user=user)
    profile.user_type = 'student'
    profile.save()
    
    if not user.first_name:
        user.first_name = "Akhil"
        user.save()
    print(f"✅ User '{username}' (Akhil) set to Student type.")

    # 3. Check Purchases for Akhil
    p_count = Purchase.objects.filter(student=user).count()
    if p_count == 0:
        print("SEEDING: Akhil has no purchases! Adding a test buy for him...")
        course = Course.objects.first()
        if course:
            Purchase.objects.get_or_create(
                student=user,
                course=course,
                price=course.price,
                purchase_date=timezone.now(),
                bill_id="FIX-AKHIL-001"
            )
            print(f"✅ Added {course.name} Enrollment for Akhil.")
        else:
            print("ERROR: No courses found to purchase!")
    else:
        print(f"STATUS: Akhil already has {p_count} purchases.")

    # 4. Global Stats
    print(f"TOTAL Students in DB: {Profile.objects.filter(user_type='student').count()}")
    print(f"TOTAL Purchases in DB: {Purchase.objects.count()}")

if __name__ == "__main__":
    fix()
