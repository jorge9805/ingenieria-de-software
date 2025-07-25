import { COLORS } from '../../constants/colors';

const LazyLoadingSpinner = ({ pageName = 'página' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      backgroundColor: '#f8f9fa',
      gap: '20px'
    }}>
      {/* Spinner animado */}
      <div style={{
        width: '50px',
        height: '50px',
        border: `4px solid ${COLORS.primary}20`,
        borderTop: `4px solid ${COLORS.primary}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>

      {/* Texto de carga */}
      <div style={{
        textAlign: 'center',
        color: COLORS.primary
      }}>
        <h3 style={{ 
          margin: '0 0 10px 0',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>
          Cargando {pageName}...
        </h3>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          color: '#666'
        }}>
          Optimizando componentes para mejor rendimiento
        </p>
      </div>

      {/* Indicador de progreso */}
      <div style={{
        width: '200px',
        height: '4px',
        backgroundColor: '#e2e8f0',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: COLORS.primary,
          borderRadius: '2px',
          animation: 'progress 1.5s ease-in-out infinite'
        }}>
          <style>
            {`
              @keyframes progress {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default LazyLoadingSpinner;
