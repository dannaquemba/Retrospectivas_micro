const URL_ITEMS_MS = "http://127.0.0.1:8082";

function obtenerItemsPorSprint(sprintId, onSuccess, onError) {
  pedir(`${URL_ITEMS_MS}/sprints/${sprintId}/items`)
    .then(function (respuesta) {
      if (respuesta.status === 204) {
        return [];
      }
      if (!respuesta.ok) {
        return leerJson(respuesta).then(function (err) {
          throw new Error(err.error || "Error al obtener los ítems.");
        });
      }
      return leerJson(respuesta);
    })
    .then(function (datos) {
      onSuccess(datos);
    })
    .catch(function (error) {
      onError(error.message);
    });
}

function crearItem(datosItem, onSuccess, onError) {
  pedir(`${URL_ITEMS_MS}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosItem),
  })
    .then(function (respuesta) {
      return leerJson(respuesta).then(function (data) {
        if (!respuesta.ok) {
          throw new Error(data.error || "Error al crear el ítem.");
        }
        return data;
      });
    })
    .then(function (datos) {
      onSuccess(datos);
    })
    .catch(function (error) {
      onError(error.message);
    });
}

function eliminarItem(id, onSuccess, onError) {
  pedir(`${URL_ITEMS_MS}/items/${id}`, {
    method: "DELETE",
  })
    .then(function (respuesta) {
      return leerJson(respuesta).then(function (data) {
        if (!respuesta.ok) {
          throw new Error(data.error || "Error al eliminar el ítem.");
        }
        return data;
      });
    })
    .then(function (datos) {
      onSuccess(datos);
    })
    .catch(function (error) {
      onError(error.message);
    });
}

function actualizarCumplimientoItem(id, cumplida, onSuccess, onError) {
  pedir(`${URL_ITEMS_MS}/items/${id}/cumplimiento`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cumplida: cumplida }),
  })
    .then(function (respuesta) {
      return leerJson(respuesta).then(function (data) {
        if (!respuesta.ok) {
          throw new Error(data.error || "Error al actualizar el cumplimiento.");
        }
        return data;
      });
    })
    .then(function (datos) {
      onSuccess(datos);
    })
    .catch(function (error) {
      onError(error.message);
    });
}

function obtenerResumenItems(onSuccess, onError) {
  pedir(`${URL_ITEMS_MS}/items/resumen`)
    .then(function (respuesta) {
      if (!respuesta.ok) {
        return leerJson(respuesta).then(function (err) {
          throw new Error(err.error || "Error al obtener el resumen de ítems.");
        });
      }
      return leerJson(respuesta);
    })
    .then(function (datos) {
      onSuccess(datos);
    })
    .catch(function (error) {
      onError(error.message);
    });
}
