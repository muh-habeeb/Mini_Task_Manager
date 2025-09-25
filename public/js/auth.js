let API_BASE = '/api';

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        if (window.location.pathname === '/dashboard') {
            window.location.href = '/login';
        }
        return false;
    }
    return true;
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Show alert message
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            showAlert('Registration successful! Please login.', 'success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            if (data.errors|| data.errors && Array.isArray(data.errors)) {
                const messages = data.errors.map(err => err.msg).join('<br>');
                showAlert(messages, 'error');
            } else {
                showAlert(data.error);
            }
        }

    } catch (error) {
        showAlert('Network error. Please try again.');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/dashboard';
        } else {
            let errorMsg = 'Login failed';
            console.log(data);

            if (data.error) {
                errorMsg = data.error;
            } else if (data.message) {
                errorMsg = data.message;
            } else if (data.errors && Array.isArray(data.errors)) {
                errorMsg = data.errors.map(err => err.msg).join('<br>');
            }

            showAlert(errorMsg, 'error');
        }

    } catch (error) {
        showAlert('Network error. Please try again.');
    }
}

// Handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}