import { useState } from "react";

const SimpleMap = ({ experience, variant = 'button' }) => {
  const [showModal, setShowModal] = useState(false);

  // Determinar coordenadas usando lógica híbrida
  const latitude = experience?.latitude || experience?.community_latitude;
  const longitude = experience?.longitude || experience?.community_longitude;

  // Si no hay coordenadas, no mostrar el botón
  if (!latitude || !longitude) {
    return null;
  }

  const title = experience?.nombre || experience?.title || 'Experiencia';
  const location = experience?.ubicacion || experience?.community_name || 'Ubicación';
  
  // URL para Google Maps estático (funciona sin JavaScript)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=600x300&maptype=roadmap&markers=color:yellow%7Clabel:E%7C${latitude},${longitude}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dKVvXnZpz8yqJM`;
  
  // URL para OpenStreetMap (alternativa sin API key)
  const osmMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  const MapModal = () => (
    <div style={{
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
        setShowModal(false);
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
            onClick={() => setShowModal(false)}
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
        <div style={{ 
          height: '400px',
          position: 'relative',
          backgroundColor: '#f0f4f8'
        }}>
          <iframe
            src={osmMapUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            title={`Mapa de ${title}`}
          />
        </div>

        {/* Footer con información y enlaces */}
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
            📍 {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#10b981',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              🗺️ Ver en Google Maps
            </a>
            <span style={{ color: '#10b981', fontWeight: '500' }}>
              Colombia Raíces
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Botón pequeño para tarjetas
  if (variant === 'small') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
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
        {showModal && <MapModal />}
      </>
    );
  }

  // Botón normal para modales
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          width: '100%',
          justifyContent: 'center'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#059669';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#10b981';
        }}
      >
        🗺️ <span>Ver Ubicación</span>
      </button>
      {showModal && <MapModal />}
    </>
  );
};

export default SimpleMap;
