from django import forms
from django.contrib.auth.models import User
from .models import Course

class SignupForm(forms.Form):
    email = forms.EmailField(error_messages={'required': 'Email is required.', 'invalid': 'Enter a valid email address.'})
    password = forms.CharField(min_length=6, error_messages={'required': 'Password is required.', 'min_length': 'Password must be at least 6 characters.'})
    fullName = forms.CharField(required=True, error_messages={'required': 'Full name is required.'})

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(username=email).exists():
            raise forms.ValidationError("User with this email already exists.")
        return email

class PurchaseForm(forms.Form):
    course_name = forms.CharField(required=True, error_messages={'required': 'Course name is required.'})
    price = forms.DecimalField(max_digits=10, decimal_places=2, required=True, error_messages={'required': 'Price is required.'})
    bill_id = forms.CharField(required=True, error_messages={'required': 'Bill ID is required.'})

    def clean_course_name(self):
        course_name = self.cleaned_data.get('course_name')
        try:
            course = Course.objects.get(name=course_name)
        except Course.DoesNotExist:
            raise forms.ValidationError("Course not found.")
        return course
