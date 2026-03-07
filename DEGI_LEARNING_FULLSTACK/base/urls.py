from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('explore/', views.explore, name='explore'),
    path('login/', views.login_page, name='login_page'),
    path('student-dashboard/', views.student_dashboard, name='student_dashboard'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('logout/', views.logout_view, name='logout'),
    
    # APIs
    path('api/login/', views.api_login, name='api_login'),
    path('api/signup/', views.api_signup, name='api_signup'),
    path('api/contact/', views.api_contact, name='api_contact'),
    path('api/purchase/', views.api_purchase, name='api_purchase'),
    path('api/complete/', views.api_complete_course, name='api_complete'),
    path('api/get-purchases/', views.api_get_purchases, name='api_get_purchases'),
    path('api/get-messages/', views.api_get_messages, name='api_get_messages'),
]
