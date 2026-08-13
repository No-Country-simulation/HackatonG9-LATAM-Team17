/**
 * APP.JS - Lógica de control y comunicación con Spring Boot
 */

const API_URL = "http://localhost:8080/api/v1/finanzas/analizar";
let listaGastos = [];

// ==========================================
// FLUJO 1: AGREGAR UN GASTO INDIVIDUAL CON FECHA AUTOMÁTICA
// ==========================================
document.getElementById("btnAgregarGasto").addEventListener("click", function () {
    const inputDesc = document.getElementById("descripcionGasto");
    const inputValor = document.getElementById("valorGasto");

    const descripcion = inputDesc.value.trim();
    const valor = parseFloat(inputValor.value);

    if (descripcion === "") {
        mostrarError("Debes escribir una descripción para el gasto.");
        return;
    }

    if (descripcion.length > 25) {
        mostrarError("La descripción del gasto no puede superar los 25 caracteres.");
        return;
    }

    if (isNaN(valor) || valor <= 0) {
        mostrarError("El valor del gasto debe ser un número positivo mayor a cero.");
        return;
    }

    ocultarMensajes();

    // Generación automática de la fecha actual en formato LocalDateTime de Java (ISO 8601)
    const fechaAutomatica = new Date().toISOString().slice(0, 19);

    // Objeto adaptado exactamente a TransaccionDTO de Java
    const nuevoGasto = {
        descripcion: descripcion,
        valor: valor,
        fecha_transaccion: fechaAutomatica
    };

    listaGastos.push(nuevoGasto);
    inputDesc.value = "";
    inputValor.value = "";

    actualizarTablaGastos();
});

// ==========================================
// FLUJO 2: RENDERIZAR LA TABLA DE GASTOS
// ==========================================
function actualizarTablaGastos() {
    const cuerpoTabla = document.getElementById("cuerpoTablaGastos");
    cuerpoTabla.innerHTML = "";

    if (listaGastos.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr id="filaVacia">
                <td colspan="3" class="texto-centrado">No has agregado ningún gasto aún.</td>
            </tr>`;
        return;
    }

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
    event.preventDefault();
    ocultarMensajes();

    if (listaGastos.length === 0) {
        mostrarError("Debes agregar al menos un gasto a la lista antes de presionar 'Analizar'.");
        return;
    }

    // Captura de todos los campos generales y nuevas variables
    const ingresoMensualVal = document.getElementById("ingresoMensual").value;
    const deudaTotalVal = document.getElementById("deudaTotal").value;
    const frecuenciaAhorroVal = document.getElementById("frecuenciaAhorro").value;

    const montoInversionVal = document.getElementById("montoInversion").value;
    const objetivoPresupuestoVal = document.getElementById("objetivoPresupuesto").value;
    const pagoMensualDeudaVal = document.getElementById("pagoMensualDeuda").value;
    const serviciosSuscripcionVal = document.getElementById("serviciosSuscripcion").value;
    const fondoEmergenciaVal = document.getElementById("fondoEmergencia").value;

    // Conversiones numéricas seguras
    const ingresoMensual = ingresoMensualVal ? parseFloat(ingresoMensualVal) : 0;
    const deudaTotal = deudaTotalVal ? parseFloat(deudaTotalVal) : 0;
    const montoInversion = montoInversionVal ? parseFloat(montoInversionVal) : 0;
    const objetivoPresupuesto = objetivoPresupuestoVal ? parseFloat(objetivoPresupuestoVal) : 0;
    const pagoMensualDeuda = pagoMensualDeudaVal ? parseFloat(pagoMensualDeudaVal) : 0;
    const serviciosSuscripcion = serviciosSuscripcionVal ? parseInt(serviciosSuscripcionVal, 10) : 0;
    const fondoEmergencia = fondoEmergenciaVal ? parseFloat(fondoEmergenciaVal) : 0;

    if (isNaN(ingresoMensual) || ingresoMensual <= 0) {
        mostrarError("El ingreso mensual debe ser un número válido mayor a cero.");
        return;
    }

    if (!frecuenciaAhorroVal) {
        mostrarError("Debes seleccionar una frecuencia de ahorro.");
        return;
    }

    // Cálculo del nivel de endeudamiento basado en deuda_total e ingreso_mensual
    const nivelEndeudamiento = Math.round((deudaTotal / ingresoMensual) * 100);

    // Payload sincronizado perfectamente con los @JsonProperty del AnalisisInputDTO
    const payload = {
        ingreso_mensual: ingresoMensual,
        nivel_endeudamiento: nivelEndeudamiento,
        frecuencia_ahorro: frecuenciaAhorroVal,
        monto_inversion: montoInversion,
        deuda_total: deudaTotal,
        objetivo_presupuesto: objetivoPresupuesto,
        pago_mensual_deuda: pagoMensualDeuda,
        servicios_suscripción: serviciosSuscripcion,
        fondo_emergencia: fondoEmergencia,
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
    const perfil = data.perfilFinanciero || data.perfil_financiero || "Sin evaluar";
    document.getElementById("resPerfil").textContent = perfil;

    const probabilidadPct = data.probabilidad ? (data.probabilidad * 100).toFixed(0) : "0";
    document.getElementById("resProbabilidad").textContent = probabilidadPct;

    const contenedorGastos = document.getElementById("resCategorias");
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