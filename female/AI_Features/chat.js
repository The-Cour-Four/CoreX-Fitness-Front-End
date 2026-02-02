/**
 * CoreX Fitness - AI Chat Coach
 * Handles the AI chatbot interface for fitness coaching
 */

const API_BASE_URL = 'https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net';

// Get JWT token from localStorage
function getToken() {
    const token = localStorage.getItem('jwtToken');
    console.log('JWT Token exists:', !!token);
    if (token) {
        console.log('Token preview:', token.substring(0, 50) + '...');
    }
    return token;
}

// Check if user is logged in
function checkAuth() {
    const token = getToken();
    if (!token) {
        Toast.warning('Please login first to use the AI Coach.');
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 1500);
        return false;
    }
    return true;
}

// Add message to chat
function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    // Sanitize content to prevent XSS
    const sanitizedContent = escapeHtml(content);

    messageDiv.innerHTML = `
        <div class="message-avatar">${isUser ? '👤' : '🏋️'}</div>
        <div class="message-content">
            <p>${sanitizedContent}</p>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
        <div class="message-avatar">🏋️</div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Send message to API
async function sendMessage(message) {
    if (!checkAuth()) return;

    const sendBtn = document.getElementById('sendBtn');
    const input = document.getElementById('messageInput');

    sendBtn.disabled = true;
    input.disabled = true;

    // Add user message to chat
    addMessage(message, true);

    // Show typing indicator
    showTypingIndicator();

    try {
        console.log('Sending request to:', `${API_BASE_URL}/api/Chat/ask`);
        console.log('Request body:', JSON.stringify({ message: message }));

        const response = await fetch(`${API_BASE_URL}/api/Chat/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ message: message })
        });

        console.log('Response status:', response.status);

        // Try to get response body for debugging
        const responseText = await response.text();
        console.log('Response body:', responseText);

        removeTypingIndicator();

        if (response.status === 401) {
            Toast.error('Session expired. Please login again.');
            localStorage.removeItem('jwtToken');
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 1500);
            return;
        }

        if (response.status === 400) {
            addMessage('Please enter a valid message to get fitness advice.');
            return;
        }

        if (response.status === 404) {
            // Parse the error message from response
            let errorMsg = 'Your profile is incomplete.';
            try {
                const errorData = JSON.parse(responseText);
                errorMsg = errorData.message || errorData.title || responseText;
            } catch (e) {
                errorMsg = responseText || errorMsg;
            }
            console.log('404 Error details:', errorMsg);
            addMessage(`Error: ${errorMsg}. Please make sure your profile has age, weight, and height.`);
            Toast.warning('Profile issue detected.');
            return;
        }

        if (!response.ok) {
            throw new Error(responseText || 'Failed to get response');
        }

        // Parse the successful response
        const data = JSON.parse(responseText);
        addMessage(data.response);

    } catch (error) {
        removeTypingIndicator();
        addMessage(`Sorry, I encountered an error. Please try again later.`);
        console.error('Chat error:', error);
    } finally {
        sendBtn.disabled = false;
        input.disabled = false;
        input.focus();
    }
}

// Handle form submission
function initChatForm() {
    const chatForm = document.getElementById('chatForm');

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (message) {
            sendMessage(message);
            input.value = '';
        }
    });
}

// Handle suggestion buttons
function initSuggestionButtons() {
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const question = this.getAttribute('data-question');
            const input = document.getElementById('messageInput');
            input.value = question;
            sendMessage(question);
            input.value = '';
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
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

    // Initialize chat functionality
    initChatForm();
    initSuggestionButtons();

    // Focus on input
    document.getElementById('messageInput').focus();
});
