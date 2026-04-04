# 🎓 Bokify - Premium Digital Learning Platform

[![Django](https://img.shields.io/badge/Backend-Django-44b78b?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![JS](https://img.shields.io/badge/Frontend-Vanilla--Javascript-f7df1e?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/Styling-Custom--Vanilla--CSS-264de4?style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003b57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/index.html)

**Bokify** is a high-performance, aesthetically refined e-learning platform built to provide a modern, engaging educational experience. It features a robust Django backend, sophisticated data analytics, and a premium "Mint & Obsidian" design system characterized by glassmorphism, smooth animations, and a seamless user journey.

---

## ✨ Core Features

### 👨‍🎓 Student Dashboard
- **Learning Streaks:** Gamified daily login system to keep students engaged.
- **My Courses:** Centralized view of all purchased content with progress tracking.
- **Lesson Player:** Immersive video and PDF player with auto-saving progress.
- **Time Tracking:** Real-time logging of hours spent on each course.
- **Course Exploration:** Categorized browsing with high-quality visual cards.

### 📊 Admin Analytics & Dashboard
- **Revenue Overview:** Real-time tracking of total sales and daily revenue growth.
- **Growth Charts:** Interactive visual data for enrollments and sales trends.
- **Inventory Management:** Easy creation and management of courses and lessons.
- **Interaction Center:** Direct access to student inquiries and contact messages.

### 👪 Parent Portal
- **Child Linking:** Securely link student accounts to parent accounts.
- **Progress Reports:** Monitor your child's learning journey and time investments.

---

## 🛠️ Technical Architecture

### 🗄️ Database Schema (Models)
The system is built on a clean, relational architecture:
- **Profile:** Extends Django's `User` with roles (`student`, `parent`, `admin`).
- **Course:** Core learning entity with descriptions, ratings, and media.
- **Lesson:** Sequential components of a course supporting Video and PDF.
- **LessonProgress:** Atomic tracking of completion for every student-lesson pair.
- **StudentStreak:** Daily login manager to track and reward consistency.
- **CourseTimeTracker:** High-resolution logging of active learning time.
- **Purchase:** Immutable ledger of all transactions and billing IDs.

### 🌐 API Integration
Bokify uses custom JSON endpoints for dynamic dashboard updates without full page reloads:
- `/api/admin/stats/`: Aggregated business intelligence for the admin panel.
- `/api/student/progress/`: Real-time learning data for student dashboards.

---

## 📂 Project Structure

```bash
DEGI_LEARNING_FULLSTACK_2/
├── base/                   # Central App Logic & Models
│   ├── models.py           # Relational schema & Business rules
│   ├── views.py            # Feature views (explore, dashboard, player)
│   └── urls.py             # Internal routing
├── learning_platform/      # Project Core Config
│   ├── settings.py         # Global Django settings
│   └── urls.py             # Root URL routing
├── static/                 # Styles & Client-side Logic
│   ├── css/                # "Mint & Obsidian" Design System
│   └── js/                 # Dashboard logic & API interactions
├── media/                  # User Asset Storage (Avatars, Course Images)
├── templates/              # Semantic HTML5 Layouts
├── manage.py               # Django CLI
└── seed_legacy_courses.py  # Advanced data initialization script
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **pip** (Python package manager)

### Installation & Local Setup

1. **Clone & Navigate:**
   ```bash
   git clone <repository-url>
   cd DEGI_LEARNING_FULLSTACK_2
   ```

2. **Environment Configuration:**
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Mac/Linux:
   source .venv/bin/activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install django pillow
   ```

4. **Initialize Database:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Seed Initial Data:**
   Populate courses, lessons, and an admin user.
   ```bash
   python seed_legacy_courses.py
   ```
   - **Default Admin Account:**
     - **Email:** `admin@bokify.com`
     - **Password:** `admin123`

6. **Ignition:**
   ```bash
   python manage.py runserver
   ```
   Visit: `http://127.0.0.1:8000/`

---

## 🎨 UI/UX Philosophy
- **Aesthetics First:** A dark-themed obsidian interface with neon mint accents.
- **Glassmorphism:** Frosted glass effect on dashboards and navigation bars.
- **Responsive:** Fluid layout transitions from desktop workstations to mobile devices.
- **Micro-interactions:** Hover effects and page transitions for a premium feel.

---

## 📬 Contact & Support
- **Support Email:** support@bokify.com
- **Website:** [bokify.com](http://127.0.0.1:8000/)

---

&copy; 2026 Bokify. Engineered for Modern Learning.
