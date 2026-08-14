/**
 * APP.JS - Lógica de control de pantallas, autenticación, gestión de gastos y eliminación de cuenta.
 */

// URLs de conexión hacia Spring Boot
const API_FINANZAS_URL = "http://localhost:8080/api/v1/finanzas/analizar";
const AUTH_REGISTRO_URL = "http://localhost:8080/api/v1/auth/registro";
const AUTH_LOGIN_URL = "http://localhost:8080/api/v1/auth/login";
const AUTH_ELIMINAR_URL = "http://localhost:8080/api/v1/auth/eliminar";

// Arreglos y variables globales de control
let listaGastos = [];
let correoUsuarioLogueado = "";

// Referencias a las pantallas principales del HTML
const loginScreen = document.getElementById("loginScreen");
const registroScreen = document.getElementById("registroScreen");
const appScreen = document.getElementById("appScreen");

// ==========================================
// SECCIÓN 1: NAVEGACIÓN ENTRE VISTAS
// ==========================================
document.getElementById("linkMostrarRegistro").addEventListener("click", (e) => {
    e.preventDefault();
    loginScreen.classList.add("hidden");
    registroScreen.classList.remove("hidden");
    document.getElementById("regMensaje").classList.add("hidden");
});

document.getElementById("linkVolverLogin").addEventListener("click", (e) => {
    e.preventDefault();
    registroScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    document.getElementById("loginMensaje").classList.add("hidden");
});

document.getElementById("linkOlvidoPassword").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Funcionalidad de recuperación de contraseña próximamente disponible.");
});
// ==========================================
// SECCIÓN 2: REGISTRO DE NUEVO USUARIO
// ==========================================
document.getElementById("registroForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("regNombre").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const mensajeDiv = document.getElementById("regMensaje");

    const payload = { nombre, email, password };

    try {
        const response = await fetch(AUTH_REGISTRO_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("El correo ya está registrado o hubo un error en el servidor.");
        }

        mensajeDiv.textContent = "¡Registro exitoso! Redirigiendo al login...";
        mensajeDiv.style.backgroundColor = "#e8f8f5";
        mensajeDiv.style.color = "#117a65";
        mensajeDiv.classList.remove("hidden");

        setTimeout(() => {
            registroScreen.classList.add("hidden");
            loginScreen.classList.remove("hidden");
            document.getElementById("registroForm").reset();
            mensajeDiv.classList.add("hidden");
        }, 1500);

    } catch (error) {
        mensajeDiv.textContent = error.message;
        mensajeDiv.style.backgroundColor = "#fadbd8";
        mensajeDiv.style.color = "#78281f";
        mensajeDiv.classList.remove("hidden");
    }
});

// ==========================================
// SECCIÓN 3: INICIO DE SESIÓN (LOGIN)
// ==========================================
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const loginMensajeDiv = document.getElementById("loginMensaje");

    const payload = { email, password };

    try {
        const response = await fetch(AUTH_LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Usuario o contraseña incorrectos.");
        }

        // Guardar el correo actual para futuros procesos como eliminación de cuenta
        correoUsuarioLogueado = email;

        loginMensajeDiv.classList.add("hidden");
        loginScreen.classList.add("hidden");
        appScreen.classList.remove("hidden");
        document.getElementById("loginForm").reset();

    } catch (error) {
        // Muestra el mensaje de error en la tarjeta visual
        loginMensajeDiv.textContent = error.message;
        loginMensajeDiv.style.backgroundColor = "#fadbd8";
        loginMensajeDiv.style.color = "#78281f";
        loginMensajeDiv.classList.remove("hidden");

        // Espera 2 segundos (2000 milisegundos) para que el usuario lea el error y reinicia la página
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
});

// Botón para cerrar sesión
document.getElementById("btnCerrarSesion").addEventListener("click", function () {
    appScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    document.getElementById("loginForm").reset();
    document.getElementById("loginMensaje").classList.add("hidden");
    correoUsuarioLogueado = "";
});

// ==========================================
// SECCIÓN 4: GESTIÓN DE GASTOS Y TRANSACCIONES
// ==========================================
document.getElementById("btnAgregarGasto").addEventListener("click", function () {
    const inputDesc = document.getElementById("descripcionGasto");
    const inputValor = document.getElementById("valorGasto");

    const descripcion = inputDesc.value.trim();
    const valor = parseFloat(inputValor.value);

    if (descripcion === "") {
        alert("Debes escribir una descripción para el gasto.");
        return;
    }

    if (descripcion.length > 25) {
        alert("La descripción del gasto no puede superar los 25 caracteres.");
        return;
    }

    if (isNaN(valor) || valor <= 0) {
        alert("El valor del gasto debe ser un número positivo mayor a cero.");
        return;
    }

    const fechaAutomatica = new Date().toISOString().slice(0, 19);

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

window.eliminarGasto = function (index) {
    listaGastos.splice(index, 1);
    actualizarTablaGastos();
};

// ==========================================
// SECCIÓN 5: ENVÍO DE DATOS FINANCIEROS AL BACKEND
// ==========================================
document.getElementById("finanzasForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    ocultarMensajesFinanzas();

    if (listaGastos.length === 0) {
        mostrarErrorFinanzas("Debes agregar al menos un gasto a la lista antes de presionar 'Analizar'.");
        return;
    }

    const ingresoMensualVal = document.getElementById("ingresoMensual").value;
    const deudaTotalVal = document.getElementById("deudaTotal").value;
    const frecuenciaAhorroVal = document.getElementById("frecuenciaAhorro").value;
    const montoInversionVal = document.getElementById("montoInversion").value;
    const objetivoPresupuestoVal = document.getElementById("objetivoPresupuesto").value;
    const pagoMensualDeudaVal = document.getElementById("pagoMensualDeuda").value;
    const serviciosSuscripcionVal = document.getElementById("serviciosSuscripcion").value;
    const fondoEmergenciaVal = document.getElementById("fondoEmergencia").value;

    const ingresoMensual = ingresoMensualVal ? parseFloat(ingresoMensualVal) : 0;
    const deudaTotal = deudaTotalVal ? parseFloat(deudaTotalVal) : 0;
    const montoInversion = montoInversionVal ? parseFloat(montoInversionVal) : 0;
    const objetivoPresupuesto = objetivoPresupuestoVal ? parseFloat(objetivoPresupuestoVal) : 0;
    const pagoMensualDeuda = pagoMensualDeudaVal ? parseFloat(pagoMensualDeudaVal) : 0;
    const serviciosSuscripcion = serviciosSuscripcionVal ? parseInt(serviciosSuscripcionVal, 10) : 0;
    const fondoEmergencia = fondoEmergenciaVal ? parseFloat(fondoEmergenciaVal) : 0;

    if (isNaN(ingresoMensual) || ingresoMensual <= 0) {
        mostrarErrorFinanzas("El ingreso mensual debe ser un número válido mayor a cero.");
        return;
    }

    if (!frecuenciaAhorroVal) {
        mostrarErrorFinanzas("Debes seleccionar una frecuencia de ahorro.");
        return;
    }

    const nivelEndeudamiento = Math.round((deudaTotal / ingresoMensual) * 100);

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

    try {
        const response = await fetch(API_FINANZAS_URL, {
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
        mostrarResultadoFinanzas(data);

    } catch (error) {
        mostrarErrorFinanzas("No se pudo conectar con el servidor backend en " + API_FINANZAS_URL);
    }
});

// ==========================================
// SECCIÓN 6: ELIMINACIÓN DE CUENTA DE USUARIO
// ==========================================
document.getElementById("btnEliminarCuenta").addEventListener("click", async function () {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción borrará tus datos permanentemente.");
    
    if (!confirmar) return;

    try {
        const response = await fetch(`${AUTH_ELIMINAR_URL}?email=${encodeURIComponent(correoUsuarioLogueado)}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("No se pudo procesar la eliminación de la cuenta.");
        }

        alert("Tu cuenta ha sido eliminada con éxito.");
        
        // Limpiar estado y regresar al login
        appScreen.classList.add("hidden");
        loginScreen.classList.remove("hidden");
        document.getElementById("loginForm").reset();
        document.getElementById("finanzasForm").reset();
        listaGastos = [];
        actualizarTablaGastos();
        correoUsuarioLogueado = "";

    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ==========================================
// SECCIÓN 7: FUNCIONES AUXILIARES DE RESULTADOS
// ==========================================
function mostrarResultadoFinanzas(data) {
    const perfil = data.perfilFinanciero || data.perfil_financiero || "Sin evaluar";
    document.getElementById("resPerfil").textContent = perfil;
    
    const probabilidadVal = data.probabilidadCategoria !== undefined ? data.probabilidadCategoria : (data.probabilidad || 0);
    const probabilidadPct = (probabilidadVal * 100).toFixed(0);
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

function mostrarErrorFinanzas(mensaje) {
    const errDiv = document.getElementById("errorContainer");
    if (errDiv) {
        errDiv.textContent = mensaje;
        errDiv.classList.remove("hidden");
    }
}

function ocultarMensajesFinanzas() {
    const resContainer = document.getElementById("resultadoContainer");
    const errContainer = document.getElementById("errorContainer");
    if (resContainer) resContainer.classList.add("hidden");
    if (errContainer) errContainer.classList.add("hidden");
}