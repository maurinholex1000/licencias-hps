import { Form, Row, Col } from 'react-bootstrap';

const ReemplazantesStep = ({ jefe, onChange }) => {
  const actualizarRep = (num, campo, valor) => {
    onChange(`rep${num}`, { ...jefe[`rep${num}`], [campo]: valor });
  };

  return (
    <fieldset className="form-section">
      <legend className="visually-hidden">Reemplazantes</legend>
      <h3>2. Personal Propuesto para Cobertura</h3>
      {[1, 2, 3].map((n) => (
        <Row key={n} className="mb-2">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder={`Nombre Reemplazante ${n}`}
              value={jefe[`rep${n}`].nombre}
              onChange={(e) => actualizarRep(n, 'nombre', e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="DNI"
              value={jefe[`rep${n}`].dni}
              onChange={(e) => actualizarRep(n, 'dni', e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              min="0"
              placeholder="Días"
              value={jefe[`rep${n}`].dias}
              onChange={(e) => actualizarRep(n, 'dias', e.target.value)}
            />
          </Col>
        </Row>
      ))}
    </fieldset>
  );
};

export default ReemplazantesStep;