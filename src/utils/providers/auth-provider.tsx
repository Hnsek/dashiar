import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../../firebase";


export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading:boolean;
    logout: () => Promise<void>
}


export let isAuthenticated = false

const AuthContext = createContext<AuthState | undefined>(undefined)
export const AuthProvider = ({children } : {children : ReactNode}) => {
    const [user, setUser] = useState<User|null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        onAuthStateChanged(auth,(user) => {

            isAuthenticated = !!user

            setUser(user)
            setIsLoading(false)
        })
    }, [])

    const logout = () => signOut(auth)

    return <AuthContext.Provider value={{user, isLoading, isAuthenticated:!!user, logout}}>
        {children}
    </AuthContext.Provider>
} 


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth usado fora do AuthProvider');
  return ctx;
}