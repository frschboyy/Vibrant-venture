document.getElementById('contact-form').addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const data = {
        name: name,
        email: email,
        message: message
    };

    const response = await fetch('/contactus-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    const res = await response.json();

    if (response.status === 201) {
        alert(`Inquiry sent!\n${res.message}`);
        // window.location.href = '/success-page';
    } else {
        alert(`Failed to send inquiry account.\n${res.message}`);
    }
});