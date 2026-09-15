import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useLicencia } from '../../context/LicenciaContext';
import { calcularComputoTotal, detectarSolapamiento } from '../../utils/licencias';
import {
  generarPDFBase,
  agregarMetadatos,
  agregarAdjunto,
  descargarBlob,
} from '../../services/pdfService';
import { useFirmaDigital } from '../../hooks/useFirmaDigital';
import DestinatarioStep from './DestinatarioStep';
import DatosAgenteStep from './DatosAgenteStep';
import BadgeSaldosRRHH from './BadgeSaldosRRHH';
import DetalleLicenciasStep from './DetalleLicenciasStep';
import ComputoTotalStep from './ComputoTotalStep';
import FirmaAgenteStep from './FirmaAgenteStep';
import DocumentoOficialPDF from '../pdf/DocumentoOficialPDF';

const AgenteForm = () => {
  const { agente, setAgente } = useLicencia();
  const [generando, setGenerando] = useState(false);
  const firma = useFirmaDigital({ altoInicial: 150 });

  // Recalcular cómputos al cambiar cualquier dato relevante
  useEffect(() => {
    const { corridos, habiles, total } = calcularComputoTotal(agente.grupoActivo, agente);

    const updates = {
      totalCorridos: corridos,
      totalHabiles: habiles,
      totalGeneral: total,
    };

    if (corridos > 0 && agente.fechaInicio && !agente.corridosDetalle) {
      const [y, m, d] = agente.fechaInicio.split('-');
      updates.corridosDetalle = `${d}/${m}/${y}`;
    } else if (corridos === 0 && agente.corridosDetalle) {
      updates.corridosDetalle = '';
    }

    if (agente.fechasSeleccionadas?.length > habiles) {
      updates.fechasSeleccionadas = agente.fechasSeleccionadas.slice(0, habiles);
    }

    setAgente((prev) => ({ ...prev, ...updates }));
  }, [
    agente.grupoActivo,
    agente.a_dias,
    agente.b_dias,
    agente.b_novedad,
    agente.b_chk_viaje,
    agente.b_computo_manual,
    agente.c_dias,
    agente.d_dias,
    agente.e_dias,
    agente.f_dias,
    agente.fechaInicio,
    setAgente,
  ]);

  const actualizarCampo = (campo, valor) => {
    setAgente((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleGenerarPDF = async () => {
    if (!agente.nombre || !agente.categoria) {
      toast.error('Debe verificar el DNI del agente primero.');
      return;
    }
    if (!agente.fechaInicio || agente.totalGeneral === 0) {
      toast.error('Complete la fecha de inicio y al menos un tipo de licencia.');
      return;
    }
    if (firma.estaVacia) {
      toast.error('Debe registrar su firma digital.');
      return;
    }
    if (agente.totalCorridos >= 1 && !agente.corridosDetalle) {
      toast.error('Complete la fecha "(a partir de)" para los días corridos.');
      return;
    }
    if (agente.totalHabiles >= 1 && !agente.habilesDetalle) {
      toast.error('Complete la selección de días hábiles.');
      return;
    }

    const check = detectarSolapamiento(
      agente.corridosDetalle,
      agente.totalCorridos,
      agente.fechasSeleccionadas
    );
    if (check.haySolapamiento) {
      toast.error(`Superposición detectada en: ${check.duplicadas.join(', ')}`);
      return;
    }

    setGenerando(true);
    try {
      const firmaDataURL = firma.toDataURL();
      const metadatos = { ...agente, firmaAgenteBase64: firmaDataURL };

      actualizarCampo('firmaAgenteDataURL', firmaDataURL);

      await new Promise((r) => setTimeout(r, 100));

      const elemento = document.getElementById('documento-oficial-unico');
      const nombreArchivo = `Licencia_${agente.nombre.replace(/\s+/g, '_')}.pdf`;

      let buffer = await generarPDFBase(elemento, nombreArchivo);
      buffer = await agregarMetadatos(buffer, metadatos);

      if (agente.b_adjunto) {
        buffer = await agregarAdjunto(buffer, agente.b_adjunto);
      }

      descargarBlob(buffer, nombreArchivo);
      toast.success('PDF generado correctamente.');
    } catch (err) {
      console.error(err);
      toast.error(`Error al generar PDF: ${err.message}`);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <>
      <Form onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-center fw-bold mb-4 text-primary">
          Generación Oficial de Licencia (Agente)
        </h2>

        <DestinatarioStep agente={agente} onChange={actualizarCampo} />
        <DatosAgenteStep agente={agente} onChange={actualizarCampo} />
        <BadgeSaldosRRHH />
        <DetalleLicenciasStep agente={agente} onChange={actualizarCampo} />
        <ComputoTotalStep agente={agente} onChange={actualizarCampo} />
        <FirmaAgenteStep firma={firma} />

        <Button
          variant="primary"
          size="lg"
          className="w-100"
          onClick={handleGenerarPDF}
          disabled={generando}
        >
          {generando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Generando PDF...
            </>
          ) : (
            <>
              <i className="bi bi-file-earmark-pdf me-2"></i>
              Generar PDF Oficial (Oficio)
            </>
          )}
        </Button>
      </Form>

      <DocumentoOficialPDF
        agente={agente}
        firmaAgenteDataURL={agente.firmaAgenteDataURL || firma.toDataURL()}
      />
    </>
  );
};

export default AgenteForm;