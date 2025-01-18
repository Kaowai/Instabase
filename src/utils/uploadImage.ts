import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../config'
import { Post } from '../models/post.model'

export const uploadImage = async (imageFiles: File[]): Promise<string[]> => {
  if (imageFiles.length === 0) {
    alert('No images to upload')
    return []
  }

  const uploadedImageUrls: string[] = []

  // Hiển thị thông báo hoặc trạng thái upload

  try {
    for (const file of imageFiles) {
      const storageRef = ref(storage, `images/${file.name}-${Date.now()}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      // Quản lý tiến trình tải lên
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(`Upload is ${progress}% done`)
          },
          (error) => {
            console.error('Upload failed:', error)
            reject(error)
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            uploadedImageUrls.push(downloadURL)
            resolve()
          }
        )
      })
    }

    // Sau khi upload tất cả ảnh, xử lý tiếp dữ liệu (e.g., lưu vào database)
    console.log('Uploaded image URLs:', uploadedImageUrls)

    // Thông báo thành công
  } catch (error) {
    console.error('Error uploading images:', error)
    alert('Failed to upload images. Please try again.')
  } finally {
    // Any cleanup code if needed
  }
  return uploadedImageUrls
}

export const uploadAvatar = async (imageFile: File): Promise<string> => {
  if (!imageFile) {
    throw new Error('No image to upload')
  }

  try {
    // Create storage reference with unique name
    const storageRef = ref(storage, `avatars/${imageFile.name}-${Date.now()}`)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)

    // Return promise that resolves with download URL
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        // Progress handler
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
        },
        // Error handler
        (error) => {
          console.error('Upload failed:', error)
          reject(error)
        },
        // Complete handler
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(downloadURL)
          } catch (error) {
            console.error('Error getting download URL:', error)
            reject(error)
          }
        }
      )
    })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    throw error
  }
}

export const sortPostDate = (postList: Post[]): Post[] => {
  return postList.sort((a, b) => new Date(b?.createdDate).getTime() - new Date(a?.createdDate).getTime())
}
