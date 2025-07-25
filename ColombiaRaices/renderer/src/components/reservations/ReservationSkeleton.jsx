import { COLORS } from '../../constants/colors';

const ReservationSkeleton = ({ count = 3 }) => {
  const skeletonStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    animation: 'shimmer 1.5s ease-in-out infinite'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>
        {`
          @keyframes shimmer {
            0% { background-color: #f0f0f0; }
            50% { background-color: #e0e0e0; }
            100% { background-color: #f0f0f0; }
          }
        `}
      </style>
      
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}
        >
          {/* Header con status y fecha */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              ...skeletonStyle,
              width: '120px',
              height: '24px'
            }} />
            <div style={{
              ...skeletonStyle,
              width: '80px',
              height: '20px'
            }} />
          </div>

          {/* Título de experiencia */}
          <div style={{
            ...skeletonStyle,
            width: '70%',
            height: '28px',
            marginBottom: '12px'
          }} />

          {/* Detalles */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <div style={{
              ...skeletonStyle,
              width: '90%',
              height: '18px'
            }} />
            <div style={{
              ...skeletonStyle,
              width: '60%',
              height: '18px'
            }} />
          </div>

          {/* Footer con precio y botones */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              ...skeletonStyle,
              width: '100px',
              height: '24px'
            }} />
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <div style={{
                ...skeletonStyle,
                width: '80px',
                height: '36px'
              }} />
              <div style={{
                ...skeletonStyle,
                width: '80px',
                height: '36px'
              }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton para estadísticas
export const ReservationStatsSkeleton = () => {
  const skeletonStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    animation: 'shimmer 1.5s ease-in-out infinite'
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      <style>
        {`
          @keyframes shimmer {
            0% { background-color: #f0f0f0; }
            50% { background-color: #e0e0e0; }
            100% { background-color: #f0f0f0; }
          }
        `}
      </style>
      
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}
        >
          <div style={{
            ...skeletonStyle,
            width: '60px',
            height: '32px',
            margin: '0 auto 12px auto'
          }} />
          <div style={{
            ...skeletonStyle,
            width: '80px',
            height: '18px',
            margin: '0 auto'
          }} />
        </div>
      ))}
    </div>
  );
};

// Skeleton para formulario de reserva
export const ReservationFormSkeleton = () => {
  const skeletonStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    animation: 'shimmer 1.5s ease-in-out infinite'
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <style>
        {`
          @keyframes shimmer {
            0% { background-color: #f0f0f0; }
            50% { background-color: #e0e0e0; }
            100% { background-color: #f0f0f0; }
          }
        `}
      </style>
      
      {/* Título */}
      <div style={{
        ...skeletonStyle,
        width: '300px',
        height: '32px',
        marginBottom: '24px'
      }} />

      {/* Campos del formulario */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            <div style={{
              ...skeletonStyle,
              width: '120px',
              height: '20px',
              marginBottom: '8px'
            }} />
            <div style={{
              ...skeletonStyle,
              width: '100%',
              height: '48px'
            }} />
          </div>
        ))}
      </div>

      {/* Botón */}
      <div style={{
        ...skeletonStyle,
        width: '200px',
        height: '48px',
        marginTop: '24px'
      }} />
    </div>
  );
};

export default ReservationSkeleton;
