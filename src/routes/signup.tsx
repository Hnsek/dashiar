import { Button } from '@/components/Buttons'
import { Input } from '@/components/Inputs'
import Loading from '@/components/Loading'
import { database } from '@/config/firebase'
import { signUp } from '@/services/firebase-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import z from 'zod/v3'

export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

type Inputs = {
  email:string;
  password:string;
}

function RouteComponent() {
  
  const { register, handleSubmit, formState:{ errors}} = useForm<Inputs>({
    resolver:zodResolver(z.object({
      email: z.string().email().nonempty(),
      password:z.string().min(8).nonempty()
    }))
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate({ from: '/signup' });
  
  const onSubmit = (data : Inputs) => {
    setLoading(true)
    signUp(data.email, data.password)
      .then(async (userCredentials) => {

        const subscriptionQuery = query(collection(database,"subscriptions"), where("userId","==", userCredentials.user.uid))
        
        const result = await getDocs(subscriptionQuery)

        const docs = result.docs

        if(!docs.length){
          addDoc(collection(database, "subscriptions"),{
            userId: userCredentials.user.uid,
            userEmail: userCredentials.user.email,
            type:"free"
          })
        }

        navigate({
          to:"/import-data",
          replace:true
        })
        setLoading(false)
      })
      .catch((error) => {
        if(error.code === "auth/email-already-in-use"){
          toast.error("E-mail already exists")
          setLoading(false)
        }
      })
  }

  return <main
    className='bg-[var(--background)] h-screen w-full'
  >

    <form className='w-full h-full flex justify-center items-center' onSubmit={handleSubmit(onSubmit)}>
        <section className='min-w-100 w-[30%]  bg-white shadow rounded flex flex-col items-center p-8 py-10 gap-3 justify-center'>
          <h1 className='font-bold text-6xl mb-8'>Sign up</h1>
          <section className='w-full flex flex-col gap-3'>
              <Input
                className='w-full p-4 px-3'
                placeholder='E-mail'
                {...register("email")}
                error={errors.email?.message}
              />

              <Input
                placeholder='Password'
                type='password'
                className='p-4 px-3 w-full'
                error={errors.password?.message}
                {...register("password")}
              />
          </section>
          {
            loading ?
              <Loading/>
              :
              <Button
                text='Create account'
                type='submit'
                className='mt-2 w-full flex items-center justify-center gap-1 bg-[var(--primary)] rounded text-[var(--text)] p-3 cursor-pointer hover:brightness-80'
              />
          }
        </section>
    </form>
    <ToastContainer/>
  </main>
}