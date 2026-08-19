// ==========================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN
// ==========================================
const API_FINANZAS_URL = "http://localhost:8080/api/v1/finanzas/analizar";
const AUTH_LOGIN_URL = "http://localhost:8080/api/v1/auth/login";
const AUTH_REGISTRO_URL = "http://localhost:8080/api/v1/auth/registro";
const AUTH_ELIMINAR_URL = "http://localhost:8080/api/v1/auth/eliminar";

let listaGastos = [];
let correoUsuarioLogueado = "";
let usuarioIdLogueado = null;
let miGraficoPastel = null;

// Elementos UI
const loginScreen = document.getElementById("loginScreen");
const registroScreen = document.getElementById("registroScreen");
const dashboardLayout = document.getElementById("dashboardLayout");
const appScreen = document.getElementById("appScreen");
const historialScreen = document.getElementById("historialScreen");
const detalleTransaccionesScreen = document.getElementById("detalleTransaccionesScreen");

// ==========================================
// 2. NAVEGACIÓN Y LOGIN / REGISTRO
// ==========================================
document.getElementById("linkMostrarRegistro").addEventListener("click", (e) => {
    e.preventDefault();
    loginScreen.classList.add("hidden");
    registroScreen.classList.remove("hidden");
});

document.getElementById("linkVolverLogin").addEventListener("click", (e) => {
    e.preventDefault();
    registroScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
});

// Lógica de Registro
document.getElementById("registroForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    const nombre = document.getElementById("registroNombre")?.value.trim() || "";
    const email = document.getElementById("registroEmail").value.trim();
    const password = document.getElementById("registroPassword").value;

    try {
        const response = await fetch(AUTH_REGISTRO_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "No se pudo registrar el usuario.");
        }

        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        registroScreen.classList.add("hidden");
        loginScreen.classList.remove("hidden");
        document.getElementById("registroForm").reset();
    } catch (error) {
        alert("Error en el registro: " + error.message);
    }
});

// Lógica de Login
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(AUTH_LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error("Credenciales inválidas.");
        
        const data = await response.json();
        usuarioIdLogueado = data.id;
        correoUsuarioLogueado = email;
        document.getElementById("labelUsuarioEmail").textContent = email;

        // Ocultar login y mostrar el dashboard con su pantalla principal
        loginScreen.classList.add("hidden");
        dashboardLayout.classList.remove("hidden");
        appScreen.classList.remove("hidden");
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ==========================================
// 3. NAVEGACIÓN SIDEBAR
// ==========================================
document.getElementById("navInicio").addEventListener("click", () => {
    historialScreen.classList.add("hidden");
    detalleTransaccionesScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
});

document.getElementById("btnIrHistorial").addEventListener("click", async () => {
    appScreen.classList.add("hidden");
    detalleTransaccionesScreen.classList.add("hidden");
    historialScreen.classList.remove("hidden");
    await cargarPantallaHistorial();
});

document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    location.reload();
});

// Botón volver desde historial a app
document.getElementById("btnVolverApp").addEventListener("click", () => {
    historialScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
});

// ==========================================
// 4. GESTIÓN DE GASTOS
// ==========================================
document.getElementById("btnAgregarGasto").addEventListener("click", function () {
    const desc = document.getElementById("descripcionGasto").value.trim();
    const valor = parseFloat(document.getElementById("valorGasto").value);

    if (!desc || isNaN(valor) || valor <= 0) {
        alert("Por favor, ingresa una descripción y un valor válido.");
        return;
    }

    listaGastos.push({ descripcion: desc, valor: valor, fecha_transaccion: new Date().toISOString() });
    document.getElementById("descripcionGasto").value = "";
    document.getElementById("valorGasto").value = "";
    actualizarTablaGastos();
});

function actualizarTablaGastos() {
    const cuerpo = document.getElementById("cuerpoTablaGastos");
    cuerpo.innerHTML = listaGastos.length === 0 ? 
        '<tr id="filaVacia"><td colspan="3" class="text-center p-6 text-slate-400 text-sm">No has agregado ningún gasto aún.</td></tr>' : "";
    
    listaGastos.forEach((g, i) => {
        cuerpo.innerHTML += `
            <tr class="text-center">
                <td class="p-3.5 text-slate-700">${g.descripcion}</td>
                <td class="p-3.5 text-slate-600 font-semibold">$${g.valor.toLocaleString()}</td>
                <td class="p-3.5"><button type="button" class="text-rose-600 font-bold text-sm hover:underline" onclick="eliminarGasto(${i})">Eliminar</button></td>
            </tr>`;
    });
}

window.eliminarGasto = (i) => { listaGastos.splice(i, 1); actualizarTablaGastos(); };

// ==========================================
// 5. ENVÍO Y ANÁLISIS
// ==========================================
document.getElementById("finanzasForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    ocultarMensajesFinanzas();

    if (!usuarioIdLogueado) {
        mostrarErrorFinanzas("No hay una sesión activa. Por favor, inicia sesión de nuevo.");
        return;
    }

    if (listaGastos.length === 0) {
        mostrarErrorFinanzas("Debes agregar al menos un gasto a la lista.");
        return;
    }

    const payload = {
        ingreso_mensual: parseFloat(document.getElementById("ingresoMensual").value) || 0,
        nivel_endeudamiento: 30,
        deuda_total: parseFloat(document.getElementById("deudaTotal").value) || 0,
        frecuencia_ahorro: document.getElementById("frecuenciaAhorro").value || "MENSUAL",
        monto_inversion: parseFloat(document.getElementById("montoInversion").value) || 0,
        objetivo_presupuesto: parseFloat(document.getElementById("objetivoPresupuesto").value || 0),
        pago_mensual_deuda: parseFloat(document.getElementById("pagoMensualDeuda").value || 0),
        servicios_suscripción: parseInt(document.getElementById("serviciosSuscripcion").value || 0, 10),
        fondo_emergencia: parseFloat(document.getElementById("fondoEmergencia").value || 0),
        transacciones: listaGastos
    };

    try {
        const res = await fetch(`${API_FINANZAS_URL}?usuarioId=${usuarioIdLogueado}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Error al procesar el análisis.");

        const data = await res.json();
        mostrarResultadoFinanzas(data);
    } catch (err) {
        mostrarErrorFinanzas("No se pudo conectar con el servidor.");
    }
});

function mostrarResultadoFinanzas(data) {
    document.getElementById("resPerfil").textContent = data.perfilFinanciero || "Evaluado";
    const prob = data.probabilidadCategoria !== undefined ? data.probabilidadCategoria : (data.probabilidad || 0);
    document.getElementById("resProbabilidad").textContent = (prob * 100).toFixed(0);
    
    const recContainer = document.getElementById("resRecomendaciones");
    if (data.recomendaciones && data.recomendaciones.length > 0) {
        recContainer.innerHTML = `<ul class="list-disc pl-5 space-y-1">${data.recomendaciones.map(r => `<li>${r}</li>`).join('')}</ul>`;
    } else {
        recContainer.textContent = "Sin recomendaciones.";
    }

    const categoriasContainer = document.getElementById("resCategoriasContainer");
    const resumen = data.resumen_gastos || data.resumenGastos || data.categorias || {};
    
    let listaNombres = [];
    if (Array.isArray(resumen)) {
        listaNombres = resumen.map(c => typeof c === 'string' ? c : (c.categoria || c.nombre || "Categoría"));
    } else if (typeof resumen === 'object' && resumen !== null) {
        listaNombres = Object.keys(resumen);
    }

    if (listaNombres.length > 0) {
        let catHtml = `<h4 class="text-xs font-bold text-slate-500 uppercase mb-1">Categorías Detectadas:</h4>`;
        catHtml += `<div class="flex flex-wrap gap-1.5">`;
        listaNombres.forEach(nombreCat => {
            catHtml += `<span class="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-semibold">${nombreCat}</span>`;
        });
        catHtml += `</div>`;
        categoriasContainer.innerHTML = catHtml;
    } else {
        categoriasContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No se detectaron categorías en este análisis.</p>`;
    }

    document.getElementById("resultadoContainer").classList.remove("hidden");
}

function mostrarErrorFinanzas(msg) {
    const err = document.getElementById("errorContainer");
    err.textContent = msg;
    err.classList.remove("hidden");
}

function ocultarMensajesFinanzas() {
    document.getElementById("resultadoContainer").classList.add("hidden");
    document.getElementById("errorContainer").classList.add("hidden");
}

// ==========================================
// 6. HISTORIAL DE ANÁLISIS
// ==========================================
async function cargarPantallaHistorial() {
    if (!usuarioIdLogueado) return;

    const contenedor = document.getElementById("listaHistorialContainer");
    contenedor.innerHTML = `<p class="text-center text-slate-400 py-6 text-base">Cargando historial...</p>`;

    try {
        const response = await fetch(`http://localhost:8080/api/v1/finanzas/historial/${usuarioIdLogueado}`);
        if (!response.ok) throw new Error("No se pudo cargar el historial.");

        const historial = await response.json();

        if (historial.length === 0) {
            contenedor.innerHTML = `<p class="text-center text-slate-400 py-6 text-base">No tienes análisis previos guardados.</p>`;
            return;
        }

        historial.sort((a, b) => new Date(b.fechaAnalisis) - new Date(a.fechaAnalisis));
        window.historialCache = {};
        let html = "";

        historial.forEach((item) => {
            let fechaFormateada = new Date(item.fechaAnalisis).toLocaleString();
            window.historialCache[item.id] = item;
            let recHtml = "<ul class='list-disc pl-5 text-base text-slate-700 space-y-2'>";
            item.recomendaciones?.forEach(r => recHtml += `<li>${r}</li>`) || (recHtml += "<li>Sin recomendaciones</li>");
            recHtml += "</ul>";

            html += `
                <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
                    <div class="flex justify-between items-center">
                        <h3 class="font-bold text-slate-900 text-lg">Análisis del ${fechaFormateada}</h3>
                        <span class="text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-semibold">${item.perfilFinanciero || 'Perfil Estándar'}</span>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Recomendaciones:</p>
                        ${recHtml}
                    </div>
                    <div class="pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span class="text-sm text-slate-500">Transacciones: ${item.transacciones?.length || 0}</span>
                        <button type="button" onclick="abrirDetalleTransacciones(${item.id})" class="bg-blue-700 hover:bg-blue-800 text-white text-sm px-5 py-2.5 rounded-xl font-semibold transition shadow-sm">
                            Ver Transacciones y Gráfico
                        </button>
                    </div>
                </div>
            `;
        });
        contenedor.innerHTML = html;
    } catch (error) {
        contenedor.innerHTML = `<p class="text-center text-rose-500 py-6 text-base">Error al cargar el historial.</p>`;
    }
}

// ==========================================
// 7. DETALLE Y GRÁFICO
// ==========================================
window.abrirDetalleTransacciones = function(analisisId) {
    const item = window.historialCache[analisisId];
    if (!item) return;

    const transacciones = item.transacciones || [];
    const resumen = item.resumen_gastos || item.resumenGastos || item.categorias || {}; 

    let listaCategoriasDetalle = [];
    if (Array.isArray(resumen)) {
        listaCategoriasDetalle = resumen.map(c => typeof c === 'string' ? { categoria: c, valor: 1 } : c);
    } else if (typeof resumen === 'object' && resumen !== null) {
        listaCategoriasDetalle = Object.keys(resumen).map(k => ({ categoria: k, valor: resumen[k] }));
    }

    document.getElementById("detalleInfoAnalisis").textContent = `Detalle del análisis del: ${new Date(item.fechaAnalisis).toLocaleString()}`;

    const cuerpoTablaCategorias = document.getElementById("cuerpoTablaCategorias");
    if (cuerpoTablaCategorias) {
        cuerpoTablaCategorias.innerHTML = "";
        if (listaCategoriasDetalle.length === 0) {
            cuerpoTablaCategorias.innerHTML = `<tr><td colspan="2" class="p-4 text-center text-slate-400">No hay categorías registradas.</td></tr>`;
        } else {
            listaCategoriasDetalle.forEach(c => {
                let fechaCat = c.fechaRegistro ? new Date(c.fechaRegistro).toLocaleString() : "N/A";
                let nombreCategoria = c.categoria || c.nombre || "Categoría"; 
                
                cuerpoTablaCategorias.innerHTML += `
                    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                        <td class="p-4 font-medium text-slate-800 text-base">${nombreCategoria}</td>
                        <td class="p-4 text-right text-slate-500 text-sm">${fechaCat}</td>
                    </tr>
                `;
            });
        }
    }

    const cuerpoTablaTransacciones = document.getElementById("cuerpoTablaDetalleTransacciones");
    if (cuerpoTablaTransacciones) {
        cuerpoTablaTransacciones.innerHTML = "";
        if (transacciones.length === 0) {
            cuerpoTablaTransacciones.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-slate-400">No hay transacciones registradas.</td></tr>`;
        } else {
            transacciones.forEach(t => {
                cuerpoTablaTransacciones.innerHTML += `
                    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                        <td class="p-4 font-medium text-slate-800 text-base">${t.descripcion}</td>
                        <td class="p-4 text-right text-slate-700 text-base font-semibold">$${t.valor.toLocaleString()}</td>
                        <td class="p-4 text-right text-slate-500 text-sm">${t.fechaTransaccion ? new Date(t.fechaTransaccion).toLocaleString() : "N/A"}</td>
                    </tr>
                `;
            });
        }
    }

    if (miGraficoPastel) miGraficoPastel.destroy();
    const ctx = document.getElementById('graficoPastelTransacciones').getContext('2d');
    
    miGraficoPastel = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: listaCategoriasDetalle.map(c => c.categoria || "Categoría"),
            datasets: [{
                data: listaCategoriasDetalle.map(c => c.valor || 1), 
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b']
            }]
        }
    });

    historialScreen.classList.add("hidden");
    detalleTransaccionesScreen.classList.remove("hidden");
};

document.getElementById("btnVolverHistorial").addEventListener("click", () => {
    detalleTransaccionesScreen.classList.add("hidden");
    historialScreen.classList.remove("hidden");
});

document.getElementById("btnEliminarCuenta").addEventListener("click", async function () {
    if (!confirm("¿Seguro que deseas eliminar tu cuenta permanentemente?")) return;
    try {
        const response = await fetch(`${AUTH_ELIMINAR_URL}?email=${encodeURIComponent(correoUsuarioLogueado)}`, { method: "DELETE" });
        if (response.ok) { alert("Cuenta eliminada."); location.reload(); }
        else throw new Error("Error al eliminar.");
    } catch (error) { alert("Error: " + error.message); }
});

// ==========================================
// 8. BLOQUEAR RUEDA DEL MOUSE EN INPUTS NUMÉRICOS
// ==========================================
document.addEventListener("wheel", function(event) {
    if (document.activeElement && document.activeElement.type === "number") {
        document.activeElement.blur();
    }
});