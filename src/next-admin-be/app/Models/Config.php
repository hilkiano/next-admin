<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Config extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'configs';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'value',
        'type',
        'description',
    ];
}
