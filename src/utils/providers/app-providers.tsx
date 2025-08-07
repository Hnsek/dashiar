import type { ComponentType, ReactNode } from "react";
import { AuthProvider } from "./auth-provider";
import { ModalProvider } from "./modal";

import {
  Elements,
} from '@stripe/react-stripe-js';
import { getStripe } from "@/config/stripe";

const composeProviders = (...providers : ComponentType<{ children: ReactNode }>[]) => ({children} : {children:ReactNode}) => {
    console.warn("children: ", children)
    return providers.reduceRight((accumulator, Provider) => {
        return <Provider>{accumulator}</Provider>
    },children)
}


export const AppProviders = composeProviders(
    ({children}:{children : ReactNode}) => {
        return <Elements stripe={getStripe()}>
            {children}
        </Elements>
    },
    AuthProvider,
    ModalProvider,
)