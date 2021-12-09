/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

const cacheName = 'v1'
const urlsToCache = ['/', '/home.html', '/main.bundle.js']

self.addEventListener('install', (event) => {
  // it is invoked when the browser installs the service worker
  // here we cache the resources that are defined in the urlsToCache[] array
  console.log(`[SW] Event fired: ${event.type}`)
  event.waitUntil(
    // waitUntil tells the browser to wait for the passed promise is done
		  caches.open( cacheName )
      		// caches is a global object representing CacheStorage
			  .then( ( cache ) => {
          		// open the cache with the name cacheName*
				  return cache.addAll( urlsToCache )
        // pass the array of URLs to cache. returns a promise
		  }))

  self.skipWaiting()
  console.log(`[SW] installed`)
})

self.addEventListener('activate', (event) => {
  // it is invoked after the service worker completes its installation.
  // It's a place for the service worker to clean up from previous SW versions
  console.log(`[SW] Event fired: ${event.type}`)
  event.waitUntil( deleteOldCache() )
  console.log(`[SW] activated`)
})

self.addEventListener('fetch', function (event) {
  console.log('we are using the network before cache strategy')
  // event.respondWith(
  //   fetch(event.request).catch(function () {
  //     return caches.match(event.request)
  //   }),
  // )

  event.respondWith( cacheThenNetworkButUpdateCacheStrategy(event) )
})

// iterates over cache entries for this site and delete
// all except the one matching cacheName
async function deleteOldCache () {
  const keyList = await caches.keys()
  return Promise.all( keyList.map( ( key ) => {
    if ( key !== cacheName ) { // compare key with the new cache Name in SW
      return caches.delete( key ) // delete any other cache
    }
  }))
}

// CACHE FIRST then NETWORK BUT UPDATE CACHE
async function cacheThenNetworkButUpdateCacheStrategy (event) {
  try {
    console.log(`[SW] handling the fetch for resource : ${event.request.url}`)
    const cachedResponse = await caches.match(event.request)
    if (cachedResponse) { // found it, return the cache but also make a fetch
      //  to update cache for next time if resource changed
      console.log(`[SW] found cached resource: ${event.request.url}`)
      fetch(event.request)
        .then(async (response) => { // we don't need to wait for this
          // to finish so using then() here
          if (response.status === 304) { // 304 Not Modified , cached
            //  version is as good as live one
            console.log(`[SW] resource not changed: ${event.request.url}`)
          } else { // resource changed, re-cache it for next time
            console.log(`[SW] updating cached resource: ${event.request.url}`)
            const cache = await caches.open(cacheName)
            cache.put(event.request, response.clone())
          }
        })
        .catch( (error) => {
          console.log(`update failed: ${error}`)
        }) // happens
        //  if offline
      return cachedResponse // return the resource to browser
    } else if (event.request.url.startsWith('http')) { // not found in
      //  cache but only cache http/s resources
      console.log(`[SW] Caching new resource: ${event.request.url}`)
      // if not found in the cache, make a fetch ,push the response
      //  to cache and then return
      const response = await fetch(event.request)
      const cache = await caches.open(cacheName) // need to await
      //  otherwise clone may fail
      cache.put(event.request, response.clone())
      return response // return the response to browser
    }
  } catch (err) {
    console.error(err)
  }
}

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'apiKey': 'AIzaSyBE8v8vX6rs26RYCjgbPZo6_c8JtKTYlCc',
  'authDomain': 'rentify-a0716.firebaseapp.com',
  'projectId': 'rentify-a0716',
  'storageBucket': 'rentify-a0716.appspot.com',
  'messagingSenderId': '231540006222',
  'appId': '1:231540006222:web:64129138773c1af280521f',
  'measurementId': 'G-NEC080LHGV',
  'databaseURL': 'https://rentify-a0716-default-rtdb.firebaseio.com/',
})

// console.log('whine me?')

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging()

// messaging.
//   onBackgroundMessage(messaging, (payload) => {
//     console.log('[firebase-messaging-sw.js] Received background message ',
//       payload)
//     // Customize notification here
//     const notificationTitle = 'Background Message Title'
//     const notificationOptions = {
//       // eslint-disable-next-line max-len
//       body: 'You have a new request, check your rental request page for more details',
//       icon: '../images/logo.png',
//     }

//     self.registration.showNotification(notificationTitle,
//       notificationOptions)
//   })
