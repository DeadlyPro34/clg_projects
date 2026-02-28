// Guide Data
const guideData = {
    iceland: {
        id: 'iceland',
        title: "Iceland: Land of Fire & Ice",
        badge: "Sustainable Nature",
        desc: "Explore Iceland's pristine glaciers, dramatic waterfalls, and geothermal wonders while minimizing your footprint on its fragile ecosystem.",
        heroImg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000",
        ecoTips: [
            "Stick to marked trails to prevent soil erosion in mossy fields.",
            "Use geothermal heating: almost all Icelandic homes use 100% renewable energy.",
            "Drink tap water: Iceland has some of the cleanest water in the world."
        ],
        localSpots: [
            "Hveragerði Hot Springs: A community-run natural spa.",
            "Skúli Craft Bar: Supports local Icelandic micro-breweries.",
            "Reykjavik Roasters: Fair-trade coffee and community hub."
        ],
        proTip: "Don't buy bottled water. Bring a reusable bottle and fill it from any tap; it's exactly the same water as the expensive bottles."
    },
    amsterdam: {
        id: 'amsterdam',
        title: "Amsterdam: Cycling Culture",
        badge: "Eco-Urban",
        desc: "Discover the charming canals and historic streets of Amsterdam through its world-famous zero-emission transport network.",
        heroImg: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=2000",
        ecoTips: [
            "Rent a bike from local community-owned shops.",
            "Shop at the Albert Cuyp Market for locally sourced produce.",
            "Participate in a canal-plastic fishing tour to clean the waterways."
        ],
        localSpots: [
            "De Ceuvel: A sustainable urban oasis built on polluted soil.",
            "Mediamatic: An arts centre focused on biotechnology and fungi.",
            "PLANT: A zero-waste vegan restaurant in the Plantage district."
        ],
        proTip: "Get an OV-chipkaart to access the extensive electric tram and bus network easily, reducing the need for taxis."
    },
    costarica: {
        id: 'costarica',
        title: "Costa Rica: Pura Vida",
        badge: "Wildlife Conservation",
        desc: "Immerse yourself in one of the most biodiverse places on Earth and support reforestation and wildlife protection efforts.",
        heroImg: "https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0?auto=format&fit=crop&q=80&w=2000",
        ecoTips: [
            "Choose Blue Flag certified beaches and eco-lodges.",
            "Never touch or feed wildlife; observe from a distance.",
            "Support local artisans in Sarchí to boost the rural economy."
        ],
        localSpots: [
            "Monteverde Cloud Forest: A community-managed private reserve.",
            "Cahuita National Park: Focus on marine life conservation.",
            "La Fortuna Farmers Market: Direct support for local farmers."
        ],
        proTip: "Pack reef-safe sunscreen. The coral reefs in Costa Rica are protected and chemical-based sunscreens are harmful."
    }
};

// Initialize Lucide icons
lucide.createIcons();

// State Management
let isLogin = true;
let currentUser = null;
let currentRating = 0;
let myRoute = [];
let activeGuide = null;

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

function initScrollAnimations() {
    document.querySelectorAll('.reveal').forEach((el) => {
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

// Navigation Function
function showSection(sectionId) {
    $('.page-section').removeClass('active');
    setTimeout(() => {
        $(`#${sectionId}`).addClass('active');
        initScrollAnimations();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (sectionId === 'my-route') renderRoute();
    }, 50);
    if ($('.navbar-collapse').hasClass('show')) {
        $('.navbar-toggler').click();
    }
}

// Custom Alert Helper
function showAlert(msg, type = 'success') {
    const alert = $('#statusAlert');
    alert.text(msg).removeClass('alert-success alert-danger').addClass(`alert-${type}`).fadeIn();
    setTimeout(() => alert.fadeOut(), 3000);
}

// Route Management Logic
function updateRouteUI() {
    const count = myRoute.length;
    const counter = $('#routeCounter');
    if (count > 0) {
        counter.removeClass('d-none').text(count);
    } else {
        counter.addClass('d-none');
    }
}

function renderRoute() {
    const timeline = $('#routeTimeline');
    const emptyState = $('#routeEmptyState');

    if (myRoute.length === 0) {
        timeline.addClass('d-none');
        emptyState.removeClass('d-none');
        return;
    }

    emptyState.addClass('d-none');
    timeline.removeClass('d-none').empty();

    myRoute.forEach((guideId, index) => {
        const data = guideData[guideId];
        const item = `
                    <div class="timeline-item reveal" style="transition-delay: ${index * 0.1}s">
                        <div class="timeline-dot"></div>
                        <div class="route-card">
                            <img src="${data.heroImg}" class="route-img" alt="${data.title}">
                            <div class="flex-grow-1">
                                <span class="badge-eco mb-1">${data.badge}</span>
                                <h5 class="fw-bold text-dark mb-1">${data.title}</h5>
                                <p class="small text-muted mb-0">Sustainable travel plan added</p>
                            </div>
                            <button class="btn btn-link text-danger remove-route-btn p-2" data-id="${guideId}">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                `;
        timeline.append(item);
    });

    lucide.createIcons();
    initScrollAnimations();

    $('.remove-route-btn').on('click', function () {
        const id = $(this).data('id');
        myRoute = myRoute.filter(i => i !== id);
        updateRouteUI();
        renderRoute();
        showAlert("Destination removed from route", "info");
    });
}

$(document).ready(function () {
    initScrollAnimations();

    // Read Guide Logic
    $('.read-guide-btn').on('click', function (e) {
        e.preventDefault();
        const guideKey = $(this).data('guide');
        const data = guideData[guideKey];

        if (data) {
            activeGuide = data;
            // Populate detail section
            $('#detail-hero').css('background-image', `url(${data.heroImg})`);
            $('#detail-title').text(data.title);
            $('#detail-badge').text(data.badge);
            $('#detail-desc').text(data.desc);
            $('#detail-pro-tip').text(data.proTip);

            // Update Button State
            const isAdded = myRoute.includes(data.id);
            $('#addToRouteBtn').html(isAdded ? '<i data-lucide="check" class="me-2"></i> In Your Route' : '<i data-lucide="plus" class="me-2"></i> Add to My Route');
            $('#addToRouteBtn').prop('disabled', isAdded);

            // Clear and populate lists
            $('#detail-eco-tips').empty();
            data.ecoTips.forEach(tip => {
                $('#detail-eco-tips').append(`<div class="p-3 bg-light rounded-3 mb-2"><i data-lucide="check" class="text-success me-2" size="18"></i>${tip}</div>`);
            });

            $('#detail-local-spots').empty();
            data.localSpots.forEach(spot => {
                $('#detail-local-spots').append(`<li class="mb-2 d-flex align-items-center"><i data-lucide="map-pin" class="text-success me-2" size="18"></i>${spot}</li>`);
            });

            lucide.createIcons(); // Refresh icons for new content
            showSection('guide-detail');
        }
    });

    // Add to Route Logic
    $('#addToRouteBtn').on('click', function () {
        if (!activeGuide) return;

        if (!myRoute.includes(activeGuide.id)) {
            myRoute.push(activeGuide.id);
            updateRouteUI();
            $(this).html('<i data-lucide="check" class="me-2"></i> Added!').addClass('btn-success').prop('disabled', true);
            showAlert(`Great! ${activeGuide.title} added to your route.`);
            lucide.createIcons();
        }
    });

    // Guide Filtering Logic
    $('[data-filter]').on('click', function () {
        const filter = $(this).data('filter');
        $('[data-filter]').removeClass('active');
        $(this).addClass('active');

        if (filter === 'all') {
            $('.guide-item').hide().fadeIn(500);
        } else {
            $('.guide-item').hide();
            $(`.guide-item[data-category="${filter}"]`).fadeIn(500);
        }
    });

    // Auth Toggle Logic
    $('#toggleAuth').on('click', function (e) {
        e.preventDefault();
        isLogin = !isLogin;
        $('.auth-container').css('opacity', '0.5');
        setTimeout(() => {
            if (isLogin) {
                $('#authTitle').text('Welcome Back');
                $('#authSubtitle').text('Please enter your details to sign in.');
                $('#registerFields').addClass('d-none');
                $('#authBtn').text('Sign In');
                $('#authToggleText').html(`Don't have an account? <a href="#" class="text-success fw-bold text-decoration-none" id="toggleAuth">Register</a>`);
            } else {
                $('#authTitle').text('Join EcoJourney');
                $('#authSubtitle').text('Start your sustainable travel journey today.');
                $('#registerFields').removeClass('d-none');
                $('#authBtn').text('Create Account');
                $('#authToggleText').html(`Already have an account? <a href="#" class="text-success fw-bold text-decoration-none" id="toggleAuth">Login</a>`);
            }
            $('.auth-container').css('opacity', '1');
            $('#toggleAuth').on('click', function (e) { e.preventDefault(); $('#toggleAuth').trigger('click'); });
        }, 150);
    });

    // Handle Login/Register Simulation
    $('#authForm').on('submit', function (e) {
        e.preventDefault();
        const name = $('#authName').val() || 'Eco Traveler';
        currentUser = { name: name };
        $('#authLinkContainer').addClass('d-none');
        $('#userProfileContainer').removeClass('d-none');
        $('#userNameDisplay').text(name);
        showAlert(isLogin ? "Successfully Logged In!" : "Account Created Successfully!");
        showSection('home');
    });

    // Star Rating Logic
    $('.feedback-star').on('click', function () {
        currentRating = $(this).data('rating');
        $('.feedback-star').each(function (index) {
            if (index < currentRating) {
                $(this).attr('fill', '#ffc107').addClass('text-warning');
            } else {
                $(this).attr('fill', 'none').removeClass('text-warning');
            }
        });
    });

    // Feedback Submission
    $('#feedbackForm').on('submit', function (e) {
        e.preventDefault();
        if (currentRating === 0) {
            showAlert("Please select a star rating", "danger");
            return;
        }
        showAlert("Thank you for your valuable feedback!");
        $(this).trigger('reset');
        $('.feedback-star').attr('fill', 'none').removeClass('text-warning');
        currentRating = 0;
    });

    // Navbar shadow on scroll
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('shadow-sm');
        } else {
            $('.navbar').removeClass('shadow-sm');
        }
    });

    // Cursor movement and hover effects
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', function (e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseover', function (e) {
        if (e.target.closest('a, button, .guide-card, .nav-link, input, textarea, .feedback-star')) {
            cursor.classList.add('cursor-grow');
        }
    });
    document.addEventListener('mouseout', function (e) {
        if (e.target.closest('a, button, .guide-card, .nav-link, input, textarea, .feedback-star')) {
            cursor.classList.remove('cursor-grow');
        }
    });
});

function logout() {
    currentUser = null;
    $('#authLinkContainer').removeClass('d-none');
    $('#userProfileContainer').addClass('d-none');
    showAlert("Logged Out Successfully");
    showSection('home');
}

// Smooth Scroll Effect for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target && this.getAttribute('href') !== '#') {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});