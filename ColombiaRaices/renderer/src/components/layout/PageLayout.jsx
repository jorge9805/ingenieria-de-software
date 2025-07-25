// Componente de layout estándar para páginas de la aplicación
import TravelerHeader from '../traveler/TravelerHeader';
import Navigation from '../common/Navigation';

const PageLayout = ({ 
  children, 
  headerType = 'default', 
  currentPage = null,
  title = null,
  showNavigation = false 
}) => {
  const renderHeader = () => {
    switch (headerType) {
      case 'traveler':
        return <TravelerHeader currentPage={currentPage} customTitle={title} />;
      case 'operator':
        // Future: OperatorHeader component
        return <TravelerHeader currentPage={currentPage} customTitle={title} />;
      case 'none':
        return null;
      default:
        return showNavigation ? <Navigation /> : null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <main>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
