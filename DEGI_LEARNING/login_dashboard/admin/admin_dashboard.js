document.addEventListener('DOMContentLoaded', () => {
    loadAdminData();
});

function loadAdminData() {
    // 1. Fetch from LocalStorage
    const courses = JSON.parse(localStorage.getItem('bokify_courses')) || [];
    const orders = JSON.parse(localStorage.getItem('bokify_orders')) || [];

    // 2. Load Courses to Table
    const coursesTables = document.querySelectorAll('table');
    const coursesTbody = coursesTables[1]?.querySelector('tbody'); // Assuming the second table is courses

    if (coursesTbody) {
        coursesTbody.innerHTML = '';
        courses.forEach((c, index) => {
            coursesTbody.innerHTML += `
            <tr>
                <td style="display:flex; align-items:center; gap:10px;">
                    <img src="${c.img}" class="course-thumb" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover; background: #eee;" onerror="this.src='https://via.placeholder.com/50'" />
                    ${c.title}
                </td>
                <td style="text-transform: capitalize;">${c.category}</td>
                <td>₹ ${c.price.toLocaleString()}</td>
                <td>0</td>
                <td>
                    <i class="fas fa-trash action-icon delete-icon" style="color:var(--danger-color); cursor:pointer;" onclick="deleteCourse(${index})"></i>
                </td>
            </tr>`;
        });
    }

    // 3. Load Recent Enrollments (Orders)
    const ordersTbody = coursesTables[0]?.querySelector('tbody'); // Assuming first table is orders
    let totalRevenue = 0;

    if (ordersTbody) {
        ordersTbody.innerHTML = '';
        // Slice and reverse to show newest first
        orders.slice().reverse().forEach(o => {
            totalRevenue += parseInt(o.amount);
            ordersTbody.innerHTML += `
            <tr>
                <td>${o.studentName}</td>
                <td>${o.course}</td>
                <td>${o.date}</td>
                <td>₹ ${o.amount.toLocaleString()}</td>
                <td><span class="status completed">${o.status}</span></td>
            </tr>`;
        });
    }

    // 4. Update Overview Stats
    const statWidgets = document.querySelectorAll('.stat-text h4');
    if (statWidgets.length >= 4) {
        statWidgets[1].innerText = courses.length; // Active Courses
        statWidgets[2].innerText = '₹ ' + (totalRevenue > 0 ? (totalRevenue / 1000).toFixed(1) + 'k' : '0'); // Revenue
        statWidgets[3].innerText = orders.length; // Pending Orders / Total Sales
    }

    // Update Earnings Tab Revenue Stat specifically
    const earningsStats = document.querySelectorAll('#view-earnings .stat-text h4');
    if (earningsStats.length >= 1) {
        earningsStats[0].innerText = '₹ ' + totalRevenue.toLocaleString();
    }

    // 5. Render the Earnings Chart
    renderEarningsChart(orders);
}

// --- Dynamic Earnings Chart Logic ---
function renderEarningsChart(orders) {
    const chartContainer = document.querySelector('.placeholder-chart');
    if (!chartContainer) return;

    // Group orders by date to calculate daily revenue
    const salesByDate = {};
    orders.forEach(o => {
        if (!salesByDate[o.date]) salesByDate[o.date] = 0;
        salesByDate[o.date] += parseInt(o.amount);
    });

    // Sort dates chronologically
    const labels = Object.keys(salesByDate).sort((a, b) => Date.parse(a) - Date.parse(b));
    const data = labels.map(date => salesByDate[date]);

    // Handle empty state (no sales yet)
    if (labels.length === 0) {
        chartContainer.innerHTML = `
            <i class="fas fa-chart-bar" style="font-size: 60px; color: #e1e4e8; margin-bottom: 20px;"></i>
            <h3 style="color: #555;">No Sales Data Yet</h3>
            <p style="color: #888;">When students purchase courses, the earnings chart will appear here.</p>
        `;
        return;
    }

    // Dynamically load Chart.js script if it isn't already loaded
    if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => buildChart(labels, data, chartContainer);
        document.head.appendChild(script);
    } else {
        buildChart(labels, data, chartContainer);
    }
}

let earningChartInstance = null;

function buildChart(labels, data, container) {
    // Replace placeholder with a canvas element
    container.innerHTML = '<canvas id="earningsChart" style="width:100%; height:350px;"></canvas>';
    container.style.padding = '20px'; // Adjust padding to fit chart nicely

    const ctx = document.getElementById('earningsChart').getContext('2d');

    // Destroy previous chart instance if it exists to prevent overlapping
    if (earningChartInstance) {
        earningChartInstance.destroy();
    }

    // Create a smooth line chart
    earningChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Revenue (₹)',
                data: data,
                borderColor: '#007bff', // Primary Bokify Blue
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4, // Adds curve to the line
                pointBackgroundColor: '#007bff',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '₹ ' + value;
                        }
                    }
                }
            }
        }
    });
}

// --- Navigation Logic ---
function switchTab(viewId, navItem) {
    document.querySelectorAll('main section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById('view-' + viewId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('fade-in');
    }
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (navItem) navItem.classList.add('active');
}

// --- Logout ---
function logout() {
    if (confirm('Logout from Admin Dashboard?')) window.location.href = 'login.html';
}

// --- Toast ---
function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// --- Modal Logic ---
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// --- Course Management ---
function addNewCourse() {
    const title = document.getElementById('newCourseTitle').value;
    const cat = document.getElementById('newCourseCat').value;
    const price = document.getElementById('newCoursePrice').value;

    const courses = JSON.parse(localStorage.getItem('bokify_courses')) || [];
    courses.push({
        title: title,
        category: cat.toLowerCase(),
        price: parseInt(price),
        author: 'Admin Added',
        img: 'https://via.placeholder.com/280x180?text=' + encodeURIComponent(title)
    });

    // Save to Database
    localStorage.setItem('bokify_courses', JSON.stringify(courses));

    // Refresh Page Data
    loadAdminData();
    closeModal('addCourseModal');

    // Reset inputs
    document.getElementById('newCourseTitle').value = '';
    document.getElementById('newCoursePrice').value = '';
    showToast('Course Added to Catalog');
}

function deleteCourse(index) {
    if (confirm('Delete this course from the platform permanently?')) {
        const courses = JSON.parse(localStorage.getItem('bokify_courses')) || [];
        courses.splice(index, 1);
        localStorage.setItem('bokify_courses', JSON.stringify(courses));
        loadAdminData();
        showToast('Course Deleted');
    }
}