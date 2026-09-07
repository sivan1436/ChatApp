import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Lofinpage from './pages/Loginpage'
import Profilepage from './pages/Profilepage'
import assets from './assets/assets'

const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Routes >
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Lofinpage />} />
        <Route path='/profile' element={<Profilepage />} />

      </Routes>
    </div>
  )
}

export default App
