const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = form?.querySelector(".btn-submit");
const btnText = submitBtn?.querySelector(".btn-text");
const btnLoader = submitBtn?.querySelector(".btn-loader");

const togglePasswordBtn = document.querySelector(".toggle-password");
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", function() {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.querySelector(".eye-icon").textContent = type === "password" ? "" : "";
        this.setAttribute("aria-label", type === "password" ? "Show password" : "Hide password");
    });
}

function validateField(input, type) {
    const value = input.value.trim();
    const errorSpan = document.getElementById(`${input.id}-error`);
    let error = "";
    
    if (!value) {
        error = "This field is required";
    } else if (type === "username" && value.length < 3) {
        error = "Username must be at least 3 characters";
    } else if (type === "email" && (!value.includes("@") || !value.includes("."))) {
        error = "Please enter a valid email address";
    } else if (type === "password" && value.length < 6) {
        error = "Password must be at least 6 characters";
    }
    
    if (errorSpan) {
        errorSpan.textContent = error;
    }
    
    if (error) {
        input.style.borderColor = "#ef4444";
        return false;
    } else {
        input.style.borderColor = "#10b981";
        return true;
    }
}

usernameInput?.addEventListener("blur", () => validateField(usernameInput, "username"));
emailInput?.addEventListener("blur", () => validateField(emailInput, "email"));
passwordInput?.addEventListener("blur", () => validateField(passwordInput, "password"));

[usernameInput, emailInput, passwordInput].forEach(input => {
    input?.addEventListener("input", () => {
        const errorSpan = document.getElementById(`${input.id}-error`);
        if (errorSpan) errorSpan.textContent = "";
        input.style.borderColor = "";
    });
});

function setLoading(isLoading) {
    if (submitBtn) {
        submitBtn.disabled = isLoading;
        if (btnText) btnText.textContent = isLoading ? "Logging in..." : "Login";
        if (btnLoader) btnLoader.classList.toggle("hidden", !isLoading);
    }
}

form?.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    const isUsernameValid = validateField(usernameInput, "username");
    const isEmailValid = validateField(emailInput, "email");
    const isPasswordValid = validateField(passwordInput, "password");
    
    if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
        Toast.error("Please fix the errors above");
        return;
    }
    
    setLoading(true);
    
    try {
        const response = await fetch("https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net/api/Authentication/Login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Login response data:', data);
            // Store JWT token for authenticated API calls
            // Check common token field names from backend
            const token = data.token || data.Token || data.accessToken || data.access_token || data.jwt;
            if (token) {
                localStorage.setItem('jwtToken', token);
                console.log('JWT Token stored successfully');
            } else {
                console.warn('No token found in response. Response keys:', Object.keys(data));
            }
            Toast.success("Login successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "Home_and_Choose_Us_Page/index.html";
            }, 1500);
        } else {
            const errorData = await response.json().catch(() => ({}));
            Toast.error(errorData.message || "Invalid username or password!");
        }
    } catch (error) {
        console.error("Login error:", error);
        Toast.error("Connection error. Please try again.");
    } finally {
        setLoading(false);
    }
});
