document.getElementById('loginBtn').addEventListener('click', function () {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Predefined login credentials
    
    const ohs = { phone: 'ccdc10x', password: 'ccdc10x', redirectUrl: 'ohs.html' };

    // Validate login
    if (phoneNumber === ohs.phone && password === ohs.password) {
        window.location.href = accident.redirectUrl;
    } else {
        errorMessage.textContent = 'Invalid phone number or password';
    }
});
