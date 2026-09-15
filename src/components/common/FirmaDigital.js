import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useFirmaDigital } from '../../hooks/useFirmaDigital';
import ModalFirmaAmpliada from './ModalFirmaAmpliada';

const FirmaDigital = ({ firma, altoInicial = 150, label = 'Firma Digital' }) => {
  const [showModal, setShowModal] = useState(false);

  const aplicarFirmaAmpliada = (dataURL) => {
    firma.cargarDesdeDataURL(dataURL);
  };

  return (
    <>
      {label && <label className="fw-bold mb-1 d-block">{label}</label>}
      <div className="contenedor-canvas-firma">
        <canvas ref={firma.canvasRef} {...firma.handlers} />
      </div>
      <div className="d-flex gap-2 mt-2">
        <Button variant="danger" size="sm" onClick={firma.limpiar}>
          <i className="bi bi-trash me-1"></i> Borrar Firma
        </Button>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          <i className="bi bi-zoom-in me-1"></i> Ampliar
        </Button>
      </div>
      <ModalFirmaAmpliada
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={aplicarFirmaAmpliada}
      />
    </>
  );
};

export default FirmaDigital;