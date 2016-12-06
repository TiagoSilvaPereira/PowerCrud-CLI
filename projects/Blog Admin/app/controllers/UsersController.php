<?php

$app->get('/v1/users', function() use ($app) {

  $results = Users::get();

  $message = $results->count() . ' results';
  return helpers::jsonResponse(false, $message, 0, $results );

});

$app->post('/v1/users', function() use ($app) {

  $request = \Slim\Slim::getInstance()->request();
  $user_rq = (array) json_decode($request->getBody());

  $user = new Users();

  if($user->create($user_rq)){
    return  helpers::jsonResponse(false, 'Users created', 0, array('id' => $user->id));
  }else{
    return  helpers::jsonResponse(true, 'Users creation failed', 0);
  }

});

$app->get('/v1/users/:id', function($id) use ($app) {

  $user = Users::find($id);

  if(!empty($user)){
    return  helpers::jsonResponse(false, 'found', 1, $user);
  }else{
    return  helpers::jsonResponse(true, 'not found', 0);
  }

});

$app->put('/v1/users/:id', function($id) use ($app) {

  $request = \Slim\Slim::getInstance()->request();
  $user_rq = (array) json_decode($request->getBody());

  $user = Users::find($id);

  if($user->update($user_rq)){
    return  helpers::jsonResponse(false, 'Users saved', 0, array('id' => $user->id));
  }else{
    return  helpers::jsonResponse(true, 'Users save failed', 0);
  }

});

$app->delete('/v1/users/:id', function($id) use ($app) {

  $user = Users::find($id);

  if(!empty($user)){

    if($user->delete()){
      return  helpers::jsonResponse(false, 'Users deleted', 1);
    }else{
      return  helpers::jsonResponse(true, 'Users not deleted', 0);
    }

  }else{
    return  helpers::jsonResponse(true, 'Users not found to delete', 0);
  }

});