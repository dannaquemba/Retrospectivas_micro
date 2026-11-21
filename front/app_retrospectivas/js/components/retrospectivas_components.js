function calcularEstadoSprint(acciones, accionesCumplidas) {
  if (acciones === 0 || accionesCumplidas === 0) {
    return "Pendientes";
  }
  if (accionesCumplidas >= acciones) {
    return "Completadas";
  }
  return "En progreso";
}

function obtenerClaseEstado(estado) {
  if (estado === "Completadas") {
    return "estado-completadas";
  }
  if (estado === "En progreso") {
    return "estado-progreso";
  }
  return "estado-pendientes";
}

function crearFilaSprint(sprint, resumenSprint, alEditar, alEliminar) {
  const fila = document.createElement("tr");

  const logros = resumenSprint ? resumenSprint.logros : 0;
  const impedimentos = resumenSprint ? resumenSprint.impedimentos : 0;
  const acciones = resumenSprint ? resumenSprint.acciones : 0;
  const accionesCumplidas = resumenSprint
    ? resumenSprint.acciones_cumplidas
    : 0;
  const estado = calcularEstadoSprint(acciones, accionesCumplidas);

  // Columna Nombre (píldora lila)
  const tdNombre = document.createElement("td");
  const spanNombre = document.createElement("span");
  spanNombre.className = "badge-pill badge-sprint";
  spanNombre.textContent = sprint.nombre;
  tdNombre.appendChild(spanNombre);

  // Columna Fechas
  const tdFechas = document.createElement("td");
  tdFechas.textContent = `${sprint.fecha_inicio}  –  ${sprint.fecha_fin}`;

  // Columna Logros
  const tdLogros = document.createElement("td");
  const spanLogros = document.createElement("span");
  spanLogros.className = "badge-pill badge-logros";
  spanLogros.textContent = `☆ ${logros}`;
  tdLogros.appendChild(spanLogros);

  // Columna Impedimentos
  const tdImpedimentos = document.createElement("td");
  const spanImp = document.createElement("span");
  spanImp.className = "badge-pill badge-impedimentos";
  spanImp.textContent = `❗ ${impedimentos}`;
  tdImpedimentos.appendChild(spanImp);

  // Columna Acciones (conteo)
  const tdAcciones = document.createElement("td");
  const spanAcc = document.createElement("span");
  spanAcc.className = "badge-pill badge-acciones";
  spanAcc.textContent = `✓ ${acciones}`;
  tdAcciones.appendChild(spanAcc);

  // Columna Estado
  const tdEstado = document.createElement("td");
  const spanEstado = document.createElement("span");
  spanEstado.className = `badge-pill ${obtenerClaseEstado(estado)}`;
  spanEstado.textContent = `● ${estado}`;
  tdEstado.appendChild(spanEstado);

  // Columna Botones (Ver, Editar, Eliminar)
  const tdBotones = document.createElement("td");
  const grupoBotones = document.createElement("div");
  grupoBotones.className = "grupo-acciones-fila";

  const btnVer = document.createElement("a");
  btnVer.href = `detalle.html?id=${encodeURIComponent(sprint.id)}`;
  btnVer.textContent = "👁";
  btnVer.title = "Ver detalle";
  btnVer.setAttribute("aria-label", "Ver detalle");
  btnVer.className = "btn-icono";

  const btnEditar = document.createElement("button");
  btnEditar.type = "button";
  btnEditar.textContent = "✎";
  btnEditar.title = "Editar sprint";
  btnEditar.setAttribute("aria-label", "Editar sprint");
  btnEditar.className = "btn-icono";
  btnEditar.addEventListener("click", function () {
    alEditar(sprint);
  });

  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.textContent = "🗑";
  btnEliminar.title = "Eliminar sprint";
  btnEliminar.setAttribute("aria-label", "Eliminar sprint");
  btnEliminar.className = "btn-icono btn-eliminar";
  btnEliminar.addEventListener("click", function () {
    alEliminar(sprint);
  });

  grupoBotones.appendChild(btnVer);
  grupoBotones.appendChild(btnEditar);
  grupoBotones.appendChild(btnEliminar);
  tdBotones.appendChild(grupoBotones);

  fila.appendChild(tdNombre);
  fila.appendChild(tdFechas);
  fila.appendChild(tdLogros);
  fila.appendChild(tdImpedimentos);
  fila.appendChild(tdAcciones);
  fila.appendChild(tdEstado);
  fila.appendChild(tdBotones);

  return fila;
}

function crearTarjetaItem(item, alCambiarCumplimiento, alEliminarItem) {
  const li = document.createElement("li");
  li.className = "item-tarjeta";

  const contenedorTexto = document.createElement("div");

  if (item.categoria === "accion") {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(item.cumplida);

    checkbox.addEventListener("change", function () {
      alCambiarCumplimiento(item.id, checkbox.checked);
    });

    const spanTexto = document.createElement("span");
    spanTexto.textContent = ` ${item.descripcion}`;
    if (item.cumplida) {
      spanTexto.style.textDecoration = "line-through";
    }

    label.appendChild(checkbox);
    label.appendChild(spanTexto);
    contenedorTexto.appendChild(label);
  } else {
    const pDescripcion = document.createElement("p");
    pDescripcion.textContent = item.descripcion;
    contenedorTexto.appendChild(pDescripcion);
  }

  if (item.fecha_revision) {
    const smallFecha = document.createElement("small");
    smallFecha.textContent = `Revisión: ${item.fecha_revision}`;
    contenedorTexto.appendChild(smallFecha);
  }

  li.appendChild(contenedorTexto);

  if (alEliminarItem) {
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "🗑";
    btnEliminar.title = "Eliminar ítem";
    btnEliminar.setAttribute("aria-label", "Eliminar ítem");
    btnEliminar.className = "btn-icono btn-eliminar";
    btnEliminar.addEventListener("click", function () {
      alEliminarItem(item.id);
    });
    li.appendChild(btnEliminar);
  }

  return li;
}

function mostrarMensajeEstado(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className =
    "mensaje-estado " + (tipo === "error" ? "mensaje-error" : "mensaje-exito");
}
