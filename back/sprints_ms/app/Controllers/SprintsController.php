<?php

namespace App\Controllers;

use App\Models\Sprint;
use DateTime;
use Exception;

class SprintsController
{
    public function obtenerTodos()
    {
        return Sprint::orderBy('fecha_inicio', 'desc')
            ->orderBy('id', 'desc')
            ->get();
    }

    public function obtenerPorId(int $id): Sprint
    {
        $sprint = Sprint::find($id);

        if (!$sprint) {
            throw new Exception('Sprint no encontrado.', 404);
        }

        return $sprint;
    }

    public function crear(array $datos): Sprint
    {
        $datosValidados = $this->validarDatos($datos);

        return Sprint::create($datosValidados);
    }

    public function actualizar(int $id, array $datos): Sprint
    {
        $sprint = Sprint::find($id);

        if (!$sprint) {
            throw new Exception('Sprint no encontrado.', 404);
        }

        $datosValidados = $this->validarDatos($datos);
        $sprint->update($datosValidados);

        return $sprint;
    }

    public function eliminar(int $id): void
    {
        $sprint = Sprint::find($id);

        if (!$sprint) {
            throw new Exception('Sprint no encontrado.', 404);
        }

        $sprint->delete();
    }

    private function validarDatos(array $datos): array
    {
        $nombre = isset($datos['nombre']) ? trim((string) $datos['nombre']) : '';
        $fechaInicio = isset($datos['fecha_inicio']) ? trim((string) $datos['fecha_inicio']) : '';
        $fechaFin = isset($datos['fecha_fin']) ? trim((string) $datos['fecha_fin']) : '';

        if ($nombre === '' || $fechaInicio === '' || $fechaFin === '') {
            throw new Exception('El nombre, la fecha de inicio y la fecha de fin son obligatorios.', 400);
        }

        $inicioObj = DateTime::createFromFormat('Y-m-d', $fechaInicio);
        $finObj = DateTime::createFromFormat('Y-m-d', $fechaFin);

        if (
            !$inicioObj || $inicioObj->format('Y-m-d') !== $fechaInicio ||
            !$finObj || $finObj->format('Y-m-d') !== $fechaFin
        ) {
            throw new Exception('Las fechas deben tener el formato válido YYYY-MM-DD.', 400);
        }

        if ($finObj < $inicioObj) {
            throw new Exception('La fecha de fin no puede ser anterior a la fecha de inicio.', 400);
        }

        return [
            'nombre'       => $nombre,
            'fecha_inicio' => $fechaInicio,
            'fecha_fin'    => $fechaFin
        ];
    }
}