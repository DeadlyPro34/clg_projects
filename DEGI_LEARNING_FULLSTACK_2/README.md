# 🎓 Bokify - High-End Digital Learning Platform

[![Django](https://img.shields.io/badge/Backend-Django-44b78b?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![JS](https://img.shields.io/badge/Frontend-Vanilla--Javascript-f7df1e?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/Styling-Custom--Vanilla--CSS-264de4?style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003b57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/index.html)

**Bokify** is a sophisticated, premium-grade Learning Management System (LMS) designed for immersive online education. Built on a robust Django core, it features a unique "Mint & Obsidian" design system, real-time status tracking, and a gamified student experience.

---

## 🏛️ Master Directory Reference (Path-by-Path)

Below is an exhaustive breakdown of every critical path in the project to ensure seamless development and maintenance:

### 1. **Core Application Engine (`/base/`)**
The heart of the project where main functionality resides.
- **📂 `base/migrations/`**: Contains the audit history of the database. Every time a new field is added (like `streak_count`), a version record is created here.
- **📂 `base/templates/`**: The primary UI files. Contains:
    - `student-dashboard.html`: The central hub for the student's learning journey.
    - `explore.html`: The visual course catalog.
    - `lesson_player.html`: The interactive media and document consumption UI.
- **📄 `models.py`**: The definitive source of truth for the database. Defines Relationships (ForeignKeys) between Users, Purchases, and Courses.
- **📄 `views.py`**: The "Brain" of the backend. Contains the Python algorithms for calculating streaks, totaling revenue, and handling real-time stats for the dashboards.

### 2. **Project Central Configuration (`/learning_platform/`)**
The global control room for the entire system.
- **📄 `settings.py`**: Contains the "DNA" of the app. Configures secure secret keys, directory paths for `media/` and `static/`, and activates critical middleware for security and sessions.
- **📄 `urls.py`**: The top-level traffic controller. Redirects web requests to the appropriate application logic (`base`, `admin`, or `login_dashboard`).

### 3. **Specialized Authentication App (`/login_dashboard/`)**
Handles the entry and exit points for all users with a focused, highly polished UI.
- **📂 `login_dashboard/student/`**: Specific design templates for the student login and signup experience.
- **📂 `login_dashboard/admin/`**: High-security login templates for the admin dashboard.
- **📄 `login.html/css/js`**: A self-contained "triple-threat" of assets that powers the glassmorphism authentication experience.

### 4. **Static & Client-Side Assets (`/static/`)**
Where the UI and frontend interactivity "live."
- **📂 `static/css/`**: Contains the **Mint & Obsidian** Design System. Includes variables for glass translucency, neon accent colors, and global responsive layout overrides.
- **📂 `static/js/`**: The reactive layer. Handles:
    - **Dashboard Stats**: Real-time chart rendering via APIs.
    - **Course Time Tracker**: The background timer that persists learning time to the database without reloading the page.
    - **Auto-Save Lesson Progress**: Silently marks lessons as complete as you finish them.

### 5. **Dynamic Media Storage (`/media/`)**
User-generated or dynamic content storage.
- **📂 `media/avatars/`**: Where student profile pictures are securely uploaded and stored.
- **📂 `media/course_images/`**: High-resolution thumbnails used to represent courses in the catalog.
- **📂 `media/lesson_pdfs/`**: Educational documents and worksheets attached to specific lessons.

---

## 🚀 Website Feature Breakdown

### 👨‍🎓 1. The Student Experience (Interactive Learning)
- **🔥 Dynamic Learning Streak:** A gamified consistency meter that tracks how many consecutive days the student logs in. If they miss a day, the counter resets, driving long-term student retention.
- **⏱️ Real-Time Time Tracking:** A silent persistence engine that logs every minute spent in a course. This data is then aggregated into the student dashboard as "Active Learning Hours."
- **⏯️ Immersive Lesson Player:** A purpose-built "Focus-Mode" UI for consuming content. Students can switch between video lectures and PDF resources effortlessly with progress tracking.
- **🛡️ Secure Enrollment & Billing:** Professional e-commerce flow that manages course purchases and generates unique bill identifiers for every transaction.

### 📊 2. The Admin Command Center (Business Intelligence)
- **📈 Revenue Analytics:** Dynamic dashboards showing Gross Sales vs. Daily Enrollment trends. Powered by a specialized `/api/admin/stats/` endpoint for real-time visualization.
- **📦 Course Inventory Management:** Full CRUD (Create, Read, Update, Delete) control over the curriculum. Admins can upload thumbnails and reorder lessons via a Simple UI.
- **📩 Message Hub:** Direct line to students through an integrated inbox for all inquiries sent via the contact system.

### 👪 3. Parent Accountability Portal
- **🔗 Student Linking System:** Parents can monitor their child's education by linking accounts through a unique 8-character "Link Code" provided by the student.
- **🔍 Milestone Visibility:** Parents see exactly what their child sees—streaks, time spent, and course completion percentages.

---

## 🛠️ Technical Implementation Summary
1. **Frontend**: Vanilla HTML5/CSS3/JavaScript (No heavy frameworks for maximum performance).
2. **Backend**: Python 3.10 with the Django 5.x Framework.
3. **Database**: Relational SQLite3 (Easily migratable to PostgreSQL for production).
4. **Icons**: Lucide for the modern, minimalist interface.

---

&copy; 2026 Bokify. Premium Digital Learning Ecosystem.
