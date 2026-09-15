import html2pdf from 'html2pdf.js';
import { PDFDocument } from 'pdf-lib';

export const generarPDFBase = async (elementoDOM, nombreArchivo) => {
  const cfg = {
    margin: [0, 15, 0, 15],
    filename: nombreArchivo,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, logging: false, scrollY: 0, useCORS: true },
    jsPDF: { unit: 'mm', format: [216, 340], orientation: 'portrait' },
  };
  return html2pdf().set(cfg).from(elementoDOM).outputPdf('arraybuffer');
};

export const agregarMetadatos = async (arrayBuffer, metadatos) => {
  const pdf = await PDFDocument.load(arrayBuffer);
  pdf.setTitle(JSON.stringify(metadatos));
  return pdf.save();
};

export const leerMetadatosPDF = async (file) => {
  const ab = await file.arrayBuffer();
  const pdf = await PDFDocument.load(ab);
  const titulo = pdf.getTitle();
  if (!titulo || !titulo.startsWith('{')) {
    throw new Error('PDF incompatible o sin metadatos válidos.');
  }
  return JSON.parse(titulo);
};

export const agregarAdjunto = async (arrayBuffer, archivoAdjunto) => {
  if (!archivoAdjunto) return arrayBuffer;
  const pdfPrincipal = await PDFDocument.load(arrayBuffer);
  const abAdjunto = await archivoAdjunto.arrayBuffer();

  if (archivoAdjunto.type === 'application/pdf') {
    const adjuntoPdf = await PDFDocument.load(abAdjunto);
    const paginas = await pdfPrincipal.copyPages(adjuntoPdf, adjuntoPdf.getPageIndices());
    paginas.forEach((p) => pdfPrincipal.addPage(p));
  } else if (archivoAdjunto.type.startsWith('image/')) {
    const nuevaPag = pdfPrincipal.addPage([612, 963]);
    let img;
    if (archivoAdjunto.type === 'image/png') img = await pdfPrincipal.embedPng(abAdjunto);
    else img = await pdfPrincipal.embedJpg(abAdjunto);
    const dims = img.scaleToFit(550, 900);
    nuevaPag.drawImage(img, {
      x: (612 - dims.width) / 2,
      y: (963 - dims.height) / 2,
      width: dims.width,
      height: dims.height,
    });
  }
  return pdfPrincipal.save();
};

export const preservarAnexosDesdeOriginal = async (arrayBufferFinal, archivoOriginal) => {
  if (!archivoOriginal) return arrayBufferFinal;
  const pdfFinal = await PDFDocument.load(arrayBufferFinal);
  const pdfOriginal = await PDFDocument.load(await archivoOriginal.arrayBuffer());
  const totalPaginas = pdfOriginal.getPageCount();

  if (totalPaginas > 1) {
    const indices = Array.from({ length: totalPaginas - 1 }, (_, i) => i + 1);
    const paginas = await pdfFinal.copyPages(pdfOriginal, indices);
    paginas.forEach((p) => pdfFinal.addPage(p));
  }
  return pdfFinal.save();
};

export const descargarBlob = (arrayBuffer, nombreArchivo) => {
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(link.href);
};