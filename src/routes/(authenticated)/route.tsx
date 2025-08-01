import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)')({
  beforeLoad: ({ context, location }) => {
  
      console.warn("context: ", context)
  
      if (!context.auth.isAuthenticated) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        });
      }
    },
    component: () => <Outlet />,
})  
