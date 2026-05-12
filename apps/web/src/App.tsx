import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CharacterDetailWiredPage } from './characters/infrastructure/ui/CharacterDetailPage'
import { CharacterListWiredPage } from './characters/infrastructure/ui/CharacterListPage'
import { Layout } from './shared/infrastructure/ui/Layout/Layout'
import { FriendGroupDetailWiredPage } from './friends/infrastructure/ui/FriendGroupDetailPage'
import { FriendGroupsWiredPage } from './friends/infrastructure/ui/FriendGroupsPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CharacterListWiredPage />} />
          <Route path="/characters" element={<CharacterListWiredPage />} />
          <Route path="/character/:slug" element={<CharacterDetailWiredPage />} />
          <Route path="/friends" element={<FriendGroupsWiredPage />} />
          <Route path="/friends/:slug" element={<FriendGroupDetailWiredPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
