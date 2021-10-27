import 'regenerator-runtime/runtime.js'
import './css/styles.css'
import './css/index.css'
import './css/home.css'
import './css/watchlist.css'
import './pages/home.html'
import './pages/watchlist.html'
import './pages/updateProfile.html'
import './js/contact'
import './js/auth'
import './js/updateProfile'
import './js/home'
import './js/watchlist'

import {initializeApp} from 'firebase/app'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getFirestore} from '@firebase/firestore'
import {getUserProfile} from './js/user'

const state = {
  user: null,
}

window.state = state

const firebaseConfig = {
  apiKey: 'AIzaSyBE8v8vX6rs26RYCjgbPZo6_c8JtKTYlCc',
  authDomain: 'rentify-a0716.firebaseapp.com',
  projectId: 'rentify-a0716',
  storageBucket: 'rentify-a0716.appspot.com',
  messagingSenderId: '231540006222',
  appId: '1:231540006222:web:64129138773c1af280521f',
  measurementId: 'G-NEC080LHGV',
  databaseURL: 'https://rentify-a0716-default-rtdb.firebaseio.com/',
}

if (module.hot) {
  module.hot.accept()
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', {scope: '.'})
    .then((register) => {
      console.log('Service worker registerd!', register)
    }).catch(() => {
      console.log('Service worker failed!')
    })
}

const loader = document.getElementById('loading')

console.log({loader})

window.stopLoader = function () {
  loader.style.display = 'none'
}

window.startLoader = function () {
  loader.style.display = 'block'
}

window.onload = function () {
  const auth = getAuth()
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid
      window.state.user = uid
      window.state.email = user.email
      window.state.userProfile = await getUserProfile(uid)
      if (!window.state.user) {
        window.location.href = '/home.html'
        console.log('is logged in', userProfile)
      }
    } else {
      if (window.state.isLoggedIn) {
        window.location.href = '/'
        window.state.user = {}
      }
      console.log('is not logged in')
    }
  })
}

const firebaseApp = initializeApp(firebaseConfig)
window.state.firestore = firebaseApp
window.state.db = getFirestore()
// const storage = getStorage(firebaseApp)
// window.state.storage = storage
