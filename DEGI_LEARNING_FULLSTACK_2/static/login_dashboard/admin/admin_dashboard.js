// --- CSRF TOKEN ---
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

// Global variables for charts
let salesChartInstance = null;
let detailedChartInstance = null;

// Use the same storage key as Explore Page
const STORAGE_KEY_COURSES = 'bokify_courses_v3';
const STORAGE_KEY_ORDERS = 'bokify_orders';

document.addEventListener('DOMContentLoaded', () => {
    loadAdminData();
});

// --- Sidebar Toggle Logic ---
function toggleSidebar() {
    if (window.innerWidth <= 768) {
        document.body.classList.toggle('sidebar-mobile-open');
    } else {
        document.body.classList.toggle('sidebar-collapsed');
    }

    // Resize charts if they exist so they fit the new layout width
    setTimeout(() => {
        if (salesChartInstance) salesChartInstance.resize();
        if (detailedChartInstance) detailedChartInstance.resize();
    }, 300);
}

async function loadAdminData() {
    let courses = [];
    try {
        const resp = await fetch('/api/courses/');
        const data = await resp.json();
        if (data.status === 'success') { courses = data.courses; }
    } catch (e) { console.error(e); }

    // FETCH REAL STATS FROM DB 🚀
    let stats = { total_revenue:0, sales_count:0, students_count:0, courses_count:0, avg_order:0 };
    let orders = [];
    let chartData = { labels: [], data: [] };

    try {
        const resp = await fetch('/api/admin/stats/');
        const data = await resp.json();
        if (data.status === 'success') {
            stats = data.stats;
            orders = data.orders;
            chartData = data.chart_data;
        }
    } catch (e) { console.error(e); }

    // 1. Update Top Stats
    document.getElementById('statTotalStudents').innerText = stats.students_count;
    document.getElementById('statActiveCourses').innerText = stats.courses_count;
    document.getElementById('statTotalRevenue').innerText = '₹ ' + stats.total_revenue.toLocaleString();
    document.getElementById('statTotalSales').innerText = stats.sales_count;

    // Analytics Stats
    document.getElementById('analyticsRevenue').innerText = '₹ ' + stats.total_revenue.toLocaleString();
    document.getElementById('analyticsAvgOrder').innerText = '₹ ' + stats.avg_order.toLocaleString();

    // 2. Load Courses Table
    const coursesTbody = document.querySelector('#coursesTable tbody');
    if (coursesTbody) {
        coursesTbody.innerHTML = '';
        courses.forEach((c) => {
            coursesTbody.innerHTML += `
                    <tr>
                        <td style="display:flex; align-items:center; gap:10px;">
                            <img src="${c.img}" class="course-thumb" onerror="this.src='https://via.placeholder.com/50'" />
                            <div>
                                <strong>${c.title}</strong>
                                <div style="font-size:12px; color:#888;">by ${c.author}</div>
                            </div>
                        </td>
                        <td style="text-transform: capitalize;">${c.category}</td>
                        <td style="text-transform: capitalize;">${c.level || 'Beginner'}</td>
                        <td>₹ ${c.price.toLocaleString()}</td>
                        <td>
                            <i class="fas fa-edit action-icon" style="color:var(--primary-color); cursor:pointer; margin-right: 15px;" onclick="openEditCourse(${c.id}, '${c.title.replace(/'/g, "\\'")}', ${c.price}, '${c.description ? c.description.replace(/'/g, "\\'") : ''}')" title="Edit Course"></i>
                            <i class="fas fa-trash action-icon delete-icon" style="color:var(--danger-color); cursor:pointer;" onclick="deleteCourse(${c.id})" title="Delete Course"></i>
                        </td>
                    </tr>`;
        });
    }

    // 3. Load Recent Orders Table
    const ordersTbody = document.querySelector('#recentOrdersTable tbody');
    if (ordersTbody) {
        ordersTbody.innerHTML = '';
        if (orders.length === 0) {
            ordersTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No enrollment history yet.</td></tr>';
        }
        orders.forEach(o => {
            ordersTbody.innerHTML += `
                    <tr>
                        <td><strong>${o.studentName}</strong></td>
                        <td>${o.course}</td>
                        <td>${o.date}</td>
                        <td style="color:var(--primary-color); font-weight:bold;">₹ ${o.amount.toLocaleString()}</td>
                        <td><span class="status completed">${o.status}</span></td>
                    </tr>`;
        });
    }

    // 4. Update Students Table (Full Directory)
    const studentsTbody = document.querySelector('#studentsTable tbody');
    if (studentsTbody) {
        studentsTbody.innerHTML = '';
        if (stats.students_count === 0) {
            studentsTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No students yet.</td></tr>';
        }
        (data.students || []).forEach(s => {
            studentsTbody.innerHTML += `
                    <tr>
                        <td><strong>${s.name}</strong><br><small style="color:#aaa;">${s.email}</small></td>
                        <td>${s.courses} Courses</td>
                        <td>${s.joined}</td>
                        <td><span class="status-badge ${s.status === 'Active' ? 'status-paid' : ''}" style="background-color: ${s.status === 'Active' ? '#dcfce7' : '#f3f4f6'};">${s.status}</span></td>
                    </tr>`;
        });
    }

    // 5. Update Charts with REAL Data
    renderCharts(chartData.labels, chartData.data);
}

// --- Chart.js Integration ---
function renderCharts(labels, data) {
    const salesCtx = document.getElementById('salesChart');
    const detailedCtx = document.getElementById('detailedChart');

    if (!salesCtx || !detailedCtx) return;

    // Use default labels if DB is empty
    if (labels.length === 0) {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [0, 0, 0, 0, 0, 0, 0];
    }

    if (labels.length === 0) {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [0, 0, 0, 0, 0, 0, 0];
    }

    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Revenue (₹)',
                data: data,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#007bff',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { borderDash: [5, 5] }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    };

    if (salesChartInstance) salesChartInstance.destroy();
    salesChartInstance = new Chart(salesCtx.getContext('2d'), chartConfig);

    if (detailedChartInstance) detailedChartInstance.destroy();
    // detailed chart could be a bar chart for variety
    chartConfig.type = 'bar';
    chartConfig.data.datasets[0].backgroundColor = '#007bff';
    detailedChartInstance = new Chart(detailedCtx.getContext('2d'), chartConfig);
}

// Function to generate fake sales data for testing the graph
function generateMockData() {
    let orders = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS)) || [];
    const today = new Date();

    for (let i = 0; i < 5; i++) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - Math.floor(Math.random() * 7)); // random day in last week

        orders.push({
            studentName: "Test User " + Math.floor(Math.random() * 100),
            course: "Mock Course",
            date: pastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: Math.floor(Math.random() * 800) + 200, // random price between 200-1000
            status: 'Paid'
        });
    }

    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    loadAdminData();
    showToast('Generated 5 mock sales!');
}

// --- Course Management ---
async function addNewCourse() {
    const title = document.getElementById('newCourseTitle').value;
    const price = document.getElementById('newCoursePrice').value;
    const description = document.getElementById('newCourseDescription').value;
    const imgInput = document.getElementById('newCourseImg');

    const formData = new FormData();
    formData.append('name', title);
    formData.append('price', price);
    formData.append('description', description);
    if (imgInput.files.length > 0) {
        formData.append('image', imgInput.files[0]);
    }

    try {
        const resp = await fetch('/api/course/add/', {
            method: 'POST',
            headers: { 'X-CSRFToken': getCookie('csrftoken') },
            body: formData
        });
        const data = await resp.json();
        if (data.status === 'success') {
            showToast('Course Successfully Published!');
            loadAdminData();
            closeModal('addCourseModal');
            document.querySelector('#addCourseModal form').reset();
        } else { alert("Error: " + data.message); }
    } catch (e) { console.error(e); }
}

async function deleteCourse(id) {
    if (confirm('Are you sure? This will permanently delete the course from the Database.')) {
        try {
            const resp = await fetch('/api/course/delete/', {
                method: 'POST',
                headers: { 
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id})
            });
            const data = await resp.json();
            if (data.status === 'success') {
                showToast('Course Deleted');
                loadAdminData();
            } else { alert("Error: " + data.message); }
        } catch(e) { console.error(e); }
    }
}

function openEditCourse(id, title, price, desc) {
    document.getElementById('editCourseId').value = id;
    document.getElementById('editCourseTitle').value = title;
    document.getElementById('editCoursePrice').value = price;
    document.getElementById('editCourseDescription').value = desc;
    document.getElementById('editCourseImg').value = '';
    openModal('editCourseModal');
}

async function submitEditCourse() {
    const id = document.getElementById('editCourseId').value;
    const title = document.getElementById('editCourseTitle').value;
    const price = document.getElementById('editCoursePrice').value;
    const description = document.getElementById('editCourseDescription').value;
    const imgInput = document.getElementById('editCourseImg');

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', title);
    formData.append('price', price);
    formData.append('description', description);
    if (imgInput.files.length > 0) {
        formData.append('image', imgInput.files[0]);
    }

    try {
        const resp = await fetch('/api/course/edit/', {
            method: 'POST',
            headers: { 'X-CSRFToken': getCookie('csrftoken') },
            body: formData
        });
        const data = await resp.json();
        if (data.status === 'success') {
            showToast('Course Updated!');
            loadAdminData();
            closeModal('editCourseModal');
        } else { alert("Error: " + data.message); }
    } catch(e) { console.error(e); }
}

// --- Navigation & UI Logic ---
function switchTab(viewId, navItem) {
    document.querySelectorAll('main section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById('view-' + viewId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('fade-in');
    }
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (navItem) navItem.classList.add('active');

    // Auto close sidebar on mobile when navigating
    if (window.innerWidth <= 768) {
        document.body.classList.remove('sidebar-mobile-open');
    }
}

function logout() {
    if (confirm('Are you sure you want to log out of the Admin Dashboard?')) {
        // Redirect back to the login page as requested
        window.location.href = '../login.html';
    }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }