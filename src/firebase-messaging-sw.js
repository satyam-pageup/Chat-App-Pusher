importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCO9c-bHNkZLUQeStyQS3B_FdU9Ae6W2C0",
    authDomain: "quickchat-8b689.firebaseapp.com",
    projectId: "quickchat-8b689",
    storageBucket: "quickchat-8b689.appspot.com",
    messagingSenderId: "982998485573",
    appId: "1:982998485573:web:5905fab3218b835412f12c",
    measurementId: "G-ZLZ8HHMJCX"
});
const messaging = firebase.messaging();

// messaging.onBackgroundMessage(payload => {
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: "New Message",
//         icon: '/firebase-logo.png'
//     };

//     return self.registration.showNotification(notificationTitle, notificationOptions);
// });

////Code for adding event on click of notification
// self.addEventListener('notificationclick', function (event) {
//     console.log("notificationclick");
//     var urlToRedirect = "https://www.google.com";
//     event.notification.close();
//     event.waitUntil(self.clients.openWindow(urlToRedirect));
// });
