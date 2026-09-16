import { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalFirmaAmpliada = ({ show, onHide, onConfirm }) => {
  const canvasRef = useRef(null);
  const dibujandoRef = useRef(false);
  const [vacia, setVacia] = useState(true);

  useEffect(() => {
    if (!show) return;
    // Esperar a que el modal termine de montar el DOM antes de medir
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      // Reset total, escala una sola vez
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = '#001a4d';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      setVacia(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [show]);

  // Coordenadas en CSS px (sin multiplicar por DPR acá, porque el ctx ya está escalado)
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  };

  const start = (e) => {
    dibujandoRef.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (!e.touches) e.preventDefault();
  };

  const move = (e) => {
    if (!dibujandoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setVacia(false);
    e.preventDefault();
  };

  const end = () => {
    dibujandoRef.current = false;
  };

  const limpiar = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Limpiar en coordenadas internas reales
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setVacia(true);
  };

  const confirmar = () => {
    if (!vacia) {
      const dataURL = canvasRef.current.toDataURL('image/png');
      onConfirm(dataURL);
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Ampliación de Firma Digital</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column">
        <div className="modal-firma-body flex-grow-1">
          <canvas
            ref={canvasRef}
            onMouseDown={start}
            onMouseMove={move}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={start}
            onTouchMove={move}
            onTouchEnd={end}
          />
        </div>
        <div className="d-flex gap-2 mt-3">
          <Button variant="danger" onClick={limpiar} className="flex-fill">
            <i className="bi bi-trash me-1"></i> Borrar
          </Button>
          <Button variant="secondary" onClick={onHide} className="flex-fill">
            <i className="bi bi-x-lg me-1"></i> Cancelar
          </Button>
          <Button variant="success" onClick={confirmar} className="flex-fill">
            <i className="bi bi-check-lg me-1"></i> Confirmar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalFirmaAmpliada;