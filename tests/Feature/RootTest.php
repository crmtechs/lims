<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('unauthenticated user visiting root is redirected to login', function ()
{
    $response = $this->get('/');

    $response->assertRedirect(route('login'));
});

test('authenticated user visiting root is redirected to dashboard', function ()
{
    $user = createTestUser();

    $response = $this->actingAs($user)->get('/');

    $response->assertRedirect(route('dashboard'));
});
