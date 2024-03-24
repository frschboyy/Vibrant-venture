const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccount.json");
const { signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const Initialize = require('firebase/app');
const validator = require('validator');
const bodyParser = require('body-parser');
const filestore = require("session-file-store")(sessions)
const adminkey = "/VdN3d0nRPuxrfhfwDq1oJ4iAWp3eFYpa1lKHT8Lh4fJaGj1M0D"
// const cookieParser
// const { getAuth, createUserWithEmailAndPassword } = require( "firebase/auth");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

const firebaseConfig = {
    apiKey: "AIzaSyCAAK7Bo8367NIO37NLk78LwpnZTqHp0fE",
    authDomain: "vibrantventures-4901a.firebaseapp.com",
    projectId: "vibrantventures-4901a",
    storageBucket: "vibrantventures-4901a.appspot.com",
    messagingSenderId: "639225366262",
    appId: "1:639225366262:web:8a1e0446040d82ceb58ed7",
    measurementId: "G-J1ZBPDPGMZ"
};

// Initialize Firebase
const firebase = Initialize.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(firebase)

app.set('view engine', 'hbs');
app.set('views', 'views')

const oneDay = 1000 * 60 * 60 * 24;

// cookie parser middleware
app.use(cookieParser());

//session middleware
app.use(sessions({
    name: "Sessioonnnnn",
    secret: "8Ge2xLWOImX2HP7R1jVy9AmIT0ZN68oSH4QXIyRZyVqtcl4z1I",
    saveUninitialized: false,
    cookie: { maxAge: oneDay, httpOnly: false },
    resave: false,
    store: new filestore({ logFn: function () { } }),
    path: "./sessions/"
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))

app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.render('homepage');
});

app.get('/home-page', (request, response) => {
    response.render('homepage');
});

app.get('/about-us', (request, response) => {
    response.render('aboutus')
})

// Booking Form page only accessible if user is logged in
app.get('/booking-form', (request, response) => {
    if (request.session.user) {
        response.render('forms')
    } else {
        // response.status(401).json({ message: "You must have an account to access this page." });
        response.redirect('/')
    }
});

// Logout function only works if user is logged in
app.get('/logout', (request, response) => {
    if (request.session.user) {
        request.session.destroy(error => {
            if (error) {
                console.error("Error destroying session:", error);
                response.status(500).json({ message: "Error occurred during logout." });
            } else {
                response.clearCookie('Sessioonnnnn')
                response.redirect('/')
                // response.status(200).json({ message: "logged out." });
            }
        })
    } else {
        response.status(401).json({ message: "N/A: NOT ACCESSIBLE" });
        // response.redirect('/')

    }
});

app.get('/contact-us', (request, response) => {
    response.render('contactus')
})

app.get('/sign-up', (request, response) => {
    response.render('signup')
})

app.get('/login', (request, response) => {
    response.render('login')
})

app.get('/reports', async (request, response) => {
    try {
        // Get User Booking Data from firebase
        const userEmail = request.session.user.email;
        const snapshot = await db.collection('Travel Details').where('user.email', '==', userEmail).get()
        const bookingData = snapshot.docs.map(doc => doc.data());
        response.render('reports', { bookingData })
    } catch (error) {
        console.error('Error during retrieval')
        response.status(500).send('Error retrieving data')
    }
});

app.get(adminkey, async (request, response) => {
    try {
        // Get Booking Data from firebase
        const snapshot = await db.collection('Travel Details').get()
        const bookingData = snapshot.docs.map(doc => doc.data());
        response.render('reports', { bookingData })
    } catch (error) {
        console.error('Error during retrieval')
        response.status(500).send('Error retrieving data')
    }
});

app.post('/signup-data', async (request, response) => {
    try {
        const { fName, lName, uName, email, password } = request.body;

        try {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    const user = userCredential.user
                    const docRef = await db.collection('users').doc(user.uid);
                    delete request.body.password;
                    await docRef.set(request.body)

                    return response.status(201).json({
                        message: 'User inserted succesfully'
                    })

                })

        } catch (error) {
            return response.status(500).json({
                message: 'Error creating user'
            })
        }

        // Add user data to Firestore
        // const userData = request.body;

        // console.log("User signed up successfully with ID: ", docRef.id);
        // response.status(200).json({ message: "User signed up successfully!" });
    } catch (error) {
        console.error("Error During Signup", error);
        if (error.code === 'auth/email-already-in-use') {
            return response.status(400).json({ message: "Email already registered" });
        } else {
            response.status(500).json({ message: "An error occurred during signup. Please try again." });
        }
    }
});

app.post('/login-data', async (request, response) => {
    try {
        const { email, password } = request.body;

        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User logged in:", user.uid, user.email);

        // Set Session Data
        if (user) {
            // request.session.uid = user.id;

            // Personalize information retrieval
            const getUserData = await db.collection('users').doc(user.uid).get();
            const userData = getUserData.data();
            request.session.user = userData;
            request.session.save()

            response.status(200).json({ message: `${userData.fName} ${userData.lName} has logged in` });
        } else {
            return response.status(401).json({ message: "Invalid email or password." });
        }
    } catch (error) {
        console.error("Login Error:", error);
        response.status(500).json({ message: "Error occured suring login. Try again." })
    }
});

app.post('/booking-data', async (request, response) => {
    try {
        const bookingData = request.body;
        const { fName, lName, email } = request.session.user;
        bookingData.user = {
            fName: fName,
            lName: lName,
            email: email
        };

        console.log("Received booking data:", bookingData)

        const docRef = await db.collection('Travel Details').add(bookingData);
        console.log("User booked successfully with ID: ", docRef.id);
        response.status(201).json({ message: "Booking was successfull!" });
    } catch (error) {
        console.error("Error booking:", error);
        response.status(500).json({ message: "Error booking" });
    }
});

// Handle DELETE request to remove a booking
app.delete('/booking-data/:id', async (request, response) => {
    try {
        const userEmail = request.query.userEmail;

        // Array containing references to all bookings by user
        const bookings = db.collection('Travel Details')
        const snapshot = await bookings.where('user.email', '==', userEmail).get()

        // Delete each booking via their reference
        const deleteBooking = snapshot.docs.map(doc => doc.ref.delete())
        await Promise.all(deleteBooking);

        response.json({ message: `Bookings deleted successfully!` });

        const bookingId = request.params.id;
        await db.collection('Travel Details').doc(bookingId).delete();
        response.json({ message: "Booking deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting booking:", error);
        response.status(500).json({ message: "Error deleting booking" });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});