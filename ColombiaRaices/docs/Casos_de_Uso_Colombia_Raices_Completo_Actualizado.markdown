    # Casos de Uso: Colombia Raíces (1-16, Actualizados)

    ## CASO DE USO 1: REGISTRAR USUARIO
    **Actores**: Viajero, Operador Comunitario
    **Requerimiento**: RF1 - El sistema debe permitir a los usuarios registrarse y autenticarse con email y contraseña.
    **Descripción**: El sistema permite que un nuevo usuario (viajero o operador comunitario) se registre proporcionando su nombre, email, contraseña y tipo de usuario. El sistema valida la información, asegura que el email sea único y almacena los datos en la base de datos SQLite.
    **Precondiciones**:
    - El usuario no está registrado previamente en el sistema.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El usuario accede a la pantalla de registro en la aplicación.
    2. El usuario ingresa su nombre, email, contraseña y selecciona su tipo de usuario (viajero u operador comunitario).
    3. El sistema valida que el email no esté registrado previamente en la tabla `Usuarios`.
    4. **{Validar Contraseña}**
    5. Si la validación es exitosa, el sistema almacena los datos del usuario en la tabla `Usuarios`, usando la contraseña encriptada devuelta.
    6. El sistema muestra un mensaje de confirmación de registro exitoso.
    7. El usuario es redirigido a la pantalla de inicio de sesión.
    **Flujo Alternativo A1: Contraseña Inválida**
    - **A1.1**: En el paso 4, el **Caso de Uso 4: Validar Contraseña** devuelve un error (e.g., “La contraseña debe tener al menos 8 caracteres”).
    - **A1.2**: El sistema muestra el mensaje de error específico devuelto por el **Caso de Uso 4**.
    - **A1.3**: El sistema permite al usuario corregir la contraseña y volver al paso 2.
    **Postcondiciones**:
    - Si el flujo normal se completa, el usuario queda registrado en la base de datos con un identificador único, y los datos (nombre, email, contraseña encriptada, tipo) están almacenados en la tabla `Usuarios`.
    - Si el flujo alternativo ocurre, el registro no se completa hasta que la contraseña sea válida.
    **Notas**:
    - **Reglas de negocio**: La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número. El email debe ser único en el sistema.
    - **Consideraciones técnicas**: Usa una biblioteca como `bcrypt` para encriptar la contraseña (manejado en el **Caso de Uso 4**).
    - **Consideraciones de seguridad**: No almacenar contraseñas en texto plano; implementar validación de formato de email en el frontend (React) y backend (Node.js).
    - **Punto de extensión**: En el paso 4, se invoca el **Caso de Uso 4: Validar Contraseña**.

    ## CASO DE USO 2: AUTENTICAR USUARIO
    **Actores**: Viajero, Operador Comunitario
    **Requerimiento**: RF1 - El sistema debe permitir a los usuarios registrarse y autenticarse con email y contraseña.
    **Descripción**: El sistema autentica a un usuario registrado al validar su email y contraseña, otorgando acceso a las funcionalidades correspondientes según su tipo de usuario.
    **Precondiciones**:
    - El usuario está registrado en la base de datos (existe en la tabla `Usuarios`).
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El usuario accede a la pantalla de inicio de sesión en la aplicación.
    2. El usuario ingresa su email y contraseña.
    3. El sistema verifica que el email exista en la tabla `Usuarios`.
    4. El sistema compara la contraseña proporcionada con la almacenada (encriptada) en la base de datos.
    5. Si las credenciales son válidas, el sistema genera una sesión para el usuario y lo redirige a la pantalla principal según su tipo (dashboard de viajero o de operador comunitario).
    6. El sistema muestra un mensaje de bienvenida personalizado con el nombre del usuario.
    **Flujo Alternativo A1: Email o Contraseña Inválida**
    - **A1.1**: En el paso 3, si el email no existe en la tabla `Usuarios`, o en el paso 4, si la contraseña no coincide con la almacenada, el sistema devuelve un error.
    - **A1.2**: El sistema muestra un mensaje genérico: “Email o contraseña incorrectos”.
    - **A1.3**: El sistema permite al usuario intentar nuevamente desde el paso 2.
    **Postcondiciones**:
    - Si el flujo normal se completa, el usuario está autenticado y tiene acceso a las funcionalidades de su rol, con una sesión activa en la aplicación.
    - Si el flujo alternativo ocurre, el usuario no está autenticado y debe corregir las credenciales.
    **Notas**:
    - **Reglas de negocio**: Solo los usuarios registrados pueden autenticarse. La sesión permanece activa hasta que el usuario cierre la aplicación o se desautentique.
    - **Consideraciones técnicas**: Usa un mecanismo de gestión de sesiones en Electron (e.g., almacenamiento en memoria o tokens locales).
    - **Consideraciones de seguridad**: Implementar un límite de intentos de inicio de sesión para prevenir ataques de fuerza bruta. Usar un mensaje genérico en el flujo alternativo para no revelar si el error es por email o contraseña.

    ## CASO DE USO 3: BUSCAR EXPERIENCIAS TURÍSTICAS
    **Actores**: Viajero
    **Requerimiento**: RF2 - El sistema debe permitir a los viajeros buscar experiencias por región, tipo (cultural, histórica, ecológica) y presupuesto.
    **Descripción**: El sistema permite al viajero buscar experiencias turísticas disponibles en la base de datos, filtrándolas por región, tipo de experiencia y presupuesto máximo, mostrando los resultados en una interfaz visualmente atractiva.
    **Precondiciones**:
    - El viajero está autenticado en el sistema.
    - Existen experiencias aprobadas en la base de datos (tabla `Experiencias` con estado “aprobada”).
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El viajero accede a la pantalla de búsqueda de experiencias en la aplicación.
    2. El viajero selecciona filtros opcionales: región (e.g., La Guajira, Chocó), tipo de experiencia (cultural, histórica, ecológica) y presupuesto máximo.
    3. El sistema valida que al menos un filtro esté seleccionado o permite una búsqueda general.
    4. El sistema consulta la tabla `Experiencias` en SQLite, filtrando por los criterios seleccionados y asegurándose de que el estado sea “aprobada”.
    5. El sistema muestra una lista de experiencias que coinciden con los filtros, incluyendo nombre, descripción, precio estimado y comunidad asociada.
    6. El viajero puede seleccionar una experiencia para ver detalles adicionales (fotos, duración, descripción completa).
    **Flujo Alternativo A1: No se Encuentran Experiencias**
    - **A1.1**: En el paso 4, si la consulta no devuelve resultados (ninguna experiencia coincide con los filtros), el sistema detecta el error.
    - **A1.2**: El sistema muestra un mensaje: “No se encontraron experiencias que coincidan con los criterios seleccionados.”
    - **A1.3**: El sistema permite al viajero ajustar los filtros y volver al paso 2.
    **Postcondiciones**:
    - Si el flujo normal se completa, el sistema muestra una lista de experiencias turísticas que cumplen con los criterios de búsqueda.
    - Si el flujo alternativo ocurre, el sistema informa al usuario que no hay resultados y permite ajustar los filtros.
    - El viajero puede interactuar con los resultados (e.g., ver detalles o generar una reserva) o ajustar la búsqueda.
    **Notas**:
    - **Reglas de negocio**: Solo se muestran experiencias con estado “aprobada”. El presupuesto máximo es un filtro opcional; si no se especifica, se muestran todas las experiencias disponibles.
    - **Consideraciones técnicas**: Usa consultas SQL optimizadas con índices en la tabla `Experiencias` para mejorar el rendimiento de las búsquedas. Implementa la interfaz con React y Tailwind CSS para una presentación visual atractiva.
    - **Restricciones**: La búsqueda no depende de APIs externas; los datos provienen exclusivamente de la base de datos SQLite.

    ## CASO DE USO 4: VALIDAR CONTRASEÑA
    **Actores**: Sistema (invocado por otros casos de uso, como Registrar Usuario o Actualizar Contraseña)
    **Requerimiento**: RF1 - El sistema debe permitir a los usuarios registrarse y autenticarse con email y contraseña (implícito en las reglas de negocio de validación de contraseña).
    **Descripción**: El sistema valida que una contraseña ingresada cumpla con las reglas de negocio definidas (mínimo 8 caracteres, al menos una letra y un número) y la encripta para su uso en procesos como el registro o la actualización de credenciales.
    **Precondiciones**:
    - Se ha proporcionado una contraseña como entrada desde un flujo de otro caso de uso.
    - El sistema tiene configuradas las reglas de validación de contraseña.
    **Flujo Normal**:
    1. El sistema recibe la contraseña ingresada desde un caso de uso principal (e.g., Registrar Usuario).
    2. El sistema verifica que la contraseña tenga al menos 8 caracteres.
    3. El sistema verifica que la contraseña contenga al menos una letra (mayúscula o minúscula).
    4. El sistema verifica que la contraseña contenga al menos un número.
    5. Si todas las verificaciones son exitosas, el sistema encripta la contraseña usando una biblioteca como `bcrypt`.
    6. El sistema devuelve la contraseña encriptada y un resultado de validación exitosa al caso de uso principal.
    **Flujo Alternativo A1: Contraseña con Menos de 8 Caracteres**
    - **A1.1**: En el paso 2, si la contraseña tiene menos de 8 caracteres, el sistema detecta el error.
    - **A1.2**: El sistema devuelve el mensaje de error: “La contraseña debe tener al menos 8 caracteres”.
    - **A1.3**: El sistema interrumpe el flujo y devuelve el error al caso de uso principal.
    **Flujo Alternativo A2: Contraseña sin Letra**
    - **A2.1**: En el paso 3, si la contraseña no contiene al menos una letra (mayúscula o minúscula), el sistema detecta el error.
    - **A2.2**: El sistema devuelve el mensaje de error: “La contraseña debe contener al menos una letra”.
    - **A2.3**: El sistema interrumpe el flujo y devuelve el error al caso de uso principal.
    **Flujo Alternativo A3: Contraseña sin Número**
    - **A3.1**: En el paso 4, si la contraseña no contiene al menos un número, el sistema detecta el error.
    - **A3.2**: El sistema devuelve el mensaje de error: “La contraseña debe contener al menos un número”.
    - **A3.3**: El sistema interrumpe el flujo y devuelve el error al caso de uso principal.
    **Postcondiciones**:
    - Si el flujo normal se completa, la contraseña es validada, encriptada, y devuelta al caso de uso principal.
    - Si un flujo alternativo ocurre, el sistema devuelve un mensaje de error específico, y la validación falla.
    **Notas**:
    - **Reglas de negocio**: La contraseña debe cumplir: mínimo 8 caracteres, al menos una letra y un número. No se permiten caracteres especiales no especificados en las reglas.
    - **Consideraciones técnicas**: Implementar la validación en el backend (Node.js) para garantizar consistencia, con una validación preliminar en el frontend (React) para mejorar la experiencia de usuario. Usa `bcrypt` para la encriptación.
    - **Consideraciones de seguridad**: Evitar exponer detalles específicos de la validación en mensajes de error para no facilitar ataques.
    - **Restricciones**: Este caso de uso es invocado como parte de otros flujos (e.g., registro o actualización de contraseña) y no es una interacción directa del usuario.

    ## CASO DE USO 5: GENERAR ESTIMACIÓN DE RESERVA
    **Actores**: Viajero
    **Requerimiento**: RF3 - El sistema debe generar estimaciones de reservas basadas en la duración, tipo de experiencia y servicios incluidos.
    **Descripción**: El sistema permite al viajero generar una estimación de reserva para una experiencia turística seleccionada, calculando el costo estimado según la duración, tipo de experiencia y servicios adicionales, almacenando la reserva en la base de datos con estado “pendiente”.
    **Precondiciones**:
    - El viajero está autenticado en el sistema.
    - La experiencia seleccionada está aprobada y disponible en la base de datos (tabla `Experiencias`).
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El viajero selecciona una experiencia turística desde la pantalla de detalles de una experiencia.
    2. El viajero elige opciones adicionales (e.g., incluir guía, transporte) y especifica la fecha deseada para la experiencia.
    3. El sistema valida que la fecha sea futura.
    4. El sistema calcula el costo estimado basado en el precio base de la experiencia, la duración y los servicios adicionales seleccionados, según las reglas de negocio.
    5. El sistema muestra un resumen de la estimación (experiencia, fecha, servicios, costo total).
    6. El viajero confirma la generación de la estimación.
    7. El sistema almacena la estimación en la tabla `Reservas` con estado “pendiente”, asociándola al usuario y la experiencia.
    8. El sistema muestra un mensaje de confirmación con los detalles de la estimación.
    **Flujo Alternativo A1: Fecha No Futura**
    - **A1.1**: En el paso 3, si la fecha ingresada no es futura (es actual o pasada), el sistema detecta el error.
    - **A1.2**: El sistema muestra un mensaje de error: “La fecha debe ser futura.”
    - **A1.3**: El sistema permite al usuario corregir la fecha y volver al paso 2.
    **Postcondiciones**:
    - Si el flujo normal se completa, la estimación de reserva está registrada en la tabla `Reservas` con estado “pendiente”.
    - Si el flujo alternativo ocurre, la reserva no se registra hasta que la fecha sea válida.
    - El viajero puede consultar la estimación en su historial de reservas.
    **Notas**:
    - **Reglas de negocio**: El costo estimado se calcula sumando el precio base de la experiencia y un porcentaje adicional por servicios (e.g., +20% por guía, +15% por transporte). La fecha debe ser futura.
    - **Consideraciones técnicas**: Usa transacciones en SQLite para garantizar la integridad al registrar la reserva. Implementa la lógica de cálculo en un módulo reutilizable en Node.js.
    - **Consideraciones de seguridad**: Valida que la fecha sea futura y que los servicios seleccionados sean válidos para la experiencia.

    ## CASO DE USO 6: PUBLICAR EXPERIENCIA
    **Actores**: Operador Comunitario
    **Requerimiento**: RF4 - El sistema debe permitir a los operadores comunitarios subir experiencias (nombre, descripción, fotos, precio estimado) con un proceso de validación administrativa.
    **Descripción**: El sistema permite a un operador comunitario subir una nueva experiencia turística, incluyendo nombre, descripción, tipo, precio estimado, duración y fotos, almacenándola en la base de datos con estado “pendiente” hasta su aprobación.
    **Precondiciones**:
    - El operador comunitario está autenticado en el sistema.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El operador comunitario accede a la pantalla de publicación de experiencias.
    2. El operador ingresa el nombre, descripción, tipo (cultural, histórica, ecológica), precio estimado, duración y sube fotos de la experiencia.
    3. El sistema valida que todos los campos obligatorios estén completos y que las fotos cumplan con los requisitos de formato (e.g., JPEG, PNG) y tamaño (menor a 5 MB).
    4. El sistema almacena la experiencia en la tabla `Experiencias` con estado “pendiente” y la asocia a una comunidad existente en la tabla `Comunidades`.
    5. El sistema muestra un mensaje de confirmación indicando que la experiencia está pendiente de aprobación.
    **Flujo Alternativo A1: Fotos Inválidas**
    - **A1.1**: En el paso 3, si las fotos no cumplen con los requisitos de formato (JPEG, PNG) o tamaño (menor a 5 MB), el sistema detecta el error.
    - **A1.2**: El sistema muestra un mensaje: “Las fotos deben ser en formato JPEG o PNG y menores a 5 MB.”
    - **A1.3**: El sistema permite al operador corregir las fotos y volver al paso 2.
    **Postcondiciones**:
    - Si el flujo normal se completa, la experiencia está registrada en la tabla `Experiencias` con estado “pendiente”.
    - Si el flujo alternativo ocurre, la experiencia no se registra hasta que las fotos sean válidas.
    - El operador puede consultar el estado de la experiencia en su panel.
    **Notas**:
    - **Reglas de negocio**: Las fotos deben ser menores a 5 MB y en formatos JPEG o PNG. El precio estimado debe ser mayor a 0.
    - **Consideraciones técnicas**: Usa un módulo de Node.js para manejar la carga de archivos (fotos) y almacenarlas como rutas o datos binarios en SQLite.
    - **Consideraciones de seguridad**: Valida el contenido de las fotos para evitar archivos maliciosos.

    ## CASO DE USO 7: APROBAR EXPERIENCIA
    **Actores**: Administrador (simulado en el sistema)
    **Requerimiento**: RF4 - El sistema debe permitir a los operadores comunitarios subir experiencias con un proceso de validación administrativa.
    **Descripción**: El sistema permite al administrador revisar y aprobar o rechazar experiencias subidas por operadores comunitarios, actualizando su estado en la base de datos.
    **Precondiciones**:
    - Existen experiencias en la tabla `Experiencias` con estado “pendiente”.
    - El administrador está autenticado en el sistema.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El administrador accede a la pantalla de gestión de experiencias pendientes.
    2. El administrador selecciona una experiencia pendiente para revisar.
    3. El sistema muestra los detalles de la experiencia (nombre, descripción, tipo, precio, fotos).
    4. El administrador aprueba o rechaza la experiencia, proporcionando un comentario opcional en caso de rechazo.
    5. El sistema actualiza el estado de la experiencia en la tabla `Experiencias` a “aprobada” o “rechazada”.
    6. El sistema notifica al operador comunitario del resultado (simulado como un mensaje en la aplicación).
    **Flujo Alternativo A1: No Hay Experiencias Pendientes**
    - **A1.1**: En el paso 1, si no hay experiencias en la tabla `Experiencias` con estado “pendiente”, el sistema detecta que la lista está vacía.
    - **A1.2**: El sistema muestra un mensaje: “No hay experiencias pendientes para revisar.”
    - **A1.3**: El sistema redirige al administrador a la pantalla principal de administración.
    **Postcondiciones**:
    - Si el flujo normal se completa, la experiencia tiene un estado actualizado (“aprobada” o “rechazada”) en la tabla `Experiencias`.
    - Si el flujo alternativo ocurre, no se realiza ninguna acción de aprobación, y el administrador es informado.
    - El operador comunitario puede consultar el resultado en su panel (en el flujo normal).
    **Notas**:
    - **Reglas de negocio**: Solo las experiencias aprobadas son visibles para los viajeros en las búsquedas.
    - **Consideraciones técnicas**: Usa transacciones en SQLite para garantizar la integridad al actualizar el estado.
    - **Consideraciones de seguridad**: Solo los administradores pueden aprobar o rechazar experiencias.

    ## CASO DE USO 8: VISUALIZAR PERFIL DE COMUNIDAD
    **Actores**: Viajero
    **Requerimiento**: RF5 - El sistema debe mostrar perfiles de comunidades con información cultural e histórica.
    **Descripción**: El sistema permite al viajero ver el perfil de una comunidad, incluyendo su nombre, región, descripción cultural e histórica, y fotos, para conectar emocionalmente con el destino.
    **Precondiciones**:
    - El viajero está autenticado en el sistema.
    - Existen comunidades registradas en la tabla `Comunidades`.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El viajero accede a la pantalla de búsqueda de comunidades o selecciona una comunidad desde una experiencia.
    2. El sistema consulta la tabla `Comunidades` para obtener los datos de la comunidad seleccionada.
    3. El sistema muestra el perfil de la comunidad, incluyendo nombre, región, descripción, fotos y experiencias asociadas.
    4. El viajero puede navegar a las experiencias relacionadas con la comunidad.
    **Postcondiciones**:
    - El viajero visualiza el perfil completo de la comunidad.
    - El viajero puede interactuar con las experiencias asociadas.
    **Notas**:
    - **Reglas de negocio**: Los perfiles deben incluir al menos una foto y una descripción de mínimo 50 caracteres.
    - **Consideraciones técnicas**: Usa React y Tailwind CSS para mostrar el perfil de forma visualmente atractiva, con un carrusel de fotos.
    - **Restricciones**: Los datos provienen exclusivamente de la base de datos SQLite.

    ## CASO DE USO 9: MOSTRAR MAPA INTERACTIVO
    **Actores**: Viajero
    **Requerimiento**: RF6 - El sistema debe integrar mapas interactivos para mostrar ubicaciones de experiencias.
    **Descripción**: El sistema muestra un mapa interactivo con las ubicaciones de las experiencias turísticas, utilizando una API externa como OpenStreetMap para enriquecer la experiencia del usuario.
    **Precondiciones**:
    - El viajero está autenticado en el sistema.
    - Existen experiencias aprobadas con información de ubicación en la tabla `Experiencias`.
    - El sistema tiene acceso a internet para la API de OpenStreetMap.
    **Flujo Normal**:
    1. El viajero accede a la pantalla de mapas desde la búsqueda de experiencias o el perfil de una comunidad.
    2. El sistema consulta la tabla `Experiencias` para obtener las coordenadas de las ubicaciones.
    3. El sistema envía una solicitud a la API de OpenStreetMap (usando Leaflet) para renderizar el mapa.
    4. El sistema muestra un mapa interactivo con marcadores para las experiencias, incluyendo nombres y precios estimados al hacer clic.
    5. El viajero puede interactuar con el mapa para explorar las ubicaciones.
    **Postcondiciones**:
    - El viajero visualiza un mapa interactivo con las ubicaciones de las experiencias.
    - El viajero puede seleccionar una experiencia desde el mapa para ver detalles.
    **Notas**:
    - **Reglas de negocio**: Las ubicaciones deben estar asociadas a experiencias aprobadas.
    - **Consideraciones técnicas**: Usa Leaflet para integrar OpenStreetMap en Electron. Almacena las coordenadas en SQLite para minimizar la dependencia de la API.
    - **Restricciones**: La API es complementaria; los datos principales residen en SQLite.

    ## CASO DE USO 10: ACTUALIZAR PERFIL DE USUARIO
    **Actores**: Viajero, Operador Comunitario
    **Requerimiento**: RF1 - El sistema debe permitir a los usuarios registrarse y autenticarse con email y contraseña (extensión para actualizar información).
    **Descripción**: El sistema permite a un usuario actualizar su información de perfil, como el nombre o la contraseña, manteniendo el email como único e inmutable.
    **Precondiciones**:
    - El usuario está autenticado en el sistema.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El usuario accede a la pantalla de edición de perfil.
    2. El usuario ingresa un nuevo nombre y/o una nueva contraseña.
    3. Si se ingresa una nueva contraseña, **{Validar Contraseña}**.
    4. El sistema valida que el nombre no esté vacío.
    5. El sistema actualiza los datos en la tabla `Usuarios`, usando la contraseña encriptada si se modificó.
    6. El sistema muestra un mensaje de confirmación de actualización exitosa.
    **Postcondiciones**:
    - Los datos del usuario (nombre y/o contraseña) están actualizados en la tabla `Usuarios`.
    **Notas**:
    - **Reglas de negocio**: El email no puede modificarse. La contraseña debe cumplir con las reglas del **Caso de Uso 4**.
    - **Consideraciones técnicas**: Usa transacciones en SQLite para garantizar la integridad.
    - **Consideraciones de seguridad**: Requiere autenticación previa para actualizar el perfil.

    ## CASO DE USO 11: CANCELAR ESTIMACIÓN DE RESERVA
    **Actores**: Viajero
    **Requerimiento**: RF3 - El sistema debe generar estimaciones de reservas basadas en la duración, tipo de experiencia y servicios incluidos (extensión para cancelación).
    **Descripción**: El sistema permite al viajero cancelar una estimación de reserva existente, actualizando su estado a “cancelada” en la base de datos.
    **Precondiciones**:
    - El viajero está autenticado en el sistema.
    - Existe al menos una reserva con estado “pendiente” o “confirmada” asociada al viajero en la tabla `Reservas`.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El viajero accede a la pantalla de historial de reservas.
    2. El viajero selecciona una reserva con estado “pendiente” o “confirmada”.
    3. El sistema muestra los detalles de la reserva (experiencia, fecha, costo estimado).
    4. El viajero confirma la cancelación de la reserva.
    5. El sistema actualiza el estado de la reserva a “cancelada” en la tabla `Reservas`.
    6. El sistema muestra un mensaje de confirmación de cancelación.
    **Flujo Alternativo A1: Reserva No Elegible para Cancelación**
    - **A1.1**: En el paso 2, si la reserva seleccionada tiene un estado “cancelada” o cualquier otro estado no permitido, el sistema detecta el error.
    - **A1.2**: El sistema muestra un mensaje: “La reserva no puede ser cancelada porque ya está cancelada o no es elegible.”
    - **A1.3**: El sistema permite al viajero seleccionar otra reserva o regresar a la pantalla de historial de reservas.
    **Postcondiciones**:
    - Si el flujo normal se completa, la reserva tiene el estado “cancelada” en la tabla `Reservas`.
    - Si el flujo alternativo ocurre, la reserva no se modifica, y el viajero es informado.
    **Notas**:
    - **Reglas de negocio**: Solo las reservas en estado “pendiente” o “confirmada” pueden ser canceladas.
    - **Consideraciones técnicas**: Usa transacciones en SQLite para garantizar la integridad.
    - **Consideraciones de seguridad**: Solo el viajero propietario de la reserva puede cancelarla.

    ## CASO DE USO 12: VISUALIZAR DETALLES DE EXPERIENCIA
    **Actores**: Viajero
    **Requerimiento**: RF2 - El sistema debe permitir a los viajeros buscar experiencias por región, tipo y presupuesto (extensión para ver detalles).
    **Descripción**: El sistema permite al viajero visualizar los detalles completos de una experiencia turística seleccionada, incluyendo descripción, fotos, precio estimado, duración y comunidad asociada.
    **Precondiciones**:
    - El viajero está autenticado en el sistema.
    - La experiencia seleccionada está aprobada en la tabla `Experiencias`.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El viajero selecciona una experiencia desde los resultados de búsqueda o un perfil de comunidad.
    2. El sistema consulta la tabla `Experiencias` y `Comunidades` para obtener los detalles de la experiencia y la comunidad asociada.
    3. El sistema muestra los detalles de la experiencia (nombre, tipo, descripción, precio estimado, duración, fotos, comunidad).
    4. El viajero puede optar por generar una estimación de reserva o regresar a la búsqueda.
    **Postcondiciones**:
    - El viajero visualiza los detalles completos de la experiencia.
    **Notas**:
    - **Reglas de negocio**: Solo se muestran experiencias aprobadas.
    - **Consideraciones técnicas**: Usa React y Tailwind CSS para mostrar un carrusel de fotos y un diseño atractivo.
    - **Restricciones**: Los datos provienen exclusivamente de SQLite.

    ## CASO DE USO 13: LISTAR RESERVAS DEL USUARIO
    **Actores**: Viajero
    **Requerimiento**: RF3 - El sistema debe generar estimaciones de reservas basadas en la duración, tipo de experiencia y servicios incluidos (extensión para consultar reservas).
    **Descripción**: El sistema permite al viajero listar todas sus reservas (pendientes, confirmadas o canceladas) almacenadas en la base de datos.
    **Precondiciones**:
    - El viajero está autenticado en el sistema.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El viajero accede a la pantalla de historial de reservas.
    2. El sistema consulta la tabla `Reservas` para obtener todas las reservas asociadas al usuario.
    3. El sistema muestra una lista de reservas, incluyendo la experiencia, fecha, estado y costo estimado.
    4. El viajero puede seleccionar una reserva para ver detalles o cancelarla.
    **Postcondiciones**:
    - El viajero visualiza la lista de sus reservas.
    **Notas**:
    - **Reglas de negocio**: Solo se muestran las reservas asociadas al usuario autenticado.
    - **Consideraciones técnicas**: Usa consultas SQL optimizadas para mejorar el rendimiento.
    - **Consideraciones de seguridad**: Restringir el acceso a las reservas del usuario autenticado.

    ## CASO DE USO 14: CERRAR SESIÓN
    **Actores**: Viajero, Operador Comunitario
    **Requerimiento**: RF1 - El sistema debe permitir a los usuarios registrarse y autenticarse con email y contraseña (extensión para cerrar sesión).
    **Descripción**: El sistema permite al usuario cerrar su sesión activa, terminando el acceso a las funcionalidades protegidas.
    **Precondiciones**:
    - El usuario está autenticado en el sistema.
    **Flujo Normal**:
    1. El usuario selecciona la opción de cerrar sesión en la aplicación.
    2. El sistema elimina la sesión activa del usuario.
    3. El sistema redirige al usuario a la pantalla de inicio de sesión.
    4. El sistema muestra un mensaje de confirmación de cierre de sesión.
    **Postcondiciones**:
    - La sesión del usuario está cerrada.
    - El usuario debe autenticarse nuevamente para acceder a las funcionalidades.
    **Notas**:
    - **Reglas de negocio**: El cierre de sesión es inmediato y no afecta los datos almacenados.
    - **Consideraciones técnicas**: Usa un mecanismo de gestión de sesiones en Electron para eliminar la sesión de forma segura.
    - **Consideraciones de seguridad**: Asegura que no queden datos sensibles en memoria tras cerrar sesión.

    ## CASO DE USO 15: REGISTRAR COMUNIDAD
    **Actores**: Administrador (simulado en el sistema)
    **Requerimiento**: RF5 - El sistema debe mostrar perfiles de comunidades con información cultural e histórica (implícito en la gestión de comunidades).
    **Descripción**: El sistema permite al administrador registrar una nueva comunidad, incluyendo su nombre, región, descripción y fotos, para asociarla con experiencias turísticas.
    **Precondiciones**:
    - El administrador está autenticado en el sistema.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El administrador accede a la pantalla de registro de comunidades.
    2. El administrador ingresa el nombre, región, descripción y sube fotos de la comunidad.
    3. El sistema valida que los campos obligatorios estén completos y que las fotos cumplan con los requisitos de formato.
    4. El sistema almacena la comunidad en la tabla `Comunidades`.
    5. El sistema muestra un mensaje de confirmación de registro exitoso.
    **Postcondiciones**:
    - La comunidad está registrada en la tabla `Comunidades`.
    - La comunidad puede asociarse con experiencias.
    **Notas**:
    - **Reglas de negocio**: Las fotos deben ser menores a 5 MB y en formatos JPEG o PNG. La descripción debe tener al menos 50 caracteres.
    - **Consideraciones técnicas**: Usa un módulo de Node.js para manejar la carga de archivos.
    - **Consideraciones de seguridad**: Valida el contenido de las fotos para evitar archivos maliciosos.

    ## CASO DE USO 16: ACTUALIZAR EXPERIENCIA
    **Actores**: Operador Comunitario
    **Requerimiento**: RF4 - El sistema debe permitir a los operadores comunitarios subir experiencias (extensión para actualizarlas).
    **Descripción**: El sistema permite a un operador comunitario actualizar los detalles de una experiencia existente (pendiente o aprobada), como descripción, precio estimado o fotos, manteniendo el estado actual o volviendo a “pendiente” si es necesario.
    **Precondiciones**:
    - El operador comunitario está autenticado en el sistema.
    - La experiencia existe en la tabla `Experiencias` y está asociada al operador.
    - El sistema tiene acceso a la base de datos SQLite.
    **Flujo Normal**:
    1. El operador accede a la pantalla de gestión de experiencias.
    2. El operador selecciona una experiencia para editar.
    3. El sistema muestra los detalles actuales de la experiencia (nombre, descripción, tipo, precio, fotos).
    4. El operador actualiza los campos deseados (e.g., descripción, precio, fotos).
    5. El sistema valida los datos actualizados (e.g., formato de fotos, precio mayor a 0).
    6. El sistema actualiza la experiencia en la tabla `Experiencias`, cambiando el estado a “pendiente” si se modifican campos críticos (e.g., precio, descripción).
    7. El sistema muestra un mensaje de confirmación de actualización.
    **Postcondiciones**:
    - La experiencia está actualizada en la tabla `Experiencias`.
    - Si se modificaron campos críticos, el estado es “pendiente”; de lo contrario, permanece “aprobada”.
    **Notas**:
    - **Reglas de negocio**: Los cambios en campos críticos requieren revalidación administrativa.
    - **Consideraciones técnicas**: Usa transacciones en SQLite para garantizar la integridad.
    - **Consideraciones de seguridad**: Solo el operador propietario de la experiencia puede actualizarla.
