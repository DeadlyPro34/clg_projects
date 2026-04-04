# 🚀 Bokify: The Future of AI-Powered Kids Learning

<p align="center">
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Claude--AI-6B46C1?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude AI" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

**Bokify** is a premium, AI-driven digital classroom designed to make learning immersive, interactive, and safe for students—especially children. By blending cutting-edge Claude AI capabilities with a robust Django backbone, Bokify empowers kids to explore courses, solve doubts instantly, and track their educational journey with ease.

---

## 🌟 Features

### 🛠️ Core Learning Essentials
*   **Smart Auth System:** High-security signup/login for students, parents, and admins.
*   **Course Catalog:** Visual browsing with high-quality thumbnails and easy enrollment.
*   **Intuitive Student Dashboard:** Real-time stats, learning streaks, and enrollment history.
*   **Curriculum Management:** Admin portal for creating, updating, and reordering lessons.

### 🤖 AI-Powered Intelligence
*   **AI Doubt Solver:** Integrated Claude API that answers student questions in plain, kid-friendly language.
*   **Contextual Assistance:** AI that understands the lesson content to provide precise help.

### 💎 Unique Student Utilities
*   **Offline PDF Downloads:** Generate lesson worksheets and notes on-the-fly using `reportlab`.
*   **Parental Oversight:** A dedicated dashboard for parents to monitor active learning hours and progress.
*   **Progress Persistence:** Auto-saving lesson markers ensures you never lose your place.

---

## 🛠️ Tech Stack

*   **Backend:** [Django 5.x](https://www.djangoproject.com/) (Python)
*   **Frontend:** HTML5, Modern Vanilla CSS3, JavaScript (ES6+)
*   **Database:** SQLite3 (Development-ready, migratable to PostgreSQL)
*   **AI Engine:** [Claude API](https://www.anthropic.com/api) (Anthropic)
*   **PDF Generation:** [ReportLab](https://www.reportlab.com/)

---

## 📂 Project Structure

```bash
BOKIFY_LEARNING/
├── base/                   # Core App: Models, Views, AI Logic
│   ├── migrations/         # DB Version History
│   ├── templates/          # Student/Explore UI
│   ├── views.py            # AI Solver & Stats Logic
│   └── models.py           # DB Schemas (Course, Lesson, Streak)
├── learning_platform/      # Project Core Config
│   ├── settings.py         # Global App Configurations
│   └── urls.py             # Root Traffic Routing
├── login_dashboard/        # Dedicated Auth Application
│   ├── templates/          # Signup/Login Layouts
├── static/                 # CSS/JS Assets (The AI UI)
├── media/                  # Uploads (Course Images, Certificates)
├── templates/              # Shared Global Layouts
├── manage.py               # Django Admin CLI
└── requirements.txt        # Project Dependencies
```

---

## ⚙️ Installation

### 1. Clone & Navigate
```bash
git clone https://github.com/yourusername/bokify.git
cd bokify
```

### 2. Prepare Virtual Environment
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install django pillow reportlab anthropic
```

### 4. Database Initialization
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Start the Engine
```bash
python manage.py runserver
```
Visit: `http://127.0.0.1:8000/`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory (or set them in your shell):

```env
# AI Integration
CLAUDE_API_KEY=your_anthropic_api_key_here

# Security
SECRET_KEY=your_django_secret_key_here
DEBUG=True
```

---

## ▶️ Usage

1.  **Signup:** Create a new student or parent account via the auth portal.
2.  **Explore:** Browse the creative course library and pick your favorite subject.
3.  **Enroll:** One-click enrollment to add the course to your personal dashboard.
4.  **Learn & Solve:** Study lessons and use the **AI Doubt Solver** sidebar to ask questions if you get stuck!

---

## 📸 Screenshots

### 🏠 Homepage
*(Image Placeholder: Modern, vibrant hero section with course previews)*

### 📊 Student Dashboard
*(Image Placeholder: Glassmorphism cards showing steaks, time logged, and enrolled courses)*

### ⏯️ Lesson Player
*(Image Placeholder: Focused video player with PDF download buttons)*

### 🤖 AI Doubt Solver
*(Image Placeholder: Chat interface showing a kid's question and Claude's simplified answer)*

---

## 🔮 Future Improvements

-   [ ] **AI-Generated Quizzes:** Dynamically created tests based on lesson content.
*   [ ] **Digital Certificates:** Auto-generated PDF certificates on course completion.
*   [ ] **Subscription Payments:** Integrated Stripe/PayPal for premium course access.

---

## 🤝 Contributing

We love contributions!
1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ for a Smarter Generation</p>
