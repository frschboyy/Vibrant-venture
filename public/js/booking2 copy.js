document.getElementById('travel-form').addEventListener('submit', async e => {
    e.preventDefault();

    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    const flightType = document.getElementById('flight-type').value;
    const hotelType = document.getElementById('hotel').value;
    const travelOption = document.getElementById('travel').value;
    const service = document.getElementById('service').value;
    const requestMessage = document.getElementById('special-requests').value;

    // Convert string dates to Date objects with the same format
    const dDate = new Date(departureDate);
    const rDate = new Date(returnDate);

    // Find current date
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());

    // Date validation
    if (dDate <= currentDate) {
        alert("Departure date must be at least one day after the current date.");
        return;
    }
    if (rDate <= dDate) {
        alert("return date must be at least one day after the departure date.");
        return;
    }

    async function handleBookingRequest() {
        try {
            const bookingData = {
                depDate: departureDate,
                retDate: returnDate,
                fltType: flightType,
                hotType: hotelType,
                travOpt: travelOption,
                service: service,
                reqMess: requestMessage
            };

            const response = await fetch('/booking-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                const res = await response.json();
                if (res.existingBookings) {
                    const choice = await displayOptionsToUser()

                    if (choice === 'delete') {
                        // Confirmation before deleting existing bookings
                        if (confirm('Are you sure you want to delete all your existing bookings?')) {
                            const deleteResponse = await fetch('/booking-data/delete', {
                                method: 'DELETE',
                            });
                            if (deleteResponse.ok) {
                                alert('Existing bookings deleted. Please submit new booking')
                            }
                            else {
                                alert('Error deleting bookings! Try again.')
                            }
                        }
                    } else if (choice === 'rescind') {
                        document.getElementById('travel-form').reset();
                        window.location.href = '/reports';
                    }
                    else {

                    }
                } else {
                    alert('Booking submitted successfully!');
                }
            } else {
                alert(`Failed to book trip.\n${res.message}`);
            }
        } catch {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }
    
    handleBookingRequest(); 
});

function displayOptionsToUser() {
    const choice = prompt("You already have existing bookings. What would you like to do?\n1. Delete Previous Booking\n2. Add New Booking\n3. Rescind This Booking");

    if (choice === null) {
        return null; // User closed the prompt without selecting
    }

    const choiceNumber = parseInt(choice); // Convert user input to number

    if (isNaN(choiceNumber) || choiceNumber < 1 || choiceNumber > 3) {
        alert("Invalid choice. Please select a valid option (1-3).");
        return null; // Handle invalid input
    }

    switch (choiceNumber) {
        case 1:
            return "delete";
        case 2:
            return "add";
        case 3:
            return "rescind";
    }
}