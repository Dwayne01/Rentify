import {getProductList} from './products'
import {getMessaging, onMessage} from 'firebase/messaging'
// import {updateUserProfile} from './user'

// eslint-disable-next-line max-len
// const YOUR_PUBLIC_VAPID_KEY = 'BBTddtq3sEF2rzrZGUe1wv7bveV0LeNQmStvIWWGkax1SYI5GsrNFUPPvTpn91v6dIxDSIpETpHhi5FxgjA4Yy4'

const isPath = window.location.pathname === '/home.html'

const state = {
  products: [],
  isPressed: {},
}
if (isPath) {
  setTimeout(async () => {
    await handleGetProducts()
  }, 2000)

  const search = document.getElementById('search')

  const searchbtn = document.querySelector('.fa-search')

  search && search.addEventListener('blur', () => {
    // console.log(search.value, 'i work')
  })

  search && search.addEventListener('input', () => {
    if (!search.value) {
      handleDisplayList(state.products)
    }
  })

  search && search.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  })

  searchbtn && searchbtn.addEventListener('click', async (e) => {
    handleSearch()
  })

  async function handleSearch () {
    await handleGetProducts()
    const filteredProducts = state.products.filter((product) => {
      if (product.data().title.toLocaleLowerCase().split(' ')
        .includes(search.value.toLocaleLowerCase())) {
        return product
      }
    })

    handleDisplayList(filteredProducts)
  }
}

function handleDisplayList (products) {
  const cardCont = document.querySelector('.features-listings')
  cardCont.innerHTML = ''

  const sortedData = products.reduce((prev, curr) => {
    const data = curr.data()
    if (prev[data.category]) {
      prev[data.category].push(curr)
    } else {
      prev[data.category] = [curr]
    }

    return {
      ...prev,
      [data.category]: prev[data.category],
    }
  }, {})

  // eslint-disable-next-line guard-for-in
  for (const data in sortedData) {
    cardCont.innerHTML += (`<div class="catgeory-cont">
    <h3 class="category">${data}</h3>
    <p><a href="./listing.html?${sortedData[data][0].data().category}">
      See all ></a></p>
  </div>`)

    const newDiv = document.createElement('div')
    newDiv.className = 'row listing-category'

    for (const product of sortedData[data]) {
      const productData = product.data()

      newDiv.innerHTML += (`
          <div class="card-container">
              <div class="card-img-container">
                    <a href="./singleListing.html?${product.id}">
                      <img src=${productData.photos[0]}
                        alt="product image" />
                    </a>                     
              </div>
              <div class="container__profile">
                  <div class="container__profile__text">
                      <h3>${productData.title}</h3>
                      <p>
                          <b>${productData.itemOwner}</b>
                      </p>
                      <div class="card-bottom">
                          <p>${productData.currency} 
                          ${productData.price} / day</p>
                          <p>${productData.city}</p>
                      </div>
                  </div>
              </div>
          </div>
      `)
    }
    cardCont.appendChild(newDiv)
  }
  window.stopLoader()
}

setTimeout(() => {
  const messaging = getMessaging()
  onMessage(messaging, (res) => {
    console.log(res, 'PAyload')
  })
}, 3000)

async function handleGetProducts () {
  window.startLoader()
  const products = await getProductList()

  const page = document.querySelector('.listing-details')

  page.style.display = 'block'

  if (!products) {
    window.stopLoader()
    return
  }

  state.products = products

  handleDisplayList(products)
}

// function initialisePushNotification () {
//   const messaging = getMessaging()
//   console.log('push notification initialized')

//   Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
//       getToken(messaging, {vapidKey: YOUR_PUBLIC_VAPID_KEY})
//         .then(async (currentToken) => {
//           console.log({currentToken})

//           const userInfo = JSON.parse(localStorage.getItem('state'))

//           const params = {...userInfo.userProfile, pushID: currentToken}

//           if (!userInfo.userProfile.pushID) {
//             await updateUserProfile( params, userInfo.user )
//             localStorage.setItem('state', {...userInfo, userProfile: params})
//           }
//         }).catch((err) => {
//           console.log('An error occurred while retrieving token. ', err)
//         // ...
//         })
//     }
//   })
// }

// const getDeviceType = () => {
//   const ua = navigator.userAgent
//   console.log({ua})
//   if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
//     return 'tablet'
//   }
//   if (
//     /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
//       ua,
//     )
//   ) {
//     return 'mobile'
//   }
//   return 'desktop'
// }
