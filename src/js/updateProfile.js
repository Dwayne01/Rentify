import {updateUserProfile, uploadImage} from './user'

const updateProfileForm = document.querySelector('#form-profile')
const updateProfile = document.querySelector('.updateProfile')

let state = {

}

if (updateProfile) {
  const handleProfileUpdate = (params) => {
    state = JSON.parse(localStorage.getItem('state'))

    const res = updateUserProfile(params, state.user)
    window.startLoader()
    setTimeout(() => {
      window.stop()
      if (res) {
        window.location.href = '/home.html'
        window.stopLoader()
      }
    }, 3000)
  }

  updateProfileForm && updateProfileForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const imgFile = document.querySelector('#image').files[0]
    const firstName = document.querySelector('#first_name').value
    const lastName = document.querySelector('#last_name').value
    const address = document.querySelector('#address').value
    const dob = document.querySelector('#dob').value
    const phone = document.querySelector('#phone').value

    if (!firstName || !lastName || !address || !dob || !phone) {
      window.stopLoader()
      return
    }

    const params = {
      firstName,
      lastName,
      address,
      dob,
      phone,
      isProfileUpdated: true,
    }

    if (imgFile) {
      uploadImage(imgFile,
        `profile/${firstName + '-' + imgFile.name}`)
        .then((data) => {
          if (data) handleProfileUpdate({...params, profileImg: data})
        })
      return
    }

    handleProfileUpdate(params)
  })
}
