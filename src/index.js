import 'regenerator-runtime/runtime.js'
import './css/styles.css'
import './css/home.css'
import './css/index.css'
import './css/watchlist.css'
import './css/singleListing.css'
import './css/createListing.css'
import './css/rentalRequest.css'
import './css/yourlisting.css'
import './pages/home.html'
import './pages/profile.html'
import './pages/watchlist.html'
import './pages/updateProfile.html'
import './pages/singleListing.html'
import './pages/listing.html'
import './pages/createListing.html'
import './pages/rentalRequest.html'
import './pages/yourListings.html'
import './js/contact'
import './js/auth'
import './js/updateProfile'
import './js/home'
import './js/watchlist'
import './js/singleListing'
import './js/listing'
import './js/createListing.js'
import './js/quote.js'
import './js/rentalRequest.js'
import './js/yourlisting.js'

import {initializeApp} from 'firebase/app'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getUserProfile} from './js/user'

let state = {
  user: null,
  isLoggedIn: false,
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
const footer = document.querySelector('#footer')

const noSearchHeader = document.querySelector('.header-no-search')

if (footer) {
  footer.innerHTML = `
    <p>&#xa9; 2021, Rently
    </p>
    `
}
if (header) {
  header.innerHTML = `
<div class="header">
    <div class="logo">
        <a href="/home.html"><img src="../images/logo.png" alt="logo" /></a>
    </div>
    <div class="profile-section">
    <a href="/createListing.html">
          <i class="fas fa-plus-square"></i>
          Create Listing
    </a>
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
                <a href="./profile.html">
                  <div class="menu-icon">
                      <i class="fas fa-user"></i>
                  </div>
                  <span class="menu-title">
                      Profile
                  </span>
                </a>
              </li>
              <li>
                  <a href="/yourListings.html">
                      <div class="menu-icon">
                         <i class="fas fa-stream"></i>
                      </div>
                      <span class="menu-title">
                        Your Listing
                      </span>
                  </a>
              </li>
              <li>
                  <a href="/rentalRequest.html">
                      <div class="menu-icon">
                          <i class="fas fa-eye"></i>
                      </div>
                      <span class="menu-title">
                        Your Requests
                      </span>
                  </a>
              </li>
              <li>
                  <a href="/watchlist.html">
                      <div class="menu-icon">
                        <i class="fas fa-star"></i>
                      </div>
                      <span class="menu-title">
                        Watchlist
                      </span>
                  </a>
              </li>
              <li>
                  <a id="logout" href="">
                      <div class="menu-icon">
                        <i class="fas fa-sign-out-alt"></i>
                      </div>
                      <span class="menu-title">
                        Logout
                      </span>
                  </a>
              </li>
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
  <a href="./profile.html">
    <div class="menu-icon">
        <i class="fas fa-user"></i>
    </div>
    <span class="menu-title">
        Profile
    </span>
  </a>
</li>
<li>
    <a href="/yourListings.html">
        <div class="menu-icon">
          <i class="fas fa-stream"></i>
        </div>
        <span class="menu-title">
          Your Listing
        </span>
    </a>
</li>
<li>
    <a href="/rentalRequest.html">
        <div class="menu-icon">
          <i class="fas fa-eye"></i>
        </div>
        <span class="menu-title">
          Your Requests
        </span>
    </a>
</li>
<li>
    <a href="/watchlist.html">
        <div class="menu-icon">
            <i class="fas fa-star"></i>
        </div>
        <span class="menu-title">
          Watchlist
        </span>
    </a>
</li>
<li>
    <a id="logout" href="">
        <div class="menu-icon">
          <i class="fas fa-sign-out-alt"></i>
        </div>
        <span class="menu-title">
          Logout
        </span>
    </a>
</li>
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

const search = document.getElementById('search')

search && search.addEventListener('blur', () => {
  console.log(search.ariaValueMax, 'i work')
})

search && search.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const filteredProducts = state.products.filter((data) => {
      if (data.itemName.toLocaleLowerCase().split(' ')
        .includes(search.value.toLocaleLowerCase())) {
        return data
      }
    })

    console.log(filteredProducts)
  }
})

window.stopLoader = function () {
  loader.style.display = 'none'
}

window.startLoader = function () {
  loader.style.display = 'block'
}

const localState = localStorage.getItem('state')

if (localState) {
  state = JSON.parse(localState)
}

window.onload = function () {
  const auth = getAuth()

  if (window.location.pathname === '/') {
    auth.signOut().then(() => {
      state = {}
      localStorage.clear()
      console.log('Logged out!')
    })
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid
      state.user = uid
      state.email = user.email
      const profile = await getUserProfile(uid)
      state.userProfile = profile

      if (!state.isLoggedIn) {
        state.isLoggedIn = true
        localStorage.setItem('state', JSON.stringify(state))
        window.location.href = profile.isProfileUpdated ?
          '/home.html' : '/updateProfile.html'
      }
    } else {
      if (state.isLoggedIn) {
        window.location.href = '/'
      }

      if (!state.isLoggedIn && window.location.pathname !== '/') {
        window.location.href = '/'
      }

      state = {}
      localStorage.setItem('state', '')

      console.log('is not logged in')
    }
  })
}

if (profilePic) {
  const userInfo = state.userProfile
  fullName.innerText = userInfo.firstName ?
    `${userInfo.firstName} ${userInfo.lastName}` : ''
  email.innerText = state.email
  profilePic.src = userInfo.profileImg
  initials.innerHTML = userInfo.firstName[0] + userInfo.lastName[0]
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

const firebaseApp = initializeApp(firebaseConfig)
state.firestore = firebaseApp
