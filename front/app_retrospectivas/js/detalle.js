const parametrosUrl = new URLSearchParams(window.location.search);
const sprintActualId = Number(parametrosUrl.get("id"));

const mensajeEstado = document.getElementById("mensaje-estado");
const detalleNombreSprint = document.getElementById("detalle-nombre-sprint");
const detalleFechasSprint = document.getElementById("detalle-fechas-sprint");

const seccionSprintAnterior = document.getElementById(
  "seccion-sprint-anterior",
);
const nombreSprintAnterior = document.getElementById("nombre-sprint-anterior");
const listaAccionesAnteriores = document.getElementById(
  "lista-acciones-anteriores",
);

const formItem = document.getElementById("form-item");
const selectCategoria = document.getElementById("item-categoria");
const inputDescripcion = document.getElementById("item-descripcion");
const inputFechaRevision = document.getElementById("item-fecha-revision");

const listaLogros = document.getElementById("lista-logros");
const listaImpedimentos = document.getElementById("lista-impedimentos");
const listaAcciones = document.getElementById("lista-acciones");

function inicializarDetalle() {
  if (!sprintActualId) {
    mostrarMensajeEstado(
      mensajeEstado,
      "No se especificó un sprint válido.",
      "error",
    );
    return;
  }

  cargarDatosSprint();
  cargarItemsSprintActual();
  cargarSprintAnterior();
}

function cargarDatosSprint() {
  obtenerSprintPorId(
    sprintActualId,
    function (sprint) {
      detalleNombreSprint.textContent = sprint.nombre;
      detalleFechasSprint.textContent = `Del ${sprint.fecha_inicio} al ${sprint.fecha_fin}`;
    },
    function (errorMsg) {
      mostrarMensajeEstado(mensajeEstado, errorMsg, "error");
    },
  );
}

let cargaItemsActual = 0;

function mostrarVaciosEnColumnas() {
  [listaLogros, listaImpedimentos, listaAcciones].forEach(function (lista) {
    if (lista.children.length === 0) {
      const li = document.createElement("li");
      li.className = "texto-vacio";
      li.textContent = "Aún no hay elementos aquí.";
      lista.appendChild(li);
    }
  });
}

function cargarItemsSprintActual() {
  const miCarga = ++cargaItemsActual;
  obtenerItemsPorSprint(
    sprintActualId,
    function (items) {
      if (miCarga !== cargaItemsActual) {
        return;
      }
      listaLogros.innerHTML = "";
      listaImpedimentos.innerHTML = "";
      listaAcciones.innerHTML = "";

      items.forEach(function (item) {
        const tarjeta = crearTarjetaItem(
          item,
          manejarCambioCumplimiento,
          confirmarEliminarItem,
        );

        if (item.categoria === "logro") {
          listaLogros.appendChild(tarjeta);
        } else if (item.categoria === "impedimento") {
          listaImpedimentos.appendChild(tarjeta);
        } else if (item.categoria === "accion") {
          listaAcciones.appendChild(tarjeta);
        }
      });

      mostrarVaciosEnColumnas();
    },
    function (errorMsg) {
      mostrarMensajeEstado(mensajeEstado, errorMsg, "error");
    },
  );
}

let cargaAnterior = 0;

function cargarSprintAnterior() {
  const miCarga = ++cargaAnterior;
  obtenerSprints(
    function (sprints) {
      if (miCarga !== cargaAnterior) {
        return;
      }
      const ordenados = sprints.slice().sort(function (a, b) {
        if (a.fecha_inicio === b.fecha_inicio) {
          return a.id - b.id;
        }
        return a.fecha_inicio.localeCompare(b.fecha_inicio);
      });

      const indiceActual = ordenados.findIndex(function (s) {
        return s.id === sprintActualId;
      });
      if (indiceActual <= 0) {
        seccionSprintAnterior.classList.add("oculto");
        return;
      }

      const sprintAnterior = ordenados[indiceActual - 1];
      nombreSprintAnterior.textContent = sprintAnterior.nombre;

      obtenerItemsPorSprint(
        sprintAnterior.id,
        function (items) {
          if (miCarga !== cargaAnterior) {
            return;
          }
          const accionesAnteriores = items.filter(function (item) {
            return item.categoria === "accion";
          });

          listaAccionesAnteriores.innerHTML = "";

          if (accionesAnteriores.length === 0) {
            const liVacio = document.createElement("li");
            liVacio.textContent =
              "El sprint anterior no tuvo acciones registradas.";
            listaAccionesAnteriores.appendChild(liVacio);
          } else {
            accionesAnteriores.forEach(function (accion) {
              const tarjeta = crearTarjetaItem(
                accion,
                manejarCambioCumplimiento,
                null,
              );
              listaAccionesAnteriores.appendChild(tarjeta);
            });
          }

          seccionSprintAnterior.classList.remove("oculto");
        },
        function (errorMsg) {
          mostrarMensajeEstado(mensajeEstado, errorMsg, "error");
        },
      );
    },
    function () {
      seccionSprintAnterior.classList.add("oculto");
    },
  );
}

function manejarAgregarItem(evento) {
  evento.preventDefault();

  const datos = {
    sprint_id: sprintActualId,
    categoria: selectCategoria.value,
    descripcion: inputDescripcion.value.trim(),
    fecha_revision: inputFechaRevision.value || null,
  };

  if (!datos.descripcion) {
    mostrarMensajeEstado(
      mensajeEstado,
      "La descripción es obligatoria.",
      "error",
    );
    return;
  }

  crearItem(
    datos,
    function () {
      formItem.reset();
      mostrarMensajeEstado(
        mensajeEstado,
        "Ítem agregado correctamente.",
        "exito",
      );
      cargarItemsSprintActual();
    },
    function (errorMsg) {
      mostrarMensajeEstado(mensajeEstado, errorMsg, "error");
    },
  );
}

function manejarCambioCumplimiento(itemId, cumplida) {
  actualizarCumplimientoItem(
    itemId,
    cumplida,
    function () {
      mostrarMensajeEstado(mensajeEstado, "Cumplimiento actualizado.", "exito");
      cargarItemsSprintActual();
      cargarSprintAnterior();
    },
    function (errorMsg) {
      mostrarMensajeEstado(mensajeEstado, errorMsg, "error");
    },
  );
}

function confirmarEliminarItem(itemId) {
  const confirmado = confirm("¿Seguro que deseas eliminar este ítem?");
  if (!confirmado) {
    return;
  }

  eliminarItem(
    itemId,
    function () {
      mostrarMensajeEstado(
        mensajeEstado,
        "Ítem eliminado correctamente.",
        "exito",
      );
      cargarItemsSprintActual();
    },
    function (errorMsg) {
      mostrarMensajeEstado(mensajeEstado, errorMsg, "error");
    },
  );
}

document.addEventListener("DOMContentLoaded", inicializarDetalle);
formItem.addEventListener("submit", manejarAgregarItem);
