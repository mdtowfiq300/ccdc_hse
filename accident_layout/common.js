document.getElementById('loginBtn').addEventListener('click', function () {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Predefined login credentials
    
    const accident = { phone: 'ccdc10x', password: 'ccdc10x', redirectUrl: 'accident.html' };

    // Validate login
    if (phoneNumber === accident.phone && password === accident.password) {
        window.location.href = accident.redirectUrl;
    } else {
        errorMessage.textContent = 'Invalid phone number or password';
    }
});
