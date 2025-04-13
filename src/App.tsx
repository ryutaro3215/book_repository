import './App.css'
import { Routes, Route } from 'react-router'
import SearchPage from './pages/SearchPage'
import SearchResultPage from './pages/SearchResultPage'
import BookListPage from './pages/BookListPage'
import ErrorPage from './pages/ErrorPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search/result" element={<SearchResultPage />} />
        <Route path="/books/" element={<BookListPage />} />
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </>
  )
}

export default App
