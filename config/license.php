<?php

use Illuminate\Support\Carbon;

$fixed_date = "2030-12-31";
$allowed_users = [
    '1'
];

return [
    'valid_until' => Carbon::parse(env('LICENSE_VALID_UNTIL', $fixed_date)),
    'allowed_users' => $allowed_users
];
