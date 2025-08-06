import { useAuth } from '@/auth-provider'
import { database } from '@/firebase'
import type { Dashboard } from '@/types/data'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { format} from "date-fns"

import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import { FaEllipsisV } from 'react-icons/fa';
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from '@/components/Buttons'

import { FaPlus } from "react-icons/fa6";


export const Route = createFileRoute('/(authenticated)/list')({
  component: RouteComponent,
})

function RouteComponent() {

  const [data, setData] = useState<Dashboard[]>([])
  
  const auth = useAuth()
  const navigate = useNavigate({
    from:"/list"
  })

  useEffect(() => {
    const dashboardsQuery = query(
      collection(database,"dashboards"),
      where("createdBy","==",auth.user?.uid)
    )
    
    onSnapshot(dashboardsQuery,(result) => {
      const docs = result.docs.map((doc) => ({
        id:doc.id,
        ...doc.data()
      }) as Dashboard)

      setData(docs)
    })

  }, [])

  return <div className='w-full h-screen bg-[var(--background)] p-4'>
      <header className='w-full flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>Dashboards</h1>
          <Button
            text='Create'
            icon={<FaPlus />}
            onMouseDown={() => {
              navigate({
                      to:"/import-data"
                    })
            }}
          />
      </header>
      {
        data.length ?
          <main className='grid grid-cols-[32%_32%_32%_4%]  '>
            <h2 className='font-bold'>Name</h2>
            <h2>Owner</h2>
            <h2 >Last modified</h2>
            <h2></h2>
            
            {
              data.map((dashboard, index) => {
                return <div 
                  key={index}
                  className='grid grid-cols-[32%_32%_32%_4%] col-span-4 bg-white rounded border border-gray-300 mb-1'>
                  <button 
                    className=' p-2  cursor-pointer grid grid-cols-3 col-span-3 py-5'
                    onMouseDown={() => navigate({
                      to:"/dashboard",
                      search:{
                        id: dashboard.id
                      }
                    })}
                    >
                      <h2 className='font-bold text-start'>{dashboard.name}</h2>
                      <p className='text-start'>{dashboard.createdByEmail}</p>
                      <p className='text-start'>{format(new Date(dashboard.updatedAt.seconds * 1000 + dashboard.updatedAt.nanoseconds / 1e6), "dd/MM/yyyy")}</p>
                  </button>
                  <div className='flex items-center justify-end p-3'>
                    <Menu

                      menuButton={<MenuButton className={"cursor-pointer w-full rounded-full bg-white hover:brightness-80 h-full flex justify-center items-center"}><FaEllipsisV /></MenuButton>}>
                      <MenuItem 
                        onMouseDown={() => {
                          deleteDoc(doc(database, "dashboards", dashboard.id))
                        }}
                        className="bg-white px-5  flex gap-2 items-center p-2 rounded cursor-pointer border border-gray-300 hover:brightness-80">
                        <FaRegTrashAlt />
                        <p>Delete</p>
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              })
            }
        </main>
        :
        undefined
      }
  </div>
}
