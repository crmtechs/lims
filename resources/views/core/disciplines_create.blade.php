@extends('layouts.app')

@section('title', 'Core : Discipline : Create')

@section('breadcrumb', 'Create Discipline')

@section('breadcrumbs')
    <span class="text-[var(--text-tertiary)]">Core</span>
    <span class="text-[var(--text-tertiary)]">/</span>
    <a href="{{ route('core.disciplines.index') }}" class="text-[var(--color-primary-600)]">Disciplines</a>
    <span class="text-[var(--text-tertiary)]">/</span>
    <span class="text-[var(--text-tertiary)]">Create</span>
@endsection

@section('content')
<form action="{{ route('core.disciplines.store') }}" method="POST" id="discipline_create_form" class="flex flex-col flex-1">
    @csrf
    @include('core.disciplines_form')
</form>
@endsection

@push('scripts')
<script src="{{ asset('js/core/disciplines-create.js') }}?v={{ filemtime(public_path('js/core/disciplines-create.js')) }}"></script>
@endpush
