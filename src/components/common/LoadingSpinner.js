import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ mensaje = 'Cargando...', size = 'md' }) => (
  <div className="text-center py-4">
    <Spinner animation="border" variant="primary" size={size === 'sm' ? 'sm' : undefined} />
    <p className="mt-2 text-muted mb-0">{mensaje}</p>
  </div>
);

export default LoadingSpinner;