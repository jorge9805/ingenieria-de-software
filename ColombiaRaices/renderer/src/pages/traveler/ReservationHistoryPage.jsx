// ReservationHistoryPage.jsx
// Vista principal para historial de reservas

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import TravelerHeader from '../../components/traveler/TravelerHeader';
import ReservationCard from '../../components/reservations/ReservationCard';
import ReservationFilters from '../../components/reservations/ReservationFilters';
import useReservations from '../../hooks/useReservations';
import { ROUTES } from '../../utils/constants';

const ReservationHistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const announcementRef = useRef();
  
  const { 
    reservations, 
    loading, 
    error, 
    filters,
    fetchReservations, 
    getFilteredReservations,
    updateFilters,
    clearFilters,
    confirmReservation,
    cancelReservation,
    getReservationDetails,
    clearError
  } = useReservations();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Accessibility helpers
  const announceToScreenReader = (message) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Enhanced error handling and success messages
  useEffect(() => {
    if (location.state?.message) {
      announceToScreenReader(location.state.message);
      // Clear the message from history state
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location]);

  // Cargar reservas al montar el componente
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Obtener reservas filtradas
  const filteredReservations = getFilteredReservations();

  const handleViewDetails = async (reservation) => {
    setActionLoading(true);
    try {
      const details = await getReservationDetails(reservation.id);
      if (details) {
        setSelectedReservation(details);
        // Aquí podrías abrir un modal con los detalles
        console.log('Detalles de reserva:', details);
      }
    } catch (err) {
      console.error('Error getting reservation details:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReservation = async (reservationId) => {
    if (window.confirm('¿Estás seguro de que deseas confirmar esta reserva?')) {
      setActionLoading(true);
      const success = await confirmReservation(reservationId);
      if (success) {
        alert('Reserva confirmada exitosamente');
      }
      setActionLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    const reason = window.prompt('Motivo de cancelación (opcional):');
    if (reason !== null) { // null significa que canceló el prompt
      setActionLoading(true);
      const success = await cancelReservation(reservationId, reason);
      if (success) {
        alert('Reserva cancelada exitosamente');
      }
      setActionLoading(false);
    }
  };

  const handleCreateNewReservation = () => {
    navigate(ROUTES.MAKE_RESERVATION);
  };

  const getStatsData = () => {
    const total = reservations.length;
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    const cancelled = reservations.filter(r => r.status === 'cancelled').length;

    return { total, pending, confirmed, completed, cancelled };
  };

  const stats = getStatsData();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <TravelerHeader currentPage="reservations" customTitle="Historial de Reservas" />
      
      <div style={{ 
        padding: '20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {/* Header con estadísticas */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h1 style={{ 
                color: '#03222b', 
                margin: '0 0 8px 0',
                fontSize: '2.2rem'
              }}>
                📅 Mi Historial de Reservas
              </h1>
              <p style={{ color: '#666', margin: 0 }}>
                Gestiona todas tus reservas de experiencias turísticas
              </p>
            </div>
            
            <button
              style={{
                backgroundColor: '#fbd338',
                color: '#03222b',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={handleCreateNewReservation}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#fbd338'}
            >
              ➕ Nueva Reserva
            </button>
          </div>

          {/* Estadísticas rápidas */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px'
          }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#03222b' }}>{stats.total}</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Total</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#856404' }}>{stats.pending}</div>
              <div style={{ fontSize: '0.9rem', color: '#856404' }}>Pendientes</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#155724' }}>{stats.confirmed}</div>
              <div style={{ fontSize: '0.9rem', color: '#155724' }}>Confirmadas</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e2e3f0', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6f42c1' }}>{stats.completed}</div>
              <div style={{ fontSize: '0.9rem', color: '#6f42c1' }}>Completadas</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#721c24' }}>{stats.cancelled}</div>
              <div style={{ fontSize: '0.9rem', color: '#721c24' }}>Canceladas</div>
            </div>
          </div>
        </div>

        {/* Botón de filtros */}
        <div style={{ marginBottom: '20px' }}>
          <button
            style={{
              backgroundColor: showFilters ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <ReservationFilters
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
          />
        )}

        {/* Mensajes de error */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fcc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>⚠️ {error}</span>
            <button
              onClick={clearError}
              style={{
                background: 'none',
                border: 'none',
                color: '#c33',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⏳</div>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Cargando tus reservas...
            </p>
          </div>
        )}

        {/* Lista de reservas */}
        {!loading && (
          <div>
            {filteredReservations.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📭</div>
                <h3 style={{ color: '#666', marginBottom: '15px' }}>
                  {reservations.length === 0 ? 'No tienes reservas aún' : 'No hay reservas que coincidan con los filtros'}
                </h3>
                <p style={{ color: '#999', marginBottom: '25px' }}>
                  {reservations.length === 0 
                    ? 'Crea tu primera reserva para comenzar a disfrutar de experiencias únicas'
                    : 'Intenta ajustar los filtros para encontrar las reservas que buscas'
                  }
                </p>
                {reservations.length === 0 && (
                  <button
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
                    onClick={handleCreateNewReservation}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f2c832'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#fbd338'}
                  >
                    🎯 Crear Mi Primera Reserva
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div style={{
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  Mostrando {filteredReservations.length} de {reservations.length} reservas
                </div>
                
                {filteredReservations.map(reservation => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onViewDetails={handleViewDetails}
                    onConfirm={handleConfirmReservation}
                    onCancel={handleCancelReservation}
                    showActions={!actionLoading}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          border: '0'
        }}
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
};

export default ReservationHistoryPage;
