document.getElementById('form').addEventListener('submit', async e => {
    e.preventDefault();

    const name = document.getElementById('username').value;
    const pass = document.getElementById('pass').value;

    const data = {
        name: name,
        pass: pass
    }

    const response = await fetch('/submit-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const res = await response.json()

    if (response.status === 201) {
        alert(`Good one \n${res.message} `)
    }
    else {
        alert(`Bad one \n${res.message} `)
    }
})