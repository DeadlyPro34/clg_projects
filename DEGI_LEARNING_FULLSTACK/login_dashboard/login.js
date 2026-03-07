document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.querySelector('#login-form .btn-submit');
    
    const signupForm = document.getElementById('signup-form');
    const signupBtn = document.querySelector('#signup-form .btn-submit');
    
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    const successView = document.getElementById('success-view');

    // --- TOGGLE BETWEEN LOGIN & SIGNUP ---
    window.toggleForm = (view) => {
        // Clear errors when switching
        document.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('.input').forEach(el => el.classList.remove('error'));

        if (view === 'signup') {
            loginBox.classList.add('hidden');
            signupBox.classList.remove('hidden');
            // Add fade-in animation
            signupBox.classList.add('fade-in');
            loginBox.classList.remove('fade-in');
        } else {
            signupBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
            // Add fade-in animation
            loginBox.classList.add('fade-in');
            signupBox.classList.remove('fade-in');
        }
    };

    // --- HELPER: SHOW/HIDE ERRORS ---
    const showError = (id, show) => {
        const errorEl = document.getElementById(id);
        if (errorEl) {
            const input = errorEl.previousElementSibling.querySelector('input');
            if (show) {
                errorEl.classList.add('visible');
                if (input) input.classList.add('error');
            } else {
                errorEl.classList.remove('visible');
                if (input) input.classList.remove('error');
            }
        }
    };

    // --- LOGIN VALIDATION & SUBMIT ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        let isValid = true;

        // Reset Errors
        showError('error-loginEmail', false);
        showError('error-loginPassword', false);

        // Validate Email
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            showError('error-loginEmail', true);
            isValid = false;
        }

        // Validate Password
        if (!password) {
            showError('error-loginPassword', true);
            isValid = false;
        }

        if (isValid) {
            // Simulate API Call / Loading
            const originalText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
            loginBtn.disabled = true;

            setTimeout(() => {
                // ROUTING LOGIC based on email
                if (email.toLowerCase().includes('admin')) {
                    window.location.href = 'admin/admin_dashboard.html';
                } else {
                    window.location.href = 'student/student_dashboard.html';
                }
                
                // Reset button (in case redirect is slow)
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
            }, 1500);
        }
    });

    // --- SIGNUP VALIDATION & SUBMIT ---
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(signupForm);
        let isValid = true;

        // Reset all errors first
        document.querySelectorAll('#signup-box .error-message').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('#signup-box .input').forEach(el => el.classList.remove('error'));

        // Simple Validation Checks
        if (!formData.get('fullName').trim()) { showError('error-fullName', true); isValid = false; }
        if (!formData.get('email').trim() || !/\S+@\S+\.\S+/.test(formData.get('email'))) { showError('error-email', true); isValid = false; }
        if (formData.get('password').length < 8) { showError('error-password', true); isValid = false; }
        if (formData.get('password') !== formData.get('confirmPassword')) { showError('error-confirmPassword', true); isValid = false; }
        if (!document.getElementById('agreeToTerms').checked) { showError('error-agreeToTerms', true); isValid = false; }

        if (isValid) {
            const originalText = signupBtn.innerHTML;
            signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            signupBtn.disabled = true;

            setTimeout(() => {
                loginBox.classList.add('hidden');
                signupBox.classList.add('hidden');
                successView.style.display = 'flex';
                
                signupBtn.innerHTML = originalText;
                signupBtn.disabled = false;
            }, 1500);
        }
    });

    // --- INPUT LISTENER (Remove errors on type) ---
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const parent = input.closest('.form-group') || input.closest('.checkbox-wrapper');
            if (parent) {
                const err = parent.querySelector('.error-message') || parent.nextElementSibling;
                if (err && err.classList.contains('error-message')) err.classList.remove('visible');
            }
        });
    });
});