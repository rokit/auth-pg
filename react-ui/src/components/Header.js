import React from "react";
import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <>
      <header>
        <nav className="main-nav">
          <NavLink
            exact
            to="/"
            activeClassName="active"
          >
            <span>Home</span>
          </NavLink>
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
