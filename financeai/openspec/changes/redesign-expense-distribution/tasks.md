## 1. Preparación del Estado

- [x] 1.1 Localizar el componente en `ReportsView.tsx` (`id="card-reports-expense-distribution"`).
- [x] 1.2 Remover el estado local `focusedCategory` de la versión anterior.
- [x] 1.3 Eliminar el código del layout de "barra apilada y leyenda" existente.
- [x] 1.4 Refactorizar el contenedor para que aplique la estructura grid solo si es necesario, o limpiar las columnas para la nueva lista vertical.

## 2. Implementación de Lógica Visual

- [x] 2.1 Calcular `maxMonto` iterando sobre `distribucionCategoriasTotal` y buscando el valor más alto en `monto`.
- [x] 2.2 Agregar un chequeo condicional en `maxMonto`: si es `<= 0` (o el arreglo está vacío), forzar a 1 para evitar divisiones por cero.
- [x] 2.3 Implementar renderizado condicional para mostrar el Empty State "Aún no hay gastos registrados" cuando la lista esté vacía.

## 3. Renderizado de Componentes UI (Distribución V2)

- [x] 3.1 Construir el contenedor scrolleable (ej. `max-h-[400px] overflow-y-auto custom-scrollbar`) para albergar la iteración de categorías.
- [x] 3.2 Por cada categoría, crear el diseño de fila (Fila que incluye: círculo de color, Nombre de categoría, Porcentaje de gasto, Monto en formato de moneda).
- [x] 3.3 Debajo de la información de la fila, insertar la barra horizontal (ej. `<div className="h-1.5 bg-[#f3f4f5]">`).
- [x] 3.4 Calcular e inyectar el ancho de la barra coloreada: `width: Math.max(1, (cat.monto / maxMonto) * 100)%`.
- [x] 3.5 Aplicar `cat.colorHex` al `backgroundColor` de la barra coloreada y añadir la transición suave de 300ms.

## 4. Pruebas y Limpieza

- [x] 4.1 Comprobar visualmente que el componente se adapta a dispositivos móviles (una sola columna).
- [x] 4.2 Verificar que una categoría dominante no oculta a las categorías secundarias en la vista.
- [x] 4.3 Comprobar que los colores se mantienen consistentes con el Dashboard (vía `colorManager`).
