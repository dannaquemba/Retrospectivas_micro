<?php

/** @var \Slim\App $app */

use App\Presentation\Repositories\RetroItemsRepository;
use Slim\Routing\RouteCollectorProxy;

$app->group('/items', function (RouteCollectorProxy $group) {
    $group->get('/resumen', [RetroItemsRepository::class, 'obtenerResumen']);
    $group->post('', [RetroItemsRepository::class, 'crear']);
    $group->delete('/{id}', [RetroItemsRepository::class, 'eliminar']);
    $group->put('/{id}/cumplimiento', [RetroItemsRepository::class, 'actualizarCumplimiento']);
});

$app->group('/sprints', function (RouteCollectorProxy $group) {
    $group->get('/{id}/items', [RetroItemsRepository::class, 'obtenerPorSprint']);
});