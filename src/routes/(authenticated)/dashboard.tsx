import { DashboardSidebar } from '@/components/Sidebar';
import { database } from '@/firebase';
import { type Dashboard } from '@/types/data';
import { createFileRoute } from '@tanstack/react-router'
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type Search = {
  id:string | undefined;
}

export const Route = createFileRoute('/(authenticated)/dashboard')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: typeof search.id === 'string' ? search.id : undefined,
  }),
})

function RouteComponent() {

  const { id } = Route.useSearch()

  const [data, setData] = useState<Dashboard>()

  useEffect(() => {
      const q = query(collection(database,"dashboards"))

      onSnapshot(q, (snapshot) => {
        const [data] : Dashboard[] = snapshot.docs.map((doc) => {
          const dashboard  = {
            id:doc.id,
            ...doc.data()
          } as Dashboard

          return dashboard
        })

        console.warn("data: ", data)

        setData({
          ...data,
          charts:[
            {
              height: 200,
              width: 200,
              y:15,
              x:15
            }
          ]
        })
      })
  },[])

  return <main className='w-full h-screen bg-[var(--background)]'>
      <DashboardSidebar/>
  </main>
}
