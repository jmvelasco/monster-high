import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/global.css'
import App from './App.tsx'
import { Factory } from './shared/infrastructure/Factory'
import { AppProviders } from './shared/infrastructure/ui/AppProviders'

const characterUseCases = {
  list: Factory.createListCharactersUseCase(),
  findBySlug: Factory.createFindCharacterBySlugUseCase(),
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders characterUseCases={characterUseCases}>
      <App />
    </AppProviders>
  </StrictMode>
)
