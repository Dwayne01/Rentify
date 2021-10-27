import {doc, getDoc, setDoc} from 'firebase/firestore'
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'

export async function getUserProfile (uid) {
  console.log(`user id ${uid}`)
  const db = window.state.db
  const citiesCol = doc(db, `users/${uid}`)
  const citySnapshot = await getDoc(citiesCol)

  if (citySnapshot.exists()) {
    console.log('Document data:', citySnapshot.data())
    return citySnapshot.data()
  }
}

export async function updateUserProfile (params, uid) {
  try {
    const db = window.state.db
    await setDoc(doc(db, 'users', uid), params)
    console.log('profile updated successfully')
    return true
  } catch (error) {
    console.log('profile update failed')
    return false
  }
}

export async function uploadImage (file, path) {
  try {
    const storage = getStorage()
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const url = await getDownloadURL(snapshot.ref)
    return url
  } catch (error) {
    console.log('Upload failed!')
    return null
  }
}
