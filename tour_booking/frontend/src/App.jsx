import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tours from "./pages/Tours";
import Scan from "./pages/Scan";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";
import Payment from "./pages/Payment";
import Ticket from "./pages/Ticket";

function App() {
  const location = useLocation();
  return (
    <>
    {location.pathname !== "/" && <Navbar />}
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/bookings" element={<MyBookings />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/ticket" element={<Ticket />} />
    </Routes>
    </> 
  );
}

export default App;