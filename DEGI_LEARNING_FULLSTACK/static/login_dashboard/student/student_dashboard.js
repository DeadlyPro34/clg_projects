document.addEventListener('DOMContentLoaded', () => {
    loadStudentData();
    initMobileSidebar();
});

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

function loadStudentData() {
    const studentCourses = JSON.parse(localStorage.getItem('bokify_student_courses')) || [];
    const dashboardGrid = document.getElementById('dashboardCourses');
    const fullGrid = document.getElementById('fullCoursesGrid');
    const certList = document.getElementById('certificatesList');
    const statCounter = document.getElementById('statCourseCount');
    const certCounter = document.getElementById('statCertCount');

    if (statCounter) statCounter.innerText = studentCourses.length;
    if (certCounter) certCounter.innerText = studentCourses.length;

    let coursesHtml = '';
    let certsHtml = '';

    if (studentCourses.length === 0) {
        coursesHtml = `<div style="grid-column: 1/-1; padding: 40px; background: white; border-radius: 16px; border: 1px solid var(--border-color); text-align: center;">
            <p style="color: #666; margin-bottom: 20px;">You haven't enrolled in any courses yet.</p>
            <a href="explore_page.html" class="btn-continue" style="display: inline-block; width: auto; padding: 12px 30px;">Explore Catalog</a>
        </div>`;
        certsHtml = `<p style="color:#777; text-align:center; padding: 20px;">No certificates earned yet.</p>`;
    } else {
        studentCourses.forEach(course => {
            const progress = course.progress || 0;
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
                    <button class="btn-continue" onclick="showToast('Loading course...')">Resume Learning</button>
                </div>
            </div>`;

            certsHtml += `
            <div style="background: white; padding: 15px 20px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #eee;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <i class="fas fa-award" style="font-size: 24px; color: #f59e0b;"></i>
                    <div>
                        <h4 style="margin: 0; font-size: 15px;">${course.title}</h4>
                        <p style="margin: 3px 0 0; font-size: 11px; color: #888;">Completed on ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                    </div>
                </div>
                <button class="btn-receipt" style="padding: 8px 15px;" onclick="viewCertificate('${course.title.replace(/'/g, "\\'")}')">View Certificate</button>
            </div>`;
        });
    }

    // Only populate if empty (fallback to localStorage if server didn't provide data)
    if (dashboardGrid && dashboardGrid.children.length === 0) dashboardGrid.innerHTML = coursesHtml;
    if (fullGrid && fullGrid.children.length === 0) fullGrid.innerHTML = coursesHtml;
    if (certList && certList.children.length === 0) certList.innerHTML = certsHtml;

    const orders = JSON.parse(localStorage.getItem('bokify_orders')) || [];
    const billingTbody = document.getElementById('billingItems');

    if (billingTbody && billingTbody.children.length <= 1) {
        const isPlaceholder = billingTbody.innerText.includes('No purchase history found') || billingTbody.children.length === 0;
        if (isPlaceholder && orders.length > 0) {
            billingTbody.innerHTML = '';
            orders.slice().reverse().forEach((order) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${order.course}</strong></td>
                    <td class="hide-mobile">${order.date}</td>
                    <td style="font-weight:bold;">₹ ${parseInt(order.amount).toLocaleString()}</td>
                    <td><span class="status-pill status-paid">${order.status}</span></td>
                    <td><button class="btn-receipt">Receipt</button></td>
                `;
                tr.querySelector('.btn-receipt').addEventListener('click', () => openReceipt(order));
                billingTbody.appendChild(tr);
            });
        }
    }
}

function openReceipt(order) {
    const overlay = document.getElementById('receiptOverlay');
    const details = document.getElementById('receiptDetails');
    const invNum = Math.floor(Math.random() * 900000) + 100000;

    details.innerHTML = `
        <div class="receipt-row"><span>Invoice No:</span><strong>#BK-${invNum}</strong></div>
        <div class="receipt-row"><span>Order Date:</span><strong>${order.date}</strong></div>
        <div class="receipt-row"><span>Customer:</span><strong>John Doe</strong></div>
        <div class="receipt-row"><span>Email:</span><strong>john@example.com</strong></div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #f1f5f9;">
        <div class="receipt-row"><span>Item Name:</span><strong>${order.course}</strong></div>
        <div class="receipt-row"><span>Method:</span><strong>UPI / Card</strong></div>
        <div class="receipt-total"><span>Total Paid</span><span>₹ ${parseInt(order.amount).toLocaleString()}</span></div>
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

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}