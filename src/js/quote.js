import {doc, getDocs, setDoc, addDoc,
  collection, query, where, getFirestore} from 'firebase/firestore'

export async function rentItem (params) {
  try {
    const db = getFirestore()

    const res = await addDoc(collection(db, 'requests'), params)
    console.log('requests created successfully', res)
    return true
  } catch (error) {
    console.log('requests create failed', error)
    return false
  }
}

export async function updateRequests (params, uid) {
  try {
    const db = getFirestore()
    const res = await setDoc(doc(db, 'requests', uid), params)
    console.log('requests updated successfully', res)
    return true
  } catch (error) {
    console.log('requests update failed')
    return false
  }
}

export async function getRequestsByUserId (userId) {
  try {
    const db = getFirestore()
    const watchlistCollection = collection(db, 'requests')
    const q = query(watchlistCollection,
      where('userID', '==', userId))

    const watchListSnapshot = await (await getDocs(q)).docs

    const res = watchListSnapshot.map((data) => ({...data.data(), id: data.id}))

    console.log('Rental Request data:', res)

    return res
  } catch (error) {
    console.log('rental request item failed', error)
    return null
  }
}

export async function getRequestsByAgentId (userId) {
  try {
    const db = getFirestore()
    const watchlistCollection = collection(db, 'requests')
    const q = query(watchlistCollection,
      where('agentID', '==', userId))

    const watchListSnapshot = await (await getDocs(q)).docs

    const res = watchListSnapshot.map((data) => ({...data.data(), id: data.id}))

    console.log('agent request data:', res)

    return res
  } catch (error) {
    console.log('agent request item failed', error)
    return null
  }
}

export async function updateReqest (params) {
  try {
    const db = getFirestore()
    const res = await setDoc(doc(db, 'requests', params.id), params)

    console.log('products updated successfully', res)
    return true
  } catch (error) {
    console.log('products update failed', error)
    return false
  }
}
