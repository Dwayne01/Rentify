import {getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword} from 'firebase/auth'
import {setDoc, doc} from 'firebase/firestore'
import {getUserProfile} from './user'

const profileImg = 'https://firebasestorage.googleapis.com/v0/b/rentify-a0716.appspot.com/o/profile%2Fprofile.png?alt=media&token=4745cdcf-69f2-468f-9614-558ca99daa59'
const logintbtn = document.querySelector('#form-signin')
logintbtn && logintbtn.addEventListener('submit', (e) => {
  e.preventDefault()
  window.startLoader()

  const email = document.querySelector('#form-signin #email').value
  const password = document.querySelector('#form-signin #password').value
  if (!email || !password) {
    window.stopLoader()
    return
  }

  const auth = getAuth()
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user
      window.state.user = user.uid
      window.state.email = user.email
      window.state.isLoggedIn = true
      const userInfo = await getUserProfile(user.uid)
      window.state.userProfile = userInfo
      console.log(user.email)
      window.location.href = userInfo.isProfileUpdated ? '/home.html' :
        '/updateProfile.html'
      window.stopLoader()
    })
    .catch((error) => {
      console.log(error.message, error.code)
      window.stopLoader()
    })
})

const signupbtn = document.querySelector('#form-signup')

signupbtn && signupbtn.addEventListener('submit', (e) => {
  e.preventDefault()

  window.startLoader()

  const email = document.querySelector('#form-signup #email').value
  const password = document.querySelector('#form-signup #password').value

  if (!email || !password) {
    window.stopLoader()
    return
  }
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, email, password)
    .then( async (userCredential) => {
      const db = window.state.db
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        isProfileUpdated: false,
        profileImg,
        test: 'this is a test',
      })

      const user = userCredential.user
      window.state.user = user.uid
      window.state.email = user.email
      window.location.href = '/updateProfile.html'
      window.state.isLoggedIn = true
      window.stopLoader()
    })
    .catch((error) => {
      console.log(error.message, error.code)
    })
})

const logout = document.querySelector('#logout')

logout && logout.addEventListener('click', (e) => {
  e.preventDefault()
  window.startLoader()
  const auth = getAuth()
  auth.signOut().then(() => {
    window.stopLoader()
    window.state = {}
    window.location.href = '/'
    console.log('Logged out!')
  })
    .catch((error) => {
      window.stopLoader()
      console.log(error.message, error.code)
    })
})

const signUpButton = document.getElementById('goto-signup')
const signInButton = document.getElementById('goto-signin')
const container = document.getElementById('container')

signUpButton && signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active')
})

signInButton && signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active')
})
