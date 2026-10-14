@extends('layouts.app')

@section('content')
<main class="p-4 lg:p-6 space-y-5 max-w-full mx-auto w-full">

    <!-- ============ Action Bar ============ -->
    <div class="surface-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
            <span class="grid place-items-center size-10 rounded-lg bg-[var(--color-primary-50)] text-primary-600">
                <i class="icon-cpu text-[18px]"></i>
            </span>
            <div>
                <div class="flex items-center gap-2.5">
                    <h1 class="font-display font-bold text-[18px] mb-0">{{ $data->discipline }}</h1>
                    @if($data->status === 'active')
                        <span class="badge-soft badge-success">Active</span>
                    @else
                        <span class="badge-soft badge-danger">Inactive</span>
                    @endif
                </div>
                <p class="text-[12px] text-tertiary mt-0.5">UUID: {{ $data->uuid }}</p>
            </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <button type="button" class="btn btn-primary !text-[12.5px]" onclick="edit_discipline('{{ $data->uuid }}');">
                <i class="icon-edit text-[13px]"></i>Edit
            </button>
            <button type="button" class="btn !text-[12.5px] text-white bg-danger-600 hover:bg-danger-700" onclick="delete_discipline('{{ $data->uuid }}', '{{ addslashes($data->discipline) }}');">
                <i class="icon-trash-2 text-[13px]"></i>Delete
            </button>
            <a href="{{ route('core.disciplines.index') }}" class="btn btn-outline !text-[12.5px]">
                <i class="icon-arrow-left text-[13px]"></i>Back to List
            </a>
        </div>
    </div>

    <!-- ============ Detail Information Card ============ -->
    <div class="surface-card p-5">
        <h2 class="font-display font-bold text-[14px] mb-4 pb-2 border-b border-subtle">Discipline Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <p class="text-[11.5px] font-semibold uppercase tracking-wide text-tertiary mb-1">Discipline Name</p>
                <div class="p-3 rounded-lg bg-sunken-bordered font-medium text-[13.5px]">
                    {{ $data->discipline }}
                </div>
            </div>

            <div>
                <p class="text-[11.5px] font-semibold uppercase tracking-wide text-tertiary mb-1">Short Name</p>
                <div class="p-3 rounded-lg bg-sunken-bordered font-medium text-[13.5px]">
                    {{ $data->short_name ?: '—' }}
                </div>
            </div>

            <div>
                <p class="text-[11.5px] font-semibold uppercase tracking-wide text-tertiary mb-1">Status</p>
                <div class="p-3 rounded-lg bg-sunken-bordered">
                    @if($data->status === 'active')
                        <span class="badge-soft badge-success">Active</span>
                    @else
                        <span class="badge-soft badge-danger">Inactive</span>
                    @endif
                </div>
            </div>

            <div>
                <p class="text-[11.5px] font-semibold uppercase tracking-wide text-tertiary mb-1">Created At</p>
                <div class="p-3 rounded-lg bg-sunken-bordered text-[13px] text-secondary">
                    {{ $data->created_at ? $data->created_at->format('M d, Y h:i A') : 'N/A' }}
                </div>
            </div>

            <div>
                <p class="text-[11.5px] font-semibold uppercase tracking-wide text-tertiary mb-1">Last Updated</p>
                <div class="p-3 rounded-lg bg-sunken-bordered text-[13px] text-secondary">
                    {{ $data->updated_at ? $data->updated_at->format('M d, Y h:i A') : 'N/A' }}
                </div>
            </div>
        </div>
    </div>

    <!-- ============ Delete Confirmation Modal ============ -->
    <div id="deleteConfirmModal" class="hs-overlay ui-modal hidden" aria-hidden="true" tabindex="-1">
        <div class="ui-modal-dialog !max-w-[380px] p-6 flex flex-col items-center text-center">
            <span class="grid place-items-center size-12 rounded-full mb-3 badge-solid-danger">
                <i class="icon-trash-2 text-[20px]"></i>
            </span>
            <h3 class="font-display font-bold text-[16px]">Delete Discipline?</h3>
            <p class="text-[12.5px] mt-1.5 text-tertiary">
                Are you sure you want to delete <span id="deleteDisciplineName" class="font-semibold text-primary-600"></span>? This action can be undone only by an administrator.
            </p>
            <div class="flex items-center gap-2 w-full mt-5">
                <button type="button" class="btn btn-outline !text-[12.5px] flex-1" id="cancelDeleteBtn">Cancel</button>
                <button type="button" class="btn !text-[12.5px] flex-1 justify-center text-white bg-danger-600 hover:bg-danger-700" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>

</main>
@endsection

@push('scripts')
<script src="{{ asset('js/core/disciplines-show.js') }}?v={{ filemtime(public_path('js/core/disciplines-show.js')) }}"></script>
@endpush
