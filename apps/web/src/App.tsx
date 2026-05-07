import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CharacterDetailPage } from './pages/CharacterDetailPage'
import { CharacterListPage } from './pages/CharacterListPage'
import { FriendGroupsPage } from './pages/FriendGroupsPage'
import { FriendGroupDetailPage } from './pages/FriendGroupDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CharacterListPage />} />
          <Route path="/characters" element={<CharacterListPage />} />
          <Route path="/character/:slug" element={<CharacterDetailPage />} />
          <Route path="/friends" element={<FriendGroupsPage />} />
          <Route path="/friends/:slug" element={<FriendGroupDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
