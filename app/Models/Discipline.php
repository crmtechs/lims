<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Discipline extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'disciplines';

    protected $primaryKey = 'uuid';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'discipline',
        'short_name',
        'status',
    ];

    public static function getDisciplinesForDropdown()
    {
        return self::where('status', 'active')
            ->orderBy('discipline')
            ->pluck('discipline', 'uuid');
    }
}
