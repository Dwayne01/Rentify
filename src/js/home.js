import {getProductList} from './products'

const isPath = window.location.pathname === '/home.html'

if (isPath) {
  const state = {
    products: [],
    isPressed: {},
  }

  setTimeout(async () => {
    window.startLoader()
    const products = await getProductList()
    const cardCont = document.querySelector('.features-listings')
    const page = document.querySelector('.listing-details')
    cardCont.innerHTML = ''
    page.style.display = 'block'

    if (!products) {
      window.stopLoader()
      return
    }

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
      cardCont.innerHTML += (`<div class="catgeory-cont">
      <h3 class="category">${data}</h3>
      <p><a href="./listing.html?${sortedData[data][0].data().slug}">
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
  }, 2000)
}
