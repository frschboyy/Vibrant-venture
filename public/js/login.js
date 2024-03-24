document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        email: email,
        password: password
    };

    const response = await fetch('/login-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();

    if (response.status === 200) {
        alert(`Login successfull!\n${res.message}`);
        window.location.href = '/'
    } else {
        alert(`Failed to login.\n${res.message}`);
    }
});