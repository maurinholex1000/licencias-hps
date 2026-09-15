import { Form, Row, Col } from 'react-bootstrap';

const DestinatarioStep = ({ agente, onChange }) => (
  <fieldset className="form-section">
    <legend className="visually-hidden">Destinatario y Emisión</legend>
    <h3>1. Destinatario y Emisión</h3>
    <Row>
      <Col md={6}>
        <Form.Group className="mb-2">
          <Form.Label className="fw-bold">AL SEÑOR (Encabezado superior):</Form.Label>
          <Form.Control
            type="text"
            value={agente.dirigido}
            onChange={(e) => onChange('dirigido', e.target.value)}
            required
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-2">
          <Form.Label className="fw-bold">Fecha de Emisión del Documento:</Form.Label>
          <Form.Select
            value={agente.fechaEmision}
            onChange={(e) => onChange('fechaEmision', e.target.value)}
          >
            <option value="HOY">Completar con la fecha de hoy</option>
            <option value="BLANCO">Dejar líneas de puntos en blanco</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  </fieldset>
);

export default DestinatarioStep;