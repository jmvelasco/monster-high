import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Factory } from './shared/infrastructure/Factory'
import { AppProviders } from './shared/infrastructure/ui/AppProviders'
import './styles/fonts.css'
import './styles/global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
})

const characterUseCases = {
  list: Factory.createListCharactersUseCase(),
  findBySlug: Factory.createFindCharacterBySlugUseCase(),
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProviders characterUseCases={characterUseCases}>
        <App />
      </AppProviders>
    </QueryClientProvider>
  </StrictMode>
)
