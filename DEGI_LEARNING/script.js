document.addEventListener('DOMContentLoaded', () => {
    // --- 1. INITIAL SETUP ---
    // Trigger "All" category by default to show all courses
    const allButton = document.querySelector('.category-tabs button[data-category="all"]');
    if (allButton) {
        selectCategory(allButton);
    }

    // --- 2. MODAL VARIABLES ---
    const userIcon = document.querySelector('.user-icon');
    const authModal = document.getElementById('auth-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalContent = document.querySelector('.modal-content');
    const tabButtons = document.querySelectorAll('.tab-button');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // --- 3. MODAL FUNCTIONS (Open/Close) ---
    const openModal = () => {
        authModal.classList.remove('hidden');
    };

    const closeModal = () => {
        authModal.classList.add('hidden');
    };

    // Event Listener: Click User Icon to Open
    userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    // Event Listener: Click 'X' to Close
    modalCloseBtn.addEventListener('click', closeModal);

    // Event Listener: Click Outside Modal to Close
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // --- 4. TAB SWITCHING LOGIC (Login vs Sign Up) ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Switch visible form based on data-tab attribute
            const tab = button.dataset.tab;
            if (tab === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });
});

// --- 5. CATEGORY FILTERING FUNCTION ---
// Handles showing/hiding course cards based on selected category
function selectCategory(buttonElement) {
    const selectedCategory = buttonElement.getAttribute('data-category');

    // Update active state of buttons
    const buttons = document.querySelectorAll('.category-tabs button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    buttonElement.classList.add('active');

    // Filter cards
    const cards = document.querySelectorAll('.book-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}
lucide.createIcons();