import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RolSelector = () => {
  const navigate = useNavigate();

  const roles = [
    {
      key: 'agente',
      titulo: '🧑‍💼 Perfil Agente',
      descripcion: 'Completar formulario de solicitud, registrar firma digital y exportar documento base.',
      ruta: '/agente',
      clase: 'rol-agente',
    },
    {
      key: 'jefe',
      titulo: '👨‍⚕️ Perfil Jefatura',
      descripcion: 'Cargar PDF digital del agente, verificar saldos sincrónicos, emitir dictamen y autorizar firma.',
      ruta: '/jefe',
      clase: 'rol-jefe',
    },
    {
      key: 'ayuda',
      titulo: '❓ Ayuda y FAQ',
      descripcion: 'Preguntas frecuentes, guías de uso paso a paso e instructivos de actualización de informes.',
      ruta: '/ayuda',
      clase: 'rol-ayuda',
    },
  ];

  return (
    <div className="pantalla-roles">
      <div className="text-center mb-4">
        <h1 className="text-primary fw-bold">Sistema Integrado de Licencias</h1>
        <p className="text-muted">Hospital Pablo Soria — S. S. de Jujuy</p>
      </div>
      <Row className="g-3">
        {roles.map((rol) => (
          <Col key={rol.key} md={4}>
            <Card
              className={`card-rol ${rol.clase}`}
              onClick={() => navigate(rol.ruta)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(rol.ruta)}
            >
              <Card.Body>
                <h5 className="fw-bold mb-3">{rol.titulo}</h5>
                <p className="text-muted small mb-0">{rol.descripcion}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RolSelector;