// Header para páginas del viajero con navegación interna
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../utils/constants';
import { validateCurrentPage } from '../../utils/validation';

const TravelerHeader = ({ 
  currentPage = 'experiences', 
  showBackToDashboard = true,
  customTitle = null 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Validar currentPage en desarrollo
  validateCurrentPage(currentPage);
  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };
  const handleDashboardRedirect = () => {
    navigate(ROUTES.TRAVELER_DASHBOARD);
  };  const handleNavigation = (page) => {
    switch (page) {
      case 'experiences':
        navigate(ROUTES.EXPERIENCES);
        break;
      case 'communities':
        navigate(ROUTES.COMMUNITIES);
        break;
      case 'reservations':
        navigate(ROUTES.RESERVATION_HISTORY);
        break;
      default:
        break;
    }
  };

  const headerStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '0px',
    marginBottom: '0px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = {
    height: '50px',
    width: 'auto',
    cursor: showBackToDashboard ? 'pointer' : 'default'
  };

  const navButtonStyle = {
    backgroundColor: 'transparent',
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '10px'
  };
  const activeNavButtonStyle = {
    ...navButtonStyle,
    backgroundColor: COLORS.primary,
    color: 'white'
  };

  const logoutButtonStyle = {
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const getPageTitle = () => {
    if (customTitle) return customTitle;
    
    switch (currentPage) {
      case 'experiences':
        return '🌟 Experiencias Turísticas';
      case 'communities':
        return '🏘️ Comunidades Locales';
      case 'reservations':
        return '📅 Mis Reservas';
      default:
        return '🧳 Viajero';
    }
  };

  return (
    <div style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Logo de Colombia Raíces */}
        <img
          src="./images/LogoColombiaRaicesNoFondo.png"
          alt="Colombia Raíces Logo"
          style={logoStyle}
          onClick={showBackToDashboard ? handleDashboardRedirect : undefined}
          onError={(e) => {
            console.error('Error loading header logo:', e);
            e.target.style.display = 'none';
          }}
          onLoad={() => {
            console.log('Header logo loaded successfully');
          }}
        />

        {/* Título de la página */}
        <div>
          <h1 style={{ margin: 0, color: COLORS.primary, fontSize: '24px' }}>
            {getPageTitle()}
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            Bienvenido, {user?.name}
          </p>
        </div>
      </div>

      {/* Navegación central */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          style={currentPage === 'experiences' ? activeNavButtonStyle : navButtonStyle}
          onClick={() => handleNavigation('experiences')}
          onMouseOver={(e) => {
            if (currentPage !== 'experiences') {
              e.target.style.backgroundColor = '#f0f8ff';
            }
          }}
          onMouseOut={(e) => {
            if (currentPage !== 'experiences') {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          🌟 Experiencias
        </button>

        <button
          style={currentPage === 'communities' ? activeNavButtonStyle : navButtonStyle}
          onClick={() => handleNavigation('communities')}
          onMouseOver={(e) => {
            if (currentPage !== 'communities') {
              e.target.style.backgroundColor = '#f0f8ff';
            }
          }}
          onMouseOut={(e) => {
            if (currentPage !== 'communities') {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          🏘️ Comunidades
        </button>

        <button
          style={currentPage === 'reservations' ? activeNavButtonStyle : navButtonStyle}
          onClick={() => handleNavigation('reservations')}
          onMouseOver={(e) => {
            if (currentPage !== 'reservations') {
              e.target.style.backgroundColor = '#f0f8ff';
            }
          }}
          onMouseOut={(e) => {
            if (currentPage !== 'reservations') {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          📅 Reservas
        </button>
      </div>

      {/* Botón de Cerrar Sesión */}
      <button 
        style={logoutButtonStyle}
        onClick={handleLogout}
        onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default TravelerHeader;
