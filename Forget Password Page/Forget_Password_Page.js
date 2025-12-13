const form = document.querySelector("form");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

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
        const response = await fetch("https://192.168.1.101:7019/api/Authentication/ChangePassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                // here for new password
                // here for confirm password
            })
        });

        if (response.ok) {
            alert("Password changed successfully!");
            window.location.href = "login Page.html"; 
        } else {
            alert("Failed to change password. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while changing password.");
    }
});
