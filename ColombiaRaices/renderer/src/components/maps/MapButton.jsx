import { useState } from "react";
import InteractiveMap from './InteractiveMap';

const MapButton = ({ 
  experience, 
  community, 
  showText = true, 
  size = 'normal',
  variant = 'button' // 'button' | 'mini' | 'inline'
}) => {
  const [showMap, setShowMap] = useState(false);

  // Determinar coordenadas usando lógica híbrida
  const latitude = experience?.latitude || community?.latitude;
  const longitude = experience?.longitude || community?.longitude;
  
  // Si no hay coordenadas, no mostrar el botón
  if (!latitude || !longitude) {
    return null;
  }

  // Determinar ubicación para mostrar
  const location = experience?.specific_location || 
                   (community?.name && community?.region ? `${community.name}, ${community.region}` : null) ||
                   'Ubicación no especificada';

  // Preparar marcador para el mapa
  const markers = [{
    latitude,
    longitude,
    title: experience?.title || experience?.nombre || community?.name,
    description: location,
    type: experience?.type || experience?.tipo,
    price: experience?.price || experience?.precio ? 
           `$${(experience?.price || experience?.precio).toLocaleString('es-CO')} COP` : null
  }];

  // Estilos según variante
  const getButtonStyle = () => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      borderRadius: '6px',
      border: 'none'
    };

    switch (variant) {
      case 'mini':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(251, 211, 56, 0.1)',
          color: '#03222b',
          padding: '4px 8px',
          fontSize: '0.75rem',
          fontWeight: '500'
        };
      case 'inline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: '#03222b',
          padding: '2px 4px',
          fontSize: '0.8rem',
          textDecoration: 'underline'
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#10b981',
          color: 'white',
          padding: size === 'small' ? '6px 12px' : '8px 16px',
          fontSize: size === 'small' ? '0.8rem' : '0.9rem',
          fontWeight: '600'
        };
    }
  };

  const buttonStyle = getButtonStyle();

  const handleMouseOver = (e) => {
    if (variant === 'button') {
      e.target.style.backgroundColor = '#059669';
    } else if (variant === 'mini') {
      e.target.style.backgroundColor = 'rgba(251, 211, 56, 0.2)';
    }
  };

  const handleMouseOut = (e) => {
    if (variant === 'button') {
      e.target.style.backgroundColor = '#10b981';
    } else if (variant === 'mini') {
      e.target.style.backgroundColor = 'rgba(251, 211, 56, 0.1)';
    }
  };

  if (showMap) {
    return (
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
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header del modal */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
          }}>
            <div>
              <h3 style={{ 
                margin: 0, 
                color: '#03222b', 
                fontSize: '1.2rem', 
                fontWeight: 'bold' 
              }}>
                📍 Ubicación en Mapa
              </h3>
              <p style={{ 
                margin: '4px 0 0 0', 
                color: '#666', 
                fontSize: '0.9rem' 
              }}>
                {markers[0].title}
              </p>
            </div>
            <button
              onClick={() => setShowMap(false)}
              style={{
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>

          {/* Contenido del mapa */}
          <div style={{ padding: '0' }}>
            <InteractiveMap
              latitude={latitude}
              longitude={longitude}
              zoom={14}
              height="500px"
              markers={markers}
              showControls={true}
            />
          </div>

          {/* Footer con información adicional */}
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  📍 {location}
                </p>
                {markers[0].type && (
                  <span style={{
                    backgroundColor: '#fbd338',
                    color: '#03222b',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    marginTop: '4px',
                    display: 'inline-block'
                  }}>
                    {markers[0].type}
                  </span>
                )}
              </div>
              {markers[0].price && (
                <div style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  color: '#03222b' 
                }}>
                  {markers[0].price}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowMap(true)}
      style={buttonStyle}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      🗺️
      {showText && (
        <span>
          {variant === 'mini' ? 'Mapa' : 'Ver Ubicación'}
        </span>
      )}
    </button>
  );
};

export default MapButton;
