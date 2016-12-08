<?php

// Seta o timezone padrão
date_default_timezone_set('America/Sao_Paulo');

// Define o diretório dos arquivos da aplicação
define("_APP", dirname(__FILE__) . '/app');

// Autoloader do composer, para carregar as classes necessárias
require 'vendor/autoload.php';


$app = new \Slim\Slim(array(
  'debug' => true
));

$corsOptions = array(
    "origin" => "*",
    "exposeHeaders" => array("Content-Type", "X-Requested-With", "X-authentication", "X-client"),
    "allowMethods" => array('GET', 'POST', 'PUT', 'DELETE', 'OPTIONS')
);

$cors = new \CorsSlim\CorsSlim($corsOptions);
$app->add($cors);

$app->response()->header('Content-Type', 'application/json;charset=utf-8');

require_once _APP . '/config/database.php';
require_once _APP . '/config/config.php';
require_once _APP . '/helpers/appHelpers.php';

// Models
{%require_models%}
require_once _APP . "/models/FilesModel.php";

// Controllers
{%require_controllers%}

# Raiz
$app->get('/', function () {
	echo json_encode("API - Generated with love by PowerCRUD");
});

$app->run();