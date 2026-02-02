/**
 * CoreX Fitness - Motivation Boost
 * Handles motivational email preview and sending
 */

const API_BASE_URL = 'https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net';

// Get JWT token from localStorage
function getToken() {
    return localStorage.getItem('jwtToken');
}

// Check authentication
function checkAuth() {
    const token = getToken();
    if (!token) {
        Toast.warning('Please login first to access this feature.');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
        return false;
    }
    return true;
}

// Show/hide loading overlay
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Show/hide modal
function showModal(show) {
    const modal = document.getElementById('previewModal');
    if (show) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Preview motivation message
async function previewMessage() {
    if (!checkAuth()) return;
    
    const previewBtn = document.getElementById('previewBtn');
    previewBtn.disabled = true;
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/Motivation/preview`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (response.status === 401) {
            Toast.error('Session expired. Please login again.');
            localStorage.removeItem('jwtToken');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
            return;
        }
        
        if (response.status === 404) {
            Toast.warning('Please complete your profile first (age, weight, height).');
            setTimeout(() => {
                if (confirm('Would you like to go to your Profile page to complete your information?')) {
                    window.location.href = '../Profile_Page_New/index.html';
                }
            }, 500);
            return;
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to preview message');
        }
        
        const data = await response.json();
        
        // Display in modal
        const previewContent = document.getElementById('previewContent');
        // The API returns HTML content, so we display it directly
        previewContent.innerHTML = data.message || '<p>Your personalized motivation message will appear here.</p>';
        
        showModal(true);
        
    } catch (error) {
        console.error('Error:', error);
        Toast.error('Failed to preview message. Please try again.');
    } finally {
        previewBtn.disabled = false;
        showLoading(false);
    }
}

// Send motivation email
async function sendEmail() {
    if (!checkAuth()) return;
    
    const sendBtn = document.getElementById('sendBtn');
    const sendFromModal = document.getElementById('sendFromModal');
    
    sendBtn.disabled = true;
    sendFromModal.disabled = true;
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/Motivation/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        
        if (response.status === 401) {
            Toast.error('Session expired. Please login again.');
            localStorage.removeItem('jwtToken');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
            return;
        }
        
        if (response.status === 404) {
            Toast.warning('Please complete your profile first (age, weight, height).');
            setTimeout(() => {
                if (confirm('Would you like to go to your Profile page to complete your information?')) {
                    window.location.href = '../Profile_Page_New/index.html';
                }
            }, 500);
            return;
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to send email');
        }
        
        // Close modal if open
        showModal(false);
        
        // Show success message
        Toast.success('Motivational email sent successfully! Check your inbox. 📬');
        
    } catch (error) {
        console.error('Error:', error);
        Toast.error('Failed to send email. Please try again.');
    } finally {
        sendBtn.disabled = false;
        sendFromModal.disabled = false;
        showLoading(false);
    }
}

// Close modal
function closeModal() {
    showModal(false);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common components
    ThemeManager.init();
    MobileNav.init();
    Toast.init();
    
    // Setup theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => ThemeManager.toggle());
    }
    
    // Check authentication
    if (!checkAuth()) return;
    
    // Event listeners
    document.getElementById('previewBtn').addEventListener('click', previewMessage);
    document.getElementById('sendBtn').addEventListener('click', sendEmail);
    document.getElementById('sendFromModal').addEventListener('click', sendEmail);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    
    // Close modal on overlay click
    document.getElementById('previewModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
