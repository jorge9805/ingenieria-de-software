@echo off
setlocal EnableDelayedExpansion

rem ====================================
rem SCRIPT DE INSTALACIÓN AUTOMÁTICA
rem TurismoApp - Aplicación de Turismo
rem ====================================

echo 🌟 Iniciando instalación de TurismoApp...
echo ========================================
echo.

rem Verificar prerrequisitos
echo 🔍 Verificando prerrequisitos...

rem Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado. Descárgalo desde https://nodejs.org/
    pause
    exit /b 1
)

rem Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm no está instalado. Viene incluido con Node.js.
    pause
    exit /b 1
)

rem Verificar PostgreSQL
psql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: PostgreSQL no está instalado. Descárgalo desde https://www.postgresql.org/download/
    echo    Asegúrate de que psql esté en el PATH del sistema.
    pause
    exit /b 1
)

rem Verificar Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Git no está instalado. Descárgalo desde https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Todos los prerrequisitos están instalados
echo.

rem Mostrar versiones
echo 📋 Versiones instaladas:
for /f "tokens=*" %%i in ('node --version') do echo Node.js: %%i
for /f "tokens=*" %%i in ('npm --version') do echo npm: %%i
for /f "tokens=1-3" %%i in ('psql --version') do echo PostgreSQL: %%i %%j %%k
for /f "tokens=1-3" %%i in ('git --version') do echo Git: %%i %%j %%k
echo.

rem Instalar dependencias del proyecto principal
echo 📦 Instalando dependencias...

if not exist "package.json" (
    echo ❌ Error: No se encontró package.json. ¿Estás en el directorio correcto?
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Error: Falló la instalación de dependencias del proyecto principal
    pause
    exit /b 1
)

echo ✅ Dependencias del proyecto principal instaladas
echo.

rem Instalar dependencias del frontend
echo 🎨 Instalando dependencias del frontend...
cd frontend

if not exist "package.json" (
    echo ❌ Error: No se encontró package.json en la carpeta frontend
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Error: Falló la instalación de dependencias del frontend
    pause
    exit /b 1
)

echo ✅ Dependencias del frontend instaladas
echo.

rem Construir el frontend
echo 🏗️ Construyendo el frontend...
npm run build
if errorlevel 1 (
    echo ❌ Error: Falló la construcción del frontend
    pause
    exit /b 1
)

echo ✅ Frontend construido exitosamente
echo.

rem Volver al directorio raíz
cd ..

rem Instalar dependencias del backend
echo ⚙️ Instalando dependencias del backend...
cd backend

if not exist "package.json" (
    echo ❌ Error: No se encontró package.json en la carpeta backend
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Error: Falló la instalación de dependencias del backend
    pause
    exit /b 1
)

echo ✅ Dependencias del backend instaladas
echo.

rem Volver al directorio raíz
cd ..

rem Configurar archivo .env
echo 🔧 Configurando variables de entorno...

if not exist "backend\.env" (
    if exist ".env.example" (
        copy ".env.example" "backend\.env" >nul
        echo ✅ Archivo .env creado desde .env.example
        echo ⚠️ IMPORTANTE: Edita backend\.env con tu configuración de PostgreSQL
    ) else (
        echo ❌ Error: No se encontró .env.example para crear la configuración
        pause
        exit /b 1
    )
) else (
    echo ✅ El archivo .env ya existe
)
echo.

rem Verificar conexión a PostgreSQL
echo 🗄️ Verificando conexión a PostgreSQL...

rem Intentar conectarse a PostgreSQL
psql -U postgres -c "SELECT version();" >nul 2>&1
if errorlevel 1 (
    echo ⚠️ No se pudo conectar a PostgreSQL. Verifica que esté corriendo:
    echo    Windows: Usar Services.msc para iniciar el servicio PostgreSQL
    echo    o usar pgAdmin para administrar el servidor
    echo.
    echo ⚠️ Recuerda configurar la base de datos manualmente después:
    echo    psql -U postgres -f database_setup.sql
) else (
    echo ✅ Conexión a PostgreSQL exitosa
    echo.
    set /p setup_db="🚀 ¿Quieres configurar la base de datos automáticamente? (y/n): "
    
    if /i "!setup_db!"=="y" (
        echo 📊 Configurando base de datos...
        
        if exist "database_setup.sql" (
            psql -U postgres -f database_setup.sql
            
            if errorlevel 1 (
                echo ⚠️ Hubo algunos errores en la configuración de la base de datos
                echo Puedes ejecutar manualmente: psql -U postgres -f database_setup.sql
            ) else (
                echo ✅ Base de datos configurada exitosamente
            )
        ) else (
            echo ⚠️ No se encontró database_setup.sql
        )
    ) else (
        echo ⚠️ Recuerda configurar la base de datos manualmente:
        echo psql -U postgres -f database_setup.sql
    )
)

echo.

rem Resumen final
echo 🎉 ¡Instalación completada!
echo ==========================
echo.
echo Para ejecutar la aplicación:
echo npm start
echo.
echo Comandos útiles:
echo npm run rebuild    # Reconstruir frontend
echo npm run build      # Empaquetar para distribución
echo.
echo Si hay problemas:
echo 1. Verifica que PostgreSQL esté corriendo (Services.msc)
echo 2. Edita backend\.env con tu configuración
echo 3. Ejecuta database_setup.sql manualmente
echo.
echo 📚 Lee el README.md para más información
echo.
echo 🚀 ¡Disfruta usando TurismoApp!
echo.

pause
