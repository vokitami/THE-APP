import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />  {/* Redirección */}
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
