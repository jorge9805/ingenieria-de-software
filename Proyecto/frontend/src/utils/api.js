// Utilidad para hacer peticiones HTTP con manejo robusto de errores y reintentos

export const fetchWithRetry = async (url, options = {}, maxRetries = 3, retryDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Agregar timeout si no está especificado
      const fetchOptions = {
        timeout: 10000,
        signal: AbortSignal.timeout(10000),
        ...options
      };
      
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
      
    } catch (error) {
      lastError = error;
      
      // Log del intento
      console.warn(`Fetch attempt ${attempt + 1} failed:`, error.message);
      
      // Verificar si es un error que vale la pena reintentar
      const isRetryableError = 
        error.name === 'TypeError' || 
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('timeout') ||
        error.message.includes('ERR_NETWORK') ||
        (error.message.includes('HTTP 5') && error.message.includes('50')); // 500, 502, 503, etc.
      
      // Si no es reintentable o ya agotamos los intentos, lanzar error
      if (!isRetryableError || attempt === maxRetries) {
        throw lastError;
      }
      
      // Esperar antes del siguiente intento
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms... (${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  throw lastError;
};

// Función helper para peticiones GET con token
export const fetchWithAuth = async (url, token, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return fetchWithRetry(url, {
    ...options,
    headers
  });
};

// Función helper para peticiones POST/PUT con datos
export const fetchWithData = async (url, method, data, token, options = {}) => {
  return fetchWithAuth(url, token, {
    method,
    body: JSON.stringify(data),
    ...options
  });
};

// Función para verificar si el servidor está disponible
export const checkServerHealth = async () => {
  try {
    const response = await fetch('http://localhost:4000/api/posts', {
      method: 'HEAD', // Solo verificar que responde
      timeout: 5000,
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Función helper para mostrar notificaciones
export const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div')
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#51cf66' : '#ff6b6b'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 1000;
    font-weight: 600;
    max-width: 350px;
    word-wrap: break-word;
  `
  document.body.appendChild(notification)
  setTimeout(() => notification.remove(), 4000)
};
