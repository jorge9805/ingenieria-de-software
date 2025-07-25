// Header para páginas del operador con navegación interna
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const OperatorHeader = ({ 
  currentPage = 'publish', 
  showBackToDashboard = true,
  customTitle = null 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const handleDashboardRedirect = () => {
    navigate(ROUTES.OPERATOR_DASHBOARD);
  };

  const handleNavigation = (page) => {
    switch (page) {
      case 'publish':
        navigate(ROUTES.PUBLISH_EXPERIENCE);
        break;
      case 'manage':
        navigate(ROUTES.MANAGE_EXPERIENCES);
        break;
      case 'reservations':
        navigate(ROUTES.OPERATOR_RESERVATIONS);
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
    color: '#03222b',
    border: '2px solid #03222b',
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
    backgroundColor: '#03222b',
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
      case 'publish':
        return '📝 Publicar Experiencia';
      case 'manage':
        return '📋 Mis Experiencias';
      case 'reservations':
        return '📅 Reservas Recibidas';
      default:
        return '⚙️ Operador';
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
          <h1 style={{ margin: 0, color: '#03222b', fontSize: '24px' }}>
            {getPageTitle()}
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            Bienvenido, {user?.name} (Operador)
          </p>
        </div>
      </div>

      {/* Navegación central */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          style={currentPage === 'publish' ? activeNavButtonStyle : navButtonStyle}
          onClick={() => handleNavigation('publish')}
          onMouseOver={(e) => {
            if (currentPage !== 'publish') {
              e.target.style.backgroundColor = '#f0f8ff';
            }
          }}
          onMouseOut={(e) => {
            if (currentPage !== 'publish') {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          📝 Publicar Experiencia
        </button>

        <button
          style={currentPage === 'manage' ? activeNavButtonStyle : navButtonStyle}
          onClick={() => handleNavigation('manage')}
          onMouseOver={(e) => {
            if (currentPage !== 'manage') {
              e.target.style.backgroundColor = '#f0f8ff';
            }
          }}
          onMouseOut={(e) => {
            if (currentPage !== 'manage') {
              e.target.style.backgroundColor = 'transparent';
            }
          }}
        >
          📋 Mis Experiencias
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
          📅 Reservas Recibidas
        </button>
      </div>

      {/* Botón de cerrar sesión */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          style={logoutButtonStyle}
          onClick={handleLogout}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#ff5252';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#ff6b6b';
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default OperatorHeader;
