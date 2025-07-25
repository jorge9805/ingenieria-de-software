import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';
import { COLORS } from '../../constants/colors';
import { ROUTES } from '../../utils/constants';

const LoginPage = () => {
  const navigate = useNavigate();

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const headerStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    marginBottom: '30px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%'
  };

  const titleStyle = {
    color: COLORS.primary,
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px'
  };

  const subtitleStyle = {
    color: COLORS.mediumGray,
    fontSize: '16px',
    lineHeight: '1.5'
  };

  const backButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `2px solid ${COLORS.primary}`,
    borderRadius: '8px',
    color: COLORS.primary,
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    marginBottom: '20px'
  };

  const footerStyle = {
    marginTop: '30px',
    textAlign: 'center',
    color: COLORS.mediumGray,
    fontSize: '14px'
  };

  const linkStyle = {
    color: COLORS.primary,
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer'
  };
  const handleRegisterClick = () => {
    navigate(ROUTES.REGISTER);
  };

  const handleBackClick = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div style={containerStyle}>
      <button
        style={backButtonStyle}
        onClick={handleBackClick}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = COLORS.primary;
          e.target.style.color = 'white';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = COLORS.primary;
        }}
      >
        ← Volver al Inicio
      </button>

      <div style={headerStyle}>
        <h1 style={titleStyle}>Bienvenido de vuelta</h1>
        <p style={subtitleStyle}>
          Inicia sesión para acceder a tu cuenta de Colombia Raíces
        </p>
      </div>

      <LoginForm />

      <div style={footerStyle}>
        ¿No tienes una cuenta?{' '}
        <span 
          style={linkStyle} 
          onClick={handleRegisterClick}
          onMouseOver={(e) => {
            e.target.style.textDecoration = 'underline';
          }}
          onMouseOut={(e) => {
            e.target.style.textDecoration = 'none';
          }}
        >
          Regístrate aquí
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
