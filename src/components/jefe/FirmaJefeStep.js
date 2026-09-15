import { Form, Row, Col } from 'react-bootstrap';
import FirmaDigital from '../common/FirmaDigital';

const FirmaJefeStep = ({ firma, jefe, onChange }) => (
  <fieldset className="form-section">
    <legend className="visually-hidden">Firma de Jefatura</legend>
    <h3>3. Fecha de Firma, Datos del Responsable</h3>
    <Row>
      <Col md={6}>
        <Form.Group className="mb-2">
          <Form.Label className="fw-bold">Apellido y Nombre Jefe/a:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: Dr. Pérez Juan"
            value={jefe.jefeNombre}
            onChange={(e) => onChange('jefeNombre', e.target.value)}
          />
          <Form.Check
            className="mt-1"
            type="checkbox"
            label="¿Se encuentra A Cargo? (A/C)"
            checked={jefe.jefeACargo}
            onChange={(e) => onChange('jefeACargo', e.target.checked)}
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-2">
          <Form.Label className="fw-bold">Servicio / Sección:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: Pediatría"
            value={jefe.jefeServicio}
            onChange={(e) => onChange('jefeServicio', e.target.value)}
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        <Form.Group className="mb-2">
          <Form.Label className="fw-bold">Hospital:</Form.Label>
          <Form.Control
            type="text"
            value={jefe.jefeHospital}
            onChange={(e) => onChange('jefeHospital', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-2">
          <Form.Label className="fw-bold">Fecha de Firma:</Form.Label>
          <Form.Control
            type="date"
            value={jefe.jefeFecha}
            onChange={(e) => onChange('jefeFecha', e.target.value)}
          />
        </Form.Group>
      </Col>
    </Row>

    <div className="mt-3">
      <FirmaDigital firma={firma} altoInicial={130} label="Firma Digitalizada del Jefe:" />
    </div>
  </fieldset>
);

export default FirmaJefeStep;