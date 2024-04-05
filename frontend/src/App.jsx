import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/Signin'
import SignUp from './pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
