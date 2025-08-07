import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, database } from "../../config/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import type { Subscription } from "@/types/subscription";


export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading:boolean;
    logout: () => Promise<void>,
    subscriptions: Subscription[]
}


export let isAuthenticated = false

const AuthContext = createContext<AuthState | undefined>(undefined)
export const AuthProvider = ({children } : {children : ReactNode}) => {
    const [user, setUser] = useState<User|null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

    useEffect(() => {
        onAuthStateChanged(auth,async (user) => {

            isAuthenticated = !!user

            setUser(user)
            setIsLoading(false)
        })




    }, [])

    useEffect(() => {

        if(!user) {
            return
        }

        const execution = async () => {
            const subscriptionQuery = query(collection(database,"subscriptions"),where("userId","==", user?.uid))
            
            onSnapshot(subscriptionQuery, (result) => {
                const subscriptions = result.docs.map((doc) => ({
                        id:doc.id,
                        ...doc.data()
                    }) as Subscription)

                    setSubscriptions(subscriptions)
            })

        }

        execution()

    }, [user])

    const logout = () => signOut(auth)

    return <AuthContext.Provider value={{user, isLoading, isAuthenticated:!!user, logout, subscriptions}}>
        {children}
    </AuthContext.Provider>
} 


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth usado fora do AuthProvider');
  return ctx;
}