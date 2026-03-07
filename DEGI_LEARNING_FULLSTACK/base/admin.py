from django.contrib import admin
from .models import Profile, Course, Purchase, ContactMessage, CourseCompletion

admin.site.register(Profile)
admin.site.register(Course)
admin.site.register(Purchase)
admin.site.register(ContactMessage)
admin.site.register(CourseCompletion)
