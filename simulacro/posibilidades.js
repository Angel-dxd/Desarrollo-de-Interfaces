// =====================================================
// 1. EVENTOS INPUT 1
// =====================================================

// TODO 1:
// Detectar cuando el usuario entra en el input (focus)
// ➜ Se usa para saber cuántas veces interactúa el usuario
// ➜ También se suele pedir aplicar una clase CSS visual
input1.addEventListener("focus", () => {
  estadisticas.input1.focus++; // Incrementa contador
  input1.classList.add("focused"); // Aplica estilo visual
});

// TODO 2:
// Detectar cuando el usuario sale del input (blur)
// ➜ Muy típico en exámenes junto con focus
input1.addEventListener("blur", () => {
  estadisticas.input1.blur++;
  input1.classList.remove("focused"); // Quita estilo
});

// TODO 3:
// Detectar cambio de valor (change)
// ➜ SOLO se dispara cuando pierdes el foco después de cambiar
input1.addEventListener("change", () => {
  estadisticas.input1.change++;
});

// TODO 4:
// Detectar pulsación de tecla específica
// ➜ Aquí solo cuenta la "a" (mayúscula o minúscula)
// ➜ Muy importante usar toLowerCase()
input1.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "a") {
    estadisticas.input1.tecla_a++;
  }
});


// =====================================================
// 2. EVENTOS INPUT 2 (MISMA LÓGICA)
// =====================================================

// TODO 5:
// Focus input2
input2.addEventListener("focus", () => {
  estadisticas.input2.focus++;
  input2.classList.add("focused");
});

// TODO 6:
// Blur input2
input2.addEventListener("blur", () => {
  estadisticas.input2.blur++;
  input2.classList.remove("focused");
});

// TODO 7:
// Change input2
input2.addEventListener("change", () => {
  estadisticas.input2.change++;
});

// TODO 8:
// Keydown letra "e"
input2.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "e") {
    estadisticas.input2.tecla_e++;
  }
});


// =====================================================
// 3. COOKIES
// =====================================================

// TODO 9:
// Guardar el objeto estadisticas en una cookie
// ➜ Siempre convertir a JSON (JSON.stringify)
// ➜ Nombre EXACTO suele importar en examen
botonGuardar.onclick = () => {
  setCookie("estadisticasFormulario", JSON.stringify(estadisticas), 7);
  mensaje.textContent = "Cookie guardada correctamente.";
};

// TODO 29 (AMPLIACIÓN):
// Guardar también la fecha
// ➜ Muy típico para diferenciar examen largo
botonGuardar.onclick = () => {
  setCookie("estadisticasFormulario", JSON.stringify(estadisticas), 7);
  setCookie("fechaGuardado", new Date().toISOString(), 7);
  mensaje.textContent = "Cookie guardada correctamente.";
};

// TODO 10:
// Borrar cookie y reiniciar datos
// ➜ Importante: resetear el objeto también
botonBorrar.onclick = () => {
  deleteCookie("estadisticasFormulario");
  estadisticas = crearEstadoInicial();
  mensaje.textContent = "Cookie eliminada y JSON reiniciado.";
};


// =====================================================
// 4. FUNCIONES DE DATOS
// =====================================================

// TODO 11:
// Crear estructura para tabla
// ➜ SIEMPRE 8 filas (4 + 4)
// ➜ Orden IMPORTANTE
function obtenerDatosTabla() {
  return [
    ["input1", "focus", estadisticas.input1.focus],
    ["input1", "blur", estadisticas.input1.blur],
    ["input1", "change", estadisticas.input1.change],
    ["input1", "tecla_a", estadisticas.input1.tecla_a],
    ["input2", "focus", estadisticas.input2.focus],
    ["input2", "blur", estadisticas.input2.blur],
    ["input2", "change", estadisticas.input2.change],
    ["input2", "tecla_e", estadisticas.input2.tecla_e]
  ];
}

// TODO 12:
// Valores para gráfica
// ➜ MISMO ORDEN que labels
function obtenerValoresGrafico() {
  return [
    estadisticas.input1.focus,
    estadisticas.input1.blur,
    estadisticas.input1.change,
    estadisticas.input1.tecla_a,
    estadisticas.input2.focus,
    estadisticas.input2.blur,
    estadisticas.input2.change,
    estadisticas.input2.tecla_e
  ];
}


// =====================================================
// 5. GRÁFICA
// =====================================================

// TODO 13:
// Labels del gráfico
labels: obtenerLabelsGrafico(),

// TODO 14:
// Datos del gráfico
data: obtenerValoresGrafico(),

// TODO 28 (AMPLIACIÓN):
// Separar datasets por input
datasets: [
  {
    label: "Input1",
    data: [
      estadisticas.input1.focus,
      estadisticas.input1.blur,
      estadisticas.input1.change,
      estadisticas.input1.tecla_a
    ]
  },
  {
    label: "Input2",
    data: [
      estadisticas.input2.focus,
      estadisticas.input2.blur,
      estadisticas.input2.change,
      estadisticas.input2.tecla_e
    ]
  }
];


// =====================================================
// 6. PDF
// =====================================================

// TODO 15:
// Información del documento
// ➜ Suele caer literal
title: "Informe de estadísticas",
author: "Alumno",

// TODO 16:
// Footer dinámico
// ➜ MUY IMPORTANTE (casi seguro examen)
footer: function(currentPage, pageCount) {
  return {
    columns: [
      { text: "Generado automáticamente con pdfMake", margin: [40, 0] },
      { text: currentPage + " de " + pageCount, alignment: "right", margin: [0, 0, 40, 0] }
    ]
  };
},

// TODO 17:
// Mostrar fecha actual
{ text: "Fecha: " + fechaHoyES() },

// TODO 18:
// Responsable alineado a la derecha
{ text: "Responsable: Alumno / Aplicación", alignment: "right" },

// TODO 19:
// Tabla de datos
body: construirTablaPdf(),

// TODO 20:
// Imagen gráfica
image: imagenGrafico,


// =====================================================
// 7. EVENTOS PDF
// =====================================================

// TODO 21:
// Mostrar PDF en iframe
botonVerPdf.onclick = () => {
  const img = generarImagenGrafico();
  const doc = crearDocumentoPdf(img);

  pdfMake.createPdf(doc).getBlob((blob) => {
    iframe.src = URL.createObjectURL(blob);
  });
};

// TODO 22:
// Abrir PDF en nueva pestaña
botonAbrirPdf.onclick = () => {
  const img = generarImagenGrafico();
  const doc = crearDocumentoPdf(img);
  pdfMake.createPdf(doc).open();
};


// =====================================================
// 8. AMPLIACIONES IMPORTANTES
// =====================================================

// TODO 26:
// Calcular total eventos
function calcularTotalEventos() {
  let total = 0;
  for (let i in estadisticas) {
    for (let e in estadisticas[i]) {
      total += estadisticas[i][e];
    }
  }
  return total;
}

// TODO 27:
// Añadir fila TOTAL en PDF
[
  { text: "TOTAL", colSpan: 2 }, {},
  calcularTotalEventos()
]

// TODO 30:
// Leer fecha guardada en cookie
const fecha = getCookie("fechaGuardado");


// =====================================================
// 9. EXTRAS PROBABLES
// =====================================================

// TODO 23:
// Tercer input
input3.addEventListener("focus", () => {
  estadisticas.input3.focus++;
});

// TODO 24:
// Evento input (en tiempo real)
input1.addEventListener("input", () => {
  estadisticas.input1.input++;
});

// TODO 25:
// Validación teléfono
const regexTelefono = /^[0-9]{9}$/;


// =====================================================
// 10. EXTRAS QUE SUMAN PUNTOS
// =====================================================

// TODO 31:
// Mostrar total en pantalla
function actualizarTotalEventos() {
  mensaje.textContent = "Total eventos: " + calcularTotalEventos();
}

// TODO 33:
// Guardado automático
function guardarAutomatico() {
  setCookie("estadisticasFormulario", JSON.stringify(estadisticas), 7);
}

// TODO 36:
// Cambiar fondo
function cambiarFondo(color) {
  document.body.style.backgroundColor = color;
}

// TODO 38:
// Validación simple
input1.addEventListener("change", () => {
  if (input1.value.length < 3) {
    mensaje.textContent = "Debe tener al menos 3 caracteres";
  }
});

// TODO 44:
// Bloquear números
input2.addEventListener("keydown", (e) => {
  if (!isNaN(e.key)) e.preventDefault();
});