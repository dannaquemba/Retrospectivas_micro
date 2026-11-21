<?php
/** @var \Slim\App $app */

use App\Presentation\Repositories\SprintsRepository;
use Slim\Routing\RouteCollectorProxy;

$app->group('/sprints', function (RouteCollectorProxy $group) {
    $group->get('', [SprintsRepository::class, 'obtenerTodos']);
    $group->get('/{id}', [SprintsRepository::class, 'obtenerPorId']);
    $group->post('', [SprintsRepository::class, 'crear']);
    $group->put('/{id}', [SprintsRepository::class, 'actualizar']);
    $group->delete('/{id}', [SprintsRepository::class, 'eliminar']);
});