document.addEventListener('DOMContentLoaded', () => {
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

// Initialize Lucide Icons
lucide.createIcons();