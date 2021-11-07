import {getSingleProduct} from './products'

const isPath = window.location.pathname === '/singleListing.html'

if (isPath) {
  const mapEle = document.getElementById('map')
  const listingEle = document.querySelector('.listing-detail-page')
  const detailsPage = document.querySelector('.listing-detail-page')

  async function initMap (product) {
    if (!mapEle) return

    const locations = [`${product.currency} ${product.weeklyPrice}`,
      product.lat, product.lng]

    const map = new google.maps.Map(mapEle, {
      zoom: 10,
      center: new google.maps.LatLng(locations[1], locations[2]),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    })

    const infowindow = new google.maps.InfoWindow()

    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[1], locations[2]),
      map: map,
    })

    google.maps.event.addListener(marker, 'click', function () {
      return function () {
        infowindow.setContent(locations[0])
        infowindow.open(map, marker)
      }
    })

    const res = await getSingleProduct(window.location.search.
      slice(1, window.location.search.length))

    const itemName = document.querySelector('.title')
    const listingImg = document.querySelector('.listing-main-img > img')
    const description = document.querySelector('.listing-description > div')
    const agentName = document.querySelector('.owner-name')
    const userPhoto = document.querySelector('.agent-info img')
    const cost = document.querySelector('.listing-pricing strong')
    const call = document.querySelector('.agent-card-info > .call')
    const message = document.querySelector('.agent-card-info .message')
    const listingImgCont = document.querySelector('.other-listing-img')

    listingImgCont.innerHTML = ''
    itemName.innerHTML = res.itemName
    listingImg.src = res.imgUrls[0]
    description.innerHTML = res.description
    agentName.innerHTML = res.userFirstName
    userPhoto.src = res.userPhoto
    cost.innerHTML = `$${res.price} / day`

    for (let url = 1; url < res.imgUrls.length; url++) {
      console.log(
        {imgUrls: res.imgUrls[url]})

      listingImgCont.innerHTML +=
      `<img src="${res.imgUrls[url]}" alt="listing main image"/>`
    }

    call.href = `tel://${res.phone}`
    message.href = `sms://${res.phone}`

    window.stopLoader()
    detailsPage.style.visibility = 'visible'
  }

  if (detailsPage) {
    detailsPage.style.visibility = 'hidden'
  }

  if (listingEle) {
    setTimeout(() => {
      window.startLoader()
      initMap({
        currency: 'CAD',
        weeklyPrice: '2142',
        lat: 45.347412,
        lng: -75.92921,
      })
    }, 2000)
  }
}
