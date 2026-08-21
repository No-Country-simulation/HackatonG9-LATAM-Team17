## 1. Integración de Endpoint (`src/components/SettingsProfileView.tsx`)

- [x] 1.1 Modificar la función que maneja el guardado de "Información Personal" para que envíe un `PUT /api/v1/auth/usuarios/{id}` con los campos `nombre` y `email`.
- [x] 1.2 Agregar manejo de estados (loading, success, error) al botón de guardado.
- [x] 1.3 Almacenar la respuesta exitosa actualizando el objeto usuario en el estado global/`localStorage` para que los cambios se reflejen inmediatamente.

## 2. Refactorización a Solo Lectura (`src/components/SettingsProfileView.tsx`)

- [x] 2.1 Reemplazar los inputs editables de "Ingreso Mensual", "Objetivo", "Fondo" y "Frecuencia" por divs/textos estáticos con estilos premium.
- [x] 2.2 Agregar a esta sección la visualización del campo "Deuda Total" de manera estática.
- [x] 2.3 Eliminar el botón "Guardar Parámetros" y la lógica de submit asociada a la sección financiera.
- [x] 2.4 Asegurar que si el usuario no tiene historial de análisis (es decir, datos en cero o `null`), se muestre un mensaje amistoso sugiriendo que cree un análisis primero.

## 3. Reseteo en Nuevo Análisis (`src/components/NewAnalysisView.tsx`)

- [x] 3.1 Agregar un hook (`useEffect`) que limpie/resetee los estados de ingreso, deuda, ahorro y demás variables financieras al montar la vista, garantizando que el usuario ingrese la información desde cero en cada análisis.
