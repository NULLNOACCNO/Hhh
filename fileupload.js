importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyD8Zj0H9tJ7oC1MjcM0JKhh4n_bCHJx7BY",
    authDomain: "myapp-116ff.firebaseapp.com",
    projectId: "myapp-116ff",
    storageBucket: "myapp-116ff.firebasestorage.app",
    messagingSenderId: "613143540780",
    appId: "1:613143540780:web:71fa41e13178a7ee36cd89",
    measurementId: "G-97DM8QJ75G"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('Received background message ', payload);
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
