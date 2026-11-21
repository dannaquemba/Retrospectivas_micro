<?php

declare(strict_types=1);

use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../app/Base/database.php';
$app = AppFactory::create();
$app->addRoutingMiddleware();

$app->addErrorMiddleware(true, true, true);

require __DIR__ . '/../app/Base/cors.php';

require __DIR__ . '/../app/Presentation/Routers/endpoints.php';

$app->run();