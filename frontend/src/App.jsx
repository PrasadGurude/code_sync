import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import { Toaster } from 'react-hot-toast';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Toaster position='top-right' />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}                     ></Route>
          <Route path="/home" element={<Home />}                 ></Route>
          <Route path="/editor/:roomId" element={<EditorPage />} ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
