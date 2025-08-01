import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { getContext } from './config/persist-query.tsx'
import { AuthProvider, useAuth } from './auth-provider.tsx'
import Loading from './components/Loading.tsx'

// Create a new router instance

const TanStackQueryProviderContext = getContext()
const router = createRouter({
  routeTree,
  context: {
    auth:undefined!,
    ...TanStackQueryProviderContext
  },
  // defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App = () => {
  const auth = useAuth()

  useEffect(() => {
    if (!auth.isLoading) {
      router.invalidate();
    }
  }, [auth]);

  if(auth.isLoading){
    return <main className='w-full bg-[var(--background)] flex justify-center items-center h-screen'>
        <Loading/>
    </main>
  }

  return <RouterProvider router={router}  context={{auth, ...TanStackQueryProviderContext}}/>
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <AuthProvider>
          <App/>
        </AuthProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
