import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tours from "./pages/Tours";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  return (
    <>
    {location.pathname !== "/" && <Navbar />}
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/bookings" element={<MyBookings />} />
    </Routes>
    </> 
  );
}

export default App;