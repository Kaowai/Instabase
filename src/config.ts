// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDpgfRC5H0WplmXXKmgKSdqtrXQ3lrX4-A',
  authDomain: 'socialite-22bba.firebaseapp.com',
  projectId: 'socialite-22bba',
  storageBucket: 'socialite-22bba.firebasestorage.app',
  messagingSenderId: '138335109412',
  appId: '1:138335109412:web:17c67a252d21566846b3b1',
  measurementId: 'G-CSTNPWH6P4'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const storage = getStorage(app) // Storage
