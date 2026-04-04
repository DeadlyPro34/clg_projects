document.addEventListener('DOMContentLoaded', () => {
    loadStudentData();
    initMobileSidebar();
    initSettingsForm();
});

function initSettingsForm() {
    const settingsForm = document.getElementById('settingsForm');
    const avatarInput = document.getElementById('avatarInput');
    const editPicBadge = document.querySelector('.edit-pic-badge');

    if (editPicBadge) {
        editPicBadge.addEventListener('click', () => {
            avatarInput.click();
        });
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(settingsForm);
            if (avatarInput.files.length > 0) {
                formData.append('avatar', avatarInput.files[0]);
            }
            try {
                const response = await fetch('/api/profile/update/', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.status === 'success') {
                    showToast('Profile Updated Successfully!');
                    setTimeout(() => window.location.reload(), 1000); // Reload to show new profile
                } else {
                    showToast(data.message || 'Error updating profile');
                }
            } catch (err) {
                console.error(err);
                showToast('Failed to update profile');
            }
        });
    }
}

function initMobileSidebar() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('visible');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
    });
}

async function loadStudentData() {
    let studentCourses = [];
    let stats = null;

    try {
        const response = await fetch('/api/my-courses/');
        const data = await response.json();
        if (data.status === 'success') {
            studentCourses = data.courses;
            stats = data.stats;
        }
    } catch (e) {
        console.error("Failed to load backend courses:", e);
    }

    const dashboardGrid = document.getElementById('dashboardCourses');
    const fullGrid = document.getElementById('fullCoursesGrid');
    const certList = document.getElementById('certificatesList');
    
    // Update Stats
    if (stats) {
        const statCounter = document.getElementById('statCourseCount');
        const certCounter = document.getElementById('statCertCount');
        const hoursCounter = document.getElementById('statHoursLearned');
        const streakEl = document.querySelector('.streak-count');
        
        let totalProgress = 0;
        studentCourses.forEach(c => totalProgress += (c.progress || 0));
        // Simple formula: 1% progress = ~15 mins of learning
        const hoursVal = Math.round((totalProgress * 15) / 60);

        if (statCounter) statCounter.innerText = stats.course_count;
        if (certCounter) certCounter.innerText = stats.certificates;
        if (hoursCounter) hoursCounter.innerText = `${hoursVal}h`;
        if (streakEl) streakEl.innerText = `🔥 ${stats.streak} Days`;
    }

    let coursesHtml = '';
    let certsHtml = '';

    if (studentCourses.length === 0) {
        coursesHtml = `<div style="grid-column: 1/-1; padding: 40px; background: white; border-radius: 16px; border: 1px solid var(--border-color); text-align: center;">
            <p style="color: #666; margin-bottom: 20px;">You haven't enrolled in any courses yet.</p>
            <a href="/explore/" class="btn-continue" style="display: inline-block; width: auto; padding: 12px 30px;">Explore Catalog</a>
        </div>`;
        certsHtml = `<p style="color:#777; text-align:center; padding: 20px;">No certificates earned yet.</p>`;
    } else {
        studentCourses.forEach(course => {
            const progress = course.progress || 0;
            const courseUrl = `/course/${course.id}/lesson/0/`; // Auto-redirect logic should handle 0
            coursesHtml += `
            <div class="course-card">
                <div class="course-img-wrapper">
                    <img src="${course.img}" class="course-img" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'">
                </div>
                <div class="course-body">
                    <h3 class="course-title">${course.title}</h3>
                    <div class="progress-container">
                        <div class="progress-info"><span>Progress</span><span>${progress}%</span></div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${progress}%;"></div></div>
                    </div>
                    <button class="btn-continue" onclick="window.location.href='${courseUrl}'">Resume Learning</button>
                </div>
            </div>`;

            if (progress === 100) {
                certsHtml += `
                <div style="background: white; padding: 15px 20px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #eee;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <i class="fas fa-award" style="font-size: 24px; color: #00f5c4;"></i>
                        <div>
                            <h4 style="margin: 0; font-size: 15px;">${course.title}</h4>
                            <p style="margin: 3px 0 0; font-size: 11px; color: #888;">Earned on ${new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-receipt" style="padding: 8px 15px; background: #64748b;" onclick="viewCertificate('${course.title.replace(/'/g, "\\'")}')">View</button>
                        <a href="/course/${course.id}/certificate/" class="btn-continue" style="padding: 8px 15px; text-decoration: none; font-size: 12px; width: auto; margin:0;">Download PDF</a>
                    </div>
                </div>`;
            }
        });
    }

    if (dashboardGrid) dashboardGrid.innerHTML = coursesHtml;
    if (fullGrid) fullGrid.innerHTML = coursesHtml;
    if (certList) certList.innerHTML = certsHtml;
}

function viewReceipt(billId, courseName, amount, date, userName, userEmail) {
    console.log('viewReceipt called:', { billId, courseName, amount, date, userName, userEmail });
    showToast('Fetching Receipt Details...');
    openReceipt({
        id: billId,
        course: courseName,
        amount: amount,
        date: date,
        name: userName,
        email: userEmail
    });
}

function openReceipt(order) {
    const overlay = document.getElementById('receiptOverlay');
    const details = document.getElementById('receiptDetails');
    // Use the actual bill_id if provided, otherwise fallback to random
    const invNum = order.id || (Math.floor(Math.random() * 900000) + 100000);

    details.innerHTML = `
        <div class="receipt-row"><span>Invoice No:</span><strong>#${invNum.toString().startsWith('BOK-') ? invNum : 'BK-'+invNum}</strong></div>
        <div class="receipt-row"><span>Order Date:</span><strong>${order.date}</strong></div>
        <div class="receipt-row"><span>Customer:</span><strong>${order.name || 'Student'}</strong></div>
        <div class="receipt-row"><span>Email:</span><strong>${order.email || ''}</strong></div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #f1f5f9;">
        <div class="receipt-row"><span>Item Name:</span><strong>${order.course}</strong></div>
        <div class="receipt-row"><span>Method:</span><strong>UPI / Card</strong></div>
        <div class="receipt-total"><span>Total Paid</span><span>₹ ${parseFloat(order.amount).toLocaleString()}</span></div>
    `;

    overlay.style.display = 'flex';
}

function closeReceipt() {
    document.getElementById('receiptOverlay').style.display = 'none';
}

function viewCertificate(courseName) {
    const overlay = document.getElementById('certOverlay');
    const studentName = "JOHN DOE";
    const issueDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
    const verifyId = "BK-" + (Math.floor(Math.random() * 900000) + 100000);

    document.getElementById('certStudentName').innerText = studentName;
    document.getElementById('certCourseName').innerText = courseName.toUpperCase();
    document.getElementById('certIssueDate').innerText = issueDate;
    document.getElementById('certVerifyId').innerText = `Verify ID: #${verifyId}`;

    overlay.style.display = 'flex';
    showToast('Certificate Prepared!');
}

function closeCert() {
    document.getElementById('certOverlay').style.display = 'none';
}

function switchTab(viewId, navItem) {
    document.querySelectorAll('main section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById('view-' + viewId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('fade-in');
    }
    document.querySelectorAll('.sidebar .nav-item').forEach(item => item.classList.remove('active'));
    if (navItem) navItem.classList.add('active');

    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function logout() {
    if (confirm('Logout from Student Dashboard?')) {
        window.location.href = '../login.html';
    }
}

async function generateLinkCode() {
    const btn = document.querySelector('#linkCodeBox button');
    const display = document.getElementById('currentCodeDisplay');
    const originalText = btn.innerHTML;

    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        btn.disabled = true;

        const response = await fetch('/api/student/generate-link-code/', {
            method: 'POST',
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        });
        const data = await response.json();

        if (data.status === 'success') {
            display.innerText = data.link_code;
            showToast('New Code Generated!');
        } else {
            showToast(data.message || 'Error generating code');
        }
    } catch (err) {
        console.error(err);
        showToast('Server error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Helper for CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        document.getElementById('toastMsg').innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}