import { createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword as signInDefault, signOut } from "firebase/auth"
import {auth} from "../firebase"

export const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth,provider)
}

export const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider()
    return signInWithPopup(auth,provider)
}

export const signUp = (email : string, password: string) => createUserWithEmailAndPassword(auth, email, password)

export const signInWithEmailAndPassword = (email: string, password:string) => signInDefault(auth,email, password)

export const logout = () => signOut(auth)