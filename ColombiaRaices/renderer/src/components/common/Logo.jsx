// Componente Logo para Colombia Raíces
// Maneja diferentes versiones del logo y estados
import { useState } from "react";

const Logo = ({ 
  size = 'medium', 
  variant = 'circular', 
  showHover = true, 
  className = '',
  style = {} 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Configuraciones de tamaño
  const sizes = {
    small: { width: '2rem', height: '2rem' },
    medium: { width: '3.5rem', height: '3.5rem' },
    large: { width: '5rem', height: '5rem' },
    xlarge: { width: '8rem', height: '8rem' }
  };

  // Configuraciones de variante
  const variants = {
    circular: {
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    square: {
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '6px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    transparent: {
      background: 'transparent',
      padding: '0',
      boxShadow: 'none'
    }
  };
  // Seleccionar el logo adecuado
  const getLogoSrc = () => {
    // Prioridad: Circular (nuevo) > Sin Fondo > Con Fondo
    const logoOptions = [
      '/images/LogoColombiaRaicesCircular.png',    // Nuevo logo circular
      '/images/LogoColombiaRaicesNoFondo.png',     // Logo sin fondo
      '/images/ColombiaRaicesLogo.png'             // Logo con fondo (fallback)
    ];
    
    return logoOptions[imageError ? 2 : 0]; // Si hay error, usar fallback
  };

  const containerStyle = {
    ...variants[variant],
    ...sizes[size],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: showHover ? 'transform 0.3s ease, box-shadow 0.3s ease' : 'none',
    cursor: 'pointer',
    ...style
  };
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    backgroundColor: 'transparent',
    transition: 'opacity 0.3s ease',
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block'
  };

  const handleError = (e) => {
    console.error('Error cargando logo:', e);
    setImageError(true);
  };

  const handleLoad = () => {
    console.log('Logo Colombia Raíces cargado exitosamente');
    setIsLoaded(true);
  };

  const handleHover = (e) => {
    if (showHover) {
      e.target.parentElement.style.transform = 'scale(1.1)';
      e.target.parentElement.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
    }
  };

  const handleMouseLeave = (e) => {
    if (showHover) {
      e.target.parentElement.style.transform = 'scale(1)';
      e.target.parentElement.style.boxShadow = containerStyle.boxShadow;
    }
  };

  return (
    <div 
      className={`logo-container ${className}`}
      style={containerStyle}
      title="Colombia Raíces - Turismo Comunitario Sostenible"
    >
      <img 
        src={getLogoSrc()}
        alt="Colombia Raíces - Turismo Comunitario Sostenible" 
        style={imageStyle}
        onError={handleError}
        onLoad={handleLoad}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Indicador de carga */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#03222b',
          fontSize: '0.8rem'
        }}>
          ...
        </div>
      )}
    </div>
  );
};

export default Logo;
