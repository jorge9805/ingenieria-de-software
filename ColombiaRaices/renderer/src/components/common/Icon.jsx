// Componente Icon base para Colombia Raíces
// Maneja la visualización consistente de iconos en toda la aplicación

const Icon = ({ 
  name, 
  size = 24, 
  color = '#03222b', 
  className = '', 
  style = {},
  ...props 
}) => {
  // Construir la ruta del icono
  const iconPath = `/icons/${name}.svg`;
  
  // Estilos por defecto
  const defaultStyles = {
    width: size,
    height: size,
    color: color,
    display: 'inline-block',
    verticalAlign: 'middle',
    ...style
  };

  return (
    <img
      src={iconPath}
      alt={`${name} icon`}
      style={defaultStyles}
      className={`icon ${className}`}
      {...props}
    />
  );
};

// Iconos predefinidos para fácil uso
export const NavigationIcon = ({ name, ...props }) => (
  <Icon name={`navigation/${name}`} {...props} />
);

export const UIIcon = ({ name, ...props }) => (
  <Icon name={`ui/${name}`} {...props} />
);

export const CategoryIcon = ({ name, ...props }) => (
  <Icon name={`categories/${name}`} {...props} />
);

export const ActionIcon = ({ name, ...props }) => (
  <Icon name={`actions/${name}`} {...props} />
);

export default Icon;
