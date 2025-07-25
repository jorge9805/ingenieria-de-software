import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../utils/constants';

const OperatorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 350px))',
    gap: '20px',
    marginBottom: '30px',
    justifyContent: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, color: COLORS.primary, fontSize: '28px' }}>
            🏘️ Dashboard - Operador Comunitario
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Bienvenido, {user?.name}
          </p>
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
            ➕ Publicar Experiencia
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Comparte las experiencias auténticas de tu comunidad
          </p>          <button 
            style={buttonStyle}
            onClick={() => navigate(ROUTES.PUBLISH_EXPERIENCE)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
            onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
          >
            Crear Experiencia
          </button>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: COLORS.primary, marginBottom: '20px' }}>
            📋 Mis Experiencias
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Gestiona y actualiza tus experiencias publicadas
          </p>          <button 
            style={buttonStyle}
            onClick={() => navigate(ROUTES.MANAGE_EXPERIENCES)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
            onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
          >
            Gestionar Experiencias
          </button>
        </div>

        <div style={cardStyle}>
          <h2 style={{ color: COLORS.primary, marginBottom: '20px' }}>
            📊 Reservas Recibidas
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Revisa las reservas de viajeros interesados
          </p>          <button 
            style={buttonStyle}
            onClick={() => navigate(ROUTES.OPERATOR_RESERVATIONS)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
            onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
          >
            Ver Reservas
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
            onClick={() => navigate(ROUTES.OPERATOR_PROFILE)}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
            onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
          >
            Actualizar Perfil
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: COLORS.primary, marginBottom: '20px' }}>
          🏘️ Mi Comunidad
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Información sobre tu comunidad y cómo conectar con los visitantes
        </p>        <button 
          style={buttonStyle}
          onClick={() => navigate(ROUTES.COMMUNITY_PROFILE)}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
          onMouseOut={(e) => e.target.style.backgroundColor = COLORS.primary}
        >
          Ver Perfil de Comunidad
        </button>
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: COLORS.primary, marginBottom: '20px' }}>
          💡 Consejos para Operadores
        </h2>
        <div style={{ textAlign: 'left', color: '#666', fontSize: '14px' }}>
          <p>• Incluye fotos atractivas en tus experiencias</p>
          <p>• Describe claramente qué incluye cada experiencia</p>
          <p>• Responde rápidamente a las consultas de los viajeros</p>
          <p>• Mantén actualizada la información de tu comunidad</p>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
