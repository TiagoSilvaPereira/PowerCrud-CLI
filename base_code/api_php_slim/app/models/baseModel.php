<?php

use Illuminate\Database\Eloquent\Model;

class {%Model%} extends Model
{
    protected $table = '{%table%}';
    protected $fillable = [
        {%fields%}
    ];
}