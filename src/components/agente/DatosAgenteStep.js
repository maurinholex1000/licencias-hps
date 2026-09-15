import { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSaldosRRHH } from '../../hooks/useSaldosRRHH';

const DatosAgenteStep = ({ agente, onChange }) => {
  const { consultar, loading } = useSaldosRRHH();
  const [dniLocal, setDniLocal] = useState(agente.dni || '');

  const handleVerificar = async () => {
    if (!dniLocal.trim()) {
      toast.error('Ingrese un DNI.');
      return;
    }
    try {
      const s = await consultar(dniLocal);
      
      // Actualizamos los datos del agente y el objeto de saldos devuelto por RRHH
      onChange('dni', dniLocal);
      onChange('nombre', s.nombre);
      onChange('categoria', s.cargo);
      
      // Guardamos la información completa de saldos para el Badge
      onChange('saldosRRHH', {
        laoTotal: s.laoTotal,
        laoDetalle: s.laoDetalle,
        compensatorios: s.compensatorios,
        actualizacion: s.actualizacion || new Date().toLocaleDateString('es-AR'),
      });

      toast.success(`✅ Agente verificado: ${s.nombre}`);
    } catch (err) {
      toast.error(err.message || 'Error al verificar DNI');
    }
  };

  return (
    <fieldset className="form-section">
      <legend className="visually-hidden">Datos del Agente</legend>
      <h3>2. Datos del Agente</h3>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">DNI N°:</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Ej: 30321654"
                value={dniLocal}
                onChange={(e) => setDniLocal(e.target.value)}
                required
              />
              <Button variant="primary" onClick={handleVerificar} disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm" /> : '🔍 Verificar'}
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">APELLIDO Y NOMBRE:</Form.Label>
            <Form.Control
              type="text"
              value={agente.nombre || ''}
              readOnly
              placeholder="Se completará automáticamente"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">CARGO Y CATEGORÍA:</Form.Label>
            <Form.Control
              type="text"
              value={agente.categoria || ''}
              readOnly
              placeholder="Se completará automáticamente"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">A PARTIR DEL DÍA (Inicio Licencia):</Form.Label>
            <Form.Control
              type="date"
              value={agente.fechaInicio || ''}
              onChange={(e) => onChange('fechaInicio', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>
    </fieldset>
  );
};

export default DatosAgenteStep;