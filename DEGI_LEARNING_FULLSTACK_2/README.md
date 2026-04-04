# 🎓 Bokify - High-End Digital Learning Platform

[![Django](https://img.shields.io/badge/Backend-Django-44b78b?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![JS](https://img.shields.io/badge/Frontend-Vanilla--Javascript-f7df1e?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/Styling-Custom--Vanilla--CSS-264de4?style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003b57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/index.html)

**Bokify** is a sophisticated, premium-grade Learning Management System (LMS) designed for immersive online education. Built on a robust Django core, it features a unique "Mint & Obsidian" design system, real-time status tracking, and a gamified student experience.

---

## 🏛️ Comprehensive Folder Structure Detail

The project is organized into modular components to ensure scalability and clarity:

| Directory / File | Description |
| :--- | :--- |
| **`base/`** | **The Core Engine**. Contains the main business logic. |
| &nbsp;&nbsp;&nbsp;&nbsp;📄 `models.py` | Definitive database architecture (Users, Profiles, Courses, Lessons, Streaks, Time Logs). |
| &nbsp;&nbsp;&nbsp;&nbsp;📄 `views.py` | Python logic for course exploration, student dashboards, and the admin interface. |
| &nbsp;&nbsp;&nbsp;&nbsp;📄 `urls.py` | Private routing for student-facing features and API endpoints. |
| &nbsp;&nbsp;&nbsp;&nbsp;📄 `forms.py` | Custom handling for profile updates and contact messages. |
| **`learning_platform/`** | **Mission Control**. Global project settings and configuration. |
| &nbsp;&nbsp;&nbsp;&nbsp;📄 `settings.py` | Security keys, Database connection, Middleware, and Installed apps declaration. |
| &nbsp;&nbsp;&nbsp;&nbsp;📄 `urls.py` | The main URL gateway that connects all apps (`base`, `login_dashboard`, `django-admin`). |
| **`login_dashboard/`** | **Auth Architecture**. Dedicated app for a specialized, highly designed login/signup experience. |
| &nbsp;&nbsp;&nbsp;&nbsp;📂 `student/` & `admin/` | Specific layout and logic assets for student/admin entry points. |
| &nbsp;&nbsp;&nbsp;&nbsp;📄 `login.html/css/js` | Triple-stack frontend assets for the stunning glassmorphism authentication UI. |
| **`static/`** | **Visual Assets**. Global CSS/JS and UI components. |
| &nbsp;&nbsp;&nbsp;&nbsp;📂 `css/` | The "Mint & Obsidian" design system, global variables, and responsive layout rules. |
| &nbsp;&nbsp;&nbsp;&nbsp;📂 `js/` | Client-side reactive logic for dashboards, stats charts, and active time-tracking. |
| **`templates/`** | **Structural Layouts**. Global HTML templates (`base.html`, `footer.html`, etc.). |
| **`media/`** | **Dynamic Content**. Stores user-uploaded avatars and course thumbnail images. |
| 📄 `manage.py` | Python command-line utility for database migrations and running the server. |
| 📄 `db.sqlite3` | The primary relational database (SQLite) containing all user and course data. |

---

## 🚀 Website Feature Breakdown

### 👨‍🎓 1. The Student Experience (Interactive Learning)
- **🔥 Dynamic Learning Streak:** A gamified "consistency meter" that tracks how many days in a row the student logs in. If they miss a day, the streak resets, encouraging daily engagement.
- **⏱️ Real-Time Time Tracking:** An automatic background process that logs active learning minutes for every student-course pair, visible in their dashboard as hourly summaries.
- **⏯️ Immersive Lesson Player:** A purpose-built interface for consuming course content. Switch between video lessons or interactive PDF worksheets seamlessly with status persistence (auto-saves progress).
- **🛡️ Secure Enrollment & Billing:** Robust purchase flow for acquiring new courses with custom bill generation and purchase history tracking.

### 📊 2. The Admin Command Center (Business Intelligence)
- **📈 Revenue Analytics:** Interactive charts showing total sales, gross revenue, and daily performance metrics powered by real-time API integrations.
- **👥 Student CRM:** Complete directory of registered students with the ability to view enrollment history, progress logs, and contact details.
- **📦 Course Inventory Management:** Full control over the curriculum—adding new courses, uploading thumbnails, and managing lesson sequences (orders).
- **📩 Message Hub:** Integrated dashboard for viewing and responding to student inquiries sent via the global contact system.

### 👪 3. Parent Accountability Portal
- **🔗 Student Linking System:** A secure mechanism for parents to link their accounts to their children's profiles using a unique "Link Code".
- **🔍 Visibility Dashboards:** Parents can view their child's streak progress, time spent on courses, and recently completed curriculum milestones.

### 🎨 4. Premium Design System
- **💎 Glassmorphism:** Elegant semi-transparent UI elements with blur effects, creating a futuristic, sleek feel throughout the platform.
- **📱 Responsive by Default:** Fully optimized for all screen sizes—from large desktop displays to mobile devices.
- **⚡ Micro-Animations:** Subtle CSS transitions and JavaScript interactions that make the UI feel alive and reactive to user input.

---

## 🛠️ Technical Details for Developers

### Database Models
| Model | Key Fields |
| :--- | :--- |
| **Profile** | `user`, `user_type` (Student/Parent/Admin), `avatar`, `link_code`. |
| **Course** | `name`, `description`, `price`, `image`. |
| **Lesson** | `course`, `title`, `video_url`, `pdf_file`, `order`. |
| **Purchase** | `student`, `course`, `bill_id`, `purchase_date`. |
| **StudentStreak** | `student`, `streak_count`, `last_login_date`. |

### Installation Summary
1. `pip install django pillow`
2. `python manage.py migrate`
3. `python seed_legacy_courses.py` (Creates admin: `admin@bokify.com` / `admin123`)
4. `python manage.py runserver`

---

&copy; 2026 Bokify. Premium Digital Learning Ecosystem.
