import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import OperatorHeader from '../../components/operator/OperatorHeader';
import { ROUTES } from '../../utils/constants';

const OperatorReservationsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <OperatorHeader currentPage="reservations" />
      
      <div style={{ 
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            color: '#03222b', 
            marginBottom: '10px',
            fontSize: '2rem'
          }}>
            📅 Reservas Recibidas
          </h1>
          
          <p style={{ 
            color: '#666', 
            marginBottom: '30px', 
            fontSize: '1.1rem' 
          }}>
            Gestiona las reservas que han realizado los viajeros para tus experiencias
          </p>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px dashed #dee2e6'
          }}>
            <h3 style={{ color: '#666', marginBottom: '15px' }}>
              🔧 Página en construcción
            </h3>
            <p style={{ color: '#888', marginBottom: '20px' }}>
              Esta funcionalidad será implementada en próximas iteraciones del proyecto.
            </p>
            <button
              onClick={() => navigate(ROUTES.OPERATOR_DASHBOARD)}
              style={{
                backgroundColor: '#03222b',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              ← Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorReservationsPage;
