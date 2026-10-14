@extends('layouts.app')

@section('title', 'Edit Discipline')

@section('breadcrumb', 'Edit Discipline')

@section('breadcrumbs')
    <span class="text-[var(--text-tertiary)]">Core</span>
    <span class="text-[var(--text-tertiary)]">/</span>
    <a href="{{ route('core.disciplines.index') }}" class="text-[var(--color-primary-600)]">Disciplines</a>
    <span class="text-[var(--text-tertiary)]">/</span>
    <span class="text-[var(--text-tertiary)]">Edit</span>
@endsection

@section('content')
<form action="{{ route('core.disciplines.update', $data->uuid) }}" method="POST" id="discipline_edit_form" class="flex flex-col flex-1">
    @csrf
    @include('core.disciplines_form')
</form>
@endsection

@push('scripts')
<script src="{{ asset('js/core/disciplines-edit.js') }}?v={{ filemtime(public_path('js/core/disciplines-edit.js')) }}"></script>
@endpush
