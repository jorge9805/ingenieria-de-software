import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useReservations from '../../hooks/useReservations';
import './MakeReservationPage.css';

const MakeReservationPageWithCSS = () => {
  const navigate = useNavigate();
  
  console.log('🔍 MakeReservationPageWithCSS: Iniciando componente con CSS...');
  
  try {
    const { createReservation, loading, error } = useReservations();
    console.log('✅ Hook useReservations cargado exitosamente');
    console.log('✅ CSS MakeReservationPage.css importado');

    return (
      <main className="make-reservation-page" role="main">
        <div className="container">
          <header className="reservation-header">
            <h1 id="page-title">🧪 Test con CSS Incluido</h1>
            <p>Probando si el CSS causa problemas</p>
          </header>

          <div style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h2 style={{ 
              color: '#03222b', 
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ✅ Resultado del Test con CSS
            </h2>
            
            <div style={{ 
              backgroundColor: '#d4edda',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #c3e6cb'
            }}>
              <h3 style={{ color: '#155724', marginBottom: '15px' }}>
                🎯 Estado del Componente:
              </h3>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <p>✅ <strong>Hook useReservations:</strong> Cargado</p>
                <p>✅ <strong>CSS File:</strong> Importado sin errores</p>
                <p>✅ <strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
                <p>✅ <strong>Error:</strong> {error || 'null'}</p>
                <p>✅ <strong>Clases CSS:</strong> Aplicadas (.make-reservation-page, .container, .reservation-header)</p>
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
                📝 Conclusión:
              </h3>
              <p style={{ fontSize: '1.1rem', color: '#2d5a2d' }}>
                Si esta página se muestra correctamente, entonces el problema NO está en:
                <br/>• ✅ El hook useReservations
                <br/>• ✅ El archivo CSS MakeReservationPage.css
                <br/>• ✅ Los imports básicos
              </p>
              <p style={{ color: '#666', marginTop: '10px', fontStyle: 'italic' }}>
                El problema debe estar en la complejidad del código del componente original 
                o en algún estado/efecto específico.
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
                  console.log('🧪 CSS Test - Clases aplicadas correctamente');
                  const element = document.querySelector('.make-reservation-page');
                  console.log('Element with class found:', element ? 'YES' : 'NO');
                }}
                style={{
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🎨 Test CSS Classes
              </button>
            </div>
          </div>
        </div>
      </main>
    );
    
  } catch (cssError) {
    console.error('❌ Error con CSS o componente:', cssError);
    
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
            ❌ Error con CSS o Componente
          </h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Error detectado: {cssError.message}
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
            {cssError.stack}
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

export default MakeReservationPageWithCSS;
