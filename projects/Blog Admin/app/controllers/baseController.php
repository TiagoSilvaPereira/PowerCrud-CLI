<?php

$app->get('/v1/{{url_suffix}}', function() use ($app) {

  $results = {{Model}}::get();

  $message = $results->count() . ' results';
  return helpers::jsonResponse(false, $message, 0, $results );

});

$app->post('/v1/{{url_suffix}}', function() use ($app) {

  $request = \Slim\Slim::getInstance()->request();
  ${{object}}_rq = (array) json_decode($request->getBody());

  ${{object}} = new {{Model}}();

  if(${{object}}->create(${{object}}_rq)){
    return  helpers::jsonResponse(false, '{{Model}} created', 0, array('id' => ${{object}}->id));
  }else{
    return  helpers::jsonResponse(true, '{{Model}} creation failed', 0);
  }

});

$app->get('/v1/{{url_suffix}}/:id', function($id) use ($app) {

  ${{object}} = {{Model}}::find($id);

  if(!empty(${{object}})){
    return  helpers::jsonResponse(false, 'found', 1, ${{object}});
  }else{
    return  helpers::jsonResponse(true, 'not found', 0);
  }

});

$app->put('/v1/{{url_suffix}}/:id', function($id) use ($app) {

  $request = \Slim\Slim::getInstance()->request();
  ${{object}}_rq = (array) json_decode($request->getBody());

  ${{object}} = {{Model}}::find($id);

  if(${{object}}->update(${{object}}_rq)){
    return  helpers::jsonResponse(false, '{{Model}} saved', 0, array('id' => ${{object}}->id));
  }else{
    return  helpers::jsonResponse(true, '{{Model}} save failed', 0);
  }

});

$app->delete('/v1/{{url_suffix}}/:id', function($id) use ($app) {

  ${{object}} = {{Model}}::find($id);

  if(!empty(${{object}})){

    if(${{object}}->delete()){
      return  helpers::jsonResponse(false, '{{Model}} deleted', 1);
    }else{
      return  helpers::jsonResponse(true, '{{Model}} not deleted', 0);
    }

  }else{
    return  helpers::jsonResponse(true, '{{Model}} not found to delete', 0);
  }

});