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

function loadAdminData() {
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY_COURSES)) || [];
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS)) || [];

    let totalRevenue = 0;
    orders.forEach(o => totalRevenue += parseInt(o.amount));

    // Generate unique student count based on names
    const uniqueStudents = [...new Set(orders.map(o => o.studentName))].length;

    // 1. Update Top Stats
    document.getElementById('statTotalStudents').innerText = uniqueStudents;
    document.getElementById('statActiveCourses').innerText = courses.length;
    document.getElementById('statTotalRevenue').innerText = '₹ ' + totalRevenue.toLocaleString();
    document.getElementById('statTotalSales').innerText = orders.length;

    // Analytics Stats
    document.getElementById('analyticsRevenue').innerText = '₹ ' + totalRevenue.toLocaleString();
    const avgVal = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
    document.getElementById('analyticsAvgOrder').innerText = '₹ ' + avgVal.toLocaleString();

    // 2. Load Courses Table
    const coursesTbody = document.querySelector('#coursesTable tbody');
    if (coursesTbody) {
        coursesTbody.innerHTML = '';
        courses.forEach((c, index) => {
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
                            <i class="fas fa-trash action-icon delete-icon" style="color:var(--danger-color); cursor:pointer;" onclick="deleteCourse(${index})" title="Delete Course"></i>
                        </td>
                    </tr>`;
        });
    }

    // 3. Load Recent Orders Table
    const ordersTbody = document.querySelector('#recentOrdersTable tbody');
    if (ordersTbody) {
        ordersTbody.innerHTML = '';
        orders.slice(-5).reverse().forEach(o => { // Show last 5
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

    // 4. Load Students Table
    const studentsTbody = document.querySelector('#studentsTable tbody');
    if (studentsTbody) {
        studentsTbody.innerHTML = '';
        orders.slice().reverse().forEach(o => {
            studentsTbody.innerHTML += `
                    <tr>
                        <td><strong>${o.studentName}</strong></td>
                        <td>${o.course}</td>
                        <td>${o.date}</td>
                        <td><span class="status active">Enrolled</span></td>
                    </tr>`;
        });
    }

    // 5. Render Charts
    renderCharts(orders);
}

// --- Chart.js Integration ---
function renderCharts(orders) {
    const salesCtx = document.getElementById('salesChart');
    const detailedCtx = document.getElementById('detailedChart');

    if (!salesCtx || !detailedCtx) return;

    // Process data: Group sales by date
    const salesByDate = {};
    orders.forEach(o => {
        if (!salesByDate[o.date]) salesByDate[o.date] = 0;
        salesByDate[o.date] += parseInt(o.amount);
    });

    // If no data, provide dummy data to show how the graph looks
    let labels = Object.keys(salesByDate).sort((a, b) => new Date(a) - new Date(b));
    let data = labels.map(date => salesByDate[date]);

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
function addNewCourse() {
    const title = document.getElementById('newCourseTitle').value;
    const author = document.getElementById('newCourseAuthor').value;
    const rating = parseFloat(document.getElementById('newCourseRating').value);
    const cat = document.getElementById('newCourseCat').value;
    const level = document.getElementById('newCourseLevel').value;
    const price = parseInt(document.getElementById('newCoursePrice').value);
    const oldPriceVal = document.getElementById('newCourseOldPrice').value;
    const img = document.getElementById('newCourseImg').value;
    const badge = document.getElementById('newCourseBadge').value;
    const badgeClass = document.getElementById('newCourseBadgeClass').value;

    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY_COURSES)) || [];

    const newCourse = {
        title: title,
        author: author,
        rating: rating,
        category: cat,
        level: level,
        price: price,
        img: img
    };

    if (oldPriceVal) newCourse.oldPrice = parseInt(oldPriceVal);
    if (badge && badgeClass) {
        newCourse.badge = badge;
        newCourse.badgeClass = badgeClass;
    }

    courses.push(newCourse);
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));

    loadAdminData();
    closeModal('addCourseModal');

    // Reset form
    document.querySelector('#addCourseModal form').reset();
    showToast('Course Successfully Published!');
}

function deleteCourse(index) {
    if (confirm('Are you sure? This will remove the course from the Explore Page catalog.')) {
        const courses = JSON.parse(localStorage.getItem(STORAGE_KEY_COURSES)) || [];
        courses.splice(index, 1);
        localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
        loadAdminData();
        showToast('Course Deleted');
    }
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