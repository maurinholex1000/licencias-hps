import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container fluid className="py-3">
        <Outlet />
      </Container>
      <footer className="text-center py-3 text-muted small">
        Desarrollado por <strong>Lic. Juan E. Orgas</strong> con IA © 2026
      </footer>
    </>
  );
};

export default Layout;