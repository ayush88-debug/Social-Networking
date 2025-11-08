import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications"; // Import the new Notifications page

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route path="friends" element={<Friends />} />
        <Route path="messages" element={<Messages />} />
        <Route path="notifications" element={<Notifications />} /> {/* Add the notifications route */}
      </Route>

      {/* Public Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}