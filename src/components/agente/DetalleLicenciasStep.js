import { Form, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { TIPOS_NOVEDAD_ESPECIAL } from '../../utils/constantes';

const DetalleLicenciasStep = ({ agente, onChange }) => {
  const grupoActivo = agente.grupoActivo;

  const cambiarGrupo = (grupo) => {
    if (grupo !== 'lao') onChange('a_dias', 0);
    if (grupo !== 'especial') {
      onChange('b_novedad', '');
      onChange('b_dias', 0);
      onChange('b_motivo', '');
      onChange('b_articulo', '');
      onChange('b_ley', '');
      onChange('b_chk_viaje', false);
      onChange('b_adjunto', null);
    }
    if (grupo !== 'compensatorios') {
      ['c', 'd', 'e', 'f'].forEach((k) => {
        onChange(`${k}_dias`, 0);
        onChange(`${k}_horas`, 0);
      });
    }
    onChange('grupoActivo', grupo);
  };

  const handleCambioNovedad = (valor) => {
    const novedad = TIPOS_NOVEDAD_ESPECIAL[valor];
    if (!novedad) {
      onChange('b_novedad', '');
      onChange('b_dias', 0);
      onChange('b_motivo', '');
      onChange('b_articulo', '');
      onChange('b_ley', '');
      onChange('b_chk_viaje', false);
      return;
    }

    let motivo = novedad.etiqueta;
    if (motivo.includes(' - ')) motivo = motivo.split(' - ')[1];
    motivo = motivo.replace(/\s*\([^)]*\)/g, '');

    onChange('b_novedad', valor);
    onChange('b_dias', novedad.dias);
    onChange('b_motivo', motivo);
    onChange('b_articulo', novedad.art);
    onChange('b_ley', novedad.ley);
    onChange('b_chk_viaje', false);
    onChange('b_computo_manual', novedad.computo);
  };

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) {
      onChange('b_adjunto', null);
      return;
    }
    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`El archivo supera los ${MAX_MB} MB.`);
      e.target.value = '';
      return;
    }
    onChange('b_adjunto', file);
  };

  const novedadActual = TIPOS_NOVEDAD_ESPECIAL[agente.b_novedad];

  return (
    <fieldset className="form-section">
      <legend className="visually-hidden">Detalle de Licencias</legend>
      <h3>3. Detalle de Licencias</h3>

      <ButtonGroup className="w-100 mb-3">
        <Button
          variant={grupoActivo === 'lao' ? 'primary' : 'outline-secondary'}
          onClick={() => cambiarGrupo('lao')}
        >
          Licencia Anual (a)
        </Button>
        <Button
          variant={grupoActivo === 'especial' ? 'primary' : 'outline-secondary'}
          onClick={() => cambiarGrupo('especial')}
        >
          Licencia Especial (b)
        </Button>
        <Button
          variant={grupoActivo === 'compensatorios' ? 'primary' : 'outline-secondary'}
          onClick={() => cambiarGrupo('compensatorios')}
        >
          Compensatorios (c-f)
        </Button>
      </ButtonGroup>

      {grupoActivo === 'lao' && (
        <div>
          <h6 className="text-primary mb-3">🌴 Licencia Anual Ordinaria (LAO)</h6>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">a) Tipo de LAO:</Form.Label>
                <Form.Select
                  value={agente.a_norma}
                  onChange={(e) => onChange('a_norma', e.target.value)}
                >
                  <option value="ART57">Art. 57° (Bis) - LAO Act. Insalubres</option>
                  <option value="LAO_REGULAR">ART. 57° - LAO</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">Días de LAO:</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={agente.a_dias}
                  onChange={(e) => onChange('a_dias', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label className="fw-bold">Año correspondiente:</Form.Label>
                <Form.Control
                  type="text"
                  value={agente.a_anio}
                  onChange={(e) => onChange('a_anio', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}

      {grupoActivo === 'especial' && (
        <div>
          <h6 className="text-primary mb-3">⭐ Licencias Especiales (Ley 3161)</h6>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">b) Seleccionar:</Form.Label>
                <Form.Select
                  value={agente.b_novedad}
                  onChange={(e) => handleCambioNovedad(e.target.value)}
                >
                  <option value="">-- Seleccionar --</option>
                  {Object.entries(TIPOS_NOVEDAD_ESPECIAL).map(([key, val]) => (
                    <option key={key} value={key}>{val.etiqueta}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">Días de Licencia:</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={agente.b_dias}
                  onChange={(e) => onChange('b_dias', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {novedadActual?.viaje && (
            <Form.Check
              className="mb-2"
              type="checkbox"
              label="Requiere Adicional por Viaje (+2 días)"
              checked={agente.b_chk_viaje}
              onChange={(e) => onChange('b_chk_viaje', e.target.checked)}
            />
          )}

          <Form.Group className="mt-3 pt-3 border-top">
            <Form.Label className="fw-bold">
              📎 Adjuntar Documentación / Comprobante de Respaldo:
            </Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              onChange={handleArchivo}
            />
            <Form.Text className="text-muted">
              Opcional. Máximo 10 MB. PDF o imagen.
            </Form.Text>
          </Form.Group>
        </div>
      )}

      {grupoActivo === 'compensatorios' && (
        <div>
          <h6 className="text-primary mb-3">⏳ Licencias por Tareas Compensatorias</h6>
          {[
            { key: 'c', label: 'c) Guardias' },
            { key: 'd', label: 'd) Recargos' },
            { key: 'e', label: 'e) Feriados' },
            { key: 'f', label: 'f) Nocturnas' },
          ].map(({ key, label }) => (
            <Row key={key} className="mb-2">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">{label} (Total de Días):</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={agente[`${key}_dias`]}
                    onChange={(e) => onChange(`${key}_dias`, e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">Su equivalente en Horas:</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={agente[`${key}_horas`]}
                    onChange={(e) => onChange(`${key}_horas`, e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}
        </div>
      )}
    </fieldset>
  );
};

export default DetalleLicenciasStep;