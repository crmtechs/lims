@extends('layouts.app')

@section('content')
<form action="{{ route('core.disciplines.update', $data->uuid) }}" method="POST" id="discipline_edit_form" class="flex flex-col flex-1">
    @csrf
    @include('core.disciplines_form')
</form>
@endsection

@push('scripts')
<script src="{{ asset('js/core/disciplines-edit.js') }}?v={{ filemtime(public_path('js/core/disciplines-edit.js')) }}"></script>
@endpush
