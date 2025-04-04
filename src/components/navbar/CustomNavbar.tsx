import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CustomNavbar.css";
import authService from "../../services/authService";
import { Role, User } from "../../models/user";
import userService from "../../services/userService";

export default function CustomNavbar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
      <a className="navbar-brand" href="/menu">Food Ordering System</a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/menu">Menu</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/history">History</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/report">Report page</a>
          </li>
        </ul>

        <div className="ml-auto d-flex align-items-center">
          <p className="text-white mb-0 mr-2">Welcome, {currentUser.email}! ({currentUser.role})</p>
          <button type="button" className="btn btn-outline-danger" onClick={authService.logout}>Logout</button>
        </div>
      </div>

    </nav>
  );
}
