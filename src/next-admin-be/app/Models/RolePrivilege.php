<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RolePrivilege extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'role_privilege_mapping';

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
        'role_id',
        'privilege_id',
    ];

    public function privilege() {
        return $this->belongsTo(Privilege::class, 'privilege_id', 'id');
    }
}
