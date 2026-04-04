from django.contrib import admin
from .models import Profile, Course, Purchase, ContactMessage, CourseCompletion, Lesson, LessonProgress, CourseReview

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ('order', 'title', 'video_url', 'pdf_file')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')
    inlines = [LessonInline]

admin.site.register(Profile)
admin.site.register(Purchase)
admin.site.register(ContactMessage)
admin.site.register(CourseCompletion)
admin.site.register(Lesson)
admin.site.register(LessonProgress)
admin.site.register(CourseReview)

