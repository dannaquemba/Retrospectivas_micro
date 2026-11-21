let listaSprints = [];
let listaResumen = [];

const navInicio = document.getElementById("nav-inicio");
const navRetrospectivas = document.getElementById("nav-retrospectivas");
const encabezadoHero = document.getElementById("encabezado-hero");
const panelResumen = document.getElementById("panel-resumen");
const subtituloTabla = document.getElementById("subtitulo-tabla");
const btnCrearTabla = document.getElementById("btn-crear-tabla");

const mensajeEstado = document.getElementById("mensaje-estado");
const totalSprintsEl = document.getElementById("total-sprints");
const porcentajeCumplimientoEl = document.getElementById(
  "porcentaje-cumplimiento",
);
const cuerpoTablaSprints = document.getElementById("cuerpo-tabla-sprints");
const textoSinSprints = document.getElementById("texto-sin-sprints");
const buscadorSprint = document.getElementById("buscador-sprint");

const seccionFormulario = document.getElementById("seccion-formulario");
const tituloFormulario = document.getElementById("titulo-formulario");
const formSprint = document.getElementById("form-sprint");
const inputSprintId = document.getElementById("sprint-id");
const inputNombre = document.getElementById("sprint-nombre");
const inputFechaInicio = document.getElementById("sprint-fecha-inicio");
const inputFechaFin = document.getElementById("sprint-fecha-fin");

const btnAbrirFormulario = document.getElementById("btn-abrir-formulario");
const btnCancelarFormulario = document.getElementById(
  "btn-cancelar-formulario",
);

function cambiarVista(vista) {
  if (vista === "retrospectivas") {
    navInicio.classList.remove("activo");
    navRetrospectivas.classList.add("activo");

    encabezadoHero.classList.add("oculto");
    panelResumen.classList.add("oculto");
    subtituloTabla.classList.remove("oculto");
    btnCrearTabla.classList.remove("oculto");

    buscadorSprint.focus();
  } else {
    navRetrospectivas.classList.remove("activo");
    navInicio.classList.add("activo");

    encabezadoHero.classList.remove("oculto");
    panelResumen.classList.remove("oculto");
    subtituloTabla.classList.add("oculto");
    btnCrearTabla.classList.add("oculto");
  }
}


function animarNumero(elemento, valorFinal, sufijo) {
  let actual = 0;
  const pasos = 20;
  const incremento = valorFinal / pasos;

  if (valorFinal === 0) {
    elemento.textContent = `0${sufijo}`;
    return;
  }

  const intervalo = setInterval(function () {
    actual += incremento;
    if (actual >= valorFinal) {
      elemento.textContent = `${valorFinal}${sufijo}`;
      clearInterval(intervalo);
    } else {
      elemento.textContent = `${Math.round(actual)}${sufijo}`;
    }
  }, 20);
}

let contadorCargas = 0;

function cargarDatosIniciales() {
  const miCarga = ++contadorCargas;
  const errores = [];
  let sprintsListos = false;
  let resumenListo = false;
  let fallaronSprints = false;

  cuerpoTablaSprints.innerHTML =
    '<tr class="fila-cargando"><td colspan="7">Cargando retrospectivas...</td></tr>';
  textoSinSprints.classList.add("oculto");

  function intentarPintar() {
    if (!sprintsListos || !resumenListo || miCarga !== contadorCargas) {
      return;
    }
    if (errores.length > 0) {
      mostrarMensajeEstado(mensajeEstado, errores.join(" "), "error");
    }
    if (fallaronSprints) {
      cuerpoTablaSprints.innerHTML = "";
      return;
    }
    actualizarTarjetasResumen();
    renderizarTablaSprints();
  }


  obtenerSprints(
    function (sprints) {
      listaSprints = sprints;
      sprintsListos = true;
      intentarPintar();
    },
    function (errorMsg) {
      errores.push(errorMsg);
      fallaronSprints = true;
      sprintsListos = true;
      intentarPintar();
    },
  );

  obtenerResumenItems(
    function (resumen) {
      listaResumen = resumen;
      resumenListo = true;
      intentarPintar();
    },
    function (errorMsg) {
      errores.push(errorMsg);
      listaResumen = [];
      resumenListo = true;
      intentarPintar();
    },
  );
}

function actualizarTarjetasResumen() {
  animarNumero(totalSprintsEl, listaSprints.length, "");

  let totalAcciones = 0;
  let totalCumplidas = 0;

  listaResumen.forEach(function (item) {
    totalAcciones += item.acciones;
    totalCumplidas += item.acciones_cumplidas;
  });

  const porcentaje =
    totalAcciones > 0 ? Math.round((totalCumplidas / totalAcciones) * 100) : 0;

  animarNumero(porcentajeCumplimientoEl, porcentaje, "%");
}

function renderizarTablaSprints() {
  cuerpoTablaSprints.innerHTML = "";

  const filtro = buscadorSprint.value.trim().toLowerCase();
  const sprintsFiltrados = listaSprints.filter(function (sprint) {
    return sprint.nombre.toLowerCase().includes(filtro);
  });

  if (sprintsFiltrados.length === 0) {
    textoSinSprints.classList.remove("oculto");
    return;
  }

  textoSinSprints.classList.add("oculto");

  sprintsFiltrados.forEach(function (sprint) {
    const resumenSprint = listaResumen.find(function (r) {
      return r.sprint_id === sprint.id;
    });

    const fila = crearFilaSprint(
      sprint,
      resumenSprint,
      abrirFormularioEdicion,
      confirmarEliminarSprint,
    );

    cuerpoTablaSprints.appendChild(fila);
  });
}

function abrirFormularioCreacion() {
  inputSprintId.value = "";
  formSprint.reset();
  tituloFormulario.textContent = "Nueva Retrospectiva";
  seccionFormulario.classList.remove("oculto");
  inputNombre.focus();
}


function abrirFormularioEdicion(sprint) {
  inputSprintId.value = sprint.id;
  inputNombre.value = sprint.nombre;
  inputFechaInicio.value = sprint.fecha_inicio;
  inputFechaFin.value = sprint.fecha_fin;
  tituloFormulario.textContent = `Editar ${sprint.nombre}`;
  seccionFormulario.classList.remove("oculto");
}


function cerrarFormulario() {
  formSprint.reset();
  inputSprintId.value = "";
  seccionFormulario.classList.add("oculto");
}

function manejarGuardarSprint(evento) {
  evento.preventDefault();

  const datos = {
    nombre: inputNombre.value.trim(),
    fecha_inicio: inputFechaInicio.value,
    fecha_fin: inputFechaFin.value,
  };

  if (!datos.nombre || !datos.fecha_inicio || !datos.fecha_fin) {
    mostrarMensajeEstado(
      mensajeEstado,
      "Todos los campos son obligatorios.",
      "error",
    );
    return;
  }

  if (datos.fecha_fin < datos.fecha_inicio) {
    mostrarMensajeEstado(
      mensajeEstado,
      "La fecha de fin no puede ser anterior a la fecha de inicio.",
      "error",
    );
    return;
  }

  const idEdicion = inputSprintId.value;

  if (idEdicion) {
    actualizarSprint(
      idEdicion,
      datos,
      function () {
        cerrarFormulario();
        mostrarMensajeEstado(
          mensajeEstado,
          "Sprint actualizado correctamente.",
          "exito",
        );
        cargarDatosIniciales();
      },
      function (errorMsg) {
        mostrarMensajeEstado(mensajeEstado, errorMsg, "error");
      },
    );
  } else {
    crearSprint(
      datos,
      function () {
        cerrarFormulario();
        mostrarMensajeEstado(
          mensajeEstado,
          "Retrospectiva creada correctamente.",
          "exito",
        );
        cargarDatosIniciales();
      },
      function (errorMsg) {
        mostrarMensajeEstado(mensajeEstado, errorMsg, "error");
      },
    );
  }
}

function confirmarEliminarSprint(sprint) {
  const confirmado = confirm(
    `¿Seguro que deseas eliminar "${sprint.nombre}" y todos sus ítems?`,
  );
  if (!confirmado) {
    return;
  }

  eliminarSprint(
    sprint.id,
    function () {
      mostrarMensajeEstado(
        mensajeEstado,
        "Sprint eliminado correctamente.",
        "exito",
      );
      cargarDatosIniciales();
    },
    function (errorMsg) {
      mostrarMensajeEstado(mensajeEstado, errorMsg, "error");
    },
  );
}

document.addEventListener("DOMContentLoaded", function () {
  cargarDatosIniciales();

  if (window.location.hash === "#mis-retrospectivas") {
    cambiarVista("retrospectivas");
  }
});

navInicio.addEventListener("click", function (e) {
  e.preventDefault();
  cambiarVista("inicio");
});

navRetrospectivas.addEventListener("click", function (e) {
  e.preventDefault();
  cambiarVista("retrospectivas");
});

btnAbrirFormulario.addEventListener("click", abrirFormularioCreacion);
btnCrearTabla.addEventListener("click", abrirFormularioCreacion);
btnCancelarFormulario.addEventListener("click", cerrarFormulario);
formSprint.addEventListener("submit", manejarGuardarSprint);
buscadorSprint.addEventListener("input", renderizarTablaSprints);
