import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <header className="header">
      <Link to="/" className="navbar-logo">AegisAI</Link>

      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/about">About</Link>
      </nav>

      <Link to="/get-started" className="get-started-btn">Get Started</Link>
    </header>
  );
};

export default Navbar;
