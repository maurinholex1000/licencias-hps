import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLicencia } from '../../context/LicenciaContext';
import { useFirmaDigital } from '../../hooks/useFirmaDigital';
import { useAuthJefe } from '../../hooks/useAuthJefe';
import { detectarSolapamiento } from '../../utils/licencias';
import {
  generarPDFBase,
  preservarAnexosDesdeOriginal,
  descargarBlob,
} from '../../services/pdfService';
import LoginJefe from './LoginJefe';
import CargarPdfAgente from './CargarPdfAgente';
import DictamenJefeStep from './DictamenJefeStep';
import ReemplazantesStep from './ReemplazantesStep';
import FirmaJefeStep from './FirmaJefeStep';
import DocumentoOficialPDF from '../pdf/DocumentoOficialPDF';

const JefeForm = () => {
  const { jefe, setJefe, metadatosPdf } = useLicencia();
  const { jefe: jefeAutenticado, autenticado, loading: loadingAuth, error: errorAuth, autenticar, cerrarSesion } = useAuthJefe();
  const [panelVisible, setPanelVisible] = useState(false);
  const [archivoOriginal, setArchivoOriginal] = useState(null);
  const [generando, setGenerando] = useState(false);
  const firma = useFirmaDigital({ altoInicial: 130 });

  const actualizarCampo = (campo, valor) => {
    setJefe((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleLogin = async (cuil, password) => {
    try {
      const data = await autenticar(cuil, password);
      // Autocompletar datos del jefe desde la planilla
      actualizarCampo('jefeNombre', data.nombre);
      actualizarCampo('jefeServicio', data.servicio);
      actualizarCampo('jefeHospital', data.hospital);
      toast.success(`✅ Bienvenido/a, ${data.nombre}`);
    } catch (err) {
      // El hook ya guarda el error
    }
  };

  const handlePdfCargado = (metadatos, file) => {
    setArchivoOriginal(file);
    setPanelVisible(true);
    toast.success(`PDF de ${metadatos.nombre} cargado.`);
  };

  const handleGenerarPDFFinal = async () => {
    if (firma.estaVacia) {
      toast.error('Falta la firma de jefatura.');
      return;
    }
    if (!jefe.jefeNombre || !jefe.jefeServicio || !jefe.jefeFecha) {
      toast.error('Complete los datos del responsable.');
      return;
    }

    const check = detectarSolapamiento(
      jefe.parcialCorridosDetalle,
      jefe.parcialCorridos,
      jefe.fechasJefeAutorizadas
    );
    if (check.haySolapamiento) {
      toast.error(`Superposición Jefatura: ${check.duplicadas.join(', ')}`);
      return;
    }

    setGenerando(true);
    try {
      const firmaDataURL = firma.toDataURL();
      actualizarCampo('firmaJefeDataURL', firmaDataURL);
      await new Promise((r) => setTimeout(r, 100));

      const nombre = metadatosPdf.nombre.replace(/\s+/g, '_');
      const elemento = document.getElementById('documento-oficial-unico');
      let buffer = await generarPDFBase(elemento, `Licencia_AUTORIZADA_${nombre}.pdf`);
      buffer = await preservarAnexosDesdeOriginal(buffer, archivoOriginal);
      descargarBlob(buffer, `Licencia_AUTORIZADA_${nombre}.pdf`);
      toast.success('PDF final generado.');
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setGenerando(false);
    }
  };

  // 🔒 Si no está autenticado → mostrar login
  if (!autenticado) {
    return <LoginJefe onLogin={handleLogin} loading={loadingAuth} error={errorAuth} />;
  }

  // ✅ Autenticado → mostrar panel original
  return (
    <>
      <Form onSubmit={(e) => e.preventDefault()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold mb-0" style={{ color: 'var(--color-jefe)' }}>
            Portal de Autorización — Jefaturas
          </h2>
          <div className="text-end">
            <div className="small text-muted">
              <i className="bi bi-person-check me-1"></i>
              <strong>{jefeAutenticado?.nombre}</strong>
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => {
                cerrarSesion();
                setPanelVisible(false);
                setArchivoOriginal(null);
              }}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Cerrar sesión
            </Button>
          </div>
        </div>

        <CargarPdfAgente onCargado={handlePdfCargado} />

        {panelVisible && metadatosPdf && (
          <>
            <Card className="agente-info-badge mb-3">
              <Card.Body>
                <strong>🧑‍💼 Agente:</strong> {metadatosPdf.nombre} |{' '}
                <strong>Función:</strong> {metadatosPdf.categoria}
                <br />
                <strong>📅 Inicio:</strong> {metadatosPdf.licDia}/{metadatosPdf.licMes}/
                {metadatosPdf.licAnio}
                <hr className="my-2" />• <strong>Días Corridos:</strong>{' '}
                {metadatosPdf.totalCorridos}{' '}
                {metadatosPdf.corridosDetalle && `(a partir de ${metadatosPdf.corridosDetalle})`}
                <br />• <strong>Días Hábiles:</strong> {metadatosPdf.totalHabiles}{' '}
                {metadatosPdf.habilesDetalle && `(los días: ${metadatosPdf.habilesDetalle})`}
                <br />• <strong>TOTAL:</strong>{' '}
                <span className="badge bg-primary">{metadatosPdf.totalGeneral} días</span>
              </Card.Body>
            </Card>

            <DictamenJefeStep
              jefe={jefe}
              metadatosPdf={metadatosPdf}
              onChange={actualizarCampo}
            />
            <ReemplazantesStep jefe={jefe} onChange={actualizarCampo} />
            <FirmaJefeStep firma={firma} jefe={jefe} onChange={actualizarCampo} />

            <Button
              variant="primary"
              size="lg"
              className="w-100"
              style={{ backgroundColor: 'var(--color-jefe)', borderColor: 'var(--color-jefe)' }}
              onClick={handleGenerarPDFFinal}
              disabled={generando}
            >
              {generando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-2"></i>
                  Validar Autorización y Generar PDF Final
                </>
              )}
            </Button>
          </>
        )}
      </Form>

      {metadatosPdf && (
        <DocumentoOficialPDF
          agente={metadatosPdf}
          jefe={jefe}
          firmaAgenteDataURL={metadatosPdf.firmaAgenteBase64}
          firmaJefeDataURL={jefe.firmaJefeDataURL || firma.toDataURL()}
        />
      )}
    </>
  );
};

export default JefeForm;