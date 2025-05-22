import { useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const { token, logout, userRole } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">
          TaskBoard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token && (
              <>
                <Nav.Link as={Link} to="/tasks">
                  Tasks
                </Nav.Link>
                <Nav.Link as={Link} to="/create-task">
                  Create Task
                </Nav.Link>
                {userRole === "ADMIN" && (
                  <Nav.Link as={Link} to="/admin/users">
                    User Management
                  </Nav.Link>
                )}
              </>
            )}
            {!token && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
          {token && (
            <Button variant="outline-light" onClick={logout}>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
