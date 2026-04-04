import os
import django
import json

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learning_platform.settings')
django.setup()

from base.models import Course, Lesson

def seed_courses():
    courses_to_add = [
        {
            "name": "Coding Fundamentals",
            "description": "Master the basics of programming with Sarah Jenkins. Learn Python, logic, and problem-solving.",
            "price": 499,
            "img": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800",
            "lessons": [
                {"title": "Introduction to Python", "url": "https://www.youtube.com/embed/kqtD5dpn9C8"},
                {"title": "Variables and Data Types", "url": "https://www.youtube.com/embed/mK5N8L-qYqA"}
            ]
        },
        {
            "name": "Advanced Mathematics",
            "description": "Complex equations and advanced logic with Dr. A. Kumar. Calculus, Algebra, and more.",
            "price": 599,
            "img": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
            "lessons": [
                {"title": "Calculus Basics", "url": "https://www.youtube.com/embed/W3W9y_Z_a_0"},
                {"title": "Linear Algebra", "url": "https://www.youtube.com/embed/kjBOesZCoqc"}
            ]
        },
        {
            "name": "Junior Robotics Lab",
            "description": "Step into the world of tech with TechKids Academy. Build your first robot!",
            "price": 799,
            "img": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800",
            "lessons": [
                {"title": "Robotics 101", "url": "https://www.youtube.com/embed/6e_f-U3M224"},
                {"title": "Sensors and Motors", "url": "https://www.youtube.com/embed/9BqIReN7mCQ"}
            ]
        },
        {
            "name": "Digital Art Masterclass",
            "description": "Master digital painting and creative arts with Lisa Ray. Procreate and Photoshop.",
            "price": 399,
            "img": "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=800",
            "lessons": [
                {"title": "Drawing Fundamentals", "url": "https://www.youtube.com/embed/W_X76p-bQPU"},
                {"title": "Color Theory", "url": "https://www.youtube.com/embed/L1CK9bE3H_s"}
            ]
        },
        {
            "name": "Web Development Basics",
            "description": "Build high-performance websites with HTML, CSS and JS. Expert guidance from Code Masters.",
            "price": 899,
            "img": "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800",
            "lessons": [
                {"title": "HTML5 & CSS3 Masterclass", "url": "https://www.youtube.com/embed/D-h8L5hgG-w"},
                {"title": "JavaScript for Beginners", "url": "https://www.youtube.com/embed/W6NZfCO5SIk"}
            ]
        },
        {
            "name": "Creative English",
            "description": "Advanced grammar and creative writing with Oxford Tutors. Perfect your literature skills.",
            "price": 299,
            "img": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
            "lessons": [
                {"title": "Creative Writing Tips", "url": "https://www.youtube.com/embed/vO8o8eH9xX0"},
                {"title": "Mastering Grammar", "url": "https://www.youtube.com/embed/XyW-y5fM6jE"}
            ]
        },
    ]

    for item in courses_to_add:
        course, created = Course.objects.update_or_create(
            name=item['name'],
            defaults={
                'description': item['description'],
                'price': item['price'],
            }
        )
        
        # Add a custom attribute for img URL if we want to use it in fallback
        # In a real app, you'd save this to the 'image' field or a new 'thumbnail_url' field
        # Here we'll just ensure the template knows how to fetch it.

        for idx, l in enumerate(item['lessons']):
            Lesson.objects.get_or_create(
                course=course,
                title=l['title'],
                defaults={
                    'video_url': l['url'],
                    'order': idx + 1
                }
            )

        if created:
            print(f"Added: {item['name']}")
        else:
            print(f"Updated: {item['name']}")

if __name__ == "__main__":
    seed_courses()
    print("\n--- Seeding Complete! ---")
