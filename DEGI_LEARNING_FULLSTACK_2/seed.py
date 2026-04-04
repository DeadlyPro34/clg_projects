import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learning_platform.settings')
django.setup()

from django.contrib.auth.models import User
from base.models import Profile, Course

# 1. Create Superuser (Admin) if not exists
if not User.objects.filter(username='admin@bokify.com').exists():
    user = User.objects.create_superuser('admin@bokify.com', 'admin@bokify.com', 'admin123')
    user.first_name = 'Bokify'
    user.last_name = 'Admin'
    user.save()
    Profile.objects.get_or_create(user=user, user_type='admin')
    print("Admin user created: admin@bokify.com / admin123")
else:
    print("Admin user already exists.")

# 2. Add Dummy Courses
courses = [
    { "name": "Coding Fundamentals", "price": 499, "description": "Sarah Jenkins" },
    { "name": "Advanced Mathematics", "price": 599, "description": "Dr. A. Kumar" },
    { "name": "Junior Robotics Lab", "price": 799, "description": "TechKids Academy" },
]

for c in courses:
    Course.objects.get_or_create(name=c['name'], defaults=c)

print("Dummy courses added.")
