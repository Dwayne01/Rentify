import {getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword} from 'firebase/auth'
import {setDoc, doc, getFirestore} from 'firebase/firestore'
import {getUserProfile} from './user'

const state = {

}
// eslint-disable-next-line max-len
const profileImg = 'https://firebasestorage.googleapis.com/v0/b/rentify-a0716.appspot.com/o/profile%2Fprofile.png?alt=media&token=4745cdcf-69f2-468f-9614-558ca99daa59'
const logintbtn = document.querySelector('#form-auth')

const goToSignup = document.getElementById('goto-signup')
const goToSignin = document.getElementById('goto-signin')

goToSignin && goToSignin.addEventListener('click', () => {
  const signin = document.querySelector('.overlay-left')
  const signup = document.querySelector('.overlay-right')

  const loginform = document.querySelector('.login-form')
  const registrationForm = document.querySelector('.registration-form')

  signup.style.display = 'block'
  signin.style.display = 'none'
  registrationForm.style.display = 'none'
  loginform.style.display = 'block'
})

goToSignup && goToSignup.addEventListener('click', () => {
  const signin = document.querySelector('.overlay-left')
  const signup = document.querySelector('.overlay-right')

  const loginform = document.querySelector('.login-form')
  const registrationForm = document.querySelector('.registration-form')

  signup.style.display = 'none'
  signin.style.display = 'block'
  registrationForm.style.display = 'block'
  loginform.style.display = 'none'
})

logintbtn && logintbtn.addEventListener('submit', (e) => {
  e.preventDefault()
  window.startLoader()

  const errorPtag = document.getElementById('errorMsglogin')
  const email = document.querySelector('.login-form #email').value
  const password = document.querySelector('.login-form #password').value

  errorPtag.innerText = ''
  if (!email || !password) {
    window.stopLoader()
    return
  }

  const auth = getAuth()
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user
      state.user = user.uid
      state.email = user.email
      state.isLoggedIn = true
      const userInfo = await getUserProfile(user.uid)
      state.userProfile = userInfo
      localStorage.setItem('state', JSON.stringify(state))

      window.location.href = userInfo.isProfileUpdated ? '/home.html' :
        '/updateProfile.html'
      window.stopLoader()
    })
    .catch((error) => {
      console.log(errorPtag)
      console.log(error.message)
      console.log(error.code)
      if (error.code === 'auth/wrong-password') {
        errorPtag.innerText = 'Please enter correct password'
      } else if (error.code === 'auth/user-not-found') {
        errorPtag.innerText = 'User does not exists'
      }

      window.stopLoader()
    })
})

const signupbtn = document.
  querySelector('.registration-form #submit')

signupbtn && signupbtn.addEventListener('click', (e) => {
  e.preventDefault()

  window.startLoader()
  const errorElement = document.getElementById('errorMsg')
  const email = document.querySelector('.registration-form #email').value
  const password = document.querySelector('.registration-form  #password').value
  errorElement.innerText = ''

  if (!email || !password) {
    window.stopLoader()
    return
  }
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, email, password)
    .then( async (userCredential) => {
      const db = getFirestore()
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        isProfileUpdated: false,
        profileImg,
      })

      const user = userCredential.user
      state.user = user.uid
      state.email = user.email
      window.stopLoader()
    })
    .catch((error) => {
      console.log(errorElement)
      if (error.code === 'auth/weak-password') {
        errorElement.innerText =
         'Password should be at least 6 characters (auth/weak-password).'
      } else if (error.code === 'auth/email-already-in-use') {
        errorElement.innerText = 'This Email address is already in use'
      }

      console.log( error.code)
      console.log(error.message)
      window.stopLoader()
    })
})

setTimeout(() => {
  const logout = document.querySelector('.menu #menu-list #logout')

  logout && logout.addEventListener('click', (e) => {
    e.preventDefault()
    window.startLoader()
    const auth = getAuth()
    auth.signOut().then(() => {
      window.stopLoader()
      window.state = {}
      localStorage.clear()

      console.log('Logged out!')
    })
      .catch((error) => {
        window.stopLoader()
        console.log(error.message, error.code)
      })
  })
}, 2000)

const signUpButton = document.getElementById('goto-signup')
const signInButton = document.getElementById('goto-signin')
const container = document.getElementById('container')

signUpButton && signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active')
  document.getElementById('create-account-title').style.display = 'block'
  document.getElementById('login-account-title').style.display = 'none'
})

signInButton && signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active')
  document.getElementById('create-account-title').style.display = 'none'
  document.getElementById('login-account-title').style.display = 'block'
})
