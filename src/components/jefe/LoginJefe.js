import { useState } from 'react';
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';

const LoginJefe = ({ onLogin, loading, error }) => {
  const [cuil, setCuil] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cuil.trim() || !password) return;
    onLogin(cuil.trim(), password);
  };

  // Solo permitir dígitos en el CUIL
  const handleCuilChange = (e) => {
    const soloDigitos = e.target.value.replace(/\D/g, '');
    setCuil(soloDigitos);
  };

  return (
    <div className="container" style={{ maxWidth: 480, margin: '40px auto' }}>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div
              style={{
                fontSize: 48,
                lineHeight: 1,
                marginBottom: 10,
                color: 'var(--color-jefe)',
              }}
            >
              🔐
            </div>
            <h3 className="fw-bold mb-1" style={{ color: 'var(--color-jefe)' }}>
              Acceso Jefaturas
            </h3>
            <p className="text-muted small mb-0">
              Ingrese su CUIL y contraseña para autorizar licencias
            </p>
          </div>

          {error && (
            <Alert variant="danger" dismissible>
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                CUIL <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-person-badge"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 20123456789"
                  value={cuil}
                  onChange={handleCuilChange}
                  maxLength={11}
                  autoFocus
                  disabled={loading}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                11 dígitos sin guiones
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Contraseña <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-lock"></i>
                </InputGroup.Text>
                <Form.Control
                  type={verPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setVerPassword((v) => !v)}
                  tabIndex={-1}
                  title={verPassword ? 'Ocultar' : 'Mostrar'}
                >
                  <i className={`bi ${verPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </Button>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100"
              style={{
                backgroundColor: 'var(--color-jefe)',
                borderColor: 'var(--color-jefe)',
              }}
              disabled={loading || !cuil.trim() || !password}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Verificando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </>
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              Si no tiene credenciales, comuníquese con RRHH
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginJefe;