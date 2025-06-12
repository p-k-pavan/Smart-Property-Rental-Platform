import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import Navbar from "./Components/Navbar";
import Profile from "./Pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    </BrowserRouter>
  )
}