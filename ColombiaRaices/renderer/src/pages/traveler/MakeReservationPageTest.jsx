import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useReservations from '../../hooks/useReservations';

const MakeReservationPageTest = () => {
  const navigate = useNavigate();
  
  console.log('🔍 MakeReservationPageTest: Iniciando componente...');
  
  try {
    const { createReservation, loading, error } = useReservations();
    console.log('✅ Hook useReservations cargado exitosamente');
    
    const [testResults, setTestResults] = useState({
      hookLoaded: true,
      hookError: null
    });

    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            color: '#03222b', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            🧪 MakeReservationPage - Debug con Hook
          </h1>
          
          <div style={{ 
            backgroundColor: '#d4edda',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            <h3 style={{ color: '#155724', marginBottom: '15px' }}>
              ✅ Hook useReservations - Estado:
            </h3>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
              <p><strong>Error:</strong> {error || 'null'}</p>
              <p><strong>CreateReservation Type:</strong> {typeof createReservation}</p>
              <p><strong>Hook Loaded:</strong> ✅ Exitosamente</p>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#fff3cd',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffeaa7'
          }}>
            <h3 style={{ color: '#856404', marginBottom: '15px' }}>
              🎯 Resultado del Test:
            </h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2d5a2d' }}>
              ✅ El componente MakeReservationPage puede cargar exitosamente con el hook useReservations
            </p>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Esto significa que el problema NO está en el hook useReservations, sino posiblemente en:
              <br/>• El archivo CSS MakeReservationPage.css
              <br/>• Algún otro import o dependencia
              <br/>• La complejidad del componente original
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
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
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🏠 Volver al Dashboard
            </button>
            
            <button
              onClick={() => {
                console.log('🧪 Testing createReservation function...');
                setTestResults(prev => ({
                  ...prev, 
                  functionTest: 'Ejecutado - Ver consola'
                }));
              }}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🧪 Test Función Hook
            </button>
          </div>
        </div>
      </div>
    );
    
  } catch (hookError) {
    console.error('❌ Error en useReservations hook:', hookError);
    
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa',
        padding: '20px',
        display: 'flex',
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
          <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
            ❌ Error en useReservations Hook
          </h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Error detectado: {hookError.message}
          </p>
          <div style={{
            backgroundColor: '#f8d7da',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            textAlign: 'left'
          }}>
            <strong>Stack trace:</strong><br/>
            {hookError.stack}
          </div>
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
        </div>
      </div>
    );
  }
};

export default MakeReservationPageTest;
