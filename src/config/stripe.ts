import { loadStripe, type Stripe } from "@stripe/stripe-js"



let stripe : Promise<Stripe | null>
export const getStripe = async () => {
    const result = await stripe
    
    if(!result){
        if(!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
            throw Error("STRIPE_PUBLISHABLE_KEY not inserted in environment variables")
        }
        stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)
    }

    return stripe
}