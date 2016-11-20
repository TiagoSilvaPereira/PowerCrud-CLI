<?php

$app->get('/v1/posts', function() use ($app) {

  $results = Posts::get();

  $message = $results->count() . ' results';
  return helpers::jsonResponse(false, $message, 0, $results );

});

$app->post('/v1/posts', function() use ($app) {

  $request = \Slim\Slim::getInstance()->request();
  $post_rq = json_decode($request->getBody());

  $post = new Posts();

  if($post->create($post_rq)){
    return  helpers::jsonResponse(false, 'Posts created', 0, array('id' => $post->id));
  }else{
    return  helpers::jsonResponse(true, 'Posts creation failed', 0);
  }

});

$app->get('/v1/posts/:id', function($id) use ($app) {

  $post = Posts::find($id);

  if(!empty($post)){
    return  helpers::jsonResponse(false, 'found', 1, $post);
  }else{
    return  helpers::jsonResponse(true, 'not found', 0);
  }

});

$app->put('/v1/posts/:id', function($id) use ($app) {

  $request = \Slim\Slim::getInstance()->request();
  $post_rq = json_decode($request->getBody());

  $post = Posts::find($id);

 if($post->save($post_rq)){
    return  helpers::jsonResponse(false, 'Posts saved', 0, array('id' => $post->id));
  }else{
    return  helpers::jsonResponse(true, 'Posts save failed', 0);
  }

});

$app->delete('/v1/posts/:id', function($id) use ($app) {

  $post = Posts::find($id);

  if(!empty($post)){

    if($post->delete()){
      return  helpers::jsonResponse(false, 'Posts deleted', 1);
    }else{
      return  helpers::jsonResponse(true, 'Posts not deleted', 0);
    }

  }else{
    return  helpers::jsonResponse(true, 'Posts not found to delete', 0);
  }

});