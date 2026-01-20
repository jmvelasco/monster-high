import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Monster High - Home (Placeholder)</div>} />
        <Route path="/character/:slug" element={<div>Character Detail (Placeholder)</div>} />
        <Route path="/favorites" element={<div>Favorites (Placeholder)</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

