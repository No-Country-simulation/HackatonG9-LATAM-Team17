-- =================================================================
-- 1. CORREGIR ESTRUCTURA DE TABLA Y REGISTROS PREVIOS
-- (Se ejecuta primero para evitar fallos de restricción NOT NULL)
-- =================================================================

-- Actualizar registros existentes que quedaron en NULL
UPDATE transacciones
SET activo = true
WHERE activo IS NULL;

-- Asegurar restricción NOT NULL y DEFAULT true para transacciones
ALTER TABLE transacciones
    ALTER COLUMN activo SET DEFAULT true,
ALTER COLUMN activo SET NOT NULL;


-- =================================================================
-- 2. INSERTAR ANÁLISIS CON SUS CATEGORÍAS Y RECOMENDACIONES
-- (Usa CTE para capturar el ID de forma atómica y evitar problemas con MAX(id))
-- =================================================================

WITH nuevo_analisis AS (
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
) VALUES (
    'USR-1001',
    650000.00,
    2,
    'MENSUAL',
    'Supermercado Coto compras semana',
    42500.00,
    'Moderado',
    0.85,
    CURRENT_TIMESTAMP
    )
    RETURNING id
    ),
    ins_categorias AS (
INSERT INTO analisis_categorias (analisis_id, categoria)
SELECT id, unnest(ARRAY['ALIMENTACION', 'GASTOS_GENERALES'])
FROM nuevo_analisis
    )
INSERT INTO analisis_recomendaciones (analisis_id, recomendacion)
SELECT id, unnest(ARRAY[
                      'Monitorear los gastos recurrentes de supermercado',
                  'Aumentar el margen de ahorro mensual'
                      ])
FROM nuevo_analisis;


-- =================================================================
-- 3. INSERTAR TRANSACCIÓN DE PRUEBA
-- =================================================================

INSERT INTO transacciones (usuario_id, descripcion, monto, tipo, categoria, activo, fecha_transaccion)
VALUES ('USR-1001', 'Compra en Farmacia', 8500.50, 'EGRESO', 'Salud', true, CURRENT_TIMESTAMP);