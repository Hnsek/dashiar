import { Button } from '@/components/Buttons'
import { Input } from '@/components/Inputs'
import { signInWithEmailAndPassword, signInWithGoogle } from '@/services/firebase-auth';
import { createFileRoute, Link, useNavigate, } from '@tanstack/react-router'
import { FcGoogle } from "react-icons/fc";
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from 'zod/v3';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '@/auth-provider';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

export const Route = createFileRoute('/login')({
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
      password:z.string().nonempty()
    }))
  })
  
   const navigate = useNavigate({ from: '/login' });

  const onSubmit = (data : Inputs) => {
    signInWithEmailAndPassword(data.email, data.password)
      .then(() => navigate({
        to:"/list",
        replace: true
      }))
      .catch((error) => {
          console.error(error)
          toast.error("Credentials incorrent")
      })
  }


  return <main
    className='bg-[var(--background)] h-screen w-full'
  >

    <form className='w-full h-full flex justify-center items-center' onSubmit={handleSubmit(onSubmit)}>
        <section className='min-w-100 w-[30%]  bg-white shadow rounded flex flex-col items-center p-8 py-10 gap-3 justify-center'>
          <h1 className='font-bold text-6xl mb-8'>Login</h1>
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
          <Button
            text='Login'
            type='submit'
            className='mt-2 w-full flex items-center justify-center gap-1 bg-[var(--primary)] rounded text-[var(--text)] p-3 cursor-pointer hover:brightness-80'
          />
          <section className='flex gap-2 w-full flex-col sm:flex-row sm:justify-center flex-wrap mt-2'>
              <Button
                onClick={() => {
                  signInWithGoogle()
                  .then(() => {
                    navigate({
                      to:"/list",
                    })
                  })
                }}
                className='border px-10 p-2 flex items-center justify-center gap-1 rounded cursor-pointer hover:brightness-80 hover:bg-[#c7c8c9]'
                icon={<FcGoogle size={40}/>}/>
          </section>
          <p>Or</p>
          <Link
            to='/signup'
            className='w-full flex items-center justify-center gap-1 bg-[var(--primary)] rounded text-[var(--text)] p-3 cursor-pointer hover:brightness-80'
          >Sign up</Link>
        </section>
    </form>
    <ToastContainer/>
  </main>
}