// MakeReservationPage.jsx
// Vista principal para generar una nueva reserva - Sprint 11 Fixed

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import TravelerHeader from '../../components/traveler/TravelerHeader';
import ReservationForm from '../../components/reservations/ReservationForm';
import ReservationSummary from '../../components/reservations/ReservationSummary';
import useReservations from '../../hooks/useReservations';
import { ROUTES } from '../../utils/constants';

const MakeReservationPage = () => {
  const navigate = useNavigate();
  
  // Estados para el flujo de reserva
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'summary', 'success'
  const [reservationData, setReservationData] = useState(null);
  const [createdReservation, setCreatedReservation] = useState(null);
  const [pageError, setPageError] = useState(null);
  // Hook de reservas con manejo de errores
  const { createReservation, estimateData, loading, error, calculateEstimate } = useReservations();

  // 🧪 FUNCIÓN DE TEST TEMPORAL - REMOVER EN PRODUCCIÓN
  const testCalculateEstimate = async () => {
    console.log('🧪 TEST: Iniciando prueba directa de calculateEstimate');
    
    const testData = {
      experience_id: 1,
      user_id: 1,
      num_personas: 2,
      reservation_date: '2025-08-15',
      reservation_time: '10:00',
      servicios_adicionales: []
    };
    
    console.log('📊 TEST: Datos de prueba:', testData);
    
    try {
      const result = await calculateEstimate(testData);
      console.log('✅ TEST: Resultado:', result);
    } catch (error) {
      console.error('❌ TEST: Error:', error);
    }
  };

  // Manejo de errores de la página
  useEffect(() => {
    const handleError = (event) => {
      console.error('🚨 Page Error:', event.error);
      setPageError('Error en la página de reservas');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Debug: Log del estado actual
  useEffect(() => {
    console.log('🔍 MakeReservationPage State:', { currentStep, reservationData, error, pageError });
  }, [currentStep, reservationData, error, pageError]);

  const handleFormSubmit = (formData) => {
    console.log('📝 Form submitted:', formData);
    setReservationData(formData);
    setCurrentStep('summary');
  };

  const handleFormCancel = () => {
    navigate(ROUTES.TRAVELER_DASHBOARD);
  };

  const handleConfirmReservation = async (data) => {
    try {
      console.log('✅ Confirming reservation:', data);
      const result = await createReservation(data);
      if (result) {
        setCreatedReservation(result);
        setCurrentStep('success');
      }
    } catch (err) {
      console.error('Error creating reservation:', err);
    }
  };

  const handleEditReservation = () => {
    setCurrentStep('form');
  };

  const handleGoToHistory = () => {
    navigate(ROUTES.RESERVATION_HISTORY);
  };

  // Si hay error de página, mostrar fallback
  if (pageError) {
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
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '16px' }}>⚠️ Error de Página</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>{pageError}</p>
          <button
            onClick={() => navigate(ROUTES.TRAVELER_DASHBOARD)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render principal simplificado
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <TravelerHeader />
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        {/* Título de la página */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            color: '#03222b', 
            margin: 0,
            fontSize: '2rem'
          }}>
            🎯 Nueva Reserva
          </h1>          <p style={{ 
            color: '#666', 
            margin: '8px 0 0 0' 
          }}>
            Paso {currentStep === 'form' ? '1' : currentStep === 'summary' ? '2' : '3'} de 3
          </p>
          
          {/* 🧪 BOTÓN DE TEST TEMPORAL - REMOVER EN PRODUCCIÓN */}
          <button
            onClick={testCalculateEstimate}
            style={{
              backgroundColor: '#ff6b00',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              marginTop: '16px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🧪 TEST API
          </button>
        </div>

        {/* Contenido según el paso actual */}
        {currentStep === 'form' && (
          <ReservationForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={loading}
            error={error}
          />
        )}

        {currentStep === 'summary' && reservationData && (
          <ReservationSummary
            reservationData={reservationData}
            estimateData={estimateData}
            onConfirm={handleConfirmReservation}
            onEdit={handleEditReservation}
            loading={loading}
            error={error}
          />
        )}

        {currentStep === 'success' && (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: '#28a745', marginBottom: '16px' }}>
              ¡Reserva Creada Exitosamente!
            </h2>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              Tu reserva ha sido procesada. Recibirás una confirmación pronto.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={handleGoToHistory}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                📋 Ver Historial
              </button>
              <button
                onClick={() => navigate(ROUTES.TRAVELER_DASHBOARD)}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                🏠 Ir al Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeReservationPage;
