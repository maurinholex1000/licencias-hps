import { useRef, useState, useCallback, useEffect } from 'react';

export const useFirmaDigital = ({ altoInicial = 250, colorTrazo = '#001a4d' } = {}) => {
  const canvasRef = useRef(null);
  const [estaVacia, setEstaVacia] = useState(true);
  const dibujandoRef = useRef(false);
  const dataURLRef = useRef('');

  const inicializar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const dataURLPrevio = !estaVacia && dataURLRef.current ? dataURLRef.current : null;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(altoInicial * dpr);

    canvas.style.width = '100%';
    canvas.style.height = `${altoInicial}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = colorTrazo;
    ctx.lineWidth = 3.5 * dpr; // Trazo grueso y legible
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (dataURLPrevio) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = dataURLPrevio;
    }
  }, [altoInicial, colorTrazo, estaVacia]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;

    const escalaX = canvas.width / rect.width;
    const escalaY = canvas.height / rect.height;

    return {
      x: (cx - rect.left) * escalaX,
      y: (cy - rect.top) * escalaY,
    };
  };

  const onStart = (e) => {
    dibujandoRef.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (!e.touches) e.preventDefault();
  };

  const onMove = (e) => {
    if (!dibujandoRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (estaVacia) setEstaVacia(false);
    e.preventDefault();
  };

  const onEnd = () => {
    dibujandoRef.current = false;
    dataURLRef.current = canvasRef.current?.toDataURL('image/png') || '';
  };

  const limpiar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setEstaVacia(true);
    dataURLRef.current = '';
  };

  // ✂️ FUNCIÓN DE AUTOCROP (Recorta el lienzo al tamaño real de la firma)
  const obtenerDataURLRecortado = () => {
    const canvas = canvasRef.current;
    if (!canvas || estaVacia) return '';

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let minX = width, minY = height, maxX = 0, maxY = 0;
    let tieneTrazo = false;

    // Escanear píxeles visibles (alpha > 0)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 10) { // Si el píxel no es transparente
          tieneTrazo = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (!tieneTrazo) return '';

    // Añadir margen mínimo (padding) alrededor del trazo
    const padding = 10;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(width, maxX + padding);
    maxY = Math.min(height, maxY + padding);

    const cropWidth = maxX - minX;
    const cropHeight = maxY - minY;

    // Crear un canvas temporal ajustado al tamaño recortado
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropWidth;
    tempCanvas.height = cropHeight;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.drawImage(
      canvas,
      minX, minY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    return tempCanvas.toDataURL('image/png');
  };

  const toDataURL = () => obtenerDataURLRecortado() || canvasRef.current?.toDataURL('image/png') || '';

  useEffect(() => {
    inicializar();
    window.addEventListener('resize', inicializar);
    return () => window.removeEventListener('resize', inicializar);
  }, [inicializar]);

  return {
    canvasRef,
    estaVacia,
    limpiar,
    toDataURL,
    handlers: {
      onMouseDown: onStart,
      onMouseMove: onMove,
      onMouseUp: onEnd,
      onMouseLeave: onEnd,
      onTouchStart: onStart,
      onTouchMove: onMove,
      onTouchEnd: onEnd,
    },
  };
};