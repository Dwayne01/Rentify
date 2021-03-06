import {getSingleProduct} from './products'
import {rentItem} from './quote'

// eslint-disable-next-line max-len
const serverKey = 'key=AAAANejcHU4:APA91bGzerR35GLhwkWjXJTPh26dWB4shBkiobURBOlDwSR-AEhI5_G6ZWljcCpmKiB_igXAjgbictoBFUdtU-rgWz3FlydE46hGW8jbdG-O_I-93RlYC7MkRUNDGzYFTdcBvU-oWTEO'
const isPath = window.location.pathname === '/singleListing.html'

if (isPath) {
  const state = {
    product: {},
    user: {},
  }
  const mapEle = document.getElementById('map')
  const listingEle = document.querySelector('.listing-detail-page')
  const detailsPage = document.querySelector('.listing-detail-page')

  mapEle.innerHTML = 'Loading...'

  async function initMap (product) {
    if (!mapEle) return

    const locations = [`${product.currency} ${product.weeklyPrice}`,
      product.lat, product.lng]

    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer()
    const destination = new google.maps.LatLng(locations[1], locations[2])

    const map = new google.maps.Map(mapEle, {
      zoom: 10,
      center: origin,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    })

    directionsRenderer.setMap(map)

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

    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude
      const long = position.coords.longitude

      calculateAndDisplayRoute({directionsService, directionsRenderer,
        destination, origin: new google.maps.LatLng(lat, long)})

      const icon = {
        url: 'https://www.appstoi.com/apk/social/wp-content/uploads/2016/07/Blue-Dot-World-Chat.png', // url
        scaledSize: new google.maps.Size(10, 10), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0), // anchor
      }

      const markerMine = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        map: map,
        icon,
      })

      google.maps.event.addListener(markerMine, 'click', function () {
        return function () {
          infowindow.setContent('locations[0]')
          infowindow.open(map, markerMine)
        }
      })
    })

    const itemName = document.querySelector('.title')
    const listingImg = document.querySelector('.listing-main-img > img')
    const description = document.querySelector('.listing-description > div')
    const agentName = document.querySelector('.owner-name')
    const userPhoto = document.querySelector('.agent-info img')
    const cost = document.querySelector('.listing-pricing #price')
    const deposit = document.querySelector('.listing-pricing #deposit')
    const call = document.querySelector('.agent-card-info > .call')
    const message = document.querySelector('.agent-card-info .message')
    const listingImgCont = document.querySelector('.other-listing-img')

    const {res} = product

    state.product = res

    const localState = localStorage.getItem('state')
    state.user = JSON.parse(localState)

    listingImgCont.innerHTML = ''
    itemName.innerHTML = res.title
    listingImg.src = res.photos[0]
    description.innerHTML = res.description
    agentName.innerHTML = res.itemOwner
    userPhoto.src = res.profileImg
    cost.innerHTML = `${res.currency} ${res.price} / day`
    deposit.innerText = `You would be paying a security deposit of ${res.currency} ${res.deposit}`

    for (let url = 1; url < res.photos.length; url++) {
      listingImgCont.innerHTML +=
      `<img src="${res.photos[url]}" alt="listing main image"/>`
    }

    call.href = `tel://${res.phone}`
    message.href = `sms://${res.phone}`

    call.innerHTML = `Call ${res.itemOwner}`
    message.innerHTML = `Message ${res.itemOwner}`

    window.stopLoader()
    detailsPage.style.visibility = 'visible'
  }

  if (detailsPage) {
    detailsPage.style.visibility = 'hidden'
  }

  if (listingEle) {
    setTimeout(async () => {
      window.startLoader()

      state.itemId = window.location.search.
        slice(1, window.location.search.length)

      const res = await getSingleProduct(window.location.search.
        slice(1, window.location.search.length))

      initMap({
        currency: '$',
        weeklyPrice: '2142',
        lat: res.latitude,
        lng: res.longitude,
        res,
      })
    }, 2000)
  }

  // Get the modal
  const modal = document.getElementById('quoteModal')

  // Get the button that opens the modal
  const btn = document.getElementById('openQuote')

  // Get the button that opens the modal
  const mdlbtn = document.getElementById('quoteModalbtn')

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0]

  // When the user clicks on the button, open the modal
  btn.onclick = function () {
    modal.style.display = 'block'
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = 'none'
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none'
    }
  }

  // Function to manage the Date input
  function parseDate (str) {
    const datat = str.split('-')
    return (datat[1] + '/' + datat[2] + '/' + datat[0])
  }

  // Function to find days between two dates
  function datediff (date1, date2) {
    const dt1 = new Date(date1)
    const dt2 = new Date(date2)
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(),
      dt2.getDate()) -
                      Date.UTC(dt1.getFullYear(), dt1.getMonth(),
                        dt1.getDate()) ) / (1000 * 60 * 60 * 24))
  }

  mdlbtn.onclick = async function () {
    const inputStartDate = dateStart.value
    const inputEndDate = dateEnd.value
    const daysDifference =
          datediff(parseDate(inputStartDate), parseDate(inputEndDate))
    const calculatedOutput = state.product.price * daysDifference

    const params = {
      days: daysDifference,
      startDate: dateStart.value,
      endDate: dateEnd.value,
      totalCost: calculatedOutput,
      costPerDat: state.product.price,
      requestProcessed: false,
      item: state.product.title,
      itemImage: state.product.itemImage,
      itemID: state.itemId,
      agentID: state.product.itemOwnerId,
      userID: state.user.user,
      ...state.user.userProfile,
    }

    window.startLoader()
    modal.style.display = 'none'

    await rentItem(params).then(() => {
      const quoteBox = document.querySelector('.listing-pricing')
      quoteBox.innerHTML = `<strong>Your request has been sent to
       ${state.product.itemOwner}</strong>`
    }).then(async () => {
      const body = {
        to: state.user.userProfile.pushID,
        notification: {
          title: 'Rental Request',
          icon: '../images/logo.png',
          // eslint-disable-next-line max-len
          body: 'someone wants to rent your item, check your requests to know more',
        },
      }

      console.log('push notification body', body)
      const options = {
        method: 'POST',
        headers: new Headers({
          'Authorization': serverKey,
          'Content-Type': 'application/json',
          'body': JSON.stringify(params),
        }),
      }
      await fetch('https://fcm.googleapis.com/fcm/send', options).then((res) => {
        console.log('sent', res)
      }).catch((err) => {
        console.log('err', err)
      })
    })

    window.stopLoader()
  }
}

// eslint-disable-next-line max-len
function calculateAndDisplayRoute ({directionsService, directionsRenderer, origin, destination}) {
  const request = {
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  }
  const service = new google.maps.DistanceMatrixService()
  directionsService
    .route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response)
    })
    .catch((e) => window.alert('Directions request failed due to ' + e))
  service.getDistanceMatrix(request).then((response) => {
    document.getElementById('duration').innerHTML =
     // eslint-disable-next-line max-len
     `This item is <strong>${response.rows[0].elements[0].distance.text}</strong> away and <strong>${response.rows[0].elements[0].duration.text}</strong> travel time`
  })
}
