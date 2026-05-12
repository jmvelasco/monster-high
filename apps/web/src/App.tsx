import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CharacterDetailWiredPage } from './characters/infrastructure/ui/CharacterDetailPage'
import { CharacterListWiredPage } from './characters/infrastructure/ui/CharacterListPage'
import { Layout } from './components/Layout'
import { FriendGroupDetailPage } from './pages/FriendGroupDetailPage'
import { FriendGroupsPage } from './pages/FriendGroupsPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CharacterListWiredPage />} />
          <Route path="/characters" element={<CharacterListWiredPage />} />
          <Route path="/character/:slug" element={<CharacterDetailWiredPage />} />
          <Route path="/friends" element={<FriendGroupsPage />} />
          <Route path="/friends/:slug" element={<FriendGroupDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
