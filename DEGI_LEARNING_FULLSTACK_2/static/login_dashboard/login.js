// --- HELPER: CSRF TOKEN ---
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

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTS ---
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.querySelector('#login-form .btn-submit');
    
    const signupForm = document.getElementById('signup-form');
    const signupBtn = document.querySelector('#signup-form .btn-submit');
    
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    const successView = document.getElementById('success-view');
    const successBtn = document.getElementById('successRedirectBtn');

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
            // Real API Call
            const originalText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
            loginBtn.disabled = true;

            fetch('/api/login/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ email: email, password: password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    if (data.user_type === 'admin') {
                        window.location.href = '/admin-dashboard/';
                    } else if (data.user_type === 'parent') {
                        window.location.href = '/parent-dashboard/';
                    } else {
                        window.location.href = '/student-dashboard/';
                    }
                } else {
                    alert(data.message || 'Login failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during login');
            })
            .finally(() => {
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
            });
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

            fetch('/api/signup/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    user_type: formData.get('user_type')
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    loginBox.classList.add('hidden');
                    signupBox.classList.add('hidden');
                    successView.style.display = 'flex';
                    const utype = formData.get('user_type');
                    const target = utype === 'parent' ? '/parent-dashboard/' : '/student-dashboard/';
                    
                    if (successBtn) successBtn.onclick = () => window.location.href = target;

                    // Auto redirect after 3s
                    setTimeout(() => {
                        window.location.href = target;
                    }, 3000);
                } else {
                    alert(data.message || 'Signup failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during signup');
            })
            .finally(() => {
                signupBtn.innerHTML = originalText;
                signupBtn.disabled = false;
            });
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