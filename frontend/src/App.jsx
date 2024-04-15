import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/Signin'
import SignUp from './pages/Signup'
import Home from './pages/Home'
import Destination from './pages/Destination'
import Flight from './pages/Flight'
import Hotel from './pages/Hotel'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path='/destinations' element={<Destination />} />
        <Route path='/flights' element={<Flight />} />
        <Route path='/hotels' element={<Hotel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
