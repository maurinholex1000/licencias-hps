import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLicencia } from '../../context/LicenciaContext';
import { useFirmaDigital } from '../../hooks/useFirmaDigital';
import { detectarSolapamiento } from '../../utils/licencias';
import { MESES } from '../../utils/constantes';
import {
  generarPDFBase,
  preservarAnexosDesdeOriginal,
  descargarBlob,
} from '../../services/pdfService';
import CargarPdfAgente from './CargarPdfAgente';
import DictamenJefeStep from './DictamenJefeStep';
import ReemplazantesStep from './ReemplazantesStep';
import FirmaJefeStep from './FirmaJefeStep';
import DocumentoOficialPDF from '../pdf/DocumentoOficialPDF';
import BadgeSaldosRRHH from '../agente/BadgeSaldosRRHH';

const JefeForm = () => {
  const { jefe, setJefe, metadatosPdf, setMetadatosPdf } = useLicencia();
  const [panelVisible, setPanelVisible] = useState(false);
  const [archivoOriginal, setArchivoOriginal] = useState(null);
  const [generando, setGenerando] = useState(false);
  const firma = useFirmaDigital({ altoInicial: 130 });

  const actualizarCampo = (campo, valor) => {
    setJefe((prev) => ({ ...prev, [campo]: valor }));
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

  return (
    <>
      <Form onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-center fw-bold mb-4" style={{ color: 'var(--color-jefe)' }}>
          Portal de Autorización — Jefaturas
        </h2>

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

            <BadgeSaldosRRHH />

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