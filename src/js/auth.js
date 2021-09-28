import {getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword} from 'firebase/auth'
import {setDoc, doc, getFirestore} from 'firebase/firestore'

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
    .then((userCredential) => {
      const user = userCredential.user
      window.state.user = user.uid
      window.location.href = '/home.html'
      window.state.isLoggedIn = true
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
      const db = getFirestore()
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        isLoggedIn: false,
      })

      const user = userCredential.user
      window.state.user = user
      window.location.href = '/home.html'
      window.state.isLoggedIn = true
      console.log(window.state)
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
    window.state.user = null
    window.state.isLoggedIn = false
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
