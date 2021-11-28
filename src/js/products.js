import {doc, getDocs, getDoc, setDoc, addDoc,
  deleteDoc, collection, query, where, getFirestore} from 'firebase/firestore'

export async function updateProduct (params, uid) {
  try {
    const db = getFirestore()
    const res = await setDoc(doc(db, 'products', uid), params)
    console.log('products updated successfully', res)
    return true
  } catch (error) {
    console.log('products update failed')
    return false
  }
}

export async function addProduct (params) {
  try {
    const db = getFirestore()

    const res = await addDoc(collection(db, 'products'), params)
    console.log('products created successfully', res)
    return true
  } catch (error) {
    console.log('products create failed')
    return false
  }
}

export async function addToWatchlist (params) {
  try {
    const db = getFirestore()

    const product = await getWatchlistProduct(params.title, params.userId)

    console.log({product}, {params})
    if (product.length === 0) {
      await addDoc(collection(db, 'watchlist'), params)
    } else {
      await deleteWatchlist(product[0].id)
    }

    return true
  } catch (error) {
    console.log('Failed to add to watchlist', error)
    return false
  }
}

export async function deleteProdut (uid) {
  try {
    const db = getFirestore()
    const res = await deleteDoc(doc(db, 'products', uid))
    console.log('products deleted successfully', res)
    return true
  } catch (error) {
    console.log('products deleted failed')
    return false
  }
}

export async function getProductList () {
  const db = getFirestore()

  try {
    const productsCol = collection(db, 'products')
    const res = await (await getDocs(productsCol)).docs

    if (res.length > 0) {
      console.log('Product data:', res)
      return res
    }
  } catch (error) {
    console.log('products deleted failed')
    return []
  }
}

export async function getProductListByCategory (categoryNames) {
  const db = getFirestore()

  const productCollection = collection(db, 'products')
  const q = query(productCollection,
    where('category', '==', categoryNames))

  try {
    const productSnapshot = await (await getDocs(q)).docs

    console.log('product data:', productSnapshot)

    return productSnapshot
  } catch (error) {
    console.log('products deleted failed', error)
    return []
  }
}

export async function getAllProductsByOwner (userId) {
  try {
    const db = getFirestore()
    const watchlistCollection = collection(db, 'products')
    const q = query(watchlistCollection,
      where('itemOwnerId', '==', userId))

    const watchListSnapshot = await (await getDocs(q)).docs

    const res = watchListSnapshot.map((data) => ({...data.data(), id: data.id}))

    console.log('products data:', res)

    return res
  } catch (error) {
    console.log('products failed', error)
    return null
  }
}

export async function getWatchlistProduct (productName, userId) {
  try {
    const db = getFirestore()
    const watchlistCollection = collection(db, 'watchlist')
    const q = query(watchlistCollection,
      where('title', '==', productName),
      where('userId', '==', userId))

    const watchListSnapshot = await (await getDocs(q)).docs

    const res = watchListSnapshot

    console.log('Watchlist data:', res)

    return res
  } catch (error) {
    console.log('get watchlist item failed', error)
    return null
  }
}

export async function getAllWatchlistByUser (userId) {
  try {
    const db = getFirestore()
    const watchlistCollection = collection(db, 'watchlist')
    const q = query(watchlistCollection,
      where('userId', '==', userId))

    const watchListSnapshot = await (await getDocs(q)).docs

    const res = watchListSnapshot.map((data) => data.data())

    console.log('Watchlist data:', res)

    return res
  } catch (error) {
    console.log('get all watchlist failed', error)
    return null
  }
}

export async function deleteWatchlist (productId) {
  try {
    const db = getFirestore()
    const res = await deleteDoc(doc(db, 'watchlist', productId))
    console.log('products deleted successfully', res)
    return true
  } catch (error) {
    console.log('products deleted failed')
    return false
  }
}

export async function getSingleProduct (id) {
  try {
    const db = getFirestore()
    const productsCollection = doc(db, `products/${id}`)
    const watchListSnapshot = await getDoc(productsCollection)

    const res = watchListSnapshot.data()

    console.log('single product data:', res)

    return res
  } catch (error) {
    console.log('get a product failed', error)
    return []
  }
}
