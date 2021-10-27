// import {addProduct, deleteProdut, getProduct,
//   getProductList, updateProduct} from './products'
import {updateUserProfile, uploadImage} from './user'

const updateProfileForm = document.querySelector('#form-profile')

const handleProfileUpdate = (params) => {
  const res = updateUserProfile(params, window.state.user)
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

const itemToRent = document.querySelector('#itemToRent')

itemToRent && itemToRent.addEventListener('click', (e) => {
//   console.log('hello')
//   addProduct( {

//     'approved': true,
//     'deleted': false,
//     'weeklyPrice': 2142,
//     'monthlyPrice': null,
//     'hourlyPreice': null,
//     'currency': 'CAD',
//     'referrerId': null,
//     'isFakeListing': false,
//     'city': 'Ottawa',
//     'region': 'ON',
//     'vehicleFlInsured': null,
//     'vehicleRegistration': null,
//     'systemEstimatedValue': null,
//     'minRentalDays': 1,
//     'minRentalHours': 1,
//     'isForSale': false,
//     'isForRent': true,
//     'salePrice': null,
//     'canBeDelivered': false,
//     'canBeCollected': false,
//     'saleCondition': 'USED',
//     'needsConfirmItemValue': false,
//     'deliveryEstimateDaysMin': null,
//     'deliveryEstimateDaysMax': null,
//     'isDraft': false,
//     'sellerID': null,
//     'paused': false,
//   })
//   deleteProdut('55PUwkzM4JCADyJfudbx')
//   updateProduct(
//     {
//       description: 'We made it to the moon',
//     },
//     'CcImh9GLigTmaSwamrbL')
//   getProductList()
//   getProduct('yzcnxvH9as8la7vH4oU9')
})
