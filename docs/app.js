/**
 * APP.JS - Lógica de control y comunicación con Spring Boot
 */

// 1. Apuntamos a la dirección donde escucha la API REST en Spring Boot
const API_URL = "http://localhost:8080/api/v1/finanzas/analizar";

// 2. Arreglo en memoria (global): Guardará cada gasto que agreguemos con el botón "＋ Agregar Gasto"
let listaGastos = [];

// ==========================================
// FLUJO 1: AGREGAR UN GASTO INDIVIDUAL
// ==========================================
document.getElementById("btnAgregarGasto").addEventListener("click", function () {

    // Obtenemos las referencias a las cajas de texto de la sección de gastos
    const inputDesc = document.getElementById("descripcionGasto");
    const inputValor = document.getElementById("valorGasto");

    // Limpiamos espacios en blanco extremos y convertimos a número flotante
    const descripcion = inputDesc.value.trim();
    const valor = parseFloat(inputValor.value);

    // --- Validación 1: Campo de descripción no vacío ---
    if (descripcion === "") {
        mostrarError("Debes escribir una descripción para el gasto.");
        return; // Interrumpe la ejecución
    }

    // --- Validación 2: Máximo 25 caracteres en la descripción ---
    if (descripcion.length > 25) {
        mostrarError("La descripción del gasto no puede superar los 25 caracteres.");
        return;
    }

    // --- Validación 3: El valor debe ser numérico y estrictamente positivo (> 0) ---
    if (isNaN(valor) || valor <= 0) {
        mostrarError("El valor del gasto debe ser un número positivo mayor a cero.");
        return;
    }

    // Ocultamos posibles mensajes de error anteriores
    ocultarMensajes();

    // Estructuramos el objeto JS exactamente como lo espera 'TransaccionDTO.java'
    const nuevoGasto = {
        descripcion: descripcion,
        valor: valor
    };

    // Añadimos el objeto a nuestra lista global
    listaGastos.push(nuevoGasto);

    // Limpiamos los inputs
    inputDesc.value = "";
    inputValor.value = "";

    // Repintamos la tabla HTML
    actualizarTablaGastos();
});

// ==========================================
// FLUJO 2: RENDERIZAR LA TABLA DE GASTOS
// ==========================================
function actualizarTablaGastos() {
    const cuerpoTabla = document.getElementById("cuerpoTablaGastos");

    cuerpoTabla.innerHTML = "";

    // Si no hay transacciones en la lista, mostramos el mensaje por defecto
    if (listaGastos.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr id="filaVacia">
                <td colspan="3" class="texto-centrado">No has agregado ningún gasto aún.</td>
            </tr>`;
        return;
    }

    // Iteramos sobre el arreglo de gastos
    listaGastos.forEach((gasto, index) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${gasto.descripcion}</td>
            <td>$${gasto.valor.toLocaleString()}</td>
            <td>
                <button type="button" class="btn-eliminar" onclick="eliminarGasto(${index})">Eliminar</button>
            </td>
        `;

        cuerpoTabla.appendChild(fila);
    });
}

// ==========================================
// FLUJO 3: ELIMINAR UN GASTO ESPECÍFICO
// ==========================================
window.eliminarGasto = function (index) {
    listaGastos.splice(index, 1);
    actualizarTablaGastos();
};

// ==========================================
// FLUJO 4: ENVIAR FORMULARIO AL BACKEND (FETCH)
// ==========================================
document.getElementById("finanzasForm").addEventListener("submit", async function (event) {

    // 1. Evitamos que el formulario se envíe de la forma tradicional HTML
    event.preventDefault();
    ocultarMensajes();

    // 2. Validar que exista al menos una transacción
    if (listaGastos.length === 0) {
        mostrarError("Debes agregar al menos un gasto a la lista antes de presionar 'Analizar'.");
        return;
    }

    // 3. Captura directa de los valores de los inputs
    const ingresoMensualVal = document.getElementById("ingresoMensual").value;
    const valorDeudaVal = document.getElementById("valorDeuda").value;
    const frecuenciaAhorroVal = document.getElementById("frecuenciaAhorro").value;

    // 4. Conversiones numéricas seguras
    const ingresoMensual = ingresoMensualVal ? parseFloat(ingresoMensualVal) : 0;
    const valorDeuda = valorDeudaVal ? parseFloat(valorDeudaVal) : 0;

    // 5. Validaciones básicas de seguridad
    if (isNaN(ingresoMensual) || ingresoMensual <= 0) {
        mostrarError("El ingreso mensual debe ser un número válido mayor a cero.");
        return;
    }

    if (!frecuenciaAhorroVal) {
        mostrarError("Debes seleccionar una frecuencia de ahorro.");
        return;
    }

    // 6. Cálculo del nivel de endeudamiento en segundo plano
    const nivelEndeudamiento = Math.round((valorDeuda / ingresoMensual) * 100);

    // 7. Construcción estricta del objeto JSON adaptado para @JsonProperty
    const payload = {
        ingreso_mensual: ingresoMensual,
        nivel_endeudamiento: nivelEndeudamiento,
        frecuencia_ahorro: frecuenciaAhorroVal,
        transacciones: listaGastos
    };

    console.log("🚀 ENVIANDO JSON A SPRING BOOT:", JSON.stringify(payload));

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ RESPUESTA EXITOSA:", data);
        mostrarResultado(data);

    } catch (error) {
        console.error("❌ ERROR DE RED:", error);
        mostrarError("No se pudo conectar con el servidor backend en " + API_URL);
    }
});

// ==========================================
// FLUJO 5: FUNCIONES AUXILIARES DE LA INTERFAZ
// ==========================================

function mostrarResultado(data) {

    // 1. Perfil Financiero (soporta tanto camelCase 'perfilFinanciero' como 'perfil_financiero')
    const perfil = data.perfilFinanciero || data.perfil_financiero || "Sin evaluar";
    document.getElementById("resPerfil").textContent = perfil;

    // 2. Certidumbre IA (ej. 0.82 -> 82%)
    const probabilidadPct = data.probabilidad ? (data.probabilidad * 100).toFixed(0) : "0";
    document.getElementById("resProbabilidad").textContent = probabilidadPct;

    // 3. Resumen de Gastos por Categoría (Alimentación, Transporte, Salud, etc.)
    const contenedorGastos = document.getElementById("resCategorias");

    // Mapea 'resumenGastos' o 'resumen_gastos' según cómo lo entregue Jackson
    const resumen = data.resumenGastos || data.resumen_gastos;

    if (contenedorGastos) {
        if (resumen && Object.keys(resumen).length > 0) {
            let htmlGastos = "<ul>";
            for (const [categoria, monto] of Object.entries(resumen)) {
                htmlGastos += `<li><strong>${categoria}:</strong> $${monto.toLocaleString()}</li>`;
            }
            htmlGastos += "</ul>";
            contenedorGastos.innerHTML = htmlGastos;
        } else {
            contenedorGastos.textContent = "No hay desglose de gastos disponible.";
        }
    }

    // 4. Recomendaciones de la IA
    const contenedorRecomendaciones = document.getElementById("resRecomendaciones");
    if (contenedorRecomendaciones) {
        if (data.recomendaciones && data.recomendaciones.length > 0) {
            let htmlRec = "<ul>";
            data.recomendaciones.forEach(rec => {
                htmlRec += `<li>${rec}</li>`;
            });
            htmlRec += "</ul>";
            contenedorRecomendaciones.innerHTML = htmlRec;
        } else {
            contenedorRecomendaciones.textContent = "Sin recomendaciones por ahora.";
        }
    }

    // Mostrar el contenedor de resultados
    document.getElementById("resultadoContainer").classList.remove("hidden");
}

function mostrarError(mensaje) {
    const errDiv = document.getElementById("errorContainer");
    errDiv.textContent = mensaje;
    errDiv.classList.remove("hidden");
}

function ocultarMensajes() {
    document.getElementById("resultadoContainer").classList.add("hidden");
    document.getElementById("errorContainer").classList.add("hidden");
}