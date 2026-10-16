@extends('layouts.app')

@section('content')
<main class="p-4 lg:p-6 space-y-4 max-w-full mx-auto w-full">

    <!-- ============ Hero (Toolbar) ============ -->
    <div class="surface-card !p-0 overflow-hidden">
        <div class="h-1 u-background-color-primary-500"></div>
        <div class="p-4 lg:p-5">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-3 min-w-0">
                    <span class="icon-chip is-primary size-10 shrink-0"><i class="icon-cpu text-[17px]"></i></span>
                    <div class="min-w-0">
                        <h1 class="font-display font-bold text-[17px] truncate">{{ $data->discipline }}</h1>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2 shrink-0">
                    <a href="{{ route('core.disciplines.edit', $data->uuid) }}" class="btn btn-primary !text-[12.5px]"><i class="icon-edit text-[13px]"></i>Edit</a>
                    <a href="javascript:void(0);" role="button" class="btn btn-error !text-[12.5px]" onclick="delete_discipline('{{ $data->uuid }}', '{{ addslashes($data->discipline) }}');"><i class="icon-trash-2 text-[13px]"></i>Delete</a>
                    <a href="{{ route('core.disciplines.index') }}" class="btn btn-outline !text-[12.5px]">Back</a>
                </div>
            </div>
        </div>
    </div>

    <!-- ============ Information Cards ============ -->
    <div class="space-y-4">
        <div class="surface-card p-5">
            <h2 class="font-display font-bold text-[14px] mb-4">Basic</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div><p class="text-[11px] text-tertiary">Discipline</p><p class="text-[14px] font-semibold mt-0.5">{{ $data->discipline }}</p></div>
                <div><p class="text-[11px] text-tertiary">Short Name</p><p class="text-[14px] font-semibold mt-0.5">{{ $data->short_name ?: '—' }}</p></div>
                <div><p class="text-[11px] text-tertiary">Status</p><p class="text-[14px] font-semibold mt-0.5">{{ ucfirst($data->status) }}</p></div>
            </div>
        </div>
    </div>

</main>
@endsection

@push('modals')
    <!-- ============ Delete Confirm Modal ============ -->
    <div id="deleteConfirmModal" class="hs-overlay ui-modal hidden" aria-hidden="true" tabindex="-1">
        <div class="ui-modal-dialog !max-w-[380px] p-6 flex flex-col items-center text-center">
            <span class="grid place-items-center size-12 rounded-full mb-3 badge-solid-danger"><i class="icon-trash-2 text-[20px]"></i></span>
            <p class="font-display font-bold text-[15px]">Delete this discipline?</p>
            <p class="text-[12.5px] mt-1.5 u-color-text-tertiary">Are you sure you want to delete this discipline <span id="deleteDisciplineName" class="font-semibold text-primary-600">{{ $data->discipline }}</span>?</p>
            <div class="flex items-center gap-2 w-full mt-5">
                <button type="button" class="btn btn-outline !text-[12.5px] flex-1" id="cancelDeleteBtn" data-modal-close>Cancel</button>
                <button type="button" id="confirmDeleteBtn" class="btn !text-[12.5px] flex-1 justify-center text-white u-background-color-danger-600">Delete</button>
            </div>
        </div>
    </div>

    <!-- ============ Success Toast Modal (generic) ============ -->
    <div id="successModal" class="hs-overlay ui-modal hidden" aria-hidden="true" tabindex="-1">
        <div class="ui-modal-dialog !max-w-[360px] p-6 flex flex-col items-center text-center">
            <span class="grid place-items-center size-14 rounded-full mb-3 badge-solid-success u-box-shadow-0-4px-14px-2px-color-mix-in-oklab-color-success-5"><i class="icon-check text-[24px]"></i></span>
            <p id="successModalTitle" class="font-display font-bold text-[15px]">Done</p>
            <p id="successModalMessage" class="text-[12.5px] mt-1.5 u-color-text-tertiary"></p>
            <button type="button" class="btn btn-primary w-full justify-center !text-[12.5px] mt-5" data-modal-close>Okay</button>
        </div>
    </div>
@endpush

@push('scripts')
<script src="{{ asset('js/core/disciplines-show.js') }}?v={{ filemtime(public_path('js/core/disciplines-show.js')) }}"></script>
@endpush
