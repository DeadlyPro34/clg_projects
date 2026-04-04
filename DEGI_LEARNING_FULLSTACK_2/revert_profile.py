import os
import django
import sys

# Setup Django environment
sys.path.append('c:\\Users\\AKHIL\\OneDrive\\Desktop\\DEGI_LEARNING_FULLSTACK')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learning_platform.settings')
django.setup()

from base.models import Profile
from django.contrib.auth.models import User

def revert():
    admin_user = "admin.sbj@bokify.com"
    user = User.objects.filter(username=admin_user).first()
    if user:
        if hasattr(user, 'profile'):
            profile = user.profile
            profile.user_type = 'student'
            profile.save()
            print(f"✅ REVERTED: {admin_user} is now a 'student' again.")
        else:
            print(f"ERROR: {admin_user} has no profile.")
    else:
        print(f"ERROR: User {admin_user} not found.")

if __name__ == "__main__":
    revert()
