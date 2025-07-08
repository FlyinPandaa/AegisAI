import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
// import Dashboard from "./pages/Dashboard";
// import Header from "./components/Header";
import Navbar from "./components/Navbar";  

function App() {
  return (
    <Router>
      {/* <Header />  */}
      <Navbar />  
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
