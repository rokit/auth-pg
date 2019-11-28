import React from "react";
import { NavLink } from 'react-router-dom'
import "./Header.css";

function Header() {
  return (
    <>
      <header>
        <h1><NavLink exact
            to="/"
            activeClassName="active">Story Game</NavLink></h1>
        <nav className="main-nav">
          <NavLink
            to="/signup"
            activeClassName="active"
          >
            <span>Sign Up</span>
          </NavLink>
          <NavLink
            to="/protected"
            activeClassName="active"
          >
            <span>Protected URL</span>
          </NavLink>
        </nav>
      </header>
    </>
  );
}

export default Header;
