import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
    </Routes>
    </BrowserRouter>
  )
}