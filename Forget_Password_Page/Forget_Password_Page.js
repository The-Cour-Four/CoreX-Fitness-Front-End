const form = document.querySelector("form");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    
    if (newPassword.length < 6) {
        alert("New password must be at least 6 characters");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await fetch("https://corex-fitness-backend-btcjekajg6a2a7ex.francecentral-01.azurewebsites.net/api/Authentication/forgotPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                newPassword: newPassword
            })
        });

        if (response.ok) {
            alert("Password changed successfully!");
            window.location.href = "Profile_Page.html";
        } 
        
        else {
            alert("Failed to change password. Please try again.");
        }
    } 
    
    catch (error) {
        console.error(error);
        alert("An error occurred while changing password.");
    }

});

