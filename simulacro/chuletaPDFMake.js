// =====================================================
// 📌 ESTRUCTURA BASE PDFMAKE (MEMORIZAR)
// =====================================================

const doc = {

  // =========================
  // INFO (METADATOS)
  // =========================
  info: {
    title: "Título del documento",
    author: "Alumno"
  },

  // =========================
  // CONFIGURACIÓN
  // =========================
  pageSize: "A4",
  pageOrientation: "portrait",
  pageMargins: [40, 80, 40, 60],

  // =========================
  // BACKGROUND (FONDO)
  // =========================
  background: {
    text: "INFORME",
    color: "gray",
    opacity: 0.1,
    bold: true,
    fontSize: 60,
    alignment: "center",
    margin: [0, 250, 0, 0]
  },

  // =========================
  // HEADER
  // =========================
  header: function(currentPage, pageCount) {
    return {
      columns: [
        { text: "Texto izquierda", margin: [40, 20, 0, 0] },
        { text: "Texto derecha", alignment: "right", margin: [0, 20, 40, 0] }
      ]
    };
  },

  // =========================
  // FOOTER (MUY IMPORTANTE)
  // =========================
  footer: function(currentPage, pageCount) {
    return {
      columns: [
        {
          text: "Generado automáticamente con pdfMake",
          alignment: "left",
          margin: [40, 0, 0, 0]
        },
        {
          text: currentPage + " de " + pageCount,
          alignment: "right",
          margin: [0, 0, 40, 0]
        }
      ]
    };
  },

  // =========================
  // ESTILOS
  // =========================
  styles: {
    title: { fontSize: 20, bold: true },
    sectionHeader: { fontSize: 14, bold: true },
    tableHeader: { bold: true, fillColor: "#eeeeee" }
  },

  // =========================
  // CONTENIDO
  // =========================
  content: [

    // TÍTULO
    { text: "Título del informe", style: "title", alignment: "center" },

    // COLUMNAS (MUY TÍPICO)
    {
      columns: [
        { text: "Fecha: " + fechaHoyES() },
        { text: "Responsable: Alumno", alignment: "right" }
      ]
    },

    // TEXTO NORMAL
    {
      text: "Descripción del informe",
      margin: [0, 10, 0, 10]
    },

    // =========================
    // TABLA (IMPORTANTÍSIMO)
    // =========================
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", 70],
        body: construirTablaPdf()
      },
      layout: "lightHorizontalLines"
    },

    // =========================
    // IMAGEN (GRÁFICA)
    // =========================
    {
      image: imagenGrafico,
      width: 500,
      alignment: "center"
    }

  ]
};