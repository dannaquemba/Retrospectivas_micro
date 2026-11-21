<?php

namespace App\Controllers;

use App\Models\RetroItem;
use Exception;
use Illuminate\Database\QueryException;

class RetroItemsController
{
    private const CATEGORIAS_VALIDAS = ['accion', 'logro', 'impedimento'];

    public function obtenerPorSprint(int $sprintId)
    {
        return RetroItem::where('sprint_id', $sprintId)
            ->orderBy('id', 'asc')
            ->get();
    }

    public function crear(array $datos): RetroItem
    {
        $sprintId = isset($datos['sprint_id']) ? (int) $datos['sprint_id'] : 0;
        $categoria = isset($datos['categoria']) ? trim((string) $datos['categoria']) : '';
        $descripcion = isset($datos['descripcion']) ? trim((string) $datos['descripcion']) : '';
        $fechaRevision = !empty($datos['fecha_revision']) ? trim((string) $datos['fecha_revision']) : null;

        if ($sprintId <= 0 || $categoria === '' || $descripcion === '') {
            throw new Exception('Los campos sprint_id, categoria y descripcion son obligatorios.', 400);
        }

        if (!in_array($categoria, self::CATEGORIAS_VALIDAS, true)) {
            throw new Exception('La categoría debe ser accion, logro o impedimento.', 400);
        }

        $cumplida = null;
        if ($categoria === 'accion') {
            $cumplida = isset($datos['cumplida']) ? (bool) $datos['cumplida'] : false;
        }

        try {
            return RetroItem::create([
                'sprint_id'      => $sprintId,
                'categoria'      => $categoria,
                'descripcion'    => $descripcion,
                'cumplida'       => $cumplida,
                'fecha_revision' => $fechaRevision
            ]);
        } catch (QueryException $e) {
        
            if ($e->getCode() === '23000') {
                throw new Exception('El sprint_id indicado no existe.', 400);
            }
            throw new Exception('Error al guardar el ítem en la base de datos.', 400);
        }
    }

    public function eliminar(int $id): void
    {
        $item = RetroItem::find($id);

        if (!$item) {
            throw new Exception('Ítem no encontrado.', 404);
        }

        $item->delete();
    }

    public function actualizarCumplimiento(int $id, array $datos): RetroItem
    {
        $item = RetroItem::find($id);

        if (!$item) {
            throw new Exception('Ítem no encontrado.', 404);
        }

        if ($item->categoria !== 'accion') {
            throw new Exception('Solo se puede marcar cumplimiento en ítems de categoría accion.', 400);
        }

        if (!array_key_exists('cumplida', $datos) || !is_bool($datos['cumplida'])) {
            throw new Exception('El campo cumplida es obligatorio y debe ser booleano (true o false).', 400);
        }

        $item->update([
            'cumplida' => $datos['cumplida']
        ]);

        return $item;
    }

    public function obtenerResumen(): array
    {
        $itemsAgrupados = RetroItem::all()->groupBy('sprint_id');
        $resumen = [];

        foreach ($itemsAgrupados as $sprintId => $items) {
            $logros = $items->where('categoria', 'logro')->count();
            $impedimentos = $items->where('categoria', 'impedimento')->count();
            $acciones = $items->where('categoria', 'accion')->count();
            $accionesCumplidas = $items->where('categoria', 'accion')
                ->where('cumplida', true)
                ->count();

            $resumen[] = [
                'sprint_id'          => (int) $sprintId,
                'logros'             => $logros,
                'impedimentos'       => $impedimentos,
                'acciones'           => $acciones,
                'acciones_cumplidas' => $accionesCumplidas
            ];
        }

        return $resumen;
    }
}