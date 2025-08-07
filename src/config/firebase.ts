import { initializeApp} from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const config = {
  apiKey: "AIzaSyBDRb1ULOEOrZmjfLqcJUlUJjRk_0tkkYs",
  authDomain: "dashiar-ea721.firebaseapp.com",
  projectId: "dashiar-ea721",
  storageBucket: "dashiar-ea721.firebasestorage.app",
  messagingSenderId: "935586107976",
  appId: "1:935586107976:web:c1162d33c6cca765ef3e7d"
}

export const app = initializeApp(config)
export const database = getFirestore(app)
export const auth = getAuth(app)
