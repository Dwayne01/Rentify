import {updateUserProfile, uploadImage} from './user'

const updateProfileForm = document.querySelector('#form-profile')
const updateProfile = document.querySelector('.updateProfile')

let state = {

}

if (updateProfile) {
  state = JSON.parse(localStorage.getItem('state'))

  console.log({state})
  const handleProfileUpdate = (params) => {
    const res = updateUserProfile(params, state.user)
    window.startLoader()
    setTimeout(() => {
      window.stopLoader()
      if (res) {
        const updatedProfile = {
          ...state,
          userProfile: {
            ...state.userProfile,
            firstName: params.firstName,
            lastName: params.lastName,
            address: params.address,
            dob: params.dob,
            phone: params.phone,
            profileImg: params.profileImg,
          },
        }

        localStorage.setItem('state', JSON.stringify(updatedProfile))
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
      profileImg: state.userProfile.profileImg,
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

  const imgFile = document.querySelector('.profile label[for="image"] > img ')
  const firstName = document.querySelector('.profile #first_name')
  const lastName = document.querySelector('.profile #last_name')
  const address = document.querySelector('.profile #address')
  const dob = document.querySelector('.profile #dob')
  const phone = document.querySelector('.profile #phone')

  firstName.value = state.userProfile.firstName
  lastName.value = state.userProfile.lastName
  address.value = state.userProfile.address
  dob.value = state.userProfile.dob
  phone.value = state.userProfile.phone
  imgFile.src = state.userProfile.profileImg
}
