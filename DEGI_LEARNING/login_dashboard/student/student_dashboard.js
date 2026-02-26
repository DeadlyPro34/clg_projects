document.addEventListener('DOMContentLoaded', () => {
    loadStudentCourses();
});

function loadStudentCourses() {
    const studentCourses = JSON.parse(localStorage.getItem('bokify_student_courses')) || [];

    // Target both grids (Overview and "My Courses" tab)
    const dashGrid = document.querySelector('#view-dashboard .courses-grid');
    const myCoursesGrid = document.querySelector('#view-courses .courses-grid');

    let html = '';

    if (studentCourses.length === 0) {
        html = `
        <div style="grid-column: 1/-1; padding: 20px; background: white; border-radius: 8px; border: 1px solid var(--border-color);">
            You have not enrolled in any courses yet. <a href="explore_page.html" style="color:var(--primary-color); font-weight:bold;">Explore courses here.</a>
        </div>`;
    } else {
        studentCourses.forEach(c => {
            html += `
            <div class="course-card">
                <img src="${c.img}" class="course-img" onerror="this.src='https://via.placeholder.com/300x160?text=Course'">
                <div class="course-body">
                    <div class="course-title">${c.title}</div>
                    <div class="progress-container">
                        <div class="progress-info"><span>Progress</span><span>${c.progress}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${c.progress}%;"></div></div>
                    </div>
                    <a href="#" onclick="showToast('Resuming Course...')" class="btn-continue">Resume Learning</a>
                </div>
            </div>`;
        });
    }

    if (dashGrid) dashGrid.innerHTML = html;
    if (myCoursesGrid) myCoursesGrid.innerHTML = html;

    // Update Enrolled Courses Stat
    const statCards = document.querySelectorAll('.stat-info h3');
    if (statCards.length > 0) {
        statCards[0].innerText = studentCourses.length;
    }
}

// --- Navigation Logic ---
function switchTab(viewId, navItem) {
    document.querySelectorAll('main section').forEach(section => {
        section.classList.add('hidden');
    });

    const target = document.getElementById('view-' + viewId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('fade-in');
    }

    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (navItem) navItem.classList.add('active');

    document.querySelector('.main-content').scrollTop = 0;
}

// --- Logout Logic ---
function logout() {
    if (confirm('Logout from Student Dashboard?')) {
        window.location.href = '../login.html';
    }
}

// --- Toast Notification ---
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMsg');

    msg.innerText = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}