"""Datos de dominio y controles de calidad del dataset.

Las variaciones sinteticas amplian redaccion y tolerancia ortografica, pero no
sustituyen transacciones reales anonimizadas. Cada termino mantiene un grupo
estable para impedir que sus variaciones caigan a ambos lados de la validacion
cruzada utilizada durante la seleccion de hiperparametros.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from .texto import normalizar_texto


CATEGORIAS: tuple[str, ...] = (
    "Alimentacion",
    "Aporte Inversiones",
    "Educacion",
    "Gastos Hormiga",
    "Ingresos",
    "Ocio",
    "Otros",
    "Salud",
    "Servicios",
    "Suscripciones",
    "Transporte",
    "Vivienda",
)

# Vocabulario deliberadamente conservador. Solo contiene señales suficientemente
# especificas del dominio; palabras genericas como "mensualidad", "plataforma",
# "dinero" o "nuevo" se excluyen para evitar confianza artificial.
SENALES_LEXICAS_POR_CATEGORIA: dict[str, tuple[str, ...]] = {
    "Alimentacion": (
        "abarrotes", "alimentos", "almuerzo", "cena", "comestibles", "comida",
        "despensa", "frutas", "polleria", "restaurante", "supermercado",
        "verduras", "viveres",
    ),
    "Aporte Inversiones": (
        "acciones", "afp", "ahorro", "bolsa", "bonos", "broker", "capital",
        "cripto", "etf", "inversion", "inversiones", "invertir", "portafolio",
    ),
    "Educacion": (
        "academia", "academico", "certificacion", "clases", "colegio", "curso",
        "educativa", "escolar", "examen", "facultad", "instituto", "matricula",
        "profesor", "universidad",
    ),
    "Gastos Hormiga": (
        "antojo", "cafecito", "cafe", "caramelo", "chicle", "chocolate",
        "expendedora", "golosina", "impulsiva", "impulso", "kiosco", "microcompra",
        "papitas", "snack",
    ),
    "Ingresos": (
        "acreditado", "bonificacion", "cobrado", "cobro", "empleador", "entrante",
        "ganados", "honorarios", "ingreso", "nomina", "recibida", "recibido",
        "salario", "sueldo",
    ),
    "Ocio": (
        "cine", "concierto", "discoteca", "festival", "ocio", "playstation",
        "teatro", "videojuego",
    ),
    "Otros": (
        "cajero", "cosmeticos", "deuda", "desconocido", "impuesto", "mochila",
        "pasaporte", "peluqueria", "retiro", "ropa", "tablet", "tributos", "zapatos",
    ),
    "Salud": (
        "anteojos", "clinica", "dentista", "farmacia", "hospital", "laboratorio",
        "medicamento", "medicamentos", "medica", "medico", "optica", "psicologo",
        "radiografia", "salud", "terapia", "vacuna",
    ),
    "Servicios": (
        "alcantarillado", "antivirus", "electricidad", "enel", "fibra", "gigas",
        "internet", "movistar", "sedapal", "telefonia", "wifi",
    ),
    "Suscripciones": (
        "audible", "crunchyroll", "deezer", "disney", "entretenimiento", "hbo",
        "membresia", "netflix", "paramount", "premium", "spotify", "streaming",
        "suscripcion", "suscripciones", "twitch",
    ),
    "Transporte": (
        "aeropuerto", "autobus", "cabify", "combustible", "didi", "estacionamiento",
        "gasolina", "metro", "mototaxi", "peaje", "taxi", "tren", "uber", "vehicular",
    ),
    "Vivienda": (
        "alquiler", "arriendo", "casa", "condominio", "domicilio", "edificio",
        "expensas", "hipoteca", "hogar", "mudanza", "plomero", "vivienda",
    ),
}


TERMINOS_POR_CATEGORIA: dict[str, tuple[str, ...]] = {
    "Alimentacion": (
        "supermercado", "mercado de alimentos", "compra de viveres", "despensa familiar",
        "abarrotes", "restaurante", "almuerzo ejecutivo", "cena familiar", "desayuno completo",
        "delivery de comida", "pedido de pizza", "pollo a la brasa", "comida rapida",
        "menu del dia", "carniceria", "pescaderia", "fruteria", "verduleria", "panaderia",
        "leche y huevos", "arroz y aceite", "productos comestibles", "bodega de alimentos",
        "minimarket de viveres", "compras para cocinar", "canasta familiar", "comida china",
        "pescado y mariscos", "almuerzo de trabajo", "cena en restaurante", "pedido rappi comida",
        "pedido pedidos ya comida", "comedor universitario", "asado familiar", "polleria",
        "supermercado metro", "hipermercado de comida",
    ),
    "Aporte Inversiones": (
        "aporte a fondo mutuo", "aporte fondo de inversion", "transferencia a inversiones",
        "compra de acciones", "compra de bonos", "compra de etf", "aporte voluntario afp",
        "aporte previsional voluntario", "deposito a cuenta de inversion", "ahorro programado",
        "aporte a cuenta de ahorro", "inversion en bolsa", "inversion en criptomonedas",
        "compra de bitcoin", "compra de dolares para ahorro", "certificado de deposito",
        "deposito a plazo fijo", "aporte a fondo de pensiones", "capital para inversion",
        "suscripcion de participaciones", "aporte mensual de inversion", "compra de fondos indexados",
        "transferencia a broker", "deposito en casa de bolsa", "reinversion de capital",
        "aporte a plan de retiro", "inversion inmobiliaria", "crowdfunding de inversion",
        "compra de instrumento financiero", "aporte de capital", "reserva de ahorro mensual",
        "cuenta meta de ahorro", "fondo de emergencia", "ahorro para vivienda", "compra de oro inversion",
        "portafolio de inversion", "cartera de inversiones",
    ),
    "Educacion": (
        "matricula academica", "pension escolar", "mensualidad universitaria", "colegio",
        "escuela primaria", "instituto tecnico", "curso online", "clases de ingles",
        "curso de programacion", "curso de excel", "academia preuniversitaria", "profesor particular",
        "tutoria", "certificacion profesional", "derecho de examen", "seminario", "capacitacion",
        "diplomado", "maestria", "libros escolares", "utiles escolares", "cuadernos",
        "material didactico", "uniforme escolar", "guarderia", "tesis universitaria",
        "plataforma educativa", "semestre universitario", "taller educativo", "clases de frances",
        "curso de inteligencia artificial", "biblioteca estudiantil", "derecho de grado",
        "curso de diseño", "academia de idiomas",
    ),
    "Gastos Hormiga": (
        "cafe para llevar", "cafecito diario", "cafe de maquina", "snack de media mañana",
        "golosinas", "chicle", "caramelos", "galletas individuales", "bebida pequeña",
        "agua embotellada", "antojo del kiosco", "compra en kiosco", "compra impulsiva pequeña",
        "propina pequeña", "dulce", "helado individual", "refresco de maquina", "maquina expendedora",
        "delivery fee pequeño", "comision pequeña de aplicativo", "microcompra dentro de app",
        "compra dentro de videojuego", "sticker digital", "suscripcion pequeña olvidada",
        "pan al paso", "empanada al paso", "chocolate", "papitas", "energizante individual",
        "cigarros", "encendedor", "bolsa reutilizable", "recargo pequeño", "redondeo solidario",
        "compra rapida por antojo", "postre individual", "jugo al paso", "cafe camino al trabajo",
        "snack de oficina", "gasto pequeño sin planificar", "caramelo por impulso",
        "botella pequeña al paso",
    ),
    "Ingresos": (
        "sueldo recibido", "salario depositado", "deposito de nomina", "pago de honorarios recibido",
        "transferencia entrante", "abono recibido", "cobro de cliente", "factura cobrada",
        "trabajo freelance cobrado", "comision ganada", "ingreso por ventas", "jubilacion recibida",
        "bono laboral recibido", "gratificacion recibida", "utilidades recibidas", "dividendos recibidos",
        "intereses ganados", "reembolso recibido", "subsidio recibido", "regalias recibidas",
        "alquiler cobrado", "propinas recibidas", "horas extras pagadas", "premio en efectivo recibido",
        "cobro por consultoria", "ingreso del negocio", "quincena recibida", "devolucion recibida",
        "remuneracion mensual", "deposito a favor", "pago de vacaciones recibido", "cliente pago",
        "ganancia de inversion recibida", "venta cobrada", "dinero entrante",
        "servicios profesionales cobrados", "bonificacion de empresa", "alquiler recibido",
    ),
    "Ocio": (
        "entrada al cine", "entrada al teatro", "entrada a concierto", "festival de musica",
        "videojuego", "playstation", "xbox", "steam", "nintendo", "discoteca", "bar con amigos",
        "karaoke", "bowling", "billar", "parque tematico", "parque de diversiones", "zoologico",
        "museo", "show de comedia", "partido en el estadio", "tour de vacaciones", "paseo recreativo",
        "excursion turistica", "resort de vacaciones", "paintball", "club social",
        "loteria", "obra teatral", "evento deportivo", "boleto de concierto",
    ),
    "Otros": (
        "compra sin detalle", "comercio desconocido", "cargo no reconocido", "pago sin concepto",
        "transferencia a persona", "retiro de cajero", "retiro atm", "ropa", "zapatos",
        "telefono celular", "computadora", "audifonos", "regalo", "comision bancaria",
        "interes de tarjeta", "pago de deuda", "impuestos", "donacion", "mascota", "veterinaria",
        "peluqueria", "cosmeticos", "joyeria", "notaria", "pasaporte", "lavanderia", "courier",
        "billetera digital", "operacion bancaria", "debito desconocido", "seguro de vida",
        "movimiento sin detalle", "cuota de prestamo", "compra online generica", "tributos",
        "extraccion de efectivo", "mochila", "tablet", "comision de tarjeta",
        "movimiento bancario sin descripcion", "extraccion de dinero",
    ),
    "Salud": (
        "farmacia", "medicamentos", "medicinas", "receta medica", "consulta medica", "doctor",
        "clinica", "hospital", "emergencia medica", "dentista", "tratamiento dental", "ortodoncia",
        "laboratorio clinico", "analisis de sangre", "ecografia", "radiografia", "resonancia",
        "seguro medico", "medicina prepaga", "psicologo", "salud mental", "fisioterapia",
        "rehabilitacion", "terapia", "vacuna", "oftalmologo", "examen de vista", "lentes opticos",
        "pediatra", "nutricionista", "dermatologo", "ginecologo", "ambulancia", "copago medico",
        "chequeo de salud", "antibioticos", "anteojos recetados",
    ),
    "Servicios": (
        "factura de electricidad", "recibo de luz", "servicio de agua", "agua potable",
        "alcantarillado", "gas domiciliario", "gas natural", "factura de internet", "fibra optica",
        "wifi", "banda ancha", "telefono fijo", "linea movil", "datos moviles", "plan celular",
        "recarga celular", "television por cable", "factura enel", "recibo sedapal", "recibo aysa",
        "servicio movistar", "servicio claro", "recoleccion de basura", "alarma del domicilio",
        "seguridad monitoreada", "hosting", "dominio web", "correo empresarial",
        "almacenamiento en la nube", "servicio cloud", "antivirus", "plan postpago",
        "paquete de gigas", "telecomunicaciones", "factura de servicios", "suministro de agua",
    ),
    "Suscripciones": (
        "suscripcion de netflix", "netflix mensual", "hbo max", "disney plus",
        "amazon prime video", "paramount plus", "crunchyroll", "spotify premium",
        "apple music", "youtube premium", "deezer", "audible", "twitch turbo",
        "suscripcion a plataforma de streaming", "membresia de peliculas",
        "canal premium de entretenimiento", "playstation plus", "xbox game pass",
        "suscripcion de videojuego", "membresia digital mensual", "aplicacion premium",
        "suscripcion de noticias", "membresia de gimnasio", "software por suscripcion",
        "adobe creative cloud", "canva pro", "dropbox plus", "icloud plus",
        "google one", "duolingo plus", "membresia anual", "renovacion de suscripcion",
        "cargo recurrente de aplicacion", "plataforma digital mensual",
        "servicio de musica por suscripcion", "streaming de series",
    ),
    "Transporte": (
        "uber", "cabify", "didi", "indrive", "taxi", "mototaxi", "colectivo", "autobus",
        "bus urbano", "metro", "tren", "metropolitano", "transmilenio", "tarjeta sube",
        "tarjeta bip", "pasaje terrestre", "pasaje aereo", "boleto de avion", "traslado al aeropuerto",
        "gasolina", "combustible", "nafta", "grifo", "peaje", "estacionamiento", "parking",
        "alquiler de auto", "transporte escolar", "lavado de auto", "cambio de aceite",
        "taller mecanico", "mantenimiento de moto", "repuesto de vehiculo", "seguro del auto",
        "revision tecnica vehicular", "recarga de transporte", "ferry", "cochera",
        "frenos del carro",
    ),
    "Vivienda": (
        "alquiler de casa", "renta del apartamento", "arriendo", "pago al propietario", "hipoteca",
        "prestamo de vivienda", "condominio", "gastos comunes", "expensas", "administracion del edificio",
        "reparacion del hogar", "plomeria", "tuberia", "reparacion del baño", "remodelacion de cocina",
        "arreglo del techo", "pintura de casa", "muebles del hogar", "sofa para el living",
        "cama y colchon", "electrodomestico", "reparacion de refrigerador", "reparacion de lavadora",
        "cerrajero del domicilio", "carpintero del hogar", "limpieza de casa", "fumigacion de casa",
        "mudanza", "seguro de vivienda", "deposito de alquiler", "cuota habitacional", "inmobiliaria",
        "impermeabilizacion", "jardinero del domicilio", "aire acondicionado del hogar", "copropiedad residencial",
        "servicio de plomero",
    ),
}


PLANTILLAS_GASTO = (
    "{termino}",
    "pago por {termino}",
    "cargo de {termino}",
    "movimiento por {termino}",
    "detalle bancario {termino}",
)

PLANTILLAS_INGRESO = (
    "{termino}",
    "movimiento por {termino}",
    "concepto {termino}",
    "registro bancario {termino}",
    "detalle bancario {termino}",
)

# Combinaciones neutrales de estado de cuenta. No contienen palabras propias de
# una categoria, por lo que obligan al modelo a aprender el concepto central.
PREFIJOS_AUMENTACION_GASTO = (
    "",
    "pago realizado por",
    "cargo bancario por",
    "compra registrada en",
    "operacion correspondiente a",
    "movimiento de cuenta por",
    "debito autorizado para",
    "transaccion registrada como",
    "comprobante asociado a",
    "consumo efectuado en",
    "pago movil para",
    "detalle de operacion",
    "concepto bancario",
    "pago con tarjeta por",
    "transferencia destinada a",
    "movimiento desde billetera para",
    "compra por aplicativo en",
    "operacion del mes por",
    "cargo confirmado de",
    "registro financiero por",
    "movimiento procesado para",
    "pos comercio",
    "debito automatico",
    "trx tarjeta",
)

PREFIJOS_AUMENTACION_INGRESO = (
    "",
    "abono registrado por",
    "credito bancario por",
    "deposito correspondiente a",
    "movimiento entrante por",
    "transferencia recibida por",
    "operacion abonada como",
    "comprobante asociado a",
    "registro de cuenta por",
    "abono movil por",
    "detalle de operacion",
    "concepto bancario",
    "credito confirmado por",
    "transferencia a favor por",
    "movimiento recibido desde",
    "operacion del mes por",
    "registro financiero por",
    "movimiento procesado como",
    "abono en cuenta por",
    "credito de cuenta por",
    "trx entrante",
    "deposito confirmado por",
    "movimiento positivo por",
    "operacion recibida por",
)

SUFIJOS_AUMENTACION = (
    "",
    "desde banca movil",
    "operacion confirmada",
    "en comercio local",
    "mediante transferencia",
    "registrado en cuenta",
    "pago digital",
    "movimiento presencial",
    "cargo del mes",
    "comprobante electronico",
    "operacion reciente",
    "detalle de estado de cuenta",
)


def crear_ejemplos_sinteticos() -> pd.DataFrame:
    """Genera variaciones trazables y agrupadas por concepto base."""

    filas: list[dict[str, str]] = []
    for categoria, terminos in TERMINOS_POR_CATEGORIA.items():
        plantillas = PLANTILLAS_INGRESO if categoria == "Ingresos" else PLANTILLAS_GASTO
        for indice, termino in enumerate(terminos):
            grupo = f"sintetico::{categoria}::{indice:03d}"
            for plantilla in plantillas:
                filas.append(
                    {
                        "descripcion": plantilla.format(termino=termino),
                        "categoria": categoria,
                        "grupo": grupo,
                        "fuente": "sintetica_controlada",
                    }
                )
    return pd.DataFrame(filas)


def crear_ejemplos_aumentados(cantidades: dict[str, int]) -> pd.DataFrame:
    """Crea textos unicos y balanceados a partir de conceptos trazables.

    La combinacion es determinista: el mismo codigo produce exactamente el
    mismo dataset. Cada variante conserva el grupo del concepto base para poder
    hacer validacion cruzada sin fuga semantica.
    """

    filas: list[dict[str, str]] = []
    for categoria in CATEGORIAS:
        cantidad = int(cantidades.get(categoria, 0))
        if cantidad < 0:
            raise ValueError(f"Cantidad negativa para {categoria}")
        terminos = TERMINOS_POR_CATEGORIA[categoria]
        prefijos = (
            PREFIJOS_AUMENTACION_INGRESO
            if categoria == "Ingresos"
            else PREFIJOS_AUMENTACION_GASTO
        )
        capacidad = len(terminos) * len(prefijos) * len(SUFIJOS_AUMENTACION)
        if cantidad > capacidad:
            raise ValueError(
                f"Se solicitaron {cantidad} ejemplos para {categoria}; "
                f"la capacidad sin duplicados es {capacidad}"
            )

        for indice in range(cantidad):
            indice_termino = indice % len(terminos)
            indice_variante = indice // len(terminos)
            indice_prefijo = indice_variante % len(prefijos)
            indice_sufijo = (indice_variante // len(prefijos)) % len(
                SUFIJOS_AUMENTACION
            )
            termino = terminos[indice_termino]
            descripcion = " ".join(
                parte
                for parte in (
                    prefijos[indice_prefijo],
                    termino,
                    SUFIJOS_AUMENTACION[indice_sufijo],
                )
                if parte
            )
            filas.append(
                {
                    "descripcion": descripcion,
                    "categoria": categoria,
                    "grupo": f"aumentado::{categoria}::{indice_termino:03d}",
                    "fuente": "aumentacion_sintetica_reproducible",
                }
            )
    return pd.DataFrame(filas)


def _validar_columnas(df: pd.DataFrame, ruta: Path) -> None:
    requeridas = {"descripcion", "categoria"}
    if not requeridas.issubset(df.columns):
        raise ValueError(f"{ruta} debe contener las columnas {sorted(requeridas)}")


def cargar_csv_etiquetado(ruta_csv: str | Path) -> pd.DataFrame:
    """Carga y valida un split sin modificar sus ejemplos."""

    ruta = Path(ruta_csv)
    df = pd.read_csv(ruta)
    _validar_columnas(df, ruta)
    df = df[["descripcion", "categoria"]].dropna().copy()
    df["descripcion"] = df["descripcion"].astype(str).str.strip()
    df["categoria"] = df["categoria"].astype(str).str.strip()
    df = df[(df["descripcion"] != "") & (df["categoria"] != "")]
    desconocidas = sorted(set(df["categoria"]) - set(CATEGORIAS))
    if desconocidas:
        raise ValueError(f"Categorias desconocidas en {ruta.name}: {desconocidas}")
    faltantes = sorted(set(CATEGORIAS) - set(df["categoria"]))
    if faltantes:
        raise ValueError(f"Faltan categorias en {ruta.name}: {faltantes}")
    normalizadas = df["descripcion"].map(normalizar_texto)
    if normalizadas.duplicated().any():
        raise ValueError(f"Hay descripciones duplicadas en {ruta.name}")
    return df.reset_index(drop=True)


def cargar_datos_entrenamiento(ruta_csv: str | Path) -> pd.DataFrame:
    """Combina ejemplos manuales y sinteticos con grupos para CV anti-fuga."""

    ruta = Path(ruta_csv)
    base = cargar_csv_etiquetado(ruta)
    base["grupo"] = [f"manual::{i:04d}" for i in range(len(base))]
    base["fuente"] = "manual_curada"
    combinado = pd.concat([base, crear_ejemplos_sinteticos()], ignore_index=True)
    combinado["descripcion_normalizada"] = combinado["descripcion"].map(normalizar_texto)

    conflictos = combinado.groupby("descripcion_normalizada")["categoria"].nunique()
    if (conflictos > 1).any():
        ejemplos = conflictos[conflictos > 1].index.tolist()[:5]
        raise ValueError(f"Descripciones normalizadas con etiquetas contradictorias: {ejemplos}")

    return (
        combinado.drop_duplicates(subset=["descripcion_normalizada", "categoria"])
        .reset_index(drop=True)
    )


def cargar_datos_entrenamiento_ampliado(
    ruta_csv: str | Path,
    objetivo_total: int = 100_000,
) -> pd.DataFrame:
    """Construye el dataset final balanceado sin guardar un CSV gigante.

    Los ejemplos manuales se preservan. El resto se genera de manera
    determinista hasta alcanzar ``objetivo_total`` exactamente.
    """

    if objetivo_total < len(CATEGORIAS) * 5:
        raise ValueError("objetivo_total es demasiado pequeno para 12 categorias")

    ruta = Path(ruta_csv)
    base = cargar_csv_etiquetado(ruta)
    base["grupo"] = [f"manual::{i:04d}" for i in range(len(base))]
    base["fuente"] = "manual_curada"

    cuota, residuo = divmod(objetivo_total, len(CATEGORIAS))
    objetivos = {
        categoria: cuota + (indice < residuo)
        for indice, categoria in enumerate(CATEGORIAS)
    }
    conteos_manual = base["categoria"].value_counts().to_dict()
    cantidades = {
        categoria: objetivos[categoria] - int(conteos_manual.get(categoria, 0))
        for categoria in CATEGORIAS
    }
    aumentados = crear_ejemplos_aumentados(cantidades)
    combinado = pd.concat([base, aumentados], ignore_index=True)
    combinado["descripcion_normalizada"] = combinado["descripcion"].map(normalizar_texto)

    conflictos = combinado.groupby("descripcion_normalizada")["categoria"].nunique()
    if (conflictos > 1).any():
        ejemplos = conflictos[conflictos > 1].index.tolist()[:5]
        raise ValueError(f"Descripciones aumentadas con etiquetas contradictorias: {ejemplos}")
    if combinado["descripcion_normalizada"].duplicated().any():
        ejemplos = combinado.loc[
            combinado["descripcion_normalizada"].duplicated(), "descripcion"
        ].tolist()[:5]
        raise ValueError(f"La aumentacion produjo duplicados: {ejemplos}")
    if len(combinado) != objetivo_total:
        raise AssertionError(f"Se esperaban {objetivo_total} ejemplos y se crearon {len(combinado)}")
    return combinado.reset_index(drop=True)


def validar_separacion_splits(entrenamiento: pd.DataFrame, *splits: pd.DataFrame) -> None:
    """Falla si una descripcion exacta se reutiliza entre entrenamiento y evaluacion."""

    vistos = set(entrenamiento["descripcion"].map(normalizar_texto))
    for indice, split in enumerate(splits, start=1):
        actuales = set(split["descripcion"].map(normalizar_texto))
        solapados = sorted(vistos & actuales)
        if solapados:
            raise ValueError(f"Fuga de datos en split {indice}: {solapados[:5]}")
        vistos.update(actuales)
