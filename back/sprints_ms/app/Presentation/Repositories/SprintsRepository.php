<?php

namespace App\Presentation\Repositories;

use App\Controllers\SprintsController;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SprintsRepository
{
    private SprintsController $controller;

    public function __construct()
    {
        $this->controller = new SprintsController();
    }

    public function obtenerTodos(Request $request, Response $response): Response
    {
        $sprints = $this->controller->obtenerTodos();

        if ($sprints->isEmpty()) {
            return $response->withStatus(204);
        }

        return $this->responderJson($response, $sprints, 200);
    }

    public function obtenerPorId(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $sprint = $this->controller->obtenerPorId($id);

            return $this->responderJson($response, $sprint, 200);
        } catch (Exception $e) {
            $codigo = $e->getCode() ?: 404;
            return $this->responderJson($response, ['error' => $e->getMessage()], $codigo);
        }
    }

    public function crear(Request $request, Response $response): Response
    {
        try {
            $datos = $this->leerBodyJson($request);
            $sprint = $this->controller->crear($datos);

            return $this->responderJson($response, $sprint, 201);
        } catch (Exception $e) {
            $codigo = $e->getCode() ?: 400;
            return $this->responderJson($response, ['error' => $e->getMessage()], $codigo);
        }
    }

    public function actualizar(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) $args['id'];
            $datos = $this->leerBodyJson($request);
            $sprint = $this->controller->actualizar($id, $datos);

            return $this->responderJson($response, $sprint, 200);
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

            return $this->responderJson($response, ['mensaje' => 'Sprint eliminado correctamente.'], 200);
        } catch (Exception $e) {
            $codigo = $e->getCode() ?: 404;
            return $this->responderJson($response, ['error' => $e->getMessage()], $codigo);
        }
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