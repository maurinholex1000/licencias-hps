import { useRef } from 'react';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLicencia } from '../../context/LicenciaContext';
import { leerMetadatosPDF } from '../../services/pdfService';

const CargarPdfAgente = ({ onCargado }) => {
  const inputRef = useRef(null);
  const { setMetadatosPdf } = useLicencia();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const metadatos = await leerMetadatosPDF(file);
      setMetadatosPdf(metadatos);
      if (onCargado) onCargado(metadatos, file);
    } catch (err) {
      toast.error(err.message);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <Card
      className="text-center p-4 mb-3"
      style={{
        border: '2px dashed var(--color-jefe)',
        background: '#f0f4f8',
        cursor: 'pointer',
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
    >
      <Card.Body>
        <strong className="text-primary d-block mb-2" style={{ fontSize: 15 }}>
          📥 Cargar PDF de Licencia del Agente
        </strong>
        <p className="text-muted mb-0 small">
          Haz clic para seleccionar el archivo generado por el empleado
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="d-none"
          onChange={handleFile}
        />
      </Card.Body>
    </Card>
  );
};

export default CargarPdfAgente;