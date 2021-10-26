import {getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword} from 'firebase/auth'
import {setDoc, doc, getFirestore} from 'firebase/firestore'

const logintbtn = document.querySelector('#form-signin')

logintbtn && logintbtn.addEventListener('submit', (e) => {
  e.preventDefault()
  window.stopLoader()

  const errorPtag = document.getElementById("errorMsglogin")
  const email = document.querySelector('#form-signin #email').value
  const password = document.querySelector('#form-signin #password').value
  errorPtag.innerText = ""
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
       console.log(errorPtag)
      console.log(error.message)
      console.log(error.code)
       if(error.code === "auth/wrong-password"){
         errorPtag.innerText = "Please enter correct password"
       }
       else if(error.code === "auth/user-not-found"){
        errorPtag.innerText = "User does not exists"
       }
       

      window.stopLoader()

    })
})

const signupbtn = document.querySelector('#form-signup')

signupbtn && signupbtn.addEventListener('submit', (e) => {
  e.preventDefault()

  // window.startLoader()
  const errorElement = document.getElementById("errorMsg")
  const email = document.querySelector('#form-signup #email').value
  const password = document.querySelector('#form-signup #password').value
  errorElement.innerText = ""

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
      console.log(errorElement);
      if(error.code === "auth/weak-password"){
        errorElement.innerText = "Password should be at least 6 characters (auth/weak-password)."
      }
      else if(error.code === "auth/email-already-in-use"){
        errorElement.innerText = "This Email address is already in use"
      }

      console.log( error.code)
      console.log(error.message)
      window.stopLoader();
      
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
