// useReservations.js
// Custom hook para lógica de reservas

import { useState, useEffect, useCallback } from 'react';

const useReservations = () => {
  // Estados para gestión de reservas
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimateData, setEstimateData] = useState(null);
  
  // Estado para filtros de historial
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: null,
    dateTo: null,
    experienceType: 'all'
  });

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Obtener reservas del usuario
  const fetchReservations = useCallback(async (userId = null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulación de datos para desarrollo
      const mockReservations = [
        {
          id: 1,
          experienceTitle: 'Tour Histórico por Barichara',
          community: 'Barichara',
          region: 'Santander',
          date: '2025-08-15',
          time: '09:00',
          participants: 2,
          totalPrice: 90000,
          status: 'confirmed',
          bookingDate: '2025-07-10',
          duration: 3
        },
        {
          id: 2,
          experienceTitle: 'Experiencia Wayuu en La Guajira',
          community: 'Comunidad Wayuu',
          region: 'La Guajira',
          date: '2025-08-20',
          time: '08:00',
          participants: 4,
          totalPrice: 480000,
          status: 'pending',
          bookingDate: '2025-07-12',
          duration: 8
        }
      ];
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReservations(mockReservations);
      
    } catch (err) {
      setError(err.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcular estimación de reserva
  const calculateEstimate = useCallback(async (reservationData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulación de cálculo de estimación
      const basePrice = 500000;
      const days = Math.ceil((new Date(reservationData.returnDate) - new Date(reservationData.departureDate)) / (1000 * 60 * 60 * 24));
      const total = basePrice * reservationData.numberOfTravelers * days;
      
      const estimate = {
        basePrice,
        numberOfTravelers: reservationData.numberOfTravelers,
        days,
        total,
        breakdown: {
          accommodation: total * 0.6,
          transportation: total * 0.2,
          activities: total * 0.15,
          insurance: total * 0.05
        }
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setEstimateData(estimate);
      return estimate;
      
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva reserva
  const createReservation = useCallback(async (reservationData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulación de creación de reserva
      console.log('Creating reservation:', reservationData);
      
      const newReservation = {
        id: Date.now(),
        ...reservationData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar lista de reservas
      setReservations(prev => [newReservation, ...prev]);
      
      return newReservation;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirmar reserva
  const confirmReservation = useCallback(async (reservationId) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'confirmed' }
            : reservation
        )
      );
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancelar reserva
  const cancelReservation = useCallback(async (reservationId, reason = '') => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'cancelled', cancellationReason: reason }
            : reservation
        )
      );
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener detalles de reserva
  const getReservationDetails = useCallback(async (reservationId) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) {
      setError('Reserva no encontrada');
      return null;
    }
    return reservation;
  }, [reservations]);

  // Obtener reservas filtradas
  const getFilteredReservations = useCallback(() => {
    return reservations.filter(reservation => {
      if (filters.status !== 'all' && reservation.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [reservations, filters]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      dateFrom: null,
      dateTo: null,
      experienceType: 'all'
    });
  }, []);

  return {
    // Estados
    reservations,
    loading,
    error,
    estimateData,
    filters,
    
    // Funciones
    fetchReservations,
    calculateEstimate,
    createReservation,
    confirmReservation,
    cancelReservation,
    getReservationDetails,
    getFilteredReservations,
    updateFilters,
    clearFilters,
    clearError
  };
};

export default useReservations;
