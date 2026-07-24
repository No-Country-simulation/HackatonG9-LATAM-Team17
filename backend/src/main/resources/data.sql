-- Insertar datos ficticios en la tabla de transacciones
INSERT INTO transacciones (usuario_id, descripcion, monto, tipo, categoria)
VALUES ('USR-1001', 'Supermercado Coto compras semana', 42500.00, 'EGRESO', 'ALIMENTACION');

INSERT INTO transacciones (usuario_id, descripcion, monto, tipo, categoria)
VALUES ('USR-1001', 'Carga de combustible YPF', 18000.00, 'EGRESO', 'TRANSPORTE');

INSERT INTO transacciones (usuario_id, descripcion, monto, tipo, categoria)
VALUES ('USR-1001', 'Transferencia sueldo mensual', 650000.00, 'INGRESO', 'INGRESOS');

INSERT INTO transacciones (usuario_id, descripcion, monto, tipo, categoria)
VALUES ('USR-1001', 'Pago servicio Internet Fibertel', 15500.00, 'EGRESO', 'SERVICIOS');

INSERT INTO transacciones (usuario_id, descripcion, monto, tipo, categoria)
VALUES ('USR-1002', 'Cena restaurante Palermo', 32000.00, 'EGRESO', 'SALIDAS');

-- Insertar análisis previos de prueba
INSERT INTO analisis_financiero (usuario_id, estado_financiero, diagnostico, fecha_creacion)
VALUES ('USR-1001', 'SALUDABLE', 'El balance mensual muestra un margen positivo adecuado.', CURRENT_TIMESTAMP(0));