import { useEffect, useRef, useState } from "react";

// Importar Leaflet de forma estática para evitar problemas en producción
let L = null;

const InteractiveMap = ({ 
  latitude, 
  longitude, 
  title = 'Ubicación', 
  description = '', 
  zoom = 13,
  height = '400px',
  width = '100%',
  showPopup = true 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Cargar Leaflet de forma más robusta
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        // Si ya está cargado globalmente, usarlo
        if (window.L) {
          L = window.L;
          setLeafletLoaded(true);
          return;
        }

        // Cargar CSS primero
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          cssLink.crossOrigin = '';
          document.head.appendChild(cssLink);
        }

        // Cargar JavaScript
        if (!window.L) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = '';
          
          script.onload = () => {
            L = window.L;
            setLeafletLoaded(true);
          };
          
          script.onerror = () => {
            setError('Error al cargar Leaflet');
          };
          
          document.head.appendChild(script);
        } else {
          L = window.L;
          setLeafletLoaded(true);
        }
      } catch (error) {
        console.error('Error cargando Leaflet:', error);
        setError('Error al cargar el mapa');
      }
    };

    loadLeaflet();
  }, []);  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || !latitude || !longitude || !leafletLoaded || !L) return;

      try {
        setError(null);
        
        // Configurar los iconos de Leaflet
        if (L.Icon.Default.prototype._getIconUrl) {
          delete L.Icon.Default.prototype._getIconUrl;
        }
        
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Limpiar mapa existente si existe
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Crear el mapa
        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        }).setView([latitude, longitude], zoom);

        // Añadir tiles de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        // Crear marcador personalizado para Colombia Raíces
        const customIcon = L.divIcon({
          html: `
            <div style="
              background: linear-gradient(135deg, #fbd338 0%, #f2c832 100%);
              color: #03222b;
              border-radius: 50%;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              border: 3px solid white;
              box-shadow: 0 3px 10px rgba(0,0,0,0.3);
              font-weight: bold;
            ">
              📍
            </div>
          `,
          className: 'colombia-raices-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        // Añadir marcador
        const marker = L.marker([latitude, longitude], { icon: customIcon })
          .addTo(map);

        // Añadir popup si está habilitado
        if (showPopup) {
          const popupContent = `
            <div style="
              text-align: center; 
              font-family: system-ui, -apple-system, sans-serif;
              min-width: 200px;
              padding: 8px;
            ">
              <h4 style="
                margin: 0 0 8px 0; 
                color: #03222b;
                font-size: 1rem;
                font-weight: 600;
              ">${title}</h4>
              ${description ? `
                <p style="
                  margin: 0 0 8px 0; 
                  color: #666; 
                  font-size: 0.9rem;
                  line-height: 1.4;
                ">${description}</p>
              ` : ''}
              <div style="
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #e5e7eb;
                color: #888; 
                font-size: 0.75rem;
              ">
                📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent).openPopup();
        }

        // Configurar controles del mapa
        map.zoomControl.setPosition('topright');

        // Añadir control de capas (opcional)
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri'
        });

        const baseMaps = {
          'Mapa': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }),
          'Satelital': satelliteLayer
        };

        // Añadir control de capas
        L.control.layers(baseMaps).addTo(map);

        mapInstanceRef.current = map;
        setIsLoaded(true);

        // Forzar recálculo del tamaño después de un breve delay
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);

      } catch (error) {
        console.error('Error inicializando el mapa:', error);
        setError('Error al cargar el mapa. Por favor, intenta de nuevo.');
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, title, description, zoom, showPopup, leafletLoaded]);

  // Manejar redimensionamiento
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!latitude || !longitude) {
    return (
      <div style={{
        width,
        height,
        backgroundColor: '#f9fafb',
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        fontSize: '0.9rem'
      }}>
        📍 Coordenadas no disponibles
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width,
        height,
        backgroundColor: '#fef2f2',
        border: '2px dashed #fca5a5',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#dc2626',
        fontSize: '0.9rem',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠️</div>
        <div>{error}</div>
      </div>
    );  }

  return (
    <div style={{ position: 'relative', width, height }}>
      <div 
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f4f8',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}
      />
      
      {(!leafletLoaded || !isLoaded) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          zIndex: 1000
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            color: '#666'
          }}>
            <div style={{ 
              fontSize: '2rem',
              animation: 'pulse 2s infinite'
            }}>🗺️</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              {!leafletLoaded ? 'Cargando Leaflet...' : 'Inicializando mapa...'}
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fef2f2',
          border: '2px dashed #fca5a5',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626',
          fontSize: '0.9rem',
          textAlign: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚠️</div>
          <div>{error}</div>
          <button
            onClick={() => {
              setError(null);
              setLeafletLoaded(false);
              // Recargar la página como último recurso
              window.location.reload();
            }}
            style={{
              marginTop: '12px',
              padding: '6px 12px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
