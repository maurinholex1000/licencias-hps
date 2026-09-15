import { useState } from 'react';
import { Form, Row, Col, Button, InputGroup, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CalendarioPicker from '../common/CalendarioPicker';
import { detectarSolapamiento } from '../../utils/licencias';

const DictamenJefeStep = ({ jefe, metadatosPdf, onChange }) => {
  const [popoverHabiles, setPopoverHabiles] = useState(false);
  const [popoverCorridos, setPopoverCorridos] = useState(false);

  const handleCambioAutoriza = (valor) => {
    onChange('autoriza', valor);
    if (valor === 'PARCIAL') {
      onChange('parcialCorridos', metadatosPdf.totalCorridos);
      onChange('parcialHabiles', metadatosPdf.totalHabiles);
      onChange('parcialCorridosDetalle', metadatosPdf.corridosDetalle || '');
      const fechasAgente = metadatosPdf.fechasSeleccionadasAgente || [];
      onChange('fechasJefeAutorizadas', [...fechasAgente]);
    }
  };

  const handleFechasJefe = (fechasISO) => {
    onChange('fechasJefeAutorizadas', fechasISO);
    onChange('parcialHabiles', fechasISO.length);
    const check = detectarSolapamiento(
      jefe.parcialCorridosDetalle,
      jefe.parcialCorridos,
      fechasISO
    );
    if (check.haySolapamiento) {
      toast.warn(`⚠️ Superposición: ${check.duplicadas.join(', ')}`);
    }
  };

  return (
    <fieldset className="form-section">
      <legend className="visually-hidden">Dictamen del Jefe</legend>
      <h3>1. Dictamen del Jefe del Servicio</h3>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">¿Autoriza la licencia solicitada?</Form.Label>
            <Form.Select
              value={jefe.autoriza}
              onChange={(e) => handleCambioAutoriza(e.target.value)}
            >
              <option value="SI">SI Autorizo</option>
              <option value="PARCIAL">Autorizo de manera Parcial</option>
              <option value="NO">NO Autorizo</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-bold">¿Debe designarse reemplazante?</Form.Label>
            <Form.Select
              value={jefe.reemplazo}
              onChange={(e) => onChange('reemplazo', e.target.value)}
            >
              <option value="NO">NO debe designarse</option>
              <option value="SI">SI debe designarse</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {jefe.autoriza === 'PARCIAL' && (
        <Card className="mt-3 p-3 bg-white border">
          <strong className="text-primary d-block mb-2">⚙️ Configurar Días Concedidos:</strong>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">Corridos:</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={jefe.parcialCorridos}
                  onChange={(e) => onChange('parcialCorridos', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="position-relative">
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">Hábiles:</Form.Label>
                <InputGroup>
                  <Form.Control type="number" readOnly value={jefe.parcialHabiles} />
                  <Button variant="primary" onClick={() => setPopoverHabiles((v) => !v)}>
                    📅 Filtrar Días
                  </Button>
                </InputGroup>
              </Form.Group>
              {popoverHabiles && (
                <div style={{ position: 'absolute', right: 12, top: '100%', zIndex: 1050 }}>
                  <CalendarioPicker
                    modo="multiple"
                    valorInicial={jefe.fechasJefeAutorizadas}
                    maxSeleccionables={metadatosPdf.totalHabiles}
                    onSelect={handleFechasJefe}
                    onClose={() => setPopoverHabiles(false)}
                  />
                </div>
              )}
            </Col>
          </Row>

          <Row className="mt-2">
            <Col md={12} className="position-relative">
              <Form.Group>
                <Form.Label className="fw-bold">Días Corridos (a partir de) *:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={jefe.parcialCorridosDetalle}
                    readOnly
                    placeholder="Ej: 10/08/2026"
                  />
                  <Button variant="primary" onClick={() => setPopoverCorridos((v) => !v)}>
                    📅 Select
                  </Button>
                </InputGroup>
              </Form.Group>
              {popoverCorridos && (
                <div style={{ position: 'absolute', right: 12, top: '100%', zIndex: 1050 }}>
                  <CalendarioPicker
                    modo="unico"
                    valorInicial={
                      jefe.parcialCorridosDetalle
                        ? jefe.parcialCorridosDetalle.split('/').reverse().join('-')
                        : ''
                    }
                    onSelect={(fechaDDMM) => {
                      onChange('parcialCorridosDetalle', fechaDDMM);
                      const check = detectarSolapamiento(
                        fechaDDMM,
                        jefe.parcialCorridos,
                        jefe.fechasJefeAutorizadas
                      );
                      if (check.haySolapamiento) {
                        toast.warn(`⚠️ Superposición: ${check.duplicadas.join(', ')}`);
                      }
                    }}
                    onClose={() => setPopoverCorridos(false)}
                  />
                </div>
              )}
            </Col>
          </Row>
        </Card>
      )}
    </fieldset>
  );
};

export default DictamenJefeStep;