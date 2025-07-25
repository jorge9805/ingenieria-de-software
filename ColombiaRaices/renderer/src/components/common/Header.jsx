const Header = ({ title = 'Colombia Raíces', showAuth = true }) => {
  return (
    <header className="bg-white shadow-lg">
      <div className="container">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <h1 className="text-green" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {title}
            </h1>
          </div>
          {showAuth && (
            <div className="flex space-x-4">
              <button className="btn btn-primary">
                Iniciar Sesión
              </button>
              <button className="btn btn-secondary">
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
