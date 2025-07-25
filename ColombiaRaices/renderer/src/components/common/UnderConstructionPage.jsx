import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const UnderConstructionPage = ({ pageName }) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚧</div>
        <h1 style={{ color: '#03222b', marginBottom: '16px' }}>
          {pageName} en Construcción
        </h1>
        <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
          Esta página está siendo desarrollada y estará disponible pronto.
        </p>        <button
          onClick={() => navigate(ROUTES.HOME)}
          style={{
            backgroundColor: '#fbd338',
            color: '#03222b',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#fbd338'}
        >
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
