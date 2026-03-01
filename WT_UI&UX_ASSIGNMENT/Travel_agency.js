const FALLBACK_IMG = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80';

// 15 Guide Data items mapped to unique, location-accurate Unsplash imagery
const guideData = [
    { id: '1', title: "Iceland Glaciers", category: "nature", badge: "Sustainable Nature", heroImg: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80", desc: "Eco-tours through crystal caves.", ecoTips: ["Use reusable gear only", "Stick to marked trails to prevent soil erosion", "Drink clean tap water"], localSpots: ["Vatnajökull Glacier", "Diamond Beach", "Hveragerði Hot Springs"], proTip: "Respect the ice and never go onto glaciers without a certified local guide." },
    { id: '2', title: "Kyoto Temples", category: "cultural", badge: "Culture & Tradition", heroImg: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", desc: "Sustainable Zen exploration.", ecoTips: ["Support local ryokans", "Mindful photography (no flash where forbidden)", "Travel via electric rail"], localSpots: ["Kinkaku-ji", "Arashiyama Bamboo Grove", "Nishiki Market"], proTip: "Rent a Yukata from a local shop to support traditional garment industries." },
    { id: '3', title: "Costa Rica Rainforest", category: "nature", badge: "Wildlife Conservation", heroImg: "https://images.unsplash.com/photo-1536782376847-5c9d14d97cc0?auto=format&fit=crop&w=800&q=80", desc: "Carbon-neutral jungle stays.", ecoTips: ["Use reef-safe sunscreen", "Never feed or touch wildlife", "Choose Blue Flag beaches"], localSpots: ["Monteverde Cloud Forest", "Tortuguero National Park", "La Fortuna Farmers Market"], proTip: "Pack light and use biodegradable soaps." },
    { id: '4', title: "Amsterdam Canals", category: "urban", badge: "Eco-Urban", heroImg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80", desc: "Tour the city by electric boat.", ecoTips: ["Rent a bicycle for primary transit", "Join a canal plastic-fishing tour", "Shop at local farmers markets"], localSpots: ["Jordaan District", "Vondelpark", "De Ceuvel Sustainable Oasis"], proTip: "Get an OV-chipkaart to access the extensive electric tram network." },
    { id: '5', title: "Swiss Alps Hike", category: "adventure", badge: "High Altitude", heroImg: "https://images.unsplash.com/photo-1469521669194-babbdf9aa9bf?auto=format&fit=crop&w=800&q=80", desc: "High altitude, low impact.", ecoTips: ["Follow 'Leave No Trace' strictly", "Use mountain rail instead of driving", "Buy local alpine cheeses"], localSpots: ["Zermatt Car-free Village", "Interlaken trails", "Aletsch Glacier"], proTip: "Stay strictly on the marked trails to protect fragile alpine flora." },
    { id: '6', title: "Bhutan Mountain Pass", category: "cultural", badge: "Carbon Negative", heroImg: "https://cdn.britannica.com/02/75702-050-C11357BD/Schoolchildren-hill-Thimpu-Bhutan.jpg", desc: "The world's only carbon-negative country.", ecoTips: ["Pay the Sustainable Development Fee gladly", "Dress modestly in sacred areas", "Avoid bringing single-use plastics into the country"], localSpots: ["Tiger's Nest Monastery", "Punakha Dzong", "Phobjikha Valley"], proTip: "Try the local butter tea and red rice to support local agriculture." },
    { id: '7', title: "Great Barrier Reef", category: "nature", badge: "Marine Protection", heroImg: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=800&q=80", desc: "Educational conservation diving.", ecoTips: ["Use only eco-certified operators", "Never touch or stand on coral", "Use physical sun barriers (rash guards)"], localSpots: ["Cairns Conservation Center", "Whitsunday Islands", "Green Island"], proTip: "Participate in 'citizen science' programs where you report marine sightings." },
    { id: '8', title: "Vancouver Green City", category: "urban", badge: "Urban Forest", heroImg: "https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&w=800&q=80", desc: "Urban nature at its finest.", ecoTips: ["Use the electric SkyTrain", "Visit zero-waste cafes", "Cycle the Seawall"], localSpots: ["Stanley Park", "Granville Island", "Capilano Suspension Bridge"], proTip: "Always carry a reusable coffee cup; the city is extremely accommodating." },
    { id: '9', title: "Patagonia Trek", category: "adventure", badge: "Wild Frontiers", heroImg: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=800&q=80", desc: "Wilderness at the edge of the world.", ecoTips: ["Use biodegradable soap", "Camp only in official sites", "Support carbon-offsetting programs"], localSpots: ["Torres del Paine", "Fitz Roy", "Perito Moreno Glacier"], proTip: "The wind can be fierce. Secure your trash so it doesn't blow away." },
    { id: '10', title: "Azores Islands", category: "nature", badge: "Geothermal", heroImg: "https://images.unsplash.com/photo-1559586616-361e18714958?auto=format&fit=crop&w=800&q=80", desc: "Volcanic wonders in the Atlantic.", ecoTips: ["Support local dairy farmers", "Eat meals cooked by geothermal heat", "Whale watch with ethical operators"], localSpots: ["Sete Cidades", "Furnas Valley", "Pico Island"], proTip: "Try 'Cozido das Furnas', a local stew cooked underground by volcanic heat." },
    { id: '11', title: "Lofoten, Norway", category: "adventure", badge: "Fjord Energy", heroImg: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80", desc: "Breathtaking fjords and fishing.", ecoTips: ["Book electric ferry tours", "Respect local fishing communities", "Stay in refurbished Rorbuer (fishing cabins)"], localSpots: ["Reine", "Svolvær", "Trollfjord"], proTip: "Dress in high-quality, long-lasting layers rather than fast fashion." },
    { id: '12', title: "Bordeaux Vineyards", category: "cultural", badge: "Organic Farming", heroImg: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80", desc: "Organic wine tasting tours.", ecoTips: ["Visit biodynamic vineyards", "Cycle the wine route instead of driving", "Buy direct from the châteaux"], localSpots: ["Saint-Émilion", "La Cité du Vin", "Medoc Region"], proTip: "Look for the 'Agriculture Biologique' certification on bottles." },
    { id: '13', title: "Singapore Green Walls", category: "urban", badge: "Vertical Greenery", heroImg: "https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=800&q=80", desc: "The future of vertical gardening.", ecoTips: ["Use the world-class MRT network", "Explore public garden integrations", "Refill bottles at public stations"], localSpots: ["Gardens by the Bay", "Jewel Changi", "MacRitchie Reservoir"], proTip: "Support local hawker centers over international fast food." },
    { id: '14', title: "Galapagos Islands", category: "nature", badge: "Biodiversity", heroImg: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80", desc: "Strictly protected biodiversity.", ecoTips: ["Follow ranger guides implicitly", "Sanitize footwear between islands", "Do not use flash photography"], localSpots: ["Santa Cruz Island", "Isabela Island", "Charles Darwin Station"], proTip: "Keep a strict distance of at least 2 meters from all wildlife." },
    { id: '15', title: "Scottish Highlands", category: "adventure", badge: "Rewilding", heroImg: "https://wallpapercrafter.com/desktop/31254-Isle-of-Skye-Scotland-Europe-nature-mountains-sky-4k.jpg", desc: "Eco-lodges and rugged trails.", ecoTips: ["Wild camp responsibly (Scottish Outdoor Access Code)", "Buy local wool products", "Support rewilding charity estates"], localSpots: ["Glencoe", "Isle of Skye", "Cairngorms National Park"], proTip: "Always leave rural gates exactly as you found them." }
];

// Initialize Lucide icons
lucide.createIcons();

// State Management
let isLogin = false; // Defaulting to the "Create Account" state
let currentUser = null;
let currentRating = 0;
let myRoute = [];

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
        if (sectionId === 'guides') renderGuides();
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
        const data = guideData.find(g => g.id === guideId);
        const item = `
                    <div class="timeline-item reveal" style="transition-delay: ${index * 0.1}s">
                        <div class="timeline-dot"></div>
                        <div class="route-card">
                            <img src="${data.heroImg}" class="route-img" alt="${data.title}" onerror="this.onerror=null; this.src='${FALLBACK_IMG}';">
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
        const id = $(this).data('id').toString();
        myRoute = myRoute.filter(i => i !== id);
        updateRouteUI();
        renderRoute();
        showAlert("Destination removed from route", "info");
    });
}

// Dynamic Guides Render and Filtering Logic
function renderGuides() {
    const searchTerm = $('#guideSearchInput').val().toLowerCase();
    const categoryFilter = $('#categoryFilter').val();
    const grid = $('#guidesGrid').empty();
    let visibleCount = 0;

    guideData.forEach((g) => {
        const matchesCategory = (categoryFilter === 'all' || g.category === categoryFilter);
        const matchesSearch = (g.title.toLowerCase().includes(searchTerm) || g.desc.toLowerCase().includes(searchTerm));

        if (matchesCategory && matchesSearch) {
            visibleCount++;
            grid.append(`
                        <div class="col-md-6 col-lg-4 guide-item reveal active" style="transition-delay: ${(visibleCount % 10) * 0.1}s;">
                            <div class="guide-card">
                                <div class="overflow-hidden">
                                    <img src="${g.heroImg}" class="card-img-top w-100" alt="${g.title}" loading="lazy" onerror="this.onerror=null; this.src='${FALLBACK_IMG}'; guideData.find(x => x.id === '${g.id}').heroImg = this.src;">
                                </div>
                                <div class="card-body p-4">
                                    <span class="badge-eco mb-2">${g.badge}</span>
                                    <h5 class="card-title fw-bold">${g.title}</h5>
                                    <p class="card-text text-muted">${g.desc}</p>
                                    <a href="#" class="text-success text-decoration-none fw-bold d-inline-flex align-items-center read-guide-btn" data-guide="${g.id}">
                                        Read Guide <i data-lucide="arrow-right" class="ms-1" size="16"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `);
        }
    });

    if (visibleCount === 0) {
        $('#noResults').removeClass('d-none');
    } else {
        $('#noResults').addClass('d-none');
    }
    lucide.createIcons();
}

$(document).ready(function () {
    // Render guides immediately on load
    renderGuides();
    initScrollAnimations();

    // Bind filter events
    $('#categoryFilter').on('change', renderGuides);
    $('#guideSearchInput').on('input', renderGuides);

    // Read Guide Logic
    $(document).on('click', '.read-guide-btn', function (e) {
        e.preventDefault();
        const guideKey = $(this).data('guide').toString();
        const data = guideData.find(g => g.id === guideKey);

        if (data) {
            // Smart image preloader to prevent broken background-image
            const bgImg = new Image();
            bgImg.onload = function () {
                $('#detail-hero').css('background-image', `url(${data.heroImg})`);
            };
            bgImg.onerror = function () {
                $('#detail-hero').css('background-image', `url(${FALLBACK_IMG})`);
                data.heroImg = FALLBACK_IMG; // Fix data array so it's right everywhere else
            };
            bgImg.src = data.heroImg;

            $('#detail-title').text(data.title);
            $('#detail-badge').text(data.badge);
            $('#detail-desc').text(data.desc);
            $('#detail-pro-tip').text(data.proTip);

            const isAdded = myRoute.includes(data.id);
            $('#addToRouteBtn').html(isAdded ? '<i data-lucide="check" class="me-2"></i> In Your Route' : '<i data-lucide="plus" class="me-2"></i> Add to My Route');
            $('#addToRouteBtn').prop('disabled', isAdded).data('active-id', data.id);

            $('#detail-eco-tips').empty();
            data.ecoTips.forEach(tip => {
                $('#detail-eco-tips').append(`<div class="p-3 bg-light rounded-3 mb-2"><i data-lucide="check" class="text-success me-2" size="18"></i>${tip}</div>`);
            });

            $('#detail-local-spots').empty();
            data.localSpots.forEach(spot => {
                $('#detail-local-spots').append(`<li class="mb-2 d-flex align-items-center"><i data-lucide="map-pin" class="text-success me-2" size="18"></i>${spot}</li>`);
            });

            lucide.createIcons();
            showSection('guide-detail');
        }
    });

    // Add to Route Logic
    $('#addToRouteBtn').on('click', function () {
        const activeId = $(this).data('active-id');
        if (!activeId) return;

        if (!myRoute.includes(activeId)) {
            myRoute.push(activeId);
            updateRouteUI();
            $(this).html('<i data-lucide="check" class="me-2"></i> Added!').addClass('btn-success').prop('disabled', true);

            const data = guideData.find(g => g.id === activeId);
            showAlert(`Great! ${data.title} added to your route.`);
            lucide.createIcons();
        }
    });

    // Auth Toggle Logic
    $('#toggleAuth').on('click', function (e) {
        e.preventDefault();
        isLogin = !isLogin;
        $('#authFormContainer').css('opacity', '0.5');
        setTimeout(() => {
            if (isLogin) {
                $('#authTitle').text('Welcome Back');
                $('#authSubtitle').text('Please enter your details to sign in.');
                $('#registerFields').addClass('d-none');
                $('#termsCheckGroup').addClass('d-none');
                $('#termsCheck').prop('required', false);
                $('#authBtn').text('Sign In');
                $('#authToggleText').html(`Don't have an account? <a href="#" class="text-success fw-bold text-decoration-none" id="toggleAuth">Register</a>`);
            } else {
                $('#authTitle').text('Create Account');
                $('#authSubtitle').text('Become a part of the sustainable travel movement.');
                $('#registerFields').removeClass('d-none');
                $('#termsCheckGroup').removeClass('d-none');
                $('#termsCheck').prop('required', true);
                $('#authBtn').text('Create My Account');
                $('#authToggleText').html(`Already have an account? <a href="#" class="text-success fw-bold text-decoration-none" id="toggleAuth">Sign In</a>`);
            }
            $('#authFormContainer').css('opacity', '1');

            // Rebind event due to dynamic HTML replacement
            $('#toggleAuth').on('click', arguments.callee);
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