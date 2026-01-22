import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CharacterDetailPage } from './pages/CharacterDetailPage'
import { CharacterListPage } from './pages/CharacterListPage'
import { FavoritesPage } from './pages/FavoritesPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CharacterListPage />} />
          <Route path="/characters" element={<CharacterListPage />} />
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

