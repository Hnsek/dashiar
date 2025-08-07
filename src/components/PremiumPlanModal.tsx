import { useAuth } from "@/utils/providers/auth-provider";
import { useModal } from "@/utils/providers/modal";
import { useStripe } from "@stripe/react-stripe-js";


export function PremiumPlanModal() {

    const stripe = useStripe()
    const auth = useAuth()

    const {hide} = useModal()

    const goToPaymentPage = async () => {


      await stripe?.redirectToCheckout({
        lineItems:[{
          price:import.meta.env.VITE_STRIPE_PREMIUM_ID,
          quantity:1
        }],
        mode:"subscription",
        customerEmail: auth.user?.email!,
        successUrl: `${window.location.origin}/subscription-sucess?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: window.location.href,
      })
      
    } 

    return (
    <div className="text-center space-y-6 bg-white p-5 rounded w-full">
        <h2 className="text-2xl font-semibold">Premium Plan</h2>
        <p className="text-gray-700">
          Unlock exclusive features with the Premium plan:
        </p>

        <ul className="text-left list-disc list-inside text-gray-600 space-y-2">
          <li>
            ✅ Import CSV files **over 100 rows**, ideal for managing large datasets seamlessly.
          </li>
          <li>
            ✅ Create **more than one dashboard**, enabling multiple views and custom analytics.
          </li>
          <li>
            ✅ Access **future exclusive charts**, with advanced visualizations planned upcoming.
          </li>
        </ul>

        <button
          onClick={() => goToPaymentPage()}
          className="w-full bg-[var(--primary)] text-white py-2 px-4 rounded hover:brightness-80 transition cursor-pointer"
        >
          Subscribe to Premium
        </button>
        <button
          onClick={()=>hide()}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
  );
}