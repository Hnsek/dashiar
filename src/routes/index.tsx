import { createFileRoute, Link } from '@tanstack/react-router'
import { FaArrowRight } from "react-icons/fa6";

export const Route = createFileRoute('/')({
  component: App,
})

function App() {

  return (
    <main className='flex flex-col h-screen bg-[var(--background)]'>
        <section className='flex-1 h-full flex justify-center items-center flex-col gap-8'>
          <h1 className='font-bold text-6xl text-center'>Create dashboards effortlessly!</h1>
          <p className='w-[90%] sm:w-[60%] text-center text-[var(--text-secondary)]'>Create powerful, customized dashboards in minutes—no technical skills or coding required. Our intuitive platform lets you visualize your data with easy drag-and-drop tools, so you can focus on insights instead of complexity.</p>
          <Link
              to='/import-data'
              className='flex items-center gap-1 bg-[var(--primary)] rounded text-[var(--text)] p-3 cursor-pointer hover:brightness-80'
            >
            <p>Import CSV</p>
            <FaArrowRight />
          </Link>
        </section>
    </main>
  )
}
