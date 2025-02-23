// Register function
function register() {
    const username = document.getElementById("registerUser").value;
    const password = document.getElementById("registerPass").value;
    const registerMessage = document.getElementById("registerMessage");

    if (username === "" || password === "") {
        registerMessage.innerText = "Please enter a username and password";
        registerMessage.style.color = "red";
        return;
    }

    // Store user credentials in localStorage
    localStorage.setItem("user_" + username, password);
    registerMessage.innerText = "Registration successful! You can now login.";
    registerMessage.style.color = "green";
}

// Login function
function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;
    const loginMessage = document.getElementById("loginMessage");

    // Retrieve stored password
    const storedPassword = localStorage.getItem("user_" + username);

    if (storedPassword && storedPassword === password) {
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("loggedInUser", username);
        window.location.href = "secure.html"; // Redirect to secured page
    } else {
        loginMessage.innerText = "Invalid username or password";
        loginMessage.style.color = "red";
    }
}

// Check if user is authenticated
function checkAuth() {
    if (localStorage.getItem("authenticated") !== "true") {
        window.location.href = "login.html"; // Redirect to login if not authenticated
    }
}

// Logout function
function logout() {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html"; // Redirect to login page
}
