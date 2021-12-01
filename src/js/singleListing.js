import {getSingleProduct} from './products'
import {rentItem} from './quote'

const isPath = window.location.pathname === '/singleListing.html'

if (isPath) {
  const state = {
    product: {},
    user: {},
  }
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

    const itemName = document.querySelector('.title')
    const listingImg = document.querySelector('.listing-main-img > img')
    const description = document.querySelector('.listing-description > div')
    const agentName = document.querySelector('.owner-name')
    const userPhoto = document.querySelector('.agent-info img')
    const cost = document.querySelector('.listing-pricing strong')
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
    cost.innerHTML = `${res.currency}${res.price} / day`

    console.log(res.photos)
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
      approved: false,
      item: state.product.title,
      itemImage: state.product.itemImage,
      itemID: state.itemId,
      agentID: state.product.agentID,
      userID: state.user.user,
      ...state.user.userProfile,
    }

    window.startLoader()
    modal.style.display = 'none'

    await rentItem(params).then(() => {
      const quoteBox = document.querySelector('.listing-pricing')
      quoteBox.innerHTML = `<strong>Your request has been sent to
       ${state.product.itemOwner}</strong>`
    })

    window.stopLoader()
  }
}
