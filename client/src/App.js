import { BrowserRouter, Routes, Route} from "react-router-dom";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import Navbar from "./Components/Navbar";
import Profile from "./Pages/Profile";
import CreateProperty from "./Pages/CreateProperty";
import PropertyDetails from "./Components/PropertyDetails";

export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/CreateProperty" element={<CreateProperty />} />
      <Route path="/property/:id" element={<PropertyDetails />} />
    </Routes>
    </BrowserRouter>
  )
}