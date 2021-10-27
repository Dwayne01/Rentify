import {addToWatchlist, getProductList} from './products'

let isMenuVisible = false
const profilePic = document.getElementById('profile-image')
const menu = document.querySelector('.menu')
const initials = document.querySelector('.initials')
const fullName = document.querySelector('.menu-name')
const email = document.querySelector('.menu-email')
const mapEle = document.getElementById('map')
const search = document.getElementById('search')

const state = {
  products: [],
  isPressed: {},
}

setTimeout(async () => {
  if (profilePic) {
    const userInfo = window.state.userProfile
    fullName.innerText = `${userInfo.firstName} ${userInfo.lastName}`
    email.innerText = window.state.email
    profilePic.src = userInfo.profileImg
    initials.innerHTML = userInfo.firstName[0] + userInfo.lastName[0]

    const isPath = window.location.href.split('/').includes('home.html')

    if (!isPath) return
    const products = await getProductList()
    state.products = products
    const cardCont = document.querySelector('.features-listings')
    cardCont.innerHTML = ''

    if (!cardCont) return

    window.startLoader()
    for (const product of products) {
      cardCont.innerHTML += `
                  <div class="card-container">
                      <div class="card-img-container">
                            <img src=${product.imgUrls[0]} alt="">
                            <div class="favorite-cont">
                              <a class="favorite">
                                <i class="fas fa-star"></i>
                              </a>
                            </div>
                      </div>
                      <div class="container__profile">
                          <div class="container__profile__text">
                              <h3>${product.itemName}</h3>
                              <p>
                                  <b>${product.userFirstName}</b>
                              </p>
                              <div class="card-bottom">
                                  <p>C$${product.weeklyPrice}/day</p>
                                  <p>${product.city}</p>
                              </div>
                          </div>
                      </div>
                  </div>
      `
    }

    initMap(products)
  }
}, 2000)

setTimeout(() => {
  const isPath = window.location.href.split('/').includes('home.html')

  if (!isPath) return
  const favoritesBtn = document.querySelectorAll('.favorite i')
  favoritesBtn.forEach((ele, index) => {
    ele.addEventListener('click', async () => {
      const listing = state.products[index]
      const {itemUrl, itemName, weeklyPrice, city, imgUrls} = listing
      const params = {
        itemUrl,
        userId: window.state.user,
        itemName,
        weeklyPrice,
        city,
        imgUrl: imgUrls[0],
      }
      state.isPressed[itemName] = state.isPressed[itemName] ? false : true

      ele.style.color = !state.isPressed[itemName] ? 'white' : 'yellow'
      window.startLoader()
      await addToWatchlist(params)
      window.stopLoader()
    })
  })
}, 4000)

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

function initMap (products) {
  if (!mapEle) return
  // The location of Uluru
  const locations = products.map((product, index) =>
    ([`${product.currency} ${product.weeklyPrice}`,
      product.lat, product.lng, index + 1]))

  const map = new google.maps.Map(mapEle, {
    zoom: 10,
    center: new google.maps.LatLng(locations[0][1], locations[0][2]),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  })

  const infowindow = new google.maps.InfoWindow()

  let marker
  let i

  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map,
    })

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(locations[i][0])
        infowindow.open(map, marker)
      }
    })(marker, i))
  }

  window.stopLoader()
}
