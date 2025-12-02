import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Nav, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AuthSection = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();   
  navigate("/", { replace: true });
};


  return (
    <Nav>
      {user ? (
        <Dropdown align="end">
          <Dropdown.Toggle as={Nav.Link} id="dropdown-user">
            Welcome, {user.sub} ({user.role})
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <>
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
          <Nav.Link as={Link} to="/register">Register</Nav.Link>
        </>
      )}
    </Nav>
  );
};

export default AuthSection;
