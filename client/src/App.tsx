import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Login from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import { Toaster } from "react-hot-toast"
import { useAuth } from "../context/AuthContext"

const App = () => {
  const { authUser } = useAuth();

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-cover bg-no-repeat bg-center">
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" /> } />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" /> } />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" /> } />
      </Routes>
    </div>
  )
}

export default App
