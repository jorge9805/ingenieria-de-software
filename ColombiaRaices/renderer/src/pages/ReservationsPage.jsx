// Página de Reservas
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TravelerHeader from '../components/traveler/TravelerHeader';

const ReservationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const mockReservations = [
        {
          id: 1,
          experienceTitle: 'Tour Histórico por Barichara',
          community: 'Barichara',
          region: 'Barichara',
          date: '2025-08-15',
          time: '09:00',
          participants: 2,
          totalPrice: 90000,
          status: 'confirmed',
          bookingDate: '2025-07-10',
          duration: 3,
          operator: 'Turismo Barichara'
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
          duration: 8,
          operator: 'Wayuu Tours'
        },
        {
          id: 3,
          experienceTitle: 'Ecoturismo en el Chocó',
          community: 'Nuquí',
          region: 'Chocó',
          date: '2025-07-25',
          time: '07:00',
          participants: 3,
          totalPrice: 540000,
          status: 'cancelled',
          bookingDate: '2025-07-05',
          duration: 12,
          operator: 'Eco Chocó'
        },
        {
          id: 4,
          experienceTitle: 'Artesanías de Mompox',
          community: 'Mompox',
          region: 'Mompox',
          date: '2025-09-10',
          time: '10:00',
          participants: 1,
          totalPrice: 75000,
          status: 'confirmed',
          bookingDate: '2025-07-14',
          duration: 4,
          operator: 'Artesanos Mompox'
        }
      ];

      setReservations(mockReservations);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReservations = reservations.filter(reservation => {
    return selectedStatus === 'all' || reservation.status === selectedStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green text-white';
      case 'pending':
        return 'bg-yellow text-green';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* TravelerHeader con Reservas activo */}
      <TravelerHeader currentPage="reservations" />
      
      {/* Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Estado de la Reserva
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green"
              >
                <option value="all">Todas</option>
                <option value="confirmed">Confirmadas</option>
                <option value="pending">Pendientes</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setSelectedStatus('all')}
                className="btn btn-outline border-green text-green hover:bg-green hover:text-white px-6 py-2"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reservations List */}
      <section className="py-12">
        <div className="container">
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando {filteredReservations.length} reservas
            </p>
          </div>

          {filteredReservations.length > 0 ? (
            <div className="space-y-6">
              {filteredReservations.map((reservation) => (
                <div key={reservation.id} className="card bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-green mb-2">{reservation.experienceTitle}</h3>
                        <p className="text-gray-600">📍 {reservation.community}, {reservation.region}</p>
                        <p className="text-gray-600">🏢 {reservation.operator}</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Fecha y Hora</p>
                        <p className="font-medium">{formatDate(reservation.date)}</p>
                        <p className="text-sm text-gray-600">{reservation.time}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Participantes</p>
                        <p className="font-medium">{reservation.participants} personas</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Duración</p>
                        <p className="font-medium">{reservation.duration} horas</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Precio Total</p>
                        <p className="font-medium text-green text-lg">{formatCurrency(reservation.totalPrice)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="text-sm text-gray-500 mb-4 md:mb-0">
                        <p>Reservado el: {formatDate(reservation.bookingDate)}</p>
                        <p>ID de reserva: #{reservation.id}</p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link
                          to={`${ROUTES.EXPERIENCES}/${reservation.id}`}
                          className="btn btn-outline border-green text-green hover:bg-green hover:text-white px-4 py-2"
                        >
                          Ver Experiencia
                        </Link>
                        
                        {reservation.status === 'confirmed' && (
                          <button className="btn btn-outline border-orange text-orange hover:bg-orange hover:text-white px-4 py-2">
                            Cancelar
                          </button>
                        )}
                        
                        {reservation.status === 'pending' && (
                          <button className="btn btn-primary bg-yellow text-green hover:bg-yellow-600 px-4 py-2">
                            Confirmar Pago
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <span className="text-6xl">📅</span>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No tienes reservas</h3>
              <p className="text-gray-500 mb-6">
                {selectedStatus === 'all' 
                  ? 'Explora nuestras experiencias y haz tu primera reserva'
                  : `No tienes reservas ${getStatusText(selectedStatus).toLowerCase()}`
                }
              </p>
              <Link
                to={ROUTES.EXPERIENCES}
                className="btn btn-primary bg-yellow text-green hover:bg-yellow-600 px-6 py-3"
              >
                Explorar Experiencias
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReservationsPage;
