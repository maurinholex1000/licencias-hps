import { Accordion, Card } from 'react-bootstrap';

const AyudaPage = () => {
  const faqs = [
    {
      id: '1',
      titulo: '📊 ¿Cómo solicitar un informe actualizado de saldos a RRHH?',
      contenido: (
        <>
          <p>
            Para obtener o actualizar el estado de tus licencias ordinarias (LAO) o tus horas
            compensatorias acumuladas, debes comunicarte con el área de{' '}
            <strong>Recursos Humanos / Control de Personal</strong> del Hospital.
          </p>
          <p className="mb-0">
            Una vez que actualizan la planilla central, la plataforma sincronizará tus nuevos saldos
            automáticamente al presionar el botón <strong>🔍 Verificar</strong> usando tu DNI.
          </p>
        </>
      ),
    },
    {
      id: '2',
      titulo: '📄 ¿Cuál es el circuito oficial del trámite y su canalización en GDE?',
      contenido: (
        <>
          <p className="fw-bold text-primary mb-1">Circuito Operativo Paso a Paso:</p>
          <ol>
            <li><strong>El Agente:</strong> Completa la solicitud, firma en pantalla y genera el PDF base.</li>
            <li><strong>Envío al Servicio:</strong> Remite el PDF a su superior sin modificarlo.</li>
            <li><strong>El Jefe:</strong> Carga el PDF en el <em>Perfil Jefatura</em>, añade dictamen y descarga el PDF Final.</li>
          </ol>
          <p className="fw-bold text-primary mb-1">Tramitación Electrónica (GDE):</p>
          <ul className="mb-0">
            <li>Enviar a RRHH vía GDE (usuario <strong>CMARQUINA</strong>).</li>
            <li>Copia informativa a UNIDAD DE CONTROL (<strong>SNESPINOZA</strong>).</li>
            <li>Usar <strong>NOCI</strong> para trámites estándar.</li>
            <li>Usar <strong>NICFC</strong> si requiere firma de Guardia o coordinaciones.</li>
          </ul>
        </>
      ),
    },
    {
      id: '3',
      titulo: '🖋️ ¿Qué hago si mi firma digital sale corrida o incompleta?',
      contenido: (
        <p className="mb-0">
          En móvil, coloca la pantalla en horizontal. Presioná <strong>"Borrar Firma"</strong>{' '}
          cuantas veces necesites y repetí el trazo.
        </p>
      ),
    },
    {
      id: '4',
      titulo: '🖥️ ¿Los datos que escribo se guardan en internet?',
      contenido: (
        <p className="mb-0">
          No. Los nombres y firmas no se almacenan en servidores externos. El PDF se genera
          localmente. Los datos viajan encriptados dentro del propio archivo PDF para que tu jefe
          pueda recuperarlos.
        </p>
      ),
    },
  ];

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: 'var(--color-ayuda)' }}>
            Centro de Ayuda y Preguntas Frecuentes
          </h2>
          <Accordion>
            {faqs.map((f) => (
              <Accordion.Item eventKey={f.id} key={f.id}>
                <Accordion.Header>{f.titulo}</Accordion.Header>
                <Accordion.Body>{f.contenido}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AyudaPage;