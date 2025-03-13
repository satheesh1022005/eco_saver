import React, { useState } from "react";
import "./Navbar.css";
import logo from "../assets/logo.webp";
import { AiOutlineClose } from "react-icons/ai";

function NavBar({ navBarData, setView, erDiagram }) {
  const [menuOpen, setMenuOpen] = useState(false);
  //console.log(navBarData);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleNavClick = (action) => {
    action();
    toggleMenu();
  };
  // Menu items data stored in an object
  return (
    <nav className={`navbar ${menuOpen ? "menu-open" : ""}`}>
      <div className="logo-icon">
        {navBarData.logo && <img src={logo} alt="logo" className="logo-img" />}
        <h1>{navBarData.name}</h1>
      </div>
      <div className="hamburger-icon" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      {/* Menu Overlay for Back Blur */}
      {menuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      {/* Menu Items */}
      {menuOpen && (
        <div className="menu">
          <div className="menu-top">
            <img src={logo} alt="logo" className="logo-img" />
            <div className="close-icon">
              <AiOutlineClose size={30} color="#333" onClick={toggleMenu} />
            </div>
          </div>
          <ul>
            {navBarData.menuItems.map((item, index) => (
              <li key={index} onClick={() => handleNavClick(item.action)}>
                <a>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
