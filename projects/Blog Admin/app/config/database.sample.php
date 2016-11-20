<?php
// Database configuration
$settings = array(
  'driver'    => 'mysql',
  'host'      => 'localhost',
  'database'  => 'top_empresas',
  'username'  => 'root',
  'password'  => '',
  'charset'   => 'utf8',
  'collation' => 'utf8_general_ci',
  'prefix'    => ''
 );

use Illuminate\Database\Capsule\Manager as Capsule;
$capsule = new Capsule;
$capsule->addConnection( $settings );

use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
$capsule->setEventDispatcher(new Dispatcher(new Container));

// Make this Capsule instance available globally via static methods... (optional)
$capsule->setAsGlobal();

$capsule->bootEloquent();