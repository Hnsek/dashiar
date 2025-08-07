import { useAuth } from "@/utils/providers/auth-provider";
import { useStripe } from "@stripe/react-stripe-js";

type Props = {
    onClose?: () => void
}

export function PremiumPlanModal({ onClose } : Props) {

    const stripe = useStripe()
    const auth = useAuth()

    const goToPaymentPage = async () => {


      await stripe?.redirectToCheckout({
        lineItems:[{
          price:import.meta.env.VITE_STRIBE_PREMIUM_ID,
          quantity:1
        }],
        mode:"subscription",
        customerEmail: auth.user?.email!,
        successUrl: window.location.href,
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Subscribe to Premium
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
  );
}