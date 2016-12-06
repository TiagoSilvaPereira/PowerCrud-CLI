<?php

$app->get('/v1/categories', function() use ($app) {

  $results = Categories::get();

  $message = $results->count() . ' results';
  return helpers::jsonResponse(false, $message, 0, $results );

});

$app->post('/v1/categories', function() use ($app) {

  $request = \Slim\Slim::getInstance()->request();
  $category_rq = (array) json_decode($request->getBody());

  $category = new Categories();

  if($category->create($category_rq)){
    return  helpers::jsonResponse(false, 'Categories created', 0, array('id' => $category->id));
  }else{
    return  helpers::jsonResponse(true, 'Categories creation failed', 0);
  }

});

$app->get('/v1/categories/:id', function($id) use ($app) {

  $category = Categories::find($id);

  if(!empty($category)){
    return  helpers::jsonResponse(false, 'found', 1, $category);
  }else{
    return  helpers::jsonResponse(true, 'not found', 0);
  }

});

$app->put('/v1/categories/:id', function($id) use ($app) {

  $request = \Slim\Slim::getInstance()->request();
  $category_rq = (array) json_decode($request->getBody());

  $category = Categories::find($id);

  if($category->update($category_rq)){
    return  helpers::jsonResponse(false, 'Categories saved', 0, array('id' => $category->id));
  }else{
    return  helpers::jsonResponse(true, 'Categories save failed', 0);
  }

});

$app->delete('/v1/categories/:id', function($id) use ($app) {

  $category = Categories::find($id);

  if(!empty($category)){

    if($category->delete()){
      return  helpers::jsonResponse(false, 'Categories deleted', 1);
    }else{
      return  helpers::jsonResponse(true, 'Categories not deleted', 0);
    }

  }else{
    return  helpers::jsonResponse(true, 'Categories not found to delete', 0);
  }

});