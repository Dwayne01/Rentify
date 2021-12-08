import {addToWatchlist, getAllWatchlistByUser} from './products'

let state = {}

setTimeout(async () => {
  const isPath = window.location.pathname === '/watchlist.html'
  if (isPath) {
    state = {...state, ...JSON.parse(localStorage.getItem('state'))}

    window.startLoader()
    const products = await getAllWatchlistByUser(state.user)
    state.products = products
    const watchListPage = document.querySelector('.listing-details')
    watchListPage.style.display = 'block'

    const cardCont = document.querySelector('.watchlist-listings')
    cardCont.innerHTML = ''

    if (!cardCont) return

    for (const product of products) {
      cardCont.innerHTML += `
                    <div class="card-container wishlist-item">
                        <div class="card-img-container">
                              <img src=${product.imgUrl} alt="">
                              <div class="favorite-cont">
                                <a class="favorite">
                                  <i class="fas fa-star"></i>
                                </a>
                              </div>
                        </div>
                        <div class="container__profile">
                            <div class="container__profile__text">
                                <a href="./singleListing.html?${product.id}">
                                  <h3>${product.title}</h3>
                                </a>
                                <p>
                                    <b>${product.itemOwner}</b>
                                </p>
                                <div class="card-bottom">
                                    <p>C$${product.price}/day</p>
                                    <p>${product.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>
        `
    }
    window.stopLoader()
  }
}, 2000)

setTimeout(() => {
  const favoritesBtn = document.querySelectorAll('.favorite i')

  favoritesBtn.forEach((ele, index) => {
    ele.addEventListener('click', async (e) => {
      e.preventDefault()
      const listing = state.products[index]

      const {title, price, city, imgUrl, itemOwner} = listing

      const params = {
        userId: state.user,
        title,
        price,
        city,
        imgUrl,
        itemOwner,
      }

      window.startLoader()
      await addToWatchlist(params)

      document.querySelectorAll('.card-container')[index].remove()

      window.stopLoader()
    })
  })
}, 4000)

