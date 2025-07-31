import React from 'react'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 60 * 24, // mantém cache por 24h :contentReference[oaicite:2]{index=2}
        staleTime: 1000 * 60 * 5,     // 5 min de frescor
      },
    },
  })

  const persister = createAsyncStoragePersister({
    storage: window.localStorage,
    key: 'my-app-cache',
    throttleTime: 1000,
  })

  return {
    queryClient,
    persistOptions: { persister, maxAge: 1000 * 60 * 60 * 24 },
  }
}

export const Provider: React.FC<{
  queryClient: QueryClient
  persistOptions: any
  children: React.ReactNode
}> = ({ queryClient, persistOptions, children }) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  )
}