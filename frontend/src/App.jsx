import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}             ></Route>
        <Route path="/home" element={<Home />}         ></Route>
        <Route path="/editor" element={<EditorPage />} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
