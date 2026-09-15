import { Alert } from 'react-bootstrap';
import { useLicencia } from '../../context/LicenciaContext';

const BadgeSaldosRRHH = () => {
  const { agente } = useLicencia();
  const saldos = agente?.saldosRRHH;

  if (!saldos) return null;

  return (
    <Alert variant="info" className="agente-info-badge my-3">
      <strong className="d-block mb-2 text-primary">
        📊 Información de Licencias Registradas en RRHH:
      </strong>
      <div>
        • <strong>LAO:</strong>{' '}
        <span className="fw-bold text-primary">{saldos.laoTotal} días</span>{' '}
        — <em className="text-muted">({saldos.laoDetalle})</em>
      </div>
      <div>
        • <strong>COMPENSATORIOS:</strong>{' '}
        <span className="fw-bold text-primary">{saldos.compensatorios} Hs.</span>
      </div>
      <div className="mt-2 pt-2 border-top text-end small text-muted">
        <strong>PENDIENTES A LA FECHA:</strong>{' '}
        <span className="badge bg-warning text-dark">{saldos.actualizacion}</span>
      </div>
    </Alert>
  );
};

export default BadgeSaldosRRHH;