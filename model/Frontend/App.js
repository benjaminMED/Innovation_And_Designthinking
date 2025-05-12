import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Tailwind-styled UI components
const Button = ({ children, ...props }) => (
  <button className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600" {...props}>
    {children}
  </button>
);

const Input = ({ ...props }) => (
  <input className="border p-2 rounded w-full mb-4" {...props} />
);

const Card = ({ children }) => (
  <div className="bg-white p-6 shadow-xl rounded-xl">{children}</div>
);

const CardContent = ({ children }) => <div>{children}</div>;

// Login Page
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) navigate("/dashboard");
  };

  return (
    <motion.div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <Card className="w-96">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleLogin}>Login</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Dashboard Page
function Dashboard() {
  const navigate = useNavigate();

  return (
    <motion.div className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-50 p-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Crowd Detection Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Map Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Live Map</h2>
          <iframe
            title="Live Map"
            className="w-full h-64 rounded-xl border"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.776126835368!2d80.23368367488637!3d13.073267487259959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52664d36e763b5%3A0x7c73bc5fbbf3cd32!2sChennai!5e0!3m2!1sen!2sin!4v1616673659797!5m2!1sen!2sin"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Camera Feed Button */}
        <div className="flex items-center justify-center">
          <Button className="text-xl px-10 py-6" onClick={() => navigate("/camera")}>
            Watch Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Camera Feed Page
function CameraFeed() {
  return (
    <motion.div className="min-h-screen p-10 bg-gradient-to-br from-yellow-100 to-red-100 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6 text-center">Live Camera Feed</h1>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-3xl h-[75vh] border-4 border-dashed border-red-400 rounded-xl shadow-lg overflow-hidden">
          <img
            src="http://127.0.0.1:5000/video"
            alt="Live Feed"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}

// Main App Routing
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/camera" element={<CameraFeed />} />
      </Routes>
    </Router>
  );
}
