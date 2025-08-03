import { createFileRoute } from '@tanstack/react-router'

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

  console.warn("id: ", id)

  return <main className='w-full h-screen bg-[var(--background)]'></main>
}
