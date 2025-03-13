import React, { useState } from "react";
import "./Navbar.css";
import logo from "../assets/logo.webp";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomeNavBar({ navBarData }) {
  return (
    <nav className="navbar">
      <div className="logo-icon">
        {navBarData.logo && <img src={logo} alt="logo" className="logo-img" />}
        <h1>{navBarData.name}</h1>
      </div>
      {/* Menu Items */}
      <div className="home-menu">
        <ul>
          {navBarData.menuItems.map((item, index) => (
            <li key={index} onClick={item.action}>
              <a>{item.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default HomeNavBar;
