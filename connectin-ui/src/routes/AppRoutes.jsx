import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/profile/Profile";
import ServiceDetails from "../pages/services/ServiceDetails";
import MyBookings from "../pages/bookings/MyBookings";
import AddService from "../pages/profile/AddService";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/add-service" element={<AddService />} />
      <Route path="/service/:id" element={<ServiceDetails />} />
      <Route path="/bookings" element={<MyBookings />} />
    </Routes>
  );
}
