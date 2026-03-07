// --- Scroll Reveal Animations ---
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // Reset and observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('active');
        observer.observe(el);
    });

    // Trigger immediately for elements already in viewport
    setTimeout(() => {
        document.querySelectorAll('.reveal').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('active');
            }
        });
    }, 100);
}

// Initialize animations on first load
document.addEventListener("DOMContentLoaded", initScrollAnimations);

// --- EcoJourney Style SPA Logic ---
function showSection(sectionId) {
    // Hide all wrapped sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Show the newly selected section
    document.getElementById(sectionId).classList.add('active');

    // Scroll to top and re-trigger scroll animations
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initScrollAnimations();
}

// --- Mobile Menu Toggle Logic (Updated for Modern Sidebar) ---
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('menuOverlay');
    const icon = document.querySelector('.mobile-menu-btn i');

    navLinks.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');

    // Icon swap & Scroll Lock
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('menuOverlay');
    const icon = document.querySelector('.mobile-menu-btn i');

    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (overlay) overlay.classList.remove('active');

        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});