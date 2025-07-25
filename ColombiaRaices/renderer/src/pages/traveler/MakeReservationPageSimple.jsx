import { useNavigate } from 'react-router-dom';

const MakeReservationPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{ 
          color: '#03222b', 
          marginBottom: '20px',
          fontSize: '2.5rem'
        }}>
          ✅ PÁGINA CORRECTA CARGADA
        </h1>
        <h2 style={{ 
          color: '#28a745', 
          marginBottom: '20px',
          fontSize: '1.8rem'
        }}>
          🎯 Nueva Reserva - Versión Simplificada
        </h2>
        <p style={{ 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '1.1rem'
        }}>
          Esta es la página correcta de MakeReservationPage. 
          La navegación está funcionando correctamente.
        </p>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ color: '#333', fontWeight: 'bold' }}>
            🚀 NAVEGACIÓN EXITOSA DESDE TRAVELER DASHBOARD
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/traveler-dashboard')}
            style={{
              backgroundColor: '#03222b',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🏠 Volver al Dashboard
          </button>
          
          <button
            onClick={() => navigate('/reservation-history')}
            style={{
              backgroundColor: '#fbd338',
              color: '#03222b',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📋 Ver Historial
          </button>
        </div>

        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f0f8ff',
          borderRadius: '8px',
          border: '2px dashed #4A90E2'
        }}>
          <h3 style={{ color: '#4A90E2', marginBottom: '10px' }}>
            🔍 DEBUG INFO
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Ruta actual: /make-reservation<br/>
            Componente: MakeReservationPage<br/>
            Estado: Funcionando correctamente
          </p>
        </div>
      </div>
    </div>
  );
};

export default MakeReservationPage;
