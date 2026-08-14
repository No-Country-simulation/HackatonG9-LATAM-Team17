## Context

En la V2 inicial, los gastos se mantenían en memoria (React State) y se despachaban todos juntos al solicitar el análisis financiero. La nueva versión del API backend introduce el `TransaccionController` para gestionar los gastos de forma individual y persistente.

## Goals / Non-Goals

**Goals:**
- Mover la lógica de persistencia de gastos fuera del flujo de envío del formulario.
- Cargar los gastos preexistentes del backend al montar la UI.
- Garantizar que el `AnalisisController` ya no reciba la lista de `transacciones` desde el cliente.
- Usar el ID `USR-1001` consistentemente.

**Non-Goals:**
- Modificar el diseño visual o las animaciones de las tarjetas de gastos.
- Implementar autenticación real de usuario.

## Decisions

1. **Sincronización Optimista vs. Pesimista**: Adoptaremos un enfoque **pesimista** (la UI de gastos solo se actualizará tras confirmar que el servidor aceptó el `POST` o `DELETE`) para garantizar que la base de datos backend esté perfectamente sincronizada con lo que ve el usuario, dado que de ello depende el cálculo del análisis posterior.
2. **Propiedad `id` obligatoria**: Los objetos de gastos en la memoria del frontend ahora deben almacenar la llave primaria (ID) proveniente de la base de datos Spring Boot, esencial para ejecutar operaciones `DELETE`.

## Risks / Trade-offs

- **Experiencia Asíncrona Ligeramente Más Lenta**: Cada vez que el usuario añada un gasto, habrá una micro-latencia de red en vez de una actualización instantánea en memoria.
  - *Mitigación*: Se debe utilizar adecuadamente un indicador de "cargando..." o deshabilitar temporalmente el botón de agregar para prevenir envíos duplicados mientras se resuelve la promesa de red.
