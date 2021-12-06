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

console.log('whine me?')

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.
  onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ',
      payload)
    // Customize notification here
    const notificationTitle = 'Background Message Title'
    const notificationOptions = {
      // eslint-disable-next-line max-len
      body: 'You have a new request, check your rental request page for more details',
      icon: '../images/logo.png',
    }

    self.registration.showNotification(notificationTitle,
      notificationOptions)
  })
