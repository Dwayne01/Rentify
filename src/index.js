import 'regenerator-runtime/runtime.js'
import './css/styles.css'
import './css/index.css'
import './css/home.css'
import './css/watchlist.css'
import './css/singleListing.css'
import './pages/home.html'
import './pages/watchlist.html'
import './pages/updateProfile.html'
import './pages/singleListing.html'
import './js/contact'
import './js/auth'
import './js/updateProfile'
import './js/home'
import './js/watchlist'
import './js/singleListing'

import {initializeApp} from 'firebase/app'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getUserProfile} from './js/user'

let state = {
  user: null,
  isLoggedIn: false,
}

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
const header = document.querySelector('.homepage-head')
const noSearchHeader = document.querySelector('.header-no-search')

if (header) {
  header.innerHTML = `
<div class="header">
    <div class="logo">
        <a href="/home.html"><img src="../images/logo.png" alt="logo" /></a>
    </div>
    <div class="custom-search-cont">
        <span class="search">
            <i class="fas fa-search"></i>
        </span>
        <input type="search" name="search" id="search">
        <span>
            <i class="fas fa-filter"></i>
        </span>
    </div>
    <div class="profile-section">
        <img alt="profile" id="profile-image" tabindex="0" />
        <div class="menu hidemenu">
            <ul id="menu-list">
                <li>
                    <div class="initials"></div>
                    <span class="user-name">
                        <div class="menu-name"></div>
                        <div class="menu-email"></div>
                    </span>
                </li>
                <li>
                    <div class="menu-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <span class="menu-title">
                        <a href="">Profile</a>
                    </span>
                </li>
                <li>
                    <div class="menu-icon">
                        <i class="fas fa-plus-square"></i>
                    </div>
                    <span class="menu-title">
                        <a href="">Create Listing</a>
                    </span>
                </li>
                <a href="/watchlist.html">
                    <li>
                        <div class="menu-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <span class="menu-title">
                        Watchlist
                        </span>
                    </li>
                </a>
                <a id="logout" href="">
                    <li>
                        <div class="menu-icon">
                            <i class="fas fa-sign-out-alt"></i>
                        </div>
                        <span class="menu-title">
                            Logout
                        </span>
                    </li>
                </a>
            </ul>
        </div>
    </div>
</div>
`
}

if (noSearchHeader) {
  noSearchHeader.innerHTML = `
<div class="header">
<div class="logo">
    <a href="/home.html"><img src="../images/logo.png" alt="logo" /></a>
</div>

<div class="profile-section">
    <img alt="profile" id="profile-image" tabindex="0" />
    <div class="menu hidemenu">
        <ul id="menu-list">
            <li>
                <div class="initials"></div>
                <span class="user-name">
                    <div class="menu-name"></div>
                    <div class="menu-email"></div>
                </span>
            </li>
            <li>
                <div class="menu-icon">
                    <i class="fas fa-user"></i>
                </div>
                <span class="menu-title">
                    <a href="">Profile</a>
                </span>
            </li>
            <li>
                <div class="menu-icon">
                    <i class="fas fa-plus-square"></i>
                </div>
                <span class="menu-title">
                    <a href="">Create Listing</a>
                </span>
            </li>
            <a href="/watchlist.html">
                <li>
                    <div class="menu-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <span class="menu-title">
                    Watchlist
                    </span>
                </li>
            </a>
            <a id="logout" href="">
                <li>
                    <div class="menu-icon">
                        <i class="fas fa-sign-out-alt"></i>
                    </div>
                    <span class="menu-title">
                        Logout
                    </span>
                </li>
            </a>
        </ul>
    </div>
</div>
</div>
`
}
const initials = document.querySelector('.initials')
const fullName = document.querySelector('.menu-name')
const email = document.querySelector('.menu-email')
let isMenuVisible = false
const profilePic = document.getElementById('profile-image')
const menu = document.querySelector('.menu')

profilePic && profilePic.addEventListener('click', () => {
  menu.classList.toggle('showmenu')
  menu.classList.toggle('hidemenu')
  isMenuVisible = !isMenuVisible
})

profilePic && profilePic.addEventListener('blur', () => {
  if (isMenuVisible) {
    menu.classList.toggle('hidemenu')
    isMenuVisible = false
  }
})

window.stopLoader = function () {
  loader.style.display = 'none'
}

window.startLoader = function () {
  loader.style.display = 'block'
}

window.onload = function () {
  const auth = getAuth()
  state = JSON.parse(localStorage.getItem('state'))

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid
      state.user = uid
      state.email = user.email
      state.userProfile = await getUserProfile(uid)

      if (!state.isLoggedIn) {
        console.log({state})
        state.isLoggedIn = true
        localStorage.setItem('state', JSON.stringify(state))
        window.location.href = '/home.html'
      }
    } else {
      window.location.href = '/'
      state = {}
      localStorage.setItem('state', '')

      console.log('is not logged in')
    }
  })

  if (profilePic) {
    const userInfo = state.userProfile
    fullName.innerText = `${userInfo.firstName} ${userInfo.lastName}`
    email.innerText = state.email
    profilePic.src = userInfo.profileImg
    initials.innerHTML = userInfo.firstName[0] + userInfo.lastName[0]
  }
}

const firebaseApp = initializeApp(firebaseConfig)
state.firestore = firebaseApp
