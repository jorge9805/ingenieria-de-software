
const LoadingSpinner = ({ size = 'medium', color = '#F5D547' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const spinnerStyle = {
    width: size === 'small' ? '16px' : size === 'medium' ? '32px' : '48px',
    height: size === 'small' ? '16px' : size === 'medium' ? '32px' : '48px',
    border: `3px solid ${color}30`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div className="flex items-center justify-center">
      <div style={spinnerStyle}></div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
