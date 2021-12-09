import {uploadImage} from './user'
import {addProduct} from './products'

const isPath = window.location.pathname === '/createListing.html'

if (isPath) {
  const submitBtn = document.getElementById('create-product')

  const localState = localStorage.getItem('state')

  const parseState = JSON.parse(localState)

  const {firstName, profileImg, phone} = parseState.userProfile

  navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude
    const long = position.coords.longitude

    latitude.value = lat
    longitude.value = long
  })

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const title = document.getElementById('title').value
    const price = document.getElementById('price').value
    const category = document.getElementById('category').value
    const currency = document.getElementById('currency').value
    const city = document.getElementById('city').value
    const province = document.getElementById('province').value
    const postcode = document.getElementById('postcode').value
    const longitude = document.getElementById('longitude')
    const latitude = document.getElementById('latitude')
    const deposit = document.getElementById('deposit').value
    const photo = document.getElementById('photo')
    const description = document.getElementById('description').value

    try {
      if (photo.files.length === 0) return
      window.startLoader()
      const unresolvePhoto = Object.values(photo.files)
        .map(async (file) => {
          return await uploadImage(file,
            `products/prod-${file.name}`)
        })

      Promise.all(unresolvePhoto).then(
        async (data ) => {
          await addProduct({
            title,
            price,
            category,
            currency,
            city,
            province,
            postcode,
            deposit,
            itemImage: data[0],
            photos: data,
            latitude: latitude.value,
            longitude: longitude.value,
            itemOwner: firstName,
            itemOwnerId: parseState.user,
            description,
            profileImg,
            phone,
            email: parseState.email,
          })

          window.stopLoader()

          window.location.href = '/home.html'
        },
      )
    } catch (error) {
      window.stopLoader()
    }
  })
}

