// function component() {
//     const element = document.createElement('div');
  
//     // Lodash, currently included via a script, is required for this line to work
//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  
//     return element;
//   }
  
//   document.body.appendChild(component());
  

// import _ from 'lodash';

//  function component() {
//    const element = document.createElement('div');

//   // Lodash, currently included via a script, is required for this line to work
//   // Lodash, now imported by this script
//    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//    return element;
//  }

//  document.body.appendChild(component());

 console.log(3)

 if (module.hot) {
  module.hot.accept()
}

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }
import { Workbox } from "workbox-window";

fetch("https://api.exchangeratesapi.io/latest")
.then(response => response.json())
.then(data => {
  const main = document.querySelector("#main");
  if (!data || !data.rates) {
    main.innerHTML = "There was an error. Please try again.";
    return false;
  }
  let html = "";

  for (const [currency, rate] of Object.entries(data.rates)) {
    html += `<article class="card card-currency">
    <div class="currency">${currency}</div>
    <div class="rate">${rate}</div>
    </article>`;
  }
  main.innerHTML = html;
});


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const wb = new Workbox("/sw.js");
    const updateButton = document.querySelector("#app-update");
    // Fires when the registered service worker has installed but is waiting to activate.
    wb.addEventListener("waiting", event => {
      updateButton.classList.add("show");
      updateButton.addEventListener("click", () => {
      // Set up a listener that will reload the page as soon as the previously waiting service worker has taken control.
      wb.addEventListener("controlling", event => {
        window.location.reload();
      });

      // Send a message telling the service worker to skip waiting.
      // This will trigger the `controlling` event handler above.
      wb.messageSW({ type: "SKIP_WAITING" });
    });
    });

    wb.register();
  });

}