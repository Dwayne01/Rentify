import {getRequestsByAgentId, getRequestsByUserId, updateReqest} from './quote'

const isPath = window.location.pathname === '/rentalRequest.html'

if (isPath) {
  const state = {
    requestFromOthers: [],
    requestFromYou: [],
  }
  const localState = localStorage.getItem('state')
  const parseState = JSON.parse(localState)

  setTimeout(async () => {
    window.startLoader()

    const requests = await getRequestsByUserId(parseState.user)
    const requestsAgent = await getRequestsByAgentId(parseState.user)

    const reqContainer = document.querySelector('.requests')

    state.requestFromYou = requests
    state.requestFromOthers = requestsAgent

    reqContainer.innerHTML = ''

    for (const request of requests) {
      reqContainer.innerHTML += `
            <div class="listing-pricing"  style="background:
             ${!request.requestProcessed ? 'rgb(249, 248, 254)' :
    request.approve ? '#e0ffe0' : '#ffc7c7'}">
              <div class="row">
                <div class="leftside">
                  <a href="/singleListing.html?${request.itemID}">
                    <img src=${request.itemImage} />
                  </a>
                </div>
                <div class="rightside">
                    <a href="/singleListing.html?${request.itemID}">
                      <h2>${request.item}</h2>
                    </a>
                    <p>${request.firstName} ${request.lastName}</p>
                    <p>${request.address}</p>
                    <p>$${request.totalCost} for ${request.days} days</p>
                    <p>${request.phone}</p>
                </div>
              </div>
            </div>
            `
    }
    window.stopLoader()

    const agentBtn = document.querySelector('.agent')

    agentBtn.addEventListener('click', () => {
      console.log(state)
      reqContainer.innerHTML = ''

      for (const request of state.requestFromOthers) {
        reqContainer.innerHTML += `
              <div class="listing-pricing">
                <div class="row">
                  <div class="leftside">
                    <a href="/singleListing.html?${request.itemID}">
                      <img src=${request.itemImage} />
                    </a>
                  </div>
                  <div class="rightside">
                      <a href="/singleListing.html?${request.itemID}">
                        <h2>${request.item}</h2>
                      </a>
                      <p>${request.firstName} ${request.lastName}</p>
                      <p>${request.address}</p>
                      <p>$${request.totalCost} for ${request.days} days</p>
                      <p>${request.phone}</p>
                      ${!request.requestProcessed ?
    `<button class="approve">Approve</button>` : ''}
                      ${!request.requestProcessed ?
    `<button class="deny">Deny</button>` : ''}
                  </div>
                </div>
              </div>
        `
      }

      const approveBtn = document.
        querySelectorAll('.listing-pricing .approve')

      const denyBtn = document.
        querySelectorAll('.listing-pricing .deny')

      approveBtn.forEach((ele, ind) => {
        ele.addEventListener('click', async (e) => {
          const params = {
            ...state.requestFromOthers[ind],
            approve: true,
            requestProcessed: true,
          }

          window.startLoader()
          try {
            await updateReqest(params)

            setTimeout(() => {
              window.stopLoader()
              window.location.href = '/rentalRequest.html'
            }, 3000)
          } catch (error) {
            setTimeout(() => {
              window.stopLoader()
            }, 3000)
          }
        })
      })

      denyBtn.forEach((ele, ind) => {
        ele.addEventListener('click', async (e) => {
          const params = {
            ...state.requestFromOthers[ind],
            approve: false,
            requestProcessed: true,
          }
          window.startLoader()
          await updateReqest(params)
          window.stopLoader()
        })
      })
    })

    const userBtn = document.querySelector('.user')

    userBtn.addEventListener('click', () => {
      console.log(agentBtn)
      reqContainer.innerHTML = ''

      for (const request of state.requestFromYou) {
        reqContainer.innerHTML += `
              <div class="listing-pricing"  style="background:
             ${!request.requestProcessed ? 'rgb(249, 248, 254)' :
    request.approve ? '#e0ffe0' : '#ffc7c7'}">
                <div class="row">
                  <div class="leftside">
                    <a href="/singleListing.html?${request.itemID}">
                      <img src=${request.itemImage} />
                    </a>
                  </div>
                  <div class="rightside">
                      <a href="/singleListing.html?${request.itemID}">
                        <h2>${request.item}</h2>
                      </a>
                      <p>${request.firstName} ${request.lastName}</p>
                      <p>${request.address}</p>
                      <p>$${request.totalCost} for ${request.days} days</p>
                      <p>${request.phone}</p>
                  </div>
                </div>
              </div>
        `
      }
    })
  }, 2000)
}
