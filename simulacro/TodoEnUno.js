<!-- =========================
    CHULETA DEFINITIVA CON BLOQUES COMENTADOS
    FORMULARIOS + MÉTRICAS + PDF + EVENTOS + EXTRAS
========================= -->
<script>
/* =========================
   0️⃣ ESTADO INICIAL / OBJETO DE ESTADÍSTICAS
   Aquí se inicializan todas las variables que registran la interacción
   del usuario con los inputs y el formulario. También el objeto session
   que registra pasos, errores, repetidos y errores por campo.
========================= */
const estadisticas = {
    input1: { focus:0, blur:0, change:0, input:0, tecla_a:0 },
    input2: { focus:0, blur:0, change:0, tecla_e:0 },
    input3: { focus:0, blur:0, change:0 },
};
let session = {
    startedAt: Date.now(), // timestamp de inicio de sesión
    steps:0, errors:0, repeats:0, lastSubmitAt:0,
    errorByField: { name:0,email:0,code:0 }
};

/* =========================
   1️⃣ UTILIDADES TIEMPO Y LOG
   Funciones de apoyo para medir tiempo en segundos y mostrar logs en pantalla.
========================= */
function nowSeconds(){ return Math.floor((Date.now()-session.startedAt)/1000); }
function log(msg){
    const li=document.createElement("li");
    li.textContent=`[${nowSeconds()}s] ${msg}`;
    document.getElementById("log")?.prepend(li); // prepend para que el log más reciente quede arriba
}

/* =========================
   2️⃣ INCREMENTO DE PASOS
   Cada interacción considerada como "paso" aumenta session.steps y
   actualiza métricas visuales. Se puede pasar un motivo (reason) para log.
========================= */
function incStep(reason){
    session.steps++;
    renderMetrics();
    if(reason) log(`Paso: ${reason}`);
}

/* =========================
   3️⃣ RENDER MÉTRICAS EN PANTALLA
   Actualiza indicadores de pasos, errores, repetidos y tiempo.
   También genera tabla resumida en HTML si existe reportBody.
========================= */
function renderMetrics(){
    document.getElementById("mSteps").textContent = session.steps;
    document.getElementById("mErrors").textContent = session.errors;
    document.getElementById("mRepeats").textContent = session.repeats;
    document.getElementById("mTime").textContent = `${nowSeconds()}s`;

    const reportBody = document.getElementById("reportBody");
    if(reportBody){
        reportBody.innerHTML = `
            <tr><td>Pasos realizados</td><td>${session.steps}</td></tr>
            <tr><td>Errores detectados</td><td>${session.errors}</td></tr>
            <tr><td>Acciones repetidas</td><td>${session.repeats}</td></tr>
            <tr><td>Tiempo transcurrido</td><td>${nowSeconds()} segundos</td></tr>
        `;
    }
}

/* =========================
   4️⃣ VALIDACIONES DE CAMPOS
   Funciones específicas para validar cada campo según criterios:
   - Nombre >=2 caracteres
   - Email válido con regex
   - Código numérico de 4 dígitos
========================= */
function validName(){ return nameInput.value.trim().length >= 2; }
function validEmail(){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()); }
function validCode(){ return /^\d{4}$/.test(codeInput.value.trim()); }

/* =========================
   5️⃣ ESTADO VISUAL Y REGISTRO DE ERRORES
   Cambia clases CSS según si el campo es válido o no.
   Actualiza session.errors y errorByField.
========================= */
function setFieldState(field, ok, hintEl, baseHint, fieldKey){
    if(ok){
        field.classList.remove("invalid"); hintEl.classList.remove("error"); hintEl.textContent=baseHint;
        return true;
    }
    field.classList.add("invalid"); hintEl.classList.add("error"); hintEl.textContent="⚠ "+baseHint;
    session.errors++; session.errorByField[fieldKey]++;
    renderMetrics(); log(`Error en "${fieldKey}"`);
    return false;
}

/* =========================
   6️⃣ PROGRESO VISUAL
   Actualiza la etiqueta de progreso con número de campos correctos
========================= */
function updateProgressLabel(){
    const okCount=[validName(),validEmail(),validCode()].filter(Boolean).length;
    const labelEl=document.getElementById("progressLabel");
    if(labelEl) labelEl.textContent = okCount===3?"Listo para enviar":`Progreso: ${okCount}/3 campos correctos`;
}

/* =========================
   7️⃣ DETECCIÓN DE PASOS REALES (INPUTS)
   Cada cambio real de valor en el input cuenta como un paso.
========================= */
function makeStepOnChange(inputEl, reasonLabel){
    let lastValue=inputEl.value;
    inputEl.addEventListener("input", ()=>{
        if(inputEl.value!==lastValue){ lastValue=inputEl.value; lastValue=inputEl.value; incStep(reasonLabel); }
        updateProgressLabel(); hideStatus();
    });
}

/* =========================
   8️⃣ BOTONES / ESTADO
   Funciones para mostrar/ocultar mensajes de estado en pantalla
========================= */
function showStatus(type,msg){
    const statusBox=document.getElementById("status");
    if(statusBox){ statusBox.className=`status ${type}`; statusBox.textContent=msg; statusBox.classList.remove("hidden"); }
}
function hideStatus(){ document.getElementById("status")?.classList.add("hidden"); }

/* =========================
   9️⃣ ACCIONES REPETIDAS
   Evita doble envío muy rápido (menos de 1.2s)
========================= */
function isRepeatSubmit(){
    const t=Date.now();
    const tooSoon=(t-session.lastSubmitAt)<1200; // 1.2s
    session.lastSubmitAt=t;
    if(tooSoon) session.repeats++;
    return tooSoon;
}

/* =========================
   🔟 COOKIES
   Guardado, lectura y borrado de cookies de estadísticas
========================= */
function setCookie(name,value,days){
    const d=new Date(); d.setTime(d.getTime()+days*24*60*60*1000);
    document.cookie=`${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}
function getCookie(name){
    const v=document.cookie.match('(^|;) ?'+name+'=([^;]*)(;|$)');
    return v?decodeURIComponent(v[2]):null;
}
function deleteCookie(name){ setCookie(name,"",-1); }

/* =========================
   1️⃣1️⃣ PDF pdfMake COMPLETO
   Genera documento PDF con métricas, tabla de errores y estilos
========================= */
function crearDocDefinitionConTablaCompleta(imagenGrafico=null){
    const tiempoFinal=nowSeconds();
    return {
        info:{ title:"Informe de Usabilidad", author:"Alumno" },
        pageSize:"A4", pageOrientation:"portrait", pageMargins:[40,60,40,60],
        header:(currentPage,pageCount)=>({ text:"Informe de Estadísticas", alignment:"center", margin:[0,10,0,0] }),
        footer:(currentPage,pageCount)=>({ text:`Página ${currentPage} de ${pageCount}`, alignment:"right", margin:[0,0,40,0] }),
        background:(currentPage)=>({ text: currentPage===1?"PORTADA":"BORRADOR", color:"gray", opacity:0.1, fontSize:80, alignment:"center" }),
        content:[
            { text:"Informe de Usabilidad", style:"header", alignment:"center" },
            { text:`Fecha: ${new Date().toLocaleString()}`, margin:[0,0,0,20], alignment:"center" },
            {
                table:{
                    headerRows:1,
                    widths:["*","auto"],
                    body:[
                        [{text:"Métrica",style:"tableHeader"}, {text:"Valor",style:"tableHeader", alignment:"center"}],
                        ["Pasos", {text: session.steps.toString(), alignment:"center"}],
                        ["Errores", {text: session.errors.toString(), alignment:"center"}],
                        ["Repetidos", {text: session.repeats.toString(), alignment:"center"}],
                        ["Tiempo", {text: `${tiempoFinal} segundos`, alignment:"center"}]
                    ]
                },
                layout:"lightHorizontalLines"
            },
            { text:"Desglose de errores por campo:", style:"subheader" },
            { ul:[`Nombre: ${session.errorByField.name}`, `Email: ${session.errorByField.email}`, `Código: ${session.errorByField.code}`] },
            { text:"Fin del informe.", margin:[0,20,0,0], italics:true, alignment:"right" }
        ],
        styles:{
            header:{ fontSize:18, bold:true, margin:[0,0,0,10] },
            subheader:{ fontSize:14, bold:true, margin:[0,15,0,5] },
            tableHeader:{ bold:true, fontSize:12, fillColor:"#eeeeee" }
        },
        defaultStyle:{ fontSize:11 }
    };
}

/* =========================
   1️⃣2️⃣ EVENTOS INPUTS (TODOs)
   Cada input tiene focus, blur, change, keydown y input
   Se registran todas las métricas en tiempo real
========================= */
// TODO 1–8, 23–24, 44 (ver la versión compacta para detalles exactos)
input1.addEventListener("focus", ()=>{ estadisticas.input1.focus++; });
input1.addEventListener("blur", ()=>{ estadisticas.input1.blur++; });
input1.addEventListener("change", ()=>{ estadisticas.input1.change++; });
input1.addEventListener("keydown", e=>{ if(e.key.toLowerCase()==="a") estadisticas.input1.tecla_a++; });
input1.addEventListener("input", ()=>{ estadisticas.input1.input++; });

input2.addEventListener("focus", ()=>{ estadisticas.input2.focus++; });
input2.addEventListener("blur", ()=>{ estadisticas.input2.blur++; });
input2.addEventListener("change", ()=>{ estadisticas.input2.change++; });
input2.addEventListener("keydown", e=>{ if(e.key.toLowerCase()==="e") estadisticas.input2.tecla_e++; });
input2.addEventListener("keydown", e=>{ if(!isNaN(e.key)) e.preventDefault(); }); // bloquea números

input3.addEventListener("focus", ()=>{ estadisticas.input3.focus++; });

/* =========================
   1️⃣3️⃣ COOKIES Y FECHA
========================= */
botonGuardar.onclick = ()=>{
    setCookie("estadisticasFormulario", JSON.stringify(estadisticas),7);
    setCookie("fechaGuardado", new Date().toISOString(),7);
    mensaje.textContent="Cookie guardada correctamente.";
};
botonBorrar.onclick = ()=>{
    deleteCookie("estadisticasFormulario");
    // reiniciar objeto estadisticas
    estadisticas.input1={focus:0,blur:0,change:0,input:0,tecla_a:0};
    estadisticas.input2={focus:0,blur:0,change:0,tecla_e:0};
    estadisticas.input3={focus:0,blur:0,change:0};
    mensaje.textContent="Cookie eliminada y JSON reiniciado.";
};
const fechaCookie = getCookie("fechaGuardado");

/* =========================
   1️⃣4️⃣ GRÁFICAS Y TABLAS PDF
   Se pueden generar datasets para chart.js o cualquier gráfico
========================= */
function obtenerDatosTabla(){ return [
    ["input1","focus",estadisticas.input1.focus],
    ["input1","blur",estadisticas.input1.blur],
    ["input1","change",estadisticas.input1.change],
    ["input1","tecla_a",estadisticas.input1.tecla_a],
    ["input2","focus",estadisticas.input2.focus],
    ["input2","blur",estadisticas.input2.blur],
    ["input2","change",estadisticas.input2.change],
    ["input2","tecla_e",estadisticas.input2.tecla_e],
    ["input3","focus",estadisticas.input3.focus],
    ["input3","blur",estadisticas.input3.blur],
    ["input3","change",estadisticas.input3.change]
]; }

/* =========================
   1️⃣5️⃣ EXTRAS Y VALIDACIONES ADICIONALES
========================= */
const regexTelefono=/^[0-9]{9}$/;
function calcularTotalEventos(){
    let total=0;
    for(let i in estadisticas){ for(let e in estadisticas[i]) total+=estadisticas[i][e]; }
    return total;
}
function actualizarTotalEventos(){ mensaje.textContent="Total eventos: "+calcularTotalEventos(); }
function guardarAutomatico(){ setCookie("estadisticasFormulario",JSON.stringify(estadisticas),7); }
function cambiarFondo(color){ document.body.style.backgroundColor=color; }

/* =========================
   1️⃣6️⃣ INICIALIZACIÓN
   Asignar listeners, actualizar métricas iniciales y log de inicio
========================= */
makeStepOnChange(nameInput,"Escritura en nombre");
makeStepOnChange(emailInput,"Escritura en email");
makeStepOnChange(codeInput,"Escritura en código");
updateProgressLabel(); renderMetrics(); log("Inicio de sesión");

// Botones clicks y form submit con validación completa
submitBtn.addEventListener("click", ()=>incStep("Click en Enviar"));
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(isRepeatSubmit()){ showStatus("warn","Has pulsado enviar muy rápido"); return; }
    const okName=setFieldState(nameInput,validName(),nameHint,"Mínimo 2 caracteres.","name");
    const okEmail=setFieldState(emailInput,validEmail(),emailHint,"Formato email válido","email");
    const okCode=setFieldState(codeInput,validCode(),codeHint,"Introduce 4 dígitos","code");
    updateProgressLabel();
    if(!okName||!okEmail||!okCode){ showStatus("err","Corrige los campos marcados en rojo"); return; }
    showStatus("ok","Formulario enviado correctamente ✅");
    submitBtn.disabled=true;
});

// PDF botones
document.getElementById("downloadReportBtn")?.addEventListener("click",()=>pdfMake.createPdf(crearDocDefinitionConTablaCompleta()).download("informe_usabilidad.pdf"));
document.getElementById("openReportBtn")?.addEventListener("click",()=>pdfMake.createPdf(crearDocDefinitionConTablaCompleta()).open());
</script>