// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6xUW1zybVQ5l2YPx0JkyuEqp6sTRHDYg",
    authDomain: "classquest-675af.firebaseapp.com",
    databaseURL: "https://classquest-675af.firebaseio.com",
    projectId: "classquest-675af",
    storageBucket: "classquest-675af.appspot.com",
    messagingSenderId: "9106053072",
    appId: "1:9106053072:web:fbe01359e1f31555c64bd5"
};

firebase.initializeApp(firebaseConfig);
// Firestore initialization
const db = firebase.firestore();