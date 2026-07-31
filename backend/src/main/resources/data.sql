-- 1. Insertar el análisis principal
INSERT INTO analisis_financiero (
    usuario_id,
    ingreso_mensual,
    nivel_endeudamiento,
    frecuencia_ahorro,
    descripcion,
    valor,
    perfil_financiero,
    probabilidad,
    fecha_creacion
)
VALUES (
           'USR-1001',
           650000.00,
           2,
           'MENSUAL',
           'Supermercado Coto compras semana',
           42500.00,
           'Moderado',
           0.85,
           CURRENT_TIMESTAMP(0)
       );

-- 2. Insertar categorías
INSERT INTO analisis_categorias (analisis_id, categoria)
SELECT id, 'ALIMENTACION' FROM analisis_financiero WHERE usuario_id = 'USR-1001' ORDER BY id DESC LIMIT 1;

INSERT INTO analisis_categorias (analisis_id, categoria)
SELECT id, 'GASTOS_GENERALES' FROM analisis_financiero WHERE usuario_id = 'USR-1001' ORDER BY id DESC LIMIT 1;

-- 3. Insertar recomendaciones
INSERT INTO analisis_recomendaciones (analisis_id, recomendacion)
SELECT id, 'Monitorear los gastos recurrentes de supermercado' FROM analisis_financiero WHERE usuario_id = 'USR-1001' ORDER BY id DESC LIMIT 1;

INSERT INTO analisis_recomendaciones (analisis_id, recomendacion)
SELECT id, 'Aumentar el margen de ahorro mensual' FROM analisis_financiero WHERE usuario_id = 'USR-1001' ORDER BY id DESC LIMIT 1;

INSERT INTO transacciones (usuario_id, descripcion, monto, tipo, categoria, fecha_transaccion)
VALUES ('USR-1001', 'Compra en Farmacia', 8500.50, 'EGRESO', 'Salud', CURRENT_TIMESTAMP);