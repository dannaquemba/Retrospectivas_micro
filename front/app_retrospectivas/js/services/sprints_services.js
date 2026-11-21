// Hace fetch con un tiempo máximo y mensajes claros si el servidor no responde.
// Las dos services usan esta función (items_services.js se carga después de este archivo).
const TIEMPO_MAXIMO_MS = 8000;

function pedir(url, opciones) {
  const control = new AbortController();
  const reloj = setTimeout(function () {
    control.abort();
  }, TIEMPO_MAXIMO_MS);

  return fetch(url, Object.assign({}, opciones, { signal: control.signal }))
    .catch(function (error) {
      const puerto = new URL(url).port;
      if (error.name === "AbortError") {
        throw new Error(
          `El servicio del puerto ${puerto} tardó demasiado en responder.`,
        );
      }
      throw new Error(
        `No se pudo conectar con el servicio del puerto ${puerto}. ¿Está encendido?`,
      );
    })
    .finally(function () {
      clearTimeout(reloj);
    });
}

// Lee el JSON de una respuesta; si el servidor mandó otra cosa (ej. una página de error), devuelve {}
function leerJson(respuesta) {
  return respuesta.json().catch(function () {
    return {};
  });
}

// URL base del microservicio de sprints
const URL_SPRINTS_MS = "http://127.0.0.1:8081";

/**
 * Obtiene la lista completa de sprints (GET /sprints).
 */
function obtenerSprints(onSuccess, onError) {
  pedir(`${URL_SPRINTS_MS}/sprints`)
    .then(function (respuesta) {
      // Si el servidor responde 204 No Content, no hay cuerpo JSON que leer
      if (respuesta.status === 204) {
        return [];
      }
      if (!respuesta.ok) {
        return leerJson(respuesta).then(function (err) {
          throw new Error(err.error || "Error al obtener los sprints.");
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

/**
 * Obtiene un sprint específico por su ID (GET /sprints/{id}).
 */
function obtenerSprintPorId(id, onSuccess, onError) {
  pedir(`${URL_SPRINTS_MS}/sprints/${id}`)
    .then(function (respuesta) {
      if (!respuesta.ok) {
        return leerJson(respuesta).then(function (err) {
          throw new Error(err.error || "No se encontró el sprint.");
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

/**
 * Crea un nuevo sprint (POST /sprints).
 */
function crearSprint(datosSprint, onSuccess, onError) {
  pedir(`${URL_SPRINTS_MS}/sprints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosSprint),
  })
    .then(function (respuesta) {
      return leerJson(respuesta).then(function (data) {
        if (!respuesta.ok) {
          throw new Error(data.error || "Error al crear el sprint.");
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

/**
 * Actualiza un sprint existente (PUT /sprints/{id}).
 */
function actualizarSprint(id, datosSprint, onSuccess, onError) {
  pedir(`${URL_SPRINTS_MS}/sprints/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosSprint),
  })
    .then(function (respuesta) {
      return leerJson(respuesta).then(function (data) {
        if (!respuesta.ok) {
          throw new Error(data.error || "Error al actualizar el sprint.");
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

/**
 * Elimina un sprint por su ID (DELETE /sprints/{id}).
 */
function eliminarSprint(id, onSuccess, onError) {
  pedir(`${URL_SPRINTS_MS}/sprints/${id}`, {
    method: "DELETE",
  })
    .then(function (respuesta) {
      return leerJson(respuesta).then(function (data) {
        if (!respuesta.ok) {
          throw new Error(data.error || "Error al eliminar el sprint.");
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
