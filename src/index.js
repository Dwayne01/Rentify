import './css/styles.css'
import {initializeApp} from 'firebase/app'

const container = document.querySelector('#container')
console.log(container)

handburgerMenu.addEventListener('click', () => {
  console.log('here')
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

initializeApp(firebaseConfig)

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
