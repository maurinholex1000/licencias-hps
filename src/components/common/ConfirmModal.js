import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  titulo = 'Confirmar',
  mensaje = '¿Está seguro?',
  textoConfirmar = 'Sí, continuar',
  textoCancelar = 'Cancelar',
  variantConfirmar = 'primary',
}) => (
  <Modal show={show} onHide={onHide} centered backdrop="static">
    <Modal.Header closeButton>
      <Modal.Title>{titulo}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{mensaje}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>{textoCancelar}</Button>
      <Button variant={variantConfirmar} onClick={onConfirm}>{textoConfirmar}</Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal;