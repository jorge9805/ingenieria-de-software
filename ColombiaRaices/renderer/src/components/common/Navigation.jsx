// Componente de navegación principal
import { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import Logo from './Logo';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: 'Inicio', path: ROUTES.HOME, icon: '🏠' },
    { name: 'Experiencias', path: ROUTES.EXPERIENCES, icon: '🌟' },
    { name: 'Comunidades', path: ROUTES.COMMUNITIES, icon: '🏘️' },
    { name: 'Reservas', path: ROUTES.RESERVATIONS, icon: '📅' },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-green shadow-lg">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <h1 className="text-white text-2xl font-bold">
              Colombia Raíces
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActiveRoute(item.path)
                    ? 'bg-yellow text-green font-semibold'
                    : 'text-white hover:bg-green-700'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link
              to={ROUTES.LOGIN}
              className="btn btn-outline border-white text-white hover:bg-white hover:text-green"
            >
              Iniciar Sesión
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="btn btn-primary bg-yellow text-green hover:bg-yellow-600"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-yellow text-green font-semibold'
                      : 'text-white hover:bg-green-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="border-t border-green-600 mt-4 pt-4">
                <div className="flex flex-col space-y-2">
                  <Link
                    to={ROUTES.LOGIN}
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-green"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="btn btn-primary bg-yellow text-green hover:bg-yellow-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
