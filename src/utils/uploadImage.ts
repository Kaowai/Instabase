import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../config'

const uploadImage = (file: File): void => {
  if (!file) {
    console.error('No file selected')
    return
  }

  // Create a storage reference
  const storageRef = ref(storage, `images/${file.name}`)

  // Start the upload
  const uploadTask = uploadBytesResumable(storageRef, file)

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Monitor progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log(`Upload is ${progress}% done`)
    },
    (error) => {
      console.error('Upload failed', error)
    },
    async () => {
      // Upload complete, get the download URL
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        console.log('File available at:', downloadURL)
      } catch (error) {
        console.error('Failed to get download URL', error)
      }
    }
  )
}

export default uploadImage
