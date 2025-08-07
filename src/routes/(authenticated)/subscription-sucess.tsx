import { database } from '@/config/firebase'
import type { Subscription } from '@/types/subscription'
import { useAuth } from '@/utils/providers/auth-provider'
import { createFileRoute, Link } from '@tanstack/react-router'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { useEffect } from 'react'

type Search = {
  sessionId:string | undefined
}

export const Route = createFileRoute('/(authenticated)/subscription-sucess')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): Search => ({
    sessionId: typeof search.session_id === 'string' ? search.session_id : undefined,
  }),
})

function RouteComponent() {
  const auth = useAuth()
  const { sessionId } = Route.useSearch()

  useEffect(() => {
    const execution = async () => {
      const subscriptionQuery = query(collection(database,"subscriptions"), where("userId", "==", auth.user?.uid ))
  
      const data = await getDocs(subscriptionQuery)

      if(data.docs.length && auth.user && sessionId){

        const [ subscriptionDoc ] = data.docs

        const subscription = subscriptionDoc.data() as Subscription

        if(subscription.type === "premium"){
          return
        }

        const newSubscription : Subscription = {
          ...subscription,
          sessionId,
          type: "premium"
        }

        updateDoc(doc(database,"subscriptions",subscriptionDoc.id),newSubscription)
      }
    }

    execution()
  },[])

  return <div className='w-full h-full bg-[var(--background)] flex items-center justify-center'>
      <div className="text-center space-y-6 bg-white rounded w-full max-w-md mx-auto p-10">
        <h2 className="text-2xl font-semibold text-green-600">Subscription Successful</h2>
        <p className="text-gray-700">
          Thank you for subscribing to the Premium Plan!
        </p>

        <ul className="text-left list-disc list-inside text-gray-600 space-y-2">
          <li>✅ You can now import CSV files over 100 rows.</li>
          <li>✅ You can create more than one dashboard.</li>
          <li>✅ You’ll get access to future exclusive charts.</li>
        </ul>

        <Link
          to='/list'
          className="inline-block bg-[var(--primary)] text-white py-2 px-4 rounded hover:brightness-90 transition"
        >
          Go to Dashboard
        </Link>
      </div>
  </div>

    
}
