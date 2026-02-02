/**
 * CoreX Fitness - AI Exercise Planner
 * Handles exercise recommendation generation based on user goals
 */

const API_BASE_URL = 'https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net';

let selectedGoal = null;
let selectedLevel = null;

// Get JWT token from localStorage
function getToken() {
    return localStorage.getItem('jwtToken');
}

// Check authentication
function checkAuth() {
    const token = getToken();
    if (!token) {
        Toast.warning('Please login first to get exercise recommendations.');
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 1500);
        return false;
    }
    return true;
}

// Handle option selection
function setupOptionButtons() {
    // Goal options
    document.querySelectorAll('#goalOptions .option-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('#goalOptions .option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedGoal = this.getAttribute('data-value');
            updateGenerateButton();
        });
    });

    // Level options
    document.querySelectorAll('#levelOptions .option-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('#levelOptions .option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedLevel = this.getAttribute('data-value');
            updateGenerateButton();
        });
    });
}

// Update generate button state
function updateGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = !(selectedGoal && selectedLevel);
}

// Show loading state
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (show) {
        loadingOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        loadingOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Generate exercise plan
async function generatePlan() {
    if (!checkAuth()) return;
    if (!selectedGoal || !selectedLevel) return;

    const generateBtn = document.getElementById('generateBtn');

    // Show loading
    generateBtn.querySelector('.btn-text').style.display = 'none';
    generateBtn.querySelector('.btn-loader').style.display = 'inline-flex';
    generateBtn.disabled = true;
    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/Exercise/recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                fitnessGoal: selectedGoal,
                fitnessLevel: selectedLevel
            })
        });

        if (response.status === 401) {
            Toast.error('Session expired. Please login again.');
            localStorage.removeItem('jwtToken');
            setTimeout(() => {
                window.location.href = '../../index.html';
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
            throw new Error(errorText || 'Failed to generate plan');
        }

        const data = await response.json();
        displayResults(data);
        Toast.success('Your personalized plan is ready!');

    } catch (error) {
        console.error('Error:', error);
        Toast.error('Failed to generate plan. Please try again.');
    } finally {
        generateBtn.querySelector('.btn-text').style.display = 'inline';
        generateBtn.querySelector('.btn-loader').style.display = 'none';
        generateBtn.disabled = false;
        showLoading(false);
    }
}

// Display results
function displayResults(data) {
    document.getElementById('selectionCard').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';

    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Plan Summary
    const planSummary = document.getElementById('planSummary');
    planSummary.innerHTML = `
        <div class="summary-item">
            <div class="label">Goal</div>
            <div class="value">${capitalizeWords(data.fitnessGoal || selectedGoal)}</div>
        </div>
        <div class="summary-item">
            <div class="label">Level</div>
            <div class="value">${capitalizeWords(data.fitnessLevel || selectedLevel)}</div>
        </div>
        <div class="summary-item">
            <div class="label">Frequency</div>
            <div class="value">${data.weeklyFrequency || '3-4x/week'}</div>
        </div>
        <div class="summary-item">
            <div class="label">Duration</div>
            <div class="value">${data.estimatedDuration || '30-45 min'}</div>
        </div>
    `;

    // Exercises Grid
    const exercisesGrid = document.getElementById('exercisesGrid');
    exercisesGrid.innerHTML = '';

    if (data.exercises && data.exercises.length > 0) {
        data.exercises.forEach((exercise, index) => {
            const difficulty = (exercise.difficulty || 'medium').toLowerCase();
            const difficultyClass = difficulty === 'easy' ? 'easy' : difficulty === 'hard' ? 'hard' : 'medium';

            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.innerHTML = `
                <h3>
                    <span class="exercise-number">${index + 1}</span>
                    ${escapeHtml(exercise.name)}
                </h3>
                <p>${escapeHtml(exercise.description)}</p>
                <div class="exercise-meta">
                    <span class="meta-tag">🎯 ${escapeHtml(exercise.muscleGroup)}</span>
                    <span class="meta-tag">📊 ${exercise.sets} sets × ${exercise.reps} reps</span>
                    <span class="difficulty-tag ${difficultyClass}">${exercise.difficulty || 'Medium'}</span>
                </div>
            `;
            exercisesGrid.appendChild(card);
        });
    } else {
        exercisesGrid.innerHTML = '<p class="no-exercises">No exercises found. Please try again.</p>';
    }

    // Tips Section
    const tipsSection = document.getElementById('tipsSection');
    tipsSection.innerHTML = `
        <h3>💡 Tips & Recommendations</h3>
        <p>${escapeHtml(data.additionalTips || 'Remember to warm up before exercising and cool down afterward. Stay hydrated and listen to your body. Consistency is key to achieving your fitness goals!')}</p>
    `;
}

// Helper functions
function capitalizeWords(str) {
    if (!str) return '';
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Reset form
function resetForm() {
    selectedGoal = null;
    selectedLevel = null;

    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('selectionCard').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Setup functionality
    setupOptionButtons();

    document.getElementById('generateBtn').addEventListener('click', generatePlan);
    document.getElementById('newPlanBtn').addEventListener('click', resetForm);
});
