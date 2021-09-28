import './css/styles.css'
import './css/index.css'
import './pages/home.html'
import './pages/updateProfile.html'
import './js/contact'
import './js/auth'

import 'regenerator-runtime/runtime.js'
import {initializeApp} from 'firebase/app'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

const state = {
  user: null,
}

window.state = state

const handburgerMenu = document.querySelector('#handburgerMenu')

handburgerMenu && handburgerMenu.addEventListener('click', () => {
  const x = document.getElementById('myLinks')
  if (x.style.display === 'block') {
    x.style.display = 'none'
  } else {
    x.style.display = 'block'
  }
})

const firebaseConfig = {
  apiKey: 'AIzaSyBE8v8vX6rs26RYCjgbPZo6_c8JtKTYlCc',
  authDomain: 'rentify-a0716.firebaseapp.com',
  projectId: 'rentify-a0716',
  storageBucket: 'rentify-a0716.appspot.com',
  messagingSenderId: '231540006222',
  appId: '1:231540006222:web:64129138773c1af280521f',
  measurementId: 'G-NEC080LHGV',
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

window.stopLoader = function () {
  loader.style.display = 'none'
}

window.startLoader = function () {
  loader.style.display = 'block'
}

window.onload = function () {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid
      window.state.user = uid
      console.log(user)
      if (!window.state.user) {
        window.location.href = '/home.html'
        console.log('is logged in', uid)
      }
    } else {
      if (window.state.isLoggedIn) {
        window.location.href = '/'
        window.state.isLoggedIn = false
        window.state.user = null
      }
      console.log('is not logged in')
    }
  })
}

export const app = initializeApp(firebaseConfig)

