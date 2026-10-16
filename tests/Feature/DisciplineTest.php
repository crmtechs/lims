<?php

use App\Models\Discipline;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('guests are redirected to login when visiting disciplines', function ()
{
    $response = $this->get(route('core.disciplines.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated user can view disciplines index page', function ()
{
    $user = createTestUser();
    $response = $this->actingAs($user)->get(route('core.disciplines.index'));

    $response->assertStatus(200);
    $response->assertViewHas('title', 'Disciplines');
    $response->assertViewHas('breadcrumbs');
    $response->assertSee('Disciplines');
    $response->assertSee('Add Discipline');
    $response->assertSee('Delete this discipline?');
    $response->assertSee('Are you sure you want to delete this discipline');
});

test('authenticated user can fetch disciplines data via ajax', function ()
{
    $user = createTestUser();
    Discipline::create([
        'discipline' => 'Electrical Calibration',
        'short_name' => 'ELC',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->postJson(route('core.disciplines.data'), [
        'draw' => 1,
        'start' => 0,
        'length' => 10,
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'draw',
        'recordsTotal',
        'recordsFiltered',
        'data',
    ]);
    $response->assertSee('Electrical Calibration');
});

test('authenticated user can view create discipline page', function ()
{
    $user = createTestUser();
    $response = $this->actingAs($user)->get(route('core.disciplines.create'));

    $response->assertStatus(200);
    $response->assertViewHas('title', 'Core : Discipline : Create');
    $response->assertViewHas('breadcrumbs');
    $response->assertSee('LIMS : Core : Discipline : Create');
    $response->assertSee('Create Discipline');
    $response->assertSee('Create new calibration discipline');
    $response->assertSee('Save');
    $response->assertSee('Cancel');
    $response->assertSee('Core');
    $response->assertSee('<a class="flex items-center text-gray-600 hover:text-primary" href="'.route('core.disciplines.index').'">', false);
    $response->assertSee('icon-chevron-right', false);
    $response->assertSee('Create');
    $response->assertSee('placeholder="Thermal"', false);
    $response->assertSee('placeholder="TH"', false);
    $response->assertSee('Basic');
    $response->assertDontSee('Discipline Details');

    // Verify sidebar: Core menu is open and Discipline menu is selected
    $response->assertSee('<li class="has-submenu is-open" data-open="true">'."\n".'                <button type="button" class="sidebar-link w-full" data-submenu-toggle>'."\n".'                    <i class="icon-cpu text-[16px]"></i>'."\n".'                    <span class="sidebar-label">Core</span>', false);
    $response->assertSee('href="'.route('core.disciplines.index').'" class="sidebar-link !text-[12.5px] is-active"', false);
});

test('authenticated user can store a valid discipline', function ()
{
    $user = createTestUser();

    $response = $this->actingAs($user)->postJson(route('core.disciplines.store'), [
        'discipline' => 'Thermal',
        'short_name' => 'TH',
        'status' => 'active',
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'status' => 'success',
        'message' => 'Discipline created successfully.',
    ]);

    $discipline = Discipline::where('discipline', 'Thermal')->first();
    expect($discipline)->not->toBeNull();
    expect($discipline->short_name)->toBe('TH');
    expect($discipline->status)->toBe('active');
});

test('discipline validation fails on invalid data', function ()
{
    $user = createTestUser();

    $response = $this->actingAs($user)->postJson(route('core.disciplines.store'), [
        'discipline' => '',
        'short_name' => '',
        'status' => 'invalid-status',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['discipline', 'short_name', 'status']);
    expect($response->json('errors.short_name'))->toBe('Short name is required.');
});

test('discipline validation fails when short_name exceeds maximum length', function ()
{
    $user = createTestUser();

    $response = $this->actingAs($user)->postJson(route('core.disciplines.store'), [
        'discipline' => 'Thermal',
        'short_name' => 'THRM',
        'status' => 'active',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['short_name']);
    expect($response->json('errors.short_name'))->toBe('Short name cannot exceed 3 characters.');
});

test('create discipline form highlights invalid fields with border-danger on validation failure', function ()
{
    $user = createTestUser();

    $response = $this->actingAs($user)
        ->from(route('core.disciplines.create'))
        ->followingRedirects()
        ->post(route('core.disciplines.store'), [
            'discipline' => '',
            'short_name' => '',
            'status' => 'active',
        ]);

    $response->assertStatus(200);
    $response->assertSee('id="discipline" name="discipline"', false);
    $response->assertSee('border-danger', false);
    $response->assertSee('Please review the form fields with errors below.', false);
    $response->assertSee('id="form-error-alert-close"', false);
    $response->assertDontSee('absolute inset-y-0 end-0');
});

test('discipline form error alert box has dismiss button and review message', function ()
{
    $user = createTestUser();

    $response = $this->actingAs($user)->get(route('core.disciplines.create'));
    $response->assertStatus(200);
    $response->assertSee('id="form-error-alert"', false);
    $response->assertSee('role="alert"', false);
    $response->assertSee('data-alert', false);
    $response->assertSee('data-alert-dismiss', false);
    $response->assertSee('id="form-error-alert-close"', false);
    $response->assertSee('alert-dismiss-btn', false);
    $response->assertSee('Please review the form fields with errors below.', false);
});

test('reusable alert component renders with dismiss button across any page', function ()
{
    $html = \Illuminate\Support\Facades\Blade::render('<x-alert type="danger" message="Test alert message" />');
    expect($html)->toContain('data-alert');
    expect($html)->toContain('role="alert"');
    expect($html)->toContain('data-alert-dismiss');
    expect($html)->toContain('alert-dismiss-btn');
    expect($html)->toContain('Test alert message');
});

test('authenticated user can view show and edit pages', function ()
{
    $user = createTestUser();
    $discipline = Discipline::create([
        'discipline' => 'Optics',
        'short_name' => 'OPT',
        'status' => 'active',
    ]);

    $showResponse = $this->actingAs($user)->get(route('core.disciplines.show', $discipline->uuid));
    $showResponse->assertStatus(200);
    $showResponse->assertViewHas('title', 'Discipline: ' . $discipline->discipline);
    $showResponse->assertSee('Optics');
    $showResponse->assertSee('OPT');
    $showResponse->assertSee('Short Name');
    $showResponse->assertSee('Basic');
    $showResponse->assertDontSee('Discipline Information');
    $showResponse->assertSee('Delete this discipline?');
    $showResponse->assertSee('Are you sure you want to delete this discipline');
    $showResponse->assertSee('Cancel');
    $showResponse->assertSee('Delete');
    $showResponse->assertDontSee('Keep Active');
    $showResponse->assertDontSee('Delete Discipline');

    $editResponse = $this->actingAs($user)->get(route('core.disciplines.edit', $discipline->uuid));
    $editResponse->assertStatus(200);
    $editResponse->assertViewHas('title', 'Edit Discipline');
    $editResponse->assertSee('Edit Discipline');
    $editResponse->assertSee('OPT');
    $editResponse->assertSee('Basic');
    $editResponse->assertDontSee('Discipline Details');
    $editResponse->assertSee('Save');
    $editResponse->assertSee('Cancel');
});

test('authenticated user can update a discipline', function ()
{
    $user = createTestUser();
    $discipline = Discipline::create([
        'discipline' => 'Acoustics',
        'short_name' => 'AC',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->postJson(route('core.disciplines.update', $discipline->uuid), [
        'discipline' => 'Acoustics & Vibration',
        'short_name' => 'VIB',
        'status' => 'inactive',
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'status' => 'success',
        'message' => 'Discipline updated successfully.',
    ]);

    $discipline->refresh();
    expect($discipline->discipline)->toBe('Acoustics & Vibration');
    expect($discipline->short_name)->toBe('VIB');
    expect($discipline->status)->toBe('inactive');
});

test('authenticated user can soft-delete a discipline', function ()
{
    $user = createTestUser();
    $discipline = Discipline::create([
        'discipline' => 'Fluid Flow',
        'short_name' => 'FLD',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->postJson(route('core.disciplines.delete', $discipline->uuid));
    $response->assertStatus(204);

    expect(Discipline::find($discipline->uuid))->toBeNull();
    expect(Discipline::withTrashed()->find($discipline->uuid)->trashed())->toBeTrue();
});

test('discipline validation fails when discipline or short_name is duplicate on create', function ()
{
    $user = createTestUser();
    Discipline::create([
        'discipline' => 'Mechanical',
        'short_name' => 'MEC',
        'status' => 'active',
    ]);

    // Duplicate discipline
    $response = $this->actingAs($user)->postJson(route('core.disciplines.store'), [
        'discipline' => 'Mechanical',
        'short_name' => 'MC2',
        'status' => 'active',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['discipline']);
    expect($response->json('errors.discipline'))->toBe('Discipline already exists.');

    // Duplicate short_name
    $response = $this->actingAs($user)->postJson(route('core.disciplines.store'), [
        'discipline' => 'Mechanical Secondary',
        'short_name' => 'MEC',
        'status' => 'active',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['short_name']);
    expect($response->json('errors.short_name'))->toBe('Short name already exists.');
});

test('authenticated user can update discipline keeping own discipline and short_name', function ()
{
    $user = createTestUser();
    $discipline = Discipline::create([
        'discipline' => 'Pressure',
        'short_name' => 'PRS',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->postJson(route('core.disciplines.update', $discipline->uuid), [
        'discipline' => 'Pressure',
        'short_name' => 'PRS',
        'status' => 'inactive',
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'status' => 'success',
        'message' => 'Discipline updated successfully.',
    ]);

    $discipline->refresh();
    expect($discipline->status)->toBe('inactive');
});

test('discipline validation fails when updating to another existing discipline or short_name', function ()
{
    $user = createTestUser();
    $discipline1 = Discipline::create([
        'discipline' => 'Dimensions',
        'short_name' => 'DIM',
        'status' => 'active',
    ]);
    $discipline2 = Discipline::create([
        'discipline' => 'Electro-Technical',
        'short_name' => 'ELT',
        'status' => 'active',
    ]);

    // Try updating discipline2 to discipline1's name
    $response = $this->actingAs($user)->postJson(route('core.disciplines.update', $discipline2->uuid), [
        'discipline' => 'Dimensions',
        'short_name' => 'EL2',
        'status' => 'active',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['discipline']);
    expect($response->json('errors.discipline'))->toBe('Discipline already exists.');

    // Try updating discipline2 to discipline1's short_name
    $response = $this->actingAs($user)->postJson(route('core.disciplines.update', $discipline2->uuid), [
        'discipline' => 'Electro-Technical Secondary',
        'short_name' => 'DIM',
        'status' => 'active',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['short_name']);
    expect($response->json('errors.short_name'))->toBe('Short name already exists.');
});

test('duplicate validation ignores soft-deleted disciplines on create and edit', function ()
{
    $user = createTestUser();
    $deletedDiscipline = Discipline::create([
        'discipline' => 'Radiological',
        'short_name' => 'RAD',
        'status' => 'active',
    ]);
    $deletedDiscipline->delete();

    // Create should succeed with same discipline and short_name
    $createResponse = $this->actingAs($user)->postJson(route('core.disciplines.store'), [
        'discipline' => 'Radiological',
        'short_name' => 'RAD',
        'status' => 'active',
    ]);
    $createResponse->assertStatus(200);

    // Create another discipline to test updating to soft-deleted name
    $anotherDiscipline = Discipline::create([
        'discipline' => 'Chemical',
        'short_name' => 'CHM',
        'status' => 'active',
    ]);
    $anotherDiscipline->delete();

    $activeDiscipline = Discipline::create([
        'discipline' => 'Biological',
        'short_name' => 'BIO',
        'status' => 'active',
    ]);

    $updateResponse = $this->actingAs($user)->postJson(route('core.disciplines.update', $activeDiscipline->uuid), [
        'discipline' => 'Chemical',
        'short_name' => 'CHM',
        'status' => 'active',
    ]);
    $updateResponse->assertStatus(200);
});
