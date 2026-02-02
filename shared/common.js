const ThemeManager = {
    storageKey: 'corex-theme',

    init() {
        const savedTheme = localStorage.getItem(this.storageKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (!systemPrefersDark) {
            this.setTheme('light');
        } else {
            this.setTheme('dark');
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.storageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);

        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
            const icon = toggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = theme === 'dark' ? '' : '';
            }
        }
    },

    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    },

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }
};

const MobileNav = {
    init() {
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('nav') || document.querySelector('.main-nav');
        const overlay = document.querySelector('.nav-overlay');

        if (hamburger && nav) {
            hamburger.addEventListener('click', () => this.toggle());

            if (overlay) {
                overlay.addEventListener('click', () => this.close());
            }

            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.close();
            });
        }
    },

    toggle() {
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('nav') || document.querySelector('.main-nav');
        const overlay = document.querySelector('.nav-overlay');

        hamburger?.classList.toggle('active');
        nav?.classList.toggle('active');
        overlay?.classList.toggle('active');

        document.body.style.overflow = nav?.classList.contains('active') ? 'hidden' : '';
    },

    close() {
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('nav') || document.querySelector('.main-nav');
        const overlay = document.querySelector('.nav-overlay');

        hamburger?.classList.remove('active');
        nav?.classList.remove('active');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
};

const Toast = {
    container: null,

    init() {
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.setAttribute('role', 'alert');
            this.container.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    },

    show(message, type = 'info', duration = 4000) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: '',
            error: '',
            warning: '',
            info: '?'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.dismiss(toast);
        });

        this.container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => this.dismiss(toast), duration);
        }

        return toast;
    },

    dismiss(toast) {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    },

    success(message, duration) { return this.show(message, 'success', duration); },
    error(message, duration) { return this.show(message, 'error', duration); },
    warning(message, duration) { return this.show(message, 'warning', duration); },
    info(message, duration) { return this.show(message, 'info', duration); }
};

const Loading = {
    overlay: null,

    init() {
        if (!document.querySelector('.loading-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'loading-overlay';
            this.overlay.innerHTML = `<div class="spinner"></div>`;
            document.body.appendChild(this.overlay);
        } else {
            this.overlay = document.querySelector('.loading-overlay');
        }
    },

    show() {
        if (!this.overlay) this.init();
        this.overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    },

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }
};

const FormValidator = {
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^.{6,}$/,
        username: /^[a-zA-Z0-9_]{3,}$/,
        phone: /^[\d\s\-+()]{10,}$/
    },

    validate(input, type) {
        const value = input.value.trim();
        const pattern = this.patterns[type];

        if (!value) {
            return { valid: false, message: 'This field is required' };
        }

        if (pattern && !pattern.test(value)) {
            const messages = {
                email: 'Please enter a valid email address',
                password: 'Password must be at least 6 characters',
                username: 'Username must be at least 3 characters (letters, numbers, underscore)',
                phone: 'Please enter a valid phone number'
            };
            return { valid: false, message: messages[type] };
        }

        return { valid: true };
    },

    showError(input, message) {
        this.clearError(input);
        input.classList.add('input-error');
        input.style.borderColor = '#ef4444';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = 'color: #ef4444; font-size: 0.85rem; margin-top: 5px;';
        errorDiv.textContent = message;

        input.parentNode.appendChild(errorDiv);
    },

    clearError(input) {
        input.classList.remove('input-error');
        input.style.borderColor = '';
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
    },

    showSuccess(input) {
        this.clearError(input);
        input.style.borderColor = '#10b981';
    }
};

const ScrollAnimations = {
    init() {
        const elements = document.querySelectorAll('[data-animate]');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animation = entry.target.dataset.animate || 'fadeIn';
                    entry.target.style.animation = `${animation} 0.6s ease forwards`;
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
};

const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    ThemeManager.init();
    MobileNav.init();
    Toast.init();
    Loading.init();
    ScrollAnimations.init();
    SmoothScroll.init();

    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => ThemeManager.toggle());
    }

    // Gender-based routing logic
    try {
        if (window.Auth && typeof window.Auth.fetchUserInfo === 'function') {
            const user = await window.Auth.fetchUserInfo();
            if (user.gender === 2 || user.gender === '2' || (typeof user.gender === 'string' && user.gender.toLowerCase() === 'female')) {
                // If not already in female frontend, redirect
                if (!window.location.pathname.includes('/female/')) {
                    const femalePath = '/female' + window.location.pathname;
                    window.location.replace(femalePath);
                    return;
                }
            } else {
                // If in female frontend but user is not female, redirect to main
                if (window.location.pathname.includes('/female/')) {
                    const mainPath = window.location.pathname.replace('/female', '');
                    window.location.replace(mainPath);
                    return;
                }
            }
        }
    } catch (e) {
        // If user info cannot be fetched, continue as normal
    }

    const mainContent = document.querySelector('main') || document.querySelector('body > *:not(header):not(script):not(style)');
    if (mainContent && !mainContent.classList.contains('animate-fade-in')) {
        mainContent.classList.add('animate-fade-in');
    }
});

// Authentication helpers: token management, fetch user info, logout
const Auth = {
    tokenKey: 'jwtToken',

    getToken() {
        return localStorage.getItem(this.tokenKey) || null;
    },

    setToken(token) {
        if (token) localStorage.setItem(this.tokenKey, token);
    },

    clearToken() {
        localStorage.removeItem(this.tokenKey);
    },

    async fetchUserInfo() {
        const token = this.getToken();
        if (!token) throw new Error('No token');

        const res = await fetch('https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net/api/Authentication/getUserInfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const message = err.message || `Failed to fetch user info: ${res.status}`;
            throw new Error(message);
        }

        return res.json();
    },

    async logout() {
        const token = this.getToken();
        try {
            if (token) {
                await fetch('https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net/api/Authentication/Logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (e) {
            console.warn('Logout request failed', e);
        } finally {
            this.clearToken();
            Toast.success('Logged out');
            // Redirect to login page at site root
            try {
                window.location.href = '/index.html';
            } catch (e) {
                window.location.href = 'index.html';
            }
        }
    }
};

// Attach logout behavior to any "Log Out" links found in markup
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a').forEach(a => {
        if (a.textContent && a.textContent.trim().toLowerCase() === 'log out') {
            a.addEventListener('click', (ev) => {
                ev.preventDefault();
                Auth.logout();
            });
            // neutralize original href to avoid accidental navigation
            a.setAttribute('href', '#');
        }
    });
});

// expose globally
window.Auth = Auth;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, MobileNav, Toast, Loading, FormValidator, ScrollAnimations };
}
