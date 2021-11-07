// import {addToWatchlist, getAllWatchlistByUser} from './products'

// let state = {}

// setTimeout(async () => {
//   const isPath = window.location.href.split('/').includes('watchlist.html')
//   state = {...state, ...JSON.parse(localStorage.getItem('state'))}

//   if (!isPath) return

//   window.startLoader()
//   const products = await getAllWatchlistByUser(state.user)
//   state.products = products
//   const cardCont = document.querySelector('.watchlist-listings')
//   cardCont.innerHTML = ''

//   if (!cardCont) return

//   for (const product of products) {
//     cardCont.innerHTML += `
//                     <div class="card-container">
//                         <div class="card-img-container">
//                               <img src=${product.imgUrl} alt="">
//                               <div class="favorite-cont">
//                                 <a class="favorite">
//                                   <i class="fas fa-star"></i>
//                                 </a>
//                               </div>
//                         </div>
//                         <div class="container__profile">
//                             <div class="container__profile__text">
//                                 <h3>${product.itemName}</h3>
//                                 <p>
//                                     <b>${product.userFirstName}</b>
//                                 </p>
//                                 <div class="card-bottom">
//                                     <p>C$${product.weeklyPrice}/day</p>
//                                     <p>${product.city}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//         `
//   }
//   window.stopLoader()
// }, 2000)

// setTimeout(() => {
//   const favoritesBtn = document.querySelectorAll('.favorite i')

//   favoritesBtn.forEach((ele, index) => {
//     ele.addEventListener('click', async () => {
//       const listing = state.products[index]

//       const {itemUrl, itemName, weeklyPrice, city, imgUrl} = listing
//       const params = {
//         itemUrl,
//         userId: state.user,
//         itemName,
//         weeklyPrice,
//         city,
//         imgUrl,
//       }

//       window.startLoader()
//       await addToWatchlist(params)

//       document.querySelectorAll('.card-container')[index].remove()

//       window.stopLoader()
//     })
//   })
// }, 4000)

