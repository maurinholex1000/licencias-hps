import { useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLicencia } from '../../context/LicenciaContext';
import { hacerPedido } from '../../services/api';

const BadgeSaldosRRHH = () => {
  const { agente } = useLicencia();
  const [enviando, setEnviando] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const saldos = agente?.saldosRRHH;

  if (!saldos) return null;

  // Abrir el modal previa validación de DNI
  const handleAbrirModal = () => {
    if (!agente?.dni) {
      toast.error('No hay DNI verificado.');
      return;
    }
    setShowModal(true);
  };

  // Confirmar y realizar la petición
  const handleConfirmarPedido = async () => {
    setEnviando(true);
    try {
      const fechaHoy = new Date().toLocaleDateString('es-AR');
      await hacerPedido({
        dni: agente.dni,
        nombre: agente.nombre,
        fecha: fechaHoy,
      });

      toast.success('✅ Pedido realizado correctamente en PedidosPendientes');
      setShowModal(false); // Cerramos el modal tras la confirmación exitosa
    } catch (err) {
      console.error(err);
      toast.error(`Error al registrar el pedido: ${err.message}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
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
        <div className="mt-2 pt-2 border-top d-flex justify-content-between align-items-center">
          <Button
            variant="warning"
            size="sm"
            className="fw-bold text-dark"
            onClick={handleAbrirModal}
            disabled={enviando}
          >
            📝 Hacer pedido
          </Button>

          <div className="small text-muted">
            <strong>PENDIENTES A LA FECHA:</strong>{' '}
            <span className="badge bg-warning text-dark">{saldos.actualizacion}</span>
          </div>
        </div>
      </Alert>

      {/* Modal de Confirmación */}
      <Modal show={showModal} onHide={() => !enviando && setShowModal(false)} centered>
        <Modal.Header closeButton={!enviando}>
          <Modal.Title>Confirmar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">¿Está seguro de que desea registrar este pedido de actualización?</p>
          <ul className="list-unstyled bg-light p-3 rounded mb-0">
            <li><strong>DNI:</strong> {agente?.dni}</li>
            <li><strong>Agente:</strong> {agente?.nombre || 'No especificado'}</li>
            <li><strong>Fecha:</strong> {new Date().toLocaleDateString('es-AR')}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)} 
            disabled={enviando}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmarPedido} 
            disabled={enviando}
          >
            {enviando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Registrando...
              </>
            ) : (
              'Confirmar Pedido'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BadgeSaldosRRHH;