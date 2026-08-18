# Proyecto Financiera Saludable - Frontend

Esta es la primera versión del frontend del Proyecto Financiera Saludable. A continuación, se detalla la documentación exclusiva de lo que se encuentra implementado actualmente en el código base. **Nota: Este proyecto se encuentra en desarrollo activo y está sujeto a próximos cambios.**

## Tecnologías Implementadas
- **Framework:** Next.js (React)
- **Estilos:** Tailwind CSS

## Funcionalidades Implementadas

### 1. Gestión de Transacciones (Ingresos y Gastos)
- **Visualización:** Carga y muestra de transacciones previas del usuario desde el servidor.
- **Creación:** Permite agregar nuevos gastos o ingresos (incluyendo validaciones de descripción, monto y generación de fecha), enviando los datos al backend de forma asíncrona.
- **Eliminación:** Posibilidad de borrar transacciones existentes, reflejando el cambio en la interfaz y en el servidor.
- **Resumen:** Cálculo automático del total de los gastos/transacciones ingresados, formateado en moneda local.

### 2. Análisis Financiero
- **Formulario de Diagnóstico:** Captura de datos clave del usuario para generar un análisis financiero personalizado, tales como:
  - Ingreso mensual y frecuencia de ahorro.
  - Valor total de la deuda y pago mensual de la misma.
  - Monto destinado a inversión y fondo de emergencia.
  - Objetivo de presupuesto y gastos en servicios de suscripción.
- **Visualización de Resultados:** Uso de componentes (`TarjetaDiagnostico` y `TarjetaRecomendacion`) para mostrar indicadores de salud financiera y consejos prácticos tras procesar el formulario.

## Estructura de Componentes Principales
- `SeccionIngresoGastos`: Componente central para listar, crear y eliminar transacciones.
- `MicroTarjetaGasto`: Tarjeta individual para mostrar los detalles de un gasto/transacción.
- `FormularioAnalisis`: Orquestador principal que recopila la información del usuario y las transacciones para su evaluación.
- `TarjetaDiagnostico` / `TarjetaRecomendacion`: Componentes visuales de retroalimentación tras el análisis.
