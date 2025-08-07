import type { ComponentType, ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { ModalProvider } from "./modal";

const composeProviders = (...providers : ComponentType<{ children: ReactNode }>[]) => ({children} : {children:ReactNode}) => {
    return providers.reduceRight((accumulator, Provider) => {
        return <Provider>{accumulator}</Provider>
    },children)
}


export const AppProviders = composeProviders(
    AuthProvider,
    ModalProvider
)