<?php

$app->get('/v1/{%url_suffix%}', function() use ($app) {

    $results = {%Model%}::get();

    $message = $results->count() . ' results';
    return helpers::jsonResponse(false, $message, 0, $results );

});

$app->post('/v1/{%url_suffix%}', function() use ($app) {

    $request = \Slim\Slim::getInstance()->request();
    ${%object%}_rq = (array) json_decode($request->getBody());

    $new{%ModelSingular%} = new {%Model%}();
    ${%object%} = $new{%ModelSingular%}->create(${%object%}_rq);

    if(${%object%}){
        return  helpers::jsonResponse(false, '{%ModelSingular%} created', 0, array('id' => ${%object%}->id));
    }else{
        return  helpers::jsonResponse(true, '{%ModelSingular%} creation failed', 0);
    }

});

$app->get('/v1/{%url_suffix%}/:id', function($id) use ($app) {

    ${%object%} = {%Model%}::find($id);
{%returnFiles%}

    if(!empty(${%object%})){
        return  helpers::jsonResponse(false, '{%ModelSingular%} found', 1, ${%object%});
    }else{
        return  helpers::jsonResponse(true, '{%ModelSingular%} not found', 0);
    }

});

$app->put('/v1/{%url_suffix%}/:id', function($id) use ($app) {

    $request = \Slim\Slim::getInstance()->request();
    ${%object%}_rq = (array) json_decode($request->getBody());

    ${%object%} = {%Model%}::find($id);

    if(${%object%}->update(${%object%}_rq)){
        return  helpers::jsonResponse(false, '{%ModelSingular%} saved', 0, array('id' => ${%object%}->id));
    }else{
        return  helpers::jsonResponse(true, '{%ModelSingular%}: fail when saving', 0);
    }

});

$app->delete('/v1/{%url_suffix%}/:id', function($id) use ($app) {

    ${%object%} = {%Model%}::find($id);

    if(!empty(${%object%})){

        if(${%object%}->delete()){
            return  helpers::jsonResponse(false, '{%ModelSingular%} deleted', 1);
        }else{
            return  helpers::jsonResponse(true, '{%ModelSingular%} not deleted', 0);
        }

    }else{
        return  helpers::jsonResponse(true, '{%ModelSingular%} not found to delete', 0);
    }

});

$app->post('/v1/{%url_suffix%}/:id/upload/:field_name', function($id, $fieldName) use ($app) {

    $directory = UPLOAD_DIR . '/{%url_suffix%}/';

    ${%object%} = {%Model%}::find($id);

    if(!empty(${%object%}->$fieldName)){
        $actualFile = Files::find(${%object%}->$fieldName);
    }else{
        $actualFile = new Files();
        $actualFile->name = '';
    }
    
    $fileSaved = $actualFile->saveNewFile($directory);
    
    if($fileSaved){
        $actualFile->save();
        ${%object%}->$fieldName = $actualFile->id;
    }

    if(${%object%}->save()){
        return  helpers::jsonResponse(false, '{%ModelSingular%} file saved', 0);
    }else{
        return  helpers::jsonResponse(true, 'Fail when saving file', 0);
    }

});