# 🚀 Bokify: The Future of AI-Powered Kids Learning

<p align="center">
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Gemini--AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

**Bokify** is a premium, AI-driven digital classroom designed to make learning immersive, interactive, and safe for students—especially children. By blending cutting-edge **Google Gemini Flash Lite** capabilities with a robust Django backbone, Bokify empowers kids to explore courses, solve doubts instantly, and track their educational journey with ease.

---

## 🌟 Key Features

### 🤖 AI-Powered Intelligence
*   **AI Doubt Solver:** A dedicated sidebar within the lesson player where students can ask questions. Integrated with **Google Gemini Flash Lite API**, it provides instant, kid-friendly explanations.
*   **Context-Aware Tutor:** The AI understands the current course and lesson context to provide precise assistance.

### 📚 Comprehensive Learning Path
*   **Interactive Lesson Player:** Focused environment with video embedding (YouTube/Vimeo) and lesson-specific notes.
*   **Rich Course Catalog:** Explore a variety of disciplines from "Coding Fundamentals" to "Digital Art" with beautiful imagery and ratings.
*   **Progress Persistence:** Automatically saves completion markers so students can pick up right where they left off.

### 📜 Premium PDF Generation
*   **Instant Lesson Notes:** One-click download of PDF worksheets and summaries for every lesson.
*   **Total Course Guides:** Generate a full, professionally formatted textbook for any enrolled course.
*   **Digital Certificates:** Auto-generated, personalized PDF certificates of completion once a student finishes 100% of a course.

### 👨‍👩‍👧‍👦 User & Parent Portals
*   **Student Dashboard:** Glassmorphism UI showing learning streaks, time logged, and enrolled courses.
*   **Parental Oversight:** A dedicated portal for parents to link their child's account via a secure 8-character connection code, enabling real-time monitoring of study hours and progress.
*   **Advanced Admin Dashboard:** Full-featured analytics for course creation, student management, and revenue tracking with dynamic charts.

---

## 🛠️ Tech Stack

*   **Backend:** [Django 5.x](https://www.djangoproject.com/) (Python)
*   **Frontend:** HTML5, Modern Vanilla CSS3, JavaScript (ES6+)
*   **AI Engine:** [Google Gemini Flash Lite 1.5](https://ai.google.dev/) (via `google-generativeai`)
*   **PDF Engine:** [ReportLab](https://www.reportlab.com/) (for certificates and lesson guides)
*   **Database:** SQLite3 (Local development)
*   **Auth:** Django Multi-User Authentication (Student, Parent, Admin roles)

---

## 📂 Project Structure

```bash
DEGI_LEARNING_FULLSTACK/
├── base/                   # Main Application Logic
│   ├── models.py           # DB Schemas: Courses, Lessons, Streaks, TimeTracking
│   ├── views.py            # AI Solver, PDF Generators, Dashboards
│   ├── templates/          # HTML Templates for UI
│   └── forms.py            # Auth & Transactional Forms
├── learning_platform/      # Global Config (Settings, SSL, URLs)
├── login_dashboard/        # Dedicated Auth & Dashboard Management
├── static/                 # Styles, Scripts, and Hero Images
│   ├── IMAGE/              # Premium Course Thumbnails
│   └── styles.css          # Main Design System
├── media/                  # User Uploads (Avatars, Lesson PDFs)
├── manage.py               # Django Admin CLI
├── seed_legacy_courses.py  # Script to populate rich demo data
└── .env                    # Environment variables (Internal keys)
```

---

## ⚙️ Quick Installation

### 1. Clone & Setup
```bash
git clone https://github.com/yourusername/bokify.git
cd bokify
python -m venv venv
# Activate on Windows: venv\Scripts\activate | Mac: source venv/bin/activate
pip install django pillow reportlab google-generativeai python-dotenv
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
# Google AI Studio Gemini API Key
GOOGLE_API_KEY='your_api_key_here'

# Django Config
SECRET_KEY='your_very_secret_key'
DEBUG=True
```

### 3. Initialize & Seed (The Demo Phase)
```bash
python manage.py makemigrations
python manage.py migrate

# Populate the platform with real courses and lessons
python seed_legacy_courses.py

# Create a default admin (Optional)
python seed.py 
```
*Default Admin Login (from seed.py): `admin@bokify.com` / `admin123`*

### 4. Run Server
```bash
python manage.py runserver
```
Visit: `http://127.0.0.1:8000/`

---

## 📸 Screen Previews

### 🏠 Homepage
Vibrant hero section with a kid-friendly design and interactive course browsing.

### 📊 Student Dashboard
Glassmorphism cards showing progress stats, streaks, and easy access to ongoing courses.

### ⏯️ Lesson Player
Minimalist player with integrated AI tutor sidebar and PDF download triggers.

### 🤖 Admin Analytics
Comprehensive charts showing revenue growth and student enrollment trends.

---

## 🔮 Roadmap
- [ ] **Gamification:** Award XP and levels for every completed lesson.
- [ ] **AI-Generated Quizzes:** Dynamic tests tailored to the specific content students have just watched.
- [ ] **Dark Mode:** Seamless theme switching for late-night learning sessions.

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewMagic`)
3. Commit your Changes (`git commit -m 'Add some NewMagic'`)
4. Push to the Branch (`git push origin feature/NewMagic`)
5. Open a Pull Request

---

## 📄 License
Distributed under the **MIT License**.

<p align="center">Made with ❤️ for a Smarter Generation by <b>Bokify Team</b></p>
