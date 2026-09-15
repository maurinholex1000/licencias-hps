import { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CalendarioPicker from '../common/CalendarioPicker';
import { agruparFechasPorMes } from '../../utils/fechas';
import { detectarSolapamiento } from '../../utils/licencias';

const ComputoTotalStep = ({ agente, onChange }) => {
  const [popoverCorridos, setPopoverCorridos] = useState(false);
  const [popoverMulti, setPopoverMulti] = useState(false);

  const handleCorridosDetalle = (fechaDDMM) => {
    onChange('corridosDetalle', fechaDDMM);
    const check = detectarSolapamiento(fechaDDMM, agente.totalCorridos, agente.fechasSeleccionadas);
    if (check.haySolapamiento) {
      toast.warn(`⚠️ Superposición: ${check.duplicadas.join(', ')}`);
    }
  };

  const handleFechasMultiples = (fechasISO) => {
    onChange('fechasSeleccionadas', fechasISO);
    onChange('habilesDetalle', agruparFechasPorMes(fechasISO));
    const check = detectarSolapamiento(agente.corridosDetalle, agente.totalCorridos, fechasISO);
    if (check.haySolapamiento) {
      toast.warn(`⚠️ Superposición: ${check.duplicadas.join(', ')}`);
    }
  };

  return (
    <fieldset className="form-section">
      <legend className="visually-hidden">Cómputo Total</legend>
      <h3>4. Cómputo Total Coexistente</h3>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">Días Corridos:</Form.Label>
            <Form.Control type="number" readOnly value={agente.totalCorridos} />
          </Form.Group>
        </Col>
        <Col md={6} className="position-relative">
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">(a partir de) *:</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={agente.corridosDetalle}
                readOnly
                placeholder="Ej: 10/08/2026"
              />
              <Button
                variant="primary"
                onClick={() => {
                  if (agente.totalCorridos === 0) {
                    toast.warn('No tiene Días Corridos asignados.');
                    return;
                  }
                  setPopoverCorridos((v) => !v);
                }}
              >
                📅 Select
              </Button>
            </InputGroup>
          </Form.Group>
          {popoverCorridos && (
            <div style={{ position: 'absolute', right: 12, top: '100%', zIndex: 1050 }}>
              <CalendarioPicker
                modo="unico"
                valorInicial={
                  agente.corridosDetalle
                    ? agente.corridosDetalle.split('/').reverse().join('-')
                    : ''
                }
                onSelect={handleCorridosDetalle}
                onClose={() => setPopoverCorridos(false)}
                tituloInfo="Seleccione la fecha exacta de inicio"
              />
            </div>
          )}
        </Col>
      </Row>

      <Row className="mt-2">
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">Días Hábiles:</Form.Label>
            <Form.Control type="number" readOnly value={agente.totalHabiles} />
          </Form.Group>
        </Col>
        <Col md={6} className="position-relative">
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">(los días) *:</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={agente.habilesDetalle}
                readOnly
                placeholder="Ej: 03, 04, 05/08/2026"
              />
              <Button
                variant="primary"
                onClick={() => {
                  if (agente.totalHabiles === 0) {
                    toast.warn('Primero debe ingresar días hábiles.');
                    return;
                  }
                  setPopoverMulti((v) => !v);
                }}
              >
                📅 Select
              </Button>
            </InputGroup>
          </Form.Group>
          {popoverMulti && (
            <div style={{ position: 'absolute', right: 12, top: '100%', zIndex: 1050 }}>
              <CalendarioPicker
                modo="multiple"
                valorInicial={agente.fechasSeleccionadas}
                maxSeleccionables={agente.totalHabiles}
                onSelect={handleFechasMultiples}
                onClose={() => setPopoverMulti(false)}
              />
            </div>
          )}
        </Col>
      </Row>

      <Form.Group className="mt-3">
        <Form.Label className="fw-bold">TOTAL GENERAL DE DÍAS:</Form.Label>
        <Form.Control type="number" readOnly value={agente.totalGeneral} />
      </Form.Group>
    </fieldset>
  );
};

export default ComputoTotalStep;