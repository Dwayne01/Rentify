import {addToWatchlist, getProductListByCategory} from './products'

const isPath = window.location.pathname === '/listing.html'

if (isPath) {
  let state = {products: []}

  state = {...state, ...JSON.parse(localStorage.getItem('state'))}

  setTimeout(async () => {
    const cardCont = document.querySelector('.features-listings')
    cardCont.innerHTML = ''

    const category = window.location.search
      .slice(1, window.location.search.length)
    window.startLoader()

    const products = await getProductListByCategory(category)

    state.products = products.map((prod) => prod.data())

    if (products.length === 0) {
      window.stopLoader()
      return
    }

    for (const product of products) {
      const prodData = product.data()

      cardCont.innerHTML += (`
            <div class="card-container">
                <div class="card-img-container">
                      <a href="./singleListing.html?${product.id}">
                        <img src=${prodData.photos[0]} 
                          alt="product image" />
                      </a>
                      <div class="favorite-cont">
                        <a class="favorite-btn">
                          <i class="fas fa-star"></i>
                        </a>
                      </div>
                </div>
                <div class="container__profile">
                    <div class="container__profile__text">
                        <h3>${prodData.title}</h3>
                        <p>
                            <b>${prodData.itemOwner}</b>
                        </p>
                        <div class="card-bottom">
                            <p>C$${prodData.price}/day</p>
                            <p>${prodData.city}</p>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }

    initMap(products)

    window.stopLoader()

    const favoritesBtn = document.querySelectorAll('.favorite-btn i')

    favoritesBtn.forEach((ele, index) => {
      ele.addEventListener('click', async (e) => {
        e.preventDefault()
        const listing = state.products[index]

        const {title, price, city, itemImage, itemOwner} = listing

        const params = {
          userId: state.user,
          title,
          price,
          city,
          imgUrl: itemImage,
          itemOwner,
        }
        window.startLoader()
        try {
          await addToWatchlist(params)
          const favorite = document.querySelector('.favorite-cont i')
          favorite.style.color = 'rgb(247,187,13)'
        } catch (error) {
          console.log(error)
        }
        window.stopLoader()
      })
    })
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
    return ([`${prod.currency} ${prod.price}`,
      prod.latitude, prod.longitude, index + 1, prod.title])
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
        infowindow.setContent(`${locations[i][4]} (${locations[i][0]})`)
        infowindow.open(map, marker)
      }
    })(marker, i))
  }

  window.stopLoader()
}
