document.getElementById('loginBtn').addEventListener('click', function () {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Predefined login credentials
    const ehs = { phone: 'ccdc10x', password: 'ccdc10x' };

    // Validate login
    if (phoneNumber === ehs.phone && password === ehs.password) {
        // ✅ Save login state
        localStorage.setItem("isLoggedIn", "true");

        // ✅ Determine redirect target
        // If user came from a protected page, go back there
        const redirectUrl = localStorage.getItem("redirectAfterLogin") || "ehs.html";
        localStorage.removeItem("redirectAfterLogin"); // clean up

        window.location.href = redirectUrl;
    } else {
        errorMessage.textContent = 'Invalid phone number or password';
    }
});

