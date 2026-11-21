<?php

namespace App\Presentation\Repositories;

use App\Controllers\RetroItemsController;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class RetroItemsRepository
{
    private RetroItemsController $controller;

    public function __construct()
    {
        $this->controller = new RetroItemsController();
    }

    public function obtenerPorSprint(Request $request, Response $response, array $args): Response
    {
        $sprintId = (int) $args['id'];
        $items = $this->controller->obtenerPorSprint($sprintId);

        if ($items->isEmpty()) {
            return $response->withStatus(204);
        }

        return $this->responderJson($response, $items, 200);
    }

    public function crear(Request $request, Response $response): Response
    {
        try {
            $datos = $this->leerBodyJson($request);
            $item = $this->controller->crear($datos);

            return $this->responderJson($response, $item, 201);
        } catch (Exception $e) {
            $codigo = $e->getCode() ?: 400;
            return $this->responderJson($response, ['error' => $e->getMessage()], $codigo);
        }
    }

    public function eliminar(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $this->controller->eliminar($id);

            return $this->responderJson($response, ['mensaje' => 'Ítem eliminado correctamente.'], 200);
        } catch (Exception $e) {
            $codigo = $e->getCode() ?: 404;
            return $this->responderJson($response, ['error' => $e->getMessage()], $codigo);
        }
    }

    public function actualizarCumplimiento(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $datos = $this->leerBodyJson($request);
            $item = $this->controller->actualizarCumplimiento($id, $datos);

            return $this->responderJson($response, $item, 200);
        } catch (Exception $e) {
            $codigo = $e->getCode() ?: 400;
            return $this->responderJson($response, ['error' => $e->getMessage()], $codigo);
        }
    }

    public function obtenerResumen(Request $request, Response $response): Response
    {
        $resumen = $this->controller->obtenerResumen();

        return $this->responderJson($response, $resumen, 200);
    }

    private function leerBodyJson(Request $request): array
    {
        $contenido = (string) $request->getBody();
        $datos = json_decode($contenido, true);

        return is_array($datos) ? $datos : [];
    }

    private function responderJson(Response $response, $datos, int $codigo): Response
    {
        $response->getBody()->write(json_encode($datos, JSON_UNESCAPED_UNICODE));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($codigo);
    }
}