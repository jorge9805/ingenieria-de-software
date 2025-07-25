import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../utils/constants';

const TravelerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // DEBUG: Verificar que las rutas están disponibles
  console.log('🔍 DEBUG - ROUTES disponibles:', ROUTES);
  console.log('🔍 DEBUG - MAKE_RESERVATION:', ROUTES.MAKE_RESERVATION);
  console.log('🔍 DEBUG - RESERVATION_HISTORY:', ROUTES.RESERVATION_HISTORY);

  // Estado para experiencias
  const [experiences, setExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(true);
  const [experiencesError, setExperiencesError] = useState(null);

  // Cargar experiencias al montar el componente
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setExperiencesLoading(true);
        const response = await window.electronAPI.experiencesSimple.getAll();
        
        if (response.success) {
          setExperiences(response.data);
        } else {
          setExperiencesError(response.error || 'Error al cargar experiencias');
        }
      } catch (error) {
        setExperiencesError('Error al conectar con la base de datos');
        console.error('Error loading experiences:', error);
      } finally {
        setExperiencesLoading(false);
      }
    };

    fetchExperiences();
  }, []);  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  // Funciones auxiliares para formatear datos
  const getExperienceIcon = (experience) => {
    const name = experience.nombre?.toLowerCase() || '';
    const description = experience.descripcion?.toLowerCase() || '';
    
    if (name.includes('wayuu') || name.includes('indígena') || description.includes('cultura')) return '🏺';
    if (name.includes('histórico') || name.includes('colonial') || name.includes('patrimonio')) return '🏛️';
    if (name.includes('eco') || name.includes('naturaleza') || name.includes('biodiversidad')) return '🌿';
    if (name.includes('aventura') || name.includes('deportes')) return '🏃‍♂️';
    if (name.includes('gastronomía') || name.includes('comida')) return '🍽️';
    if (name.includes('artesanía') || name.includes('arte')) return '🎨';
    if (name.includes('música') || name.includes('danza')) return '🎵';
    return '✨';
  };

  const formatPrice = (price) => {
    if (!price) return 'Consultar precio';
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `$${numPrice.toLocaleString('es-CO')}`;
  };

  const formatDuration = (duration) => {
    if (!duration) return 'Duración variable';
    if (typeof duration === 'number') {
      return duration >= 24 ? `${Math.floor(duration/24)}d` : `${duration}h`;
    }
    return duration;
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  };

  const headerStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    textAlign: 'center'
  };
  const buttonStyle = {
    backgroundColor: COLORS.primary,
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '10px'
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ff6b6b',
    color: 'white'
  };

  const sectionStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Logo de Colombia Raíces */}
          <img
            src="./images/LogoColombiaRaicesNoFondo.png"
            alt="Colombia Raíces Logo"
            style={{
              height: '50px',
              width: 'auto'
            }}
            onError={(e) => {
              console.error('Error loading dashboard logo:', e);
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Dashboard logo loaded successfully');
            }}
          />          {/* Texto del Dashboard */}
          <div>
            <h1 style={{ margin: 0, color: COLORS.primary, fontSize: '28px' }}>
              Dashboard - Viajero 🧳
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Bienvenido, {user?.name}
            </p>
          </div>
        </div>
        <button 
          style={logoutButtonStyle}
          onClick={handleLogout}
          onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
        >
          Cerrar Sesión
        </button>
      </div>

      <div style={sectionStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: COLORS.primary, marginBottom: '20px' }}>
            🔍 Buscar Experiencias
          </h2>          <p style={{ color: '#666', marginBottom: '20px' }}>
            Explora experiencias auténticas en comunidades colombianas
          </p>          <button 
            style={buttonStyle}
            onClick={() => navigate(ROUTES.EXPERIENCES)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
            onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
          >
            Explorar Experiencias
          </button>
        </div>        <div style={cardStyle}>
          <h2 style={{ color: COLORS.primary, marginBottom: '20px' }}>
            📅 Mis Reservas
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Gestiona tus reservas de experiencias turísticas
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            flexWrap: 'wrap'
          }}>            <button 
              style={{
                ...buttonStyle, 
                flex: '1', 
                minWidth: '180px',
                backgroundColor: COLORS.primary
              }}
              onClick={() => {
                navigate(ROUTES.MAKE_RESERVATION);
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
              onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
            >
              📝 Generar Reserva
            </button>
            
            <button 
              style={{
                ...buttonStyle, 
                flex: '1', 
                minWidth: '180px', 
                backgroundColor: COLORS.primary
              }}
              onClick={() => {
                navigate(ROUTES.RESERVATION_HISTORY);
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
              onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
            >
              📋 Ver Historial
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: COLORS.primary, marginBottom: '20px' }}>
            🏘️ Comunidades
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Conoce los perfiles de las comunidades locales
          </p>          <button 
            style={buttonStyle}
            onClick={() => navigate(ROUTES.COMMUNITIES)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
            onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
          >
            Explorar Comunidades
          </button>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: COLORS.primary, marginBottom: '20px' }}>
            👤 Mi Perfil
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Actualiza tu información personal y contraseña
          </p>          <button 
            style={buttonStyle}
            onClick={() => navigate(ROUTES.PROFILE)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
            onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
          >
            Actualizar Perfil
          </button>
        </div>      </div>

      {/* Sección de Experiencias Disponibles */}
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          color: COLORS.primary, 
          marginBottom: '20px',
          fontSize: '24px',
          textAlign: 'center'
        }}>
          🌟 Experiencias Disponibles
        </h2>
        
        {experiencesLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              display: 'inline-block',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              Cargando experiencias...
            </div>
          </div>
        ) : experiencesError ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#fff5f5',
            borderRadius: '12px',
            border: '1px solid #fed7d7'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ color: '#c53030', marginBottom: '8px' }}>Error al cargar experiencias</h3>
            <p style={{ color: '#718096' }}>{experiencesError}</p>
          </div>
        ) : experiences.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🌟</div>
            <h3 style={{ color: COLORS.primary, marginBottom: '8px' }}>No hay experiencias disponibles</h3>
            <p style={{ color: '#666' }}>Próximamente tendremos nuevas experiencias para ti</p>
          </div>        ) : (
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 320px))',
            gap: '20px',
            justifyContent: 'center'
          }}>
            {experiences.map((exp) => (
              <div
                key={exp.id}
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => {
                  const experienceInfo = [
                    `🌟 ${exp.nombre}`,
                    `📍 ${exp.ubicacion || 'Ubicación por confirmar'}`,
                    `💰 ${formatPrice(exp.precio)}`,
                    `⏰ ${formatDuration(exp.duracion_horas)}`,
                    `📝 ${exp.descripcion?.substring(0, 200)}${exp.descripcion?.length > 200 ? '...' : ''}`,
                    '',
                    '💡 ¿Te interesa? ¡Contacta al operador para más detalles!'
                  ].join('\n');
                  
                  alert(experienceInfo);
                }}
              >
                {/* Imagen de la experiencia */}
                <div style={{ 
                  height: '160px',
                  backgroundImage: `url(${exp.image_url || `./images/experiences/experience_${exp.id}_thumbnail.jpg`})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  {/* Overlay con ícono de categoría */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    padding: '4px 8px',
                    fontSize: '1rem'
                  }}>
                    {getExperienceIcon(exp)}
                  </div>
                </div>
                
                {/* Contenido de la card */}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ 
                    color: COLORS.primary, 
                    marginBottom: '8px',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {exp.nombre || 'Experiencia sin nombre'}
                  </h3>
                  <p style={{ 
                    color: '#666', 
                    marginBottom: '12px', 
                    lineHeight: '1.4',
                    fontSize: '0.9rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {exp.descripcion || 'Descripción no disponible'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      color: COLORS.primary, 
                      fontWeight: 'bold', 
                      fontSize: '1rem' 
                    }}>
                      {formatPrice(exp.precio)}
                    </span>
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>
                      ⏱️ {formatDuration(exp.duracion_horas)}
                    </span>
                  </div>
                  {exp.ubicacion && (
                    <div style={{ 
                      marginTop: '8px',
                      fontSize: '0.8rem',
                      color: '#718096',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      📍 {exp.ubicacion}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: COLORS.primary, marginBottom: '20px' }}>
          🎯 Próximas Funcionalidades
        </h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          En desarrollo: Mapas interactivos, sistema de pagos, chat con operadores, y más...
        </p>
      </div>
    </div>
  );
};

export default TravelerDashboard;
