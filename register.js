const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const age = parseInt(document.getElementById("age").value);
    const gender = parseInt(document.getElementById("gender").value);

    if (username.length < 3) {
        alert("Username must be at least 3 letters");
        e.preventDefault();
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email");
        e.preventDefault();
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        e.preventDefault();
        return;
    }

    if (isNaN(weight) || weight <= 0) {
        alert("Please enter a valid weight (must be > 0)");
        e.preventDefault();
        return;
    }

    if (isNaN(height) || height <= 0) {
        alert("Please enter a valid height (must be > 0)");
        e.preventDefault();
        return;
    }

    if (isNaN(age) || age <= 1) {
        alert("Please enter a valid age (must be > 1)");
        e.preventDefault();
        return;
    }

    if (!gender || isNaN(gender)) {
        alert("Please select your gender");
        e.preventDefault();
        return;
    }

    try {
        const payload = {
            userName: username,
            email: email,
            password: password,
            weight: weight,
            height: height,
            age: age,
            gender: gender
        };

        console.log("Sending Registration Payload:", payload);

        const response = await fetch("https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net/api/Authentication/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            //store email for verification page
            localStorage.setItem('pendingVerificationEmail', email);

            //redirect to verification page
            window.location.href = `verification-sent.html?email=${encodeURIComponent(email)}`;
        } else {
            const errorData = await response.json().catch(() => ({}));
            alert(errorData.message || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.log(error);
    }
});
