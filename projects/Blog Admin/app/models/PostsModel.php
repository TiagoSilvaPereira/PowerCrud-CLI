<?php

use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    protected $table = 'posts';
    protected $fillable = [
        'title','content','image'
    ];
}