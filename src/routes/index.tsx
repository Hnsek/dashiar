import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
        <h1 className='font-bold'>Create dashboards effortlessly!</h1>
    </div>
  )
}
