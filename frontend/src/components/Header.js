import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Header = () => {
    return (
      <header className="header">
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
    );
  };

export default Header;
