from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class StudentStreak(models.Model):
    student = models.OneToOneField(User, on_delete=models.CASCADE)
    streak_count = models.IntegerField(default=1)
    last_login_date = models.DateField(auto_now_add=True)

    def update_streak(self):
        today = timezone.now().date()
        delta = (today - self.last_login_date).days
        if delta == 1:
            self.streak_count += 1
            self.last_login_date = today
        elif delta > 1:
            self.streak_count = 1
            self.last_login_date = today
        self.save()

class Profile(models.Model):
    USER_TYPES = (
        ('student', 'Student'),
        ('parent', 'Parent'),
        ('admin', 'Admin'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='student')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    link_code = models.CharField(max_length=8, unique=True, null=True, blank=True)

    
    def __str__(self):
        return f"{self.user.username} - {self.user_type}"

class Course(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='course_images/', null=True, blank=True)
    
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return sum(review.rating for review in reviews) / reviews.count()
        return 0

    def __str__(self):
        return self.name

    def get_image_url(self):
        if self.image:
            return self.image.url
        
        # Consistent fallbacks based on ID to ensure variety
        placeholders = [
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
            "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
            "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
            "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
            "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8",
            "https://images.unsplash.com/photo-1547658719-da2b51169166",
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8"
        ]
        idx = self.id % len(placeholders) if self.id else 0
        return f"{placeholders[idx]}?auto=format&fit=crop&w=600&q=80"

class CourseReview(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course', 'student')

    def __str__(self):
        return f"{self.rating}★ by {self.student.username} for {self.course.name}"

class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    video_url = models.URLField(null=True, blank=True, help_text="YouTube/Vimeo embed URL")
    pdf_file = models.FileField(upload_to='lesson_pdfs/', null=True, blank=True)
    order = models.PositiveIntegerField(default=1)
    content = models.TextField(null=True, blank=True, help_text="Full lesson transcript or notes for PDF download")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.name} - {self.order}. {self.title}"

class LessonProgress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('student', 'lesson')  # One record per student per lesson

    def __str__(self):
        status = "✅" if self.completed else "⬜"
        return f"{status} {self.student.username} — {self.lesson.title}"

class Purchase(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateTimeField(auto_now_add=True)
    bill_id = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.student.username} bought {self.course.name}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message from {self.name}"

class CourseCompletion(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=255)
    completion_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.student.username} completed {self.course_name}"

class StudentParent(models.Model):
    parent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='students')
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent_association')

    def __str__(self):
        return f"Parent: {self.parent.username} -> Student: {self.student.username}"

class CourseTimeTracker(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_time_logs')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_time_logs')
    time_spent = models.PositiveIntegerField(default=0, help_text="Time spent in minutes")
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} — {self.course.name} ({self.time_spent}m)"


