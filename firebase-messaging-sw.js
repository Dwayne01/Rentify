// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js')
// importScripts('/__/firebase/init.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'apiKey': 'AIzaSyBE8v8vX6rs26RYCjgbPZo6_c8JtKTYlCc',
  'authDomain': 'rentify-a0716.firebaseapp.com',
  'projectId': 'rentify-a0716',
  'storageBucket': 'rentify-a0716.appspot.com',
  'messagingSenderId': '231540006222',
  'appId': '1:231540006222:web:64129138773c1af280521f',
  'measurementId': 'G-NEC080LHGV',
  'databaseURL': 'https://rentify-a0716-default-rtdb.firebaseio.com/',
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.messaging()
