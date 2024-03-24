
document.getElementById('signup-form').addEventListener('submit', async e => {
    e.preventDefault();

    const fName = document.getElementById('fName').value;
    const lName = document.getElementById('lName').value;
    const uName = document.getElementById('uName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Name Validation
    if (!validateName(fName)) {
        alert("Invalid First Name");
        return;
    }
    if (!validateName(lName)) {
        alert("Invalid Last Name");
        return;
    }

    // Email validation
    if (!validateEmail(email)) {
        alert("Enter valid email address");
        return;
    }

    // Password Strength
    if (!validatePassword(password)) {
        alert("Password is week!");
        return;
    }


    const data = {
        fName: fName,
        lName: lName,
        uName: uName,
        email: email,
        password: password
    };

    const response = await fetch('/signup-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();

    if (response.status === 201) {
        alert(`Account created successfully!\n${res.message}`);
        window.location.href = '/login';
    } else {
        alert(`Failed to create account.\n${res.message}`);
    }

});


function validateName(name) {
    // Check for number or special characters
    const regEx = /[0-9!@#$%^&*()_+={}[\]|\\:;"'<>.,?/~`]/;
    return !regEx.test(name)
}
function validateEmail(email) {
    // Validate email input
    const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regEx.test(email);
}

function validatePassword(password) {
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    return regex.test(password)
}