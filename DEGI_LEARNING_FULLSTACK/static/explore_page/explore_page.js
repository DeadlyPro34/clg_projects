// GLOBAL CART STATE (Wrapped in try-catch to prevent iframe security crashes)
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('bokify_cart')) || [];
} catch (e) { console.warn('LocalStorage unavailable'); }

// --- 1. LOCAL STORAGE SEEDING FOR CATALOG ---
const defaultCourses = [
    { title: "Coding Fundamentals", author: "Sarah Jenkins", price: 499, oldPrice: 999, category: "coding", level: "beginner", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80", rating: 4.8, badge: "Bestseller", badgeClass: "bestseller" },
    { title: "Advanced Mathematics", author: "Dr. A. Kumar", price: 599, oldPrice: 1299, category: "mathematics", level: "advanced", img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80", rating: 5.0, badge: "New", badgeClass: "new" },
    { title: "Junior Robotics Lab", author: "TechKids Academy", price: 799, category: "science", level: "intermediate", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80", rating: 4.2 },
    { title: "Digital Art Masterclass", author: "Lisa Ray", price: 399, category: "arts", level: "beginner", img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80", rating: 4.9 },
    { title: "Web Development Basics", author: "Code Masters", price: 899, category: "coding", level: "intermediate", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80", rating: 4.8 },
    { title: "Creative English", author: "Oxford Tutors", price: 299, category: "languages", level: "beginner", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80", rating: 4.3 }
];

// Ensure database is ONLY seeded if it's completely empty.
// This prevents overwriting any courses that were added from the Admin Dashboard!
try {
    if (!localStorage.getItem('bokify_courses_v3')) {
        localStorage.setItem('bokify_courses_v3', JSON.stringify(defaultCourses));
    }
} catch (e) { }

// DOM ELEMENTS
const views = {
    courses: document.getElementById('courses-view'),
    detail: document.getElementById('detail-view'), // ADDED DETAIL VIEW
    checkout: document.getElementById('checkout-view'),
    payment: document.getElementById('payment-view'),
    success: document.getElementById('success-view')
};
const cartBadge = document.getElementById('cartBadge');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    renderCoursesToGrid();
    initCart();
    updateCartUI();
    initScrollAnimations();

    document.getElementById('checkoutForm').addEventListener('submit', (e) => e.preventDefault());
    document.getElementById('paymentForm').addEventListener('submit', (e) => e.preventDefault());
});

// --- RENDER DYNAMIC COURSES ---
function renderCoursesToGrid() {
    let courses = defaultCourses;
    // Fetch the currently saved courses (which includes Admin additions)
    try {
        const savedCourses = localStorage.getItem('bokify_courses_v3');
        if (savedCourses) {
            courses = JSON.parse(savedCourses);
        }
    } catch (e) { }

    const grid = document.getElementById('coursesGrid');
    grid.innerHTML = '';

    courses.forEach((course, index) => {
        // Ensure price is treated as a number
        const parsedPrice = parseInt(course.price) || 0;
        let badgeHtml = course.badge ? `<span class="badge ${course.badgeClass}">${course.badge}</span>` : '';
        let oldPriceHtml = course.oldPrice ? `<small>₹ ${course.oldPrice}</small>` : '';

        // Making the image and text area clickable to open details
        grid.innerHTML += `
                <div class="book-card reveal" style="transition-delay: ${index * 0.1}s" data-category="${course.category}" data-level="${course.level || 'beginner'}" data-price="${parsedPrice}">
                    ${badgeHtml}
                    <div class="card-clickable" onclick="openCourseDetail(${index})" style="cursor: pointer; flex-grow: 1;">
                        <div class="cover-image" style="background-image: url('${course.img}'); background-size: cover; background-position: center; height: 180px; border-radius: 8px; margin-bottom: 15px;"></div>
                        <h3>${course.title}</h3>
                        <p class="author">by ${course.author || 'Expert Educator'}</p>
                        <div class="rating"><i class="fas fa-star"></i> ${course.rating || '4.5'}</div>
                    </div>
                    <div class="card-footer">
                        <div class="price">₹ ${parsedPrice.toLocaleString()} ${oldPriceHtml}</div>
                        <button type="button" class="add-btn" onclick="addToCart(${index}); showToast('Item added to cart!');">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
                `;
    });

    initFilters();
    initScrollAnimations();
}

// --- NEW: COURSE DETAIL LOGIC ---
window.openCourseDetail = (index) => {
    let courses = defaultCourses;
    try {
        const savedCourses = localStorage.getItem('bokify_courses_v3');
        if (savedCourses) {
            courses = JSON.parse(savedCourses);
        }
    } catch (e) { }
    const course = courses[index];
    const parsedPrice = parseInt(course.price) || 0;

    const detailContainer = document.getElementById('detailContent');
    detailContainer.innerHTML = `
                <div class="course-detail-container">
                    <div class="course-detail-img-container">
                        <img src="${course.img}" class="course-detail-img" alt="${course.title}" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'">
                    </div>
                    <div class="course-detail-info">
                        ${course.badge ? `<span class="badge ${course.badgeClass}" style="position:static; display:inline-block; margin-bottom:15px;">${course.badge}</span>` : ''}
                        <h1 class="course-detail-title">${course.title}</h1>
                        
                        <div class="course-detail-meta">
                            <span><i class="fas fa-user text-primary"></i> ${course.author || 'Expert Educator'}</span>
                            <span><i class="fas fa-star" style="color:#FFD700;"></i> ${course.rating || '4.5'} Rating</span>
                            <span style="text-transform: capitalize;"><i class="fas fa-layer-group"></i> ${course.level || 'Beginner'}</span>
                        </div>

                        <div class="course-detail-price">
                            ₹ ${parsedPrice.toLocaleString()} 
                            ${course.oldPrice ? `<small style="font-size:18px; color:#999; text-decoration:line-through; font-weight:normal;">₹ ${course.oldPrice}</small>` : ''}
                        </div>

                        <p class="course-detail-desc">
                            Unlock your potential with this comprehensive program designed specifically for ${course.level || 'beginner'} learners. 
                            Master the core concepts of ${course.category} through step-by-step video tutorials, hands-on projects, and interactive assessments. 
                            By the end of this course, you'll have the confidence and portfolio to showcase your new skills to the world!
                        </p>

                        <ul class="course-features">
                            <li><i class="fas fa-check-circle"></i> 10+ Hours of On-Demand High Quality Video</li>
                            <li><i class="fas fa-check-circle"></i> Interactive Assignments & Real-World Projects</li>
                            <li><i class="fas fa-check-circle"></i> Direct Messaging with the Instructor</li>
                            <li><i class="fas fa-check-circle"></i> Official Certificate of Completion</li>
                            <li><i class="fas fa-check-circle"></i> Lifetime Access across all devices</li>
                        </ul>

                        <div class="detail-actions">
                            <button type="button" class="btn-primary-large" onclick="addToCart(${index}); showCheckout();">
                                Enroll Now
                            </button>
                            <button type="button" class="btn-secondary-large" onclick="addToCart(${index}); showToast('Item added to cart!');">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;

    switchView('detail');
};

window.addToCart = (index) => {
    let courses = defaultCourses;
    try {
        const savedCourses = localStorage.getItem('bokify_courses_v3');
        if (savedCourses) {
            courses = JSON.parse(savedCourses);
        }
    } catch (e) { }
    const course = courses[index];
    const parsedPrice = parseInt(course.price) || 0;
    const item = {
        title: course.title,
        price: parsedPrice,
        img: course.img
    };
    cart.push(item);
    saveCart();
    updateCartUI();
};

// --- ANIMATION LOGIC ---
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('active');
        observer.observe(el);
    });

    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('active');
            }
        });
    }, 100);
}

// --- NAVIGATION FUNCTIONS ---
function switchView(viewName) {
    Object.values(views).forEach(el => el.style.display = 'none');
    views[viewName].style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initScrollAnimations();
}

window.showCourses = () => switchView('courses');
window.showCheckout = () => {
    if (cart.length === 0) { alert("Your cart is empty!"); return; }
    populateCheckoutSummary();
    document.getElementById('cartOverlay').style.display = 'none';
    switchView('checkout');
};
window.showPayment = () => {
    const total = calculateTotal();
    document.getElementById('payAmount').innerText = '₹ ' + total.toLocaleString();
    switchView('payment');
};

// --- PAYMENT & SYNC LOGIC ---
window.processPayment = () => {
    const btn = document.getElementById('payButton');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    const firstName = document.getElementById('billFirstName').value || 'Student';
    const lastName = document.getElementById('billLastName').value || '';
    const billId = 'BILL-' + Math.floor(Math.random() * 1000000);

    // Purchase each item in cart
    const purchasePromises = cart.map(item => {
        return fetch('/api/purchase/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_name: item.title,
                price: item.price,
                bill_id: billId
            })
        });
    });

    Promise.all(purchasePromises)
        .then(async (responses) => {
            // Check if all responses are OK
            for (let r of responses) {
                if (!r.ok) {
                    if (r.status === 401) {
                        alert('Please login to purchase courses.');
                        window.location.href = '/login/';
                        return;
                    }
                    const errorData = await r.json();
                    throw new Error(errorData.message || 'Purchase failed');
                }
            }

            // Success
            let studentCourses = [];
            try {
                studentCourses = JSON.parse(localStorage.getItem('bokify_student_courses')) || [];
            } catch (e) { }

            cart.forEach(item => {
                if (!studentCourses.some(c => c.title === item.title)) {
                    studentCourses.push({
                        title: item.title,
                        img: item.img,
                        progress: 0
                    });
                }
            });

            try {
                localStorage.setItem('bokify_student_courses', JSON.stringify(studentCourses));
                localStorage.removeItem('bokify_cart');
            } catch (e) { }

            cart = [];
            updateCartUI();
            switchView('success');

            document.getElementById('displayCardNumber').innerText = "#### #### #### ####";
            document.getElementById('displayCardName').innerText = "YOUR NAME";
            document.getElementById('displayCardExpiry').innerText = "MM/YY";
            document.getElementById('paymentForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during payment processing');
        })
        .finally(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
};

// --- CHECKOUT UI ---
function calculateTotal() { return cart.reduce((sum, item) => sum + item.price, 0); }

function populateCheckoutSummary() {
    const list = document.getElementById('checkoutItemsList');
    const totalEl = document.getElementById('checkoutTotal');
    list.innerHTML = '';
    cart.forEach(item => {
        const html = `<div class="summary-row"><span>${item.title}</span><span>₹ ${item.price.toLocaleString()}</span></div>`;
        list.insertAdjacentHTML('beforeend', html);
    });
    totalEl.innerText = '₹ ' + calculateTotal().toLocaleString();
}

// --- REAL-TIME CARD UI ---
window.updateCardNumber = (val) => {
    let raw = val.replace(/\D/g, '');
    let formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    document.getElementById('cardNumber').value = formatted.substring(0, 19);
    document.getElementById('displayCardNumber').innerText = formatted || "#### #### #### ####";
}
window.updateCardName = (val) => { document.getElementById('displayCardName').innerText = val.toUpperCase() || "YOUR NAME"; }
window.updateCardExpiry = (val) => {
    let raw = val.replace(/\D/g, '');
    if (raw.length > 2) raw = raw.substring(0, 2) + '/' + raw.substring(2, 4);
    document.getElementById('cardExpiry').value = raw;
    document.getElementById('displayCardExpiry').innerText = raw || "MM/YY";
}

// --- CART LOGIC ---
function initCart() {
    const cartIcon = document.getElementById('cartIcon');
    const modalCheckoutBtn = document.getElementById('modalCheckoutBtn');

    cartIcon.addEventListener('click', () => {
        renderCartModal();
        document.getElementById('cartOverlay').style.display = 'flex';
    });

    document.getElementById('closeCart').addEventListener('click', () => {
        document.getElementById('cartOverlay').style.display = 'none';
    });

    document.getElementById('cartOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('cartOverlay')) document.getElementById('cartOverlay').style.display = 'none';
    });

    modalCheckoutBtn.addEventListener('click', showCheckout);
}

window.removeFromCart = function (index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
    renderCartModal();
    if (views.checkout.style.display === 'block') {
        populateCheckoutSummary();
        if (cart.length === 0) showCourses();
    }
};

function saveCart() {
    try { localStorage.setItem('bokify_cart', JSON.stringify(cart)); } catch (e) { }
}
function updateCartUI() { cartBadge.innerText = cart.length; }

function renderCartModal() {
    const container = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
        totalEl.innerText = '₹ 0';
        return;
    }

    cart.forEach((item, index) => {
        const html = `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'">
                        <div class="cart-item-details">
                            <h4>${item.title}</h4>
                            <div class="cart-item-price">₹ ${item.price.toLocaleString()}</div>
                            <button type="button" class="remove-item" onclick="removeFromCart(${index})">Remove</button>
                        </div>
                    </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
    totalEl.innerText = '₹ ' + calculateTotal().toLocaleString();
}

window.showToast = function (message) {
    toastMessage.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// --- FILTERING LOGIC ---
function initFilters() {
    const filterBtn = document.getElementById('filterToggle');
    const filterDropdown = document.getElementById('filterDropdown');
    const applyBtn = document.getElementById('applyFiltersBtn');
    const searchInput = document.getElementById('searchInput');

    const newFilterBtn = filterBtn.cloneNode(true);
    filterBtn.parentNode.replaceChild(newFilterBtn, filterBtn);

    newFilterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('visible');
        newFilterBtn.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!filterDropdown.contains(e.target) && !newFilterBtn.contains(e.target)) {
            filterDropdown.classList.remove('visible');
            newFilterBtn.classList.remove('active');
        }
    });

    applyBtn.addEventListener('click', () => {
        const courses = document.querySelectorAll('.book-card');
        const allSub = document.querySelector('input[name="category"][value="all"]').checked;
        let cats = [];
        if (!allSub) {
            document.querySelectorAll('input[name="category"]:checked').forEach(c => cats.push(c.value));
        }

        const levels = Array.from(document.querySelectorAll('input[name="level"]:checked')).map(c => c.value);
        const min = parseInt(document.getElementById('minPrice').value) || 0;
        const max = parseInt(document.getElementById('maxPrice').value) || 100000;

        courses.forEach(card => {
            const cCat = card.dataset.category;
            const cLev = card.dataset.level;
            const cPrice = parseInt(card.dataset.price);

            const catMatch = allSub || cats.includes(cCat);
            const levMatch = levels.length === 0 || levels.includes(cLev);
            const priceMatch = cPrice >= min && cPrice <= max;

            if (catMatch && levMatch && priceMatch) card.classList.remove('hidden');
            else card.classList.add('hidden');
        });

        filterDropdown.classList.remove('visible');
        newFilterBtn.classList.remove('active');
        initScrollAnimations();
    });

    searchInput.addEventListener('input', (e) => {
        const courses = document.querySelectorAll('.book-card');
        const term = e.target.value.toLowerCase();
        courses.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(term)) card.classList.remove('hidden');
            else card.classList.add('hidden');
        });
        initScrollAnimations();
    });
}