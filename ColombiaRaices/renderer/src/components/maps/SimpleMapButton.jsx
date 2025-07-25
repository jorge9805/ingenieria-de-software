import { useState, useEffect, useRef } from "react";

// Variable global para Leaflet
let L = null;

const SimpleMapButton = ({ experience, community }) => {
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Verificar si tenemos coordenadas
  const hasCoordinates = (experience?.latitude && experience?.longitude) || 
                        (community?.latitude && community?.longitude);

  // Si no hay coordenadas, no mostrar el botón
  if (!hasCoordinates) {
    return null;
  }

  const latitude = experience?.latitude || community?.latitude;
  const longitude = experience?.longitude || community?.longitude;
  const title = experience?.title || experience?.nombre || 'Experiencia';
  const location = experience?.specific_location || 
                   (community?.name && community?.region ? `${community.name}, ${community.region}` : null) ||
                   'Ubicación';

  // Cargar Leaflet cuando se muestra el mapa
  useEffect(() => {
    if (!showMap) return;

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
  }, [showMap]);
  // Función para inicializar el mapa
  const initializeMap = async () => {
    if (!mapRef.current || !leafletLoaded || !L) return;

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
      const map = L.map(mapRef.current).setView([latitude, longitude], 13);

      // Añadir tiles de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Crear marcador personalizado
      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: #fbd338;
            color: #03222b;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            📍
          </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Añadir marcador con popup
      const marker = L.marker([latitude, longitude], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center; font-family: system-ui;">
            <h4 style="margin: 0 0 8px 0; color: #03222b;">${title}</h4>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 0.9rem;">${location}</p>
            <p style="margin: 0; color: #888; font-size: 0.8rem;">
              ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
            </p>
          </div>
        `)
        .openPopup();

      mapInstanceRef.current = map;

      // Forzar recálculo del tamaño después de un breve delay
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);

    } catch (error) {
      console.error('Error inicializando el mapa:', error);
      setError('Error al cargar el mapa');
    }
  };
  // Efecto para inicializar el mapa cuando se muestra
  useEffect(() => {
    if (showMap) {
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);
      return () => clearTimeout(timer);
    }
    
    // Limpiar el mapa cuando se cierra
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };  }, [showMap, latitude, longitude]);

  // Modal con mapa interactivo
  if (showMap) {
    return (
      <>
        {/* CSS para Leaflet */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
        
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMap(false);
            }
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Header del modal */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fbd338'
            }}>
              <div>
                <h3 style={{ 
                  margin: '0 0 4px 0', 
                  color: '#03222b',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}>
                  📍 {title}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: '#03222b',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  {location}
                </p>
              </div>
              <button
                onClick={() => setShowMap(false)}
                style={{
                  background: 'rgba(3, 34, 43, 0.1)',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#03222b',
                  padding: '8px',
                  borderRadius: '50%',
                  lineHeight: 1,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(3, 34, 43, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(3, 34, 43, 0.1)';
                }}
              >
                ×
              </button>
            </div>

            {/* Contenedor del mapa */}
            <div 
              ref={mapRef}
              style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#f0f4f8'
              }}
            />

            {/* Footer con información adicional */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              color: '#666'
            }}>
              <span>
                Coordenadas: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
              </span>
              <span style={{ color: '#10b981', fontWeight: '500' }}>
                🗺️ Mapa interactivo - Colombia Raíces
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <button
      onClick={() => setShowMap(true)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: 'rgba(251, 211, 56, 0.1)',
        color: '#03222b',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = 'rgba(251, 211, 56, 0.2)';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = 'rgba(251, 211, 56, 0.1)';
      }}
    >
      🗺️ <span>Mapa</span>
    </button>
  );
};

export default SimpleMapButton;
