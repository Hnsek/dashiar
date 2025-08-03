import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)')({
  beforeLoad: ({ context, location }) => {
  
      if (!context.auth.isAuthenticated) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        });
      }
    },
    component: () => <Outlet />,
})  
