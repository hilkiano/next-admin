<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupRole extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'group_role_mapping';

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
        'group_id',
        'role_id',
    ];

    public function group() {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }

    public function role() {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }
}
