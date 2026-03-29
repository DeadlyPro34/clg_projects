# Bokify - Digital Learning Platform

Bokify is a comprehensive e-learning platform designed to empower the next generation with high-quality, accessible, and engaging online education. Built with a robust Django backend and a modern, responsive frontend, Bokify offers a seamless experience for both students and administrators.

---

## 🚀 Features

### For Students
- **Course Exploration:** Browse through a wide range of courses in Coding, Mathematics, Robotics, and Digital Art.
- **Interactive Roadmap:** Understand the learning journey and milestones.
- **Secure Authentication:** Easy signup and login process.
- **Personal Dashboard:** Track purchased courses and learning progress.
- **Direct Support:** Get in touch with the team via the integrated contact form.

### For Administrators
- **Comprehensive Dashboard:** Monitor total revenue, number of courses, and total sales.
- **Student Management:** View and manage registered students.
- **Sales Tracking:** Detailed list of all purchases made on the platform.
- **Message Center:** Access and respond to inquiries sent via the contact form.

---

## 🛠️ Technology Stack

- **Backend:** [Django](https://www.djangoproject.com/) (Python)
- **Frontend:** HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Database:** SQLite3 (default, but easily migratable to PostgreSQL or MySQL)
- **Icons & Fonts:** Font-Awesome, Lucide-Icons, Google Fonts

---

## 📂 Project Structure

```bash
DEGI_LEARNING_FULLSTACK/
├── base/                   # Core application logic
│   ├── models.py           # Database schemas (Profile, Course, Purchase, etc.)
│   ├── views.py            # Backend logic and API endpoints
│   ├── urls.py             # Route definitions
│   └── templates/          # HTML templates for the app
├── Documentations/         # Project reports and presentations
├── learning_platform/      # Main project configuration
│   ├── settings.py         # Project settings
│   └── urls.py             # Root URL routing
├── static/                 # Static assets (CSS, JS)
├── media/                  # User-uploaded files (Course images)
├── IMAGE/                  # Design assets and logos
├── manage.py               # Django's command-line utility
├── seed.py                 # Script to populate initial data
└── db.sqlite3              # Local development database
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.8 or higher installed on your system.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd DEGI_LEARNING_FULLSTACK
   ```

2. **Create and activate a virtual environment (Optional but recommended):**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   *(Ensure you have Django installed)*
   ```bash
   pip install django
   ```

4. **Apply Migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Seed the Database (Initial Data):**
   This script creates an admin user and some dummy courses.
   ```bash
   python seed.py
   ```
   - **Admin Email:** `admin@bokify.com`
   - **Admin Password:** `admin123`

6. **Run the Server:**
   ```bash
   python manage.py runserver
   ```

7. **Access the Platform:**
   - **Frontend:** Open `http://127.0.0.1:8000/` in your browser.
   - **Django Admin:** Open `http://127.0.0.1:8000/django-admin/`.

---

## 📬 Contact us

For support or business inquiries, reach out at:
- **Email:** support@bokify.com
- **Website:** [bokify.com](http://127.0.0.1:8000/)

---

&copy; 2025 Bokify. All rights reserved.
