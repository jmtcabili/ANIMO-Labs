// Function to handle login
function login() {
    const userId = document.getElementById("user-id").value;
    const password = document.getElementById("password").value;

    // Find user in JSON data
    const user = userData.find(u => u.user_id === userId && u.password === password);
    if (user) {
        // Redirect based on account type
        if (user.acc_type === "student" && userId.startsWith("1")) {
            window.location.href = "/user-profile";
        } else if (user.acc_type === "lab-administrator" && userId.startsWith("9")) {
            window.location.href = "/lab-profile";
        } else {
            alert("Invalid account type for this user ID.");
        }
    } else {
        alert("Invalid user ID or password.");
    }
}

// Add event listener to the login button
document.querySelector("button").addEventListener("click", login);