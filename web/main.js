// web/main.js

const API_BASE = 'http://localhost:3000';

// ===== Helpers =====
async function postJSON(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

function saveAuth(token, email) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('authEmail', email);
}

function clearAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authEmail');
}

function getAuth() {
  return {
    token: localStorage.getItem('authToken'),
    email: localStorage.getItem('authEmail'),
  };
}

// ===== Signup =====
async function handleSignup(event) {
  event.preventDefault();

  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const msgEl = document.getElementById('signup-message');

  msgEl.textContent = 'Creating account...';

  const { ok, body } = await postJSON(`${API_BASE}/api/auth/register`, {
    name,
    email,
    password,
  });

  if (ok) {
    msgEl.textContent = 'Account created! You can login now.';
    msgEl.style.color = 'green';
    form.reset();
  } else {
    msgEl.textContent = body.message || 'Error creating account';
    msgEl.style.color = 'red';
  }
}

// ===== Login =====
async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value;
  const msgEl = document.getElementById('login-message');

  msgEl.textContent = 'Logging in...';

  const { ok, body } = await postJSON(`${API_BASE}/api/auth/login`, {
    email,
    password,
  });

  if (ok && body.token) {
    msgEl.textContent = 'Login successful!';
    msgEl.style.color = 'green';

    saveAuth(body.token, email);

    // بعد نجاح الدخول نرسل المستخدم للـ dashboard
    window.location.href = 'dashboard.html';
  } else {
    msgEl.textContent = body.message || 'Invalid email or password';
    msgEl.style.color = 'red';
  }
}

// ===== Dashboard =====
function initDashboard() {
  const root = document.getElementById('dashboard-root');
  if (!root) return; // مو في صفحة الداشبورد

  const { token, email } = getAuth();

  // لو مافيه توكن رجّعه لصفحة الـ login
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const welcome = document.getElementById('welcome-text');
  welcome.textContent = `Welcome, ${email}! You are logged in.`;

  // زر الـ Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearAuth();
      window.location.href = 'login.html';
    });
  }

  // هنا لاحقاً بنستعمل token مع fetch للـ weekly/daily APIs
}

// ===== Wire up forms/pages =====
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  initDashboard();
});
