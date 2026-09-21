import { useRef, useState, useCallback, useEffect } from 'react';

export const useFirmaDigital = ({ altoInicial = 150, colorTrazo = '#001a4d' } = {}) => {
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

    // Buffer interno (píxeles reales del canvas)
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(altoInicial * dpr);

    // Tamaño visual (CSS px)
    canvas.style.width = '100%';
    canvas.style.height = `${altoInicial}px`;

    // Sin ctx.scale → trabajamos siempre en píxeles del buffer
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = colorTrazo;
    ctx.lineWidth = 1.8 * dpr; // grosor escalado por DPR para que se vea igual
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

  // 🔑 Coordenadas del mouse en píxeles del BUFFER (no del CSS)
  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;

    // Escalar de CSS px a píxeles del buffer interno
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

  const toDataURL = () => canvasRef.current?.toDataURL('image/png') || '';

  const cargarDesdeDataURL = useCallback((dataURL) => {
    if (!dataURL) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Escalar la firma al tamaño del buffer manteniendo aspecto
      const escala = Math.min(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * escala;
      const h = img.height * escala;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;

      ctx.drawImage(img, x, y, w, h);
      setEstaVacia(false);
      dataURLRef.current = dataURL;
    };
    img.src = dataURL;
  }, []);

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
    cargarDesdeDataURL,
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