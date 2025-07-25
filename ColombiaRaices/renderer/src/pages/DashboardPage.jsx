// Página de Dashboard
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';

const DashboardPage = () => {
  // Datos mock para demostración
  const userStats = {
    totalReservations: 5,
    activeReservations: 2,
    completedExperiences: 3,
    totalSpent: 890000
  };

  const recentActivity = [
    {
      id: 1,
      type: 'reservation',
      title: 'Reserva confirmada',
      description: 'Tour Histórico por Barichara',
      date: '2025-07-14',
      icon: '✅'
    },
    {
      id: 2,
      type: 'experience',
      title: 'Experiencia completada',
      description: 'Ecoturismo en el Chocó',
      date: '2025-07-12',
      icon: '🌟'
    },
    {
      id: 3,
      type: 'review',
      title: 'Reseña enviada',
      description: 'Artesanías de Mompox',
      date: '2025-07-10',
      icon: '📝'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-green text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-xl">
            Bienvenido a tu panel de control
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 -mt-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green text-white rounded-full">
                  📅
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Reservas</p>
                  <p className="text-2xl font-bold text-green">{userStats.totalReservations}</p>
                </div>
              </div>
            </div>

            <div className="card bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow text-green rounded-full">
                  ⏳
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Reservas Activas</p>
                  <p className="text-2xl font-bold text-yellow">{userStats.activeReservations}</p>
                </div>
              </div>
            </div>

            <div className="card bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange text-white rounded-full">
                  🌟
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Experiencias Completadas</p>
                  <p className="text-2xl font-bold text-orange">{userStats.completedExperiences}</p>
                </div>
              </div>
            </div>

            <div className="card bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green text-white rounded-full">
                  💰
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Gastado</p>
                  <p className="text-2xl font-bold text-green">{formatCurrency(userStats.totalSpent)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="card bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green mb-6">Actividad Reciente</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mr-4">{activity.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    to={ROUTES.RESERVATIONS}
                    className="btn btn-outline border-green text-green hover:bg-green hover:text-white"
                  >
                    Ver Todas las Reservas
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="card bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green mb-6">Acciones Rápidas</h3>
                <div className="space-y-4">
                  <Link
                    to={ROUTES.EXPERIENCES}
                    className="block w-full btn btn-primary bg-yellow text-green hover:bg-yellow-600 py-3 text-center"
                  >
                    🌟 Explorar Experiencias
                  </Link>
                  <Link
                    to={ROUTES.COMMUNITIES}
                    className="block w-full btn btn-outline border-green text-green hover:bg-green hover:text-white py-3 text-center"
                  >
                    🏘️ Conocer Comunidades
                  </Link>
                  <Link
                    to={ROUTES.RESERVATIONS}
                    className="block w-full btn btn-outline border-orange text-orange hover:bg-orange hover:text-white py-3 text-center"
                  >
                    📅 Gestionar Reservas
                  </Link>
                </div>
              </div>

              {/* Profile Card */}
              <div className="card bg-white shadow-lg rounded-lg p-6 mt-6">
                <h3 className="text-xl font-semibold text-green mb-4">Mi Perfil</h3>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-green text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    👤
                  </div>
                  <h4 className="font-medium">Usuario Demo</h4>
                  <p className="text-sm text-gray-600">usuario@demo.com</p>
                </div>
                <button className="w-full btn btn-outline border-green text-green hover:bg-green hover:text-white py-2">
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
