-- Insertar análisis previos de prueba con el nuevo esquema
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

-- Si querés probar insertar categorías mock para ese análisis:
INSERT INTO analisis_categorias (analisis_id, categoria)
VALUES (1, 'ALIMENTACION');