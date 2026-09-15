import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <BSNavbar expand="lg" className="navbar-dark" style={{ backgroundColor: '#0056b3' }}>
      <Container fluid>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold">
          🏥 Sistema de Licencias — HPS
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="nav-main" />
        <BSNavbar.Collapse id="nav-main">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={isActive('/')}>Inicio</Nav.Link>
            <Nav.Link as={Link} to="/agente" active={isActive('/agente')}>Agente</Nav.Link>
            <Nav.Link as={Link} to="/jefe" active={isActive('/jefe')}>Jefatura</Nav.Link>
            <Nav.Link as={Link} to="/ayuda" active={isActive('/ayuda')}>Ayuda</Nav.Link>
          </Nav>
          <Button variant="outline-light" size="sm" onClick={() => navigate('/')}>
            <i className="bi bi-house-door me-1"></i> Menú
          </Button>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;