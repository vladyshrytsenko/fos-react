import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CustomNavbar.css";
import authService from "../../services/authService";
import { Role, User } from "../../models/user";
import userService from "../../services/userService";
import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

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
    <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/menu">FOS React</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/menu">Menu</Nav.Link>
            <Nav.Link href="/history">History</Nav.Link>
            <Nav.Link href="/report">Report page</Nav.Link>
            <Nav.Link href="/support/topics">Support chat <Badge bg="light" text="dark"> +2</Badge></Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={`${currentUser.email}! (${currentUser.role})`} id="basic-nav-dropdown">
              {currentUser.role === 'ADMIN' && (
                <NavDropdown.Item href="/users">System users</NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={authService.logout}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
