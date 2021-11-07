import {addToWatchlist, getProductList} from './products'

const isPath = window.location.href.split('/').includes('home.html')

if (isPath) {
  let state = {
    products: [],
    isPressed: {},
  }

  setTimeout(async () => {
    window.startLoader()
    const products = await getProductList()
    const cardCont = document.querySelector('.features-listings')
    cardCont.innerHTML = ''

    const productData = products.map((product) => {
      return product.data()
    })

    state.products = productData

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
      console.log(sortedData[data][0], data)
      cardCont.innerHTML += (`<div class="catgeory-cont">
      <h3 class="category">${data}</h3>
      <p><a href="./listing.html?${sortedData[data][0].data().slug}">
        See all</a></p>
    </div>`)
      const newDiv = document.createElement('div')
      newDiv.className = 'row listing-category'

      for (const product of sortedData[data]) {
        const productData = product.data()

        console.log({productData})
        newDiv.innerHTML += (`
            <div class="card-container">
                <div class="card-img-container">
                      <a href="./singleListing.html?${product.id}">
                        <img src=${productData.imgUrls[0]}
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
                        <h3>${productData.itemName}</h3>
                        <p>
                            <b>${productData.userFirstName}</b>
                        </p>
                        <div class="card-bottom">
                            <p>C$${productData.weeklyPrice}/day</p>
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
  }, 2000)

  setTimeout(() => {
    const isPath = window.location.href.split('/').includes('home.html')

    const localState = JSON.parse(localStorage.getItem('state'))

    if (localState) {
      state = {...localState, ...state}
    }

    if (!isPath) return
    const favoritesBtn = document.querySelectorAll('.favorite i')
    favoritesBtn.forEach((ele, index) => {
      ele.addEventListener('click', async () => {
        const listing = state.products[index]
        const {itemUrl, itemName, weeklyPrice, city, imgUrls} = listing

        const params = {
          itemUrl,
          userId: state.user,
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
}
