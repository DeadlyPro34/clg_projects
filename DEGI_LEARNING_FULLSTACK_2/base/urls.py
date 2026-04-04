from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('lesson/<int:lesson_id>/download-pdf/', views.download_lesson_pdf, name='pdf_dl'),
    path('course/<int:course_id>/download-full-pdf/', views.download_full_course_pdf, name='full_course_pdf'),
    path('', views.index, name='index'),
    path('explore/', views.explore, name='explore'),
    path('course/<int:pk>/', views.course_detail, name='course_detail'),
    path('login/', views.login_page, name='login_page'),
    path('student-dashboard/', views.student_dashboard, name='student_dashboard'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('parent-dashboard/', views.parent_dashboard, name='parent_dashboard'),
    path('logout/', views.logout_view, name='logout'),
    
    # APIs
    path('api/login/', views.api_login, name='api_login'),
    path('api/signup/', views.api_signup, name='api_signup'),
    path('api/contact/', views.api_contact, name='api_contact'),
    path('api/purchase/', views.api_purchase, name='api_purchase'),
    path('api/complete/', views.api_complete_course, name='api_complete'),
    path('api/get-purchases/', views.api_get_purchases, name='api_get_purchases'),
    path('api/get-messages/', views.api_get_messages, name='api_get_messages'),
    path('api/courses/', views.api_courses, name='api_courses'),
    path('api/my-courses/', views.api_my_courses, name='api_my_courses'),
    path('api/profile/update/', views.api_update_profile, name='api_update_profile'),
    path('api/course/<int:course_id>/lessons/', views.api_course_lessons, name='api_course_lessons'),
    path('api/course/<int:course_id>/lesson/<int:lesson_id>/complete/', views.api_mark_lesson_completed, name='api_mark_lesson_completed'),
    path('api/course/<int:course_id>/review/', views.api_add_course_review, name='api_add_course_review'),
    path('course/<int:course_id>/certificate/', views.download_certificate, name='download_certificate'),
    path('api/course/add/', views.api_add_course, name='api_add_course'),
    path('api/course/edit/', views.api_edit_course, name='api_edit_course'),
    path('api/course/delete/', views.api_delete_course, name='api_delete_course'),
    path('api/parent/dashboard/', views.api_parent_dashboard, name='api_parent_dashboard'),
    path('api/student/generate-link-code/', views.api_generate_link_code, name='api_generate_link_code'),
    path('api/parent/connect-child/', views.api_connect_child, name='api_connect_child'),
    path('api/checkout/', views.api_checkout, name='api_checkout'),
    path('api/ask-doubt/', views.api_ask_doubt, name='api_ask_doubt'),
    path('api/admin/stats/', views.api_admin_stats, name='api_admin_stats'),
    path('course/<int:course_id>/lesson/<int:lesson_id>/', views.lesson_player, name='lesson_player'),
    
    # --- Django Password Reset Auth Views ---
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name='registration/password_reset_form.html'), name="reset_password"),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name='registration/password_reset_done.html'), name="password_reset_done"),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='registration/password_reset_confirm.html'), name="password_reset_confirm"),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name='registration/password_reset_complete.html'), name="password_reset_complete"),
]
