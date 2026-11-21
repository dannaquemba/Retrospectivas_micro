<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RetroItem extends Model
{
    protected $table = 'retro_items';
    protected $fillable = [
        'sprint_id',
        'categoria',
        'descripcion',
        'cumplida',
        'fecha_revision'
    ];

    protected $casts = [
        'sprint_id' => 'integer',
        'cumplida'  => 'boolean'
    ];

    public $timestamps = true;
}