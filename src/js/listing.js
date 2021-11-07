import {getProductListByCategory} from './products'

const isPath = window.location.pathname === '/listing.html'

if (isPath) {
  setTimeout(async () => {
    const cardCont = document.querySelector('.features-listings')
    cardCont.innerHTML = ''

    const category = window.location.search
      .slice(1, window.location.pathname.length)
    window.startLoader()
    const products = await getProductListByCategory(category)

    if (products.length === 0) {
      window.stopLoader()
      return
    }

    for (const product of products) {
      const prodData = product.data()
      console.log(product.id)
      cardCont.innerHTML += (`
            <div class="card-container">
                <div class="card-img-container">
                      <a href="./singleListing.html?${product.id}">
                        <img src=${prodData.imgUrls[0]} 
                          alt="product image" />
                      </a>
                      <div class="favorite-cont">
                        <a class="favorite">
                          <i class="fas fa-star"></i>
                        </a>
                      </div>
                </div>
                <div class="container__profile">
                    <div class="container__profile__text">
                        <h3>${prodData.itemName}</h3>
                        <p>
                            <b>${prodData.userFirstName}</b>
                        </p>
                        <div class="card-bottom">
                            <p>C$${prodData.weeklyPrice}/day</p>
                            <p>${prodData.city}</p>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }

    initMap(products)

    window.stopLoader()
  })

  const gridEleBtn = document.getElementById('gridBtn')
  const mapEleBtn = document.getElementById('mapBtn')

  gridEleBtn.addEventListener('click', () => {
    const map = document.getElementById('map')
    const listing = document.querySelector('.features-listings')
    if (map) {
      listing.style.display = 'grid'
      map.style.display = 'none'
    }
  })

  mapEleBtn.addEventListener('click', () => {
    const listing = document.querySelector('.features-listings')
    if (listing) {
      listing.style.display = 'none'
      map.style.display = 'block'
    }
  })
}
function initMap (products) {
  const mapEle = document.getElementById('map')
  if (!mapEle) return
  // The location of Uluru
  const locations = products.map((product, index) => {
    const prod = product.data()
    return ([`${prod.currency} ${prod.weeklyPrice}`,
      prod.lat, prod.lng, index + 1])
  })

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
