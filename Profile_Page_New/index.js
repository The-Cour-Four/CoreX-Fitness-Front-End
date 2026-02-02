/* Profile page script
   - Fetches user info on load (requires JWT in localStorage 'jwtToken')
   - Populates form fields and enables editing
   - Submits updates to the backend, sending Authorization header when present
*/

const form = document.getElementById('profile-form');
const submitBtn = form?.querySelector('.btn-submit');
const btnText = submitBtn?.querySelector('.btn-text');
const btnLoader = submitBtn?.querySelector('.btn-loader');

function setSubmitLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    if (btnText) btnText.textContent = isLoading ? 'Updating...' : 'Update Profile';
    if (btnLoader) btnLoader.classList.toggle('hidden', !isLoading);
}

function disableForm(disabled = true) {
    form.querySelectorAll('input, button, select, textarea').forEach(el => el.disabled = disabled);
}

async function initProfile() {
    disableForm(true);
    Loading.show();
    try {
        const user = await window.Auth.fetchUserInfo();
        // populate fields
        document.getElementById('username').value = user.name || '';
        document.getElementById('current-email').value = user.email || '';
        // new email left empty for user to enter
        document.getElementById('age').value = user.age ?? '';
        document.getElementById('weight').value = user.weight ?? '';
        document.getElementById('height').value = user.height ?? '';

        disableForm(false);
    } catch (err) {
        console.error('Failed loading profile:', err);
        if (err.message === 'No token') {
            Toast.error('Session expired. Please log in.');
            window.Auth.clearToken();
            setTimeout(() => window.location.href = '/index.html', 800);
            return;
        }
        Toast.error(err.message || 'Unable to load profile');
    } finally {
        Loading.hide();
    }
}

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const username = document.getElementById('username').value.trim();
    const newEmail = document.getElementById('new-email').value.trim();
    const currentEmail = document.getElementById('current-email').value.trim();
    const age = Number(document.getElementById('age').value.trim());
    const weight = Number(document.getElementById('weight').value.trim());
    const height = Number(document.getElementById('height').value.trim());
    const currentPassword = document.getElementById('current-password').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (newPassword && newPassword !== confirmPassword) {
        Toast.error('New password and confirm password do not match');
        setSubmitLoading(false);
        return;
    }

    try {
        // Optional: verify current password if provided
        if (currentPassword) {
            const pwdResp = await fetch('https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net/api/Authentication/PasswordChecker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ PasswordChecker: currentPassword, CurrentEmail: currentEmail })
            });
            if (!pwdResp.ok) {
                Toast.error('Current password verification failed');
                setSubmitLoading(false);
                return;
            }
        }

        const token = window.Auth.getToken();
        const res = await fetch('https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net/api/Authentication/updateUserInformation', {
            method: 'POST',
            headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { 'Authorization': `Bearer ${token}` } : {}),
            body: JSON.stringify({
                userName: username,
                currentEmail: currentEmail,
                email: newEmail || currentEmail,
                age: Number.isFinite(age) ? parseInt(age) : null,
                weight: Number.isFinite(weight) ? parseFloat(weight) : null,
                height: Number.isFinite(height) ? parseFloat(height) : null,
                password: newPassword || undefined
            })
        });

        if (res.ok) {
            Toast.success('Details changed successfully');
        } else {
            const err = await res.json().catch(() => ({}));
            Toast.error(err.message || 'Update failed');
        }
    } catch (err) {
        console.error(err);
        Toast.error('Connection error');
    } finally {
        setSubmitLoading(false);
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', initProfile);
