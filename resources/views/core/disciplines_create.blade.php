@extends('layouts.app')

@section('content')
<form action="{{ route('core.disciplines.store') }}" method="POST" id="discipline_create_form" class="flex flex-col flex-1">
    @csrf
    @include('core.disciplines_form')
</form>
@endsection

@push('scripts')
<script src="{{ asset('js/core/disciplines-create.js') }}?v={{ filemtime(public_path('js/core/disciplines-create.js')) }}"></script>
@endpush
