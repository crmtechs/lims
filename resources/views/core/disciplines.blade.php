@extends('layouts.app')

@section('content')
<main class="p-4 lg:p-6 space-y-5 max-w-full mx-auto w-full">

    <!-- ============ Page Header ============ -->
    <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 class="font-display font-bold text-[21px]">Disciplines</h1>
            <p class="text-[12.5px] mt-1 text-tertiary">Core testing and calibration disciplines</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <a href="{{ route('core.disciplines.create') }}" class="btn btn-primary !text-[12.5px]">
                <i class="icon-plus text-[13px]"></i>Add Discipline
            </a>
        </div>
    </div>

    <!-- ============ Filter Section ============ -->
    <div class="surface-card p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
                <label for="filter_status" class="block text-[11.5px] font-semibold uppercase tracking-wide mb-1.5 text-tertiary">Status</label>
                <select id="filter_status" class="field-control w-full">
                    <option value="">All Statuses</option>
                    @foreach($statuses as $status_key => $status_label)
                        <option value="{{ $status_key }}" @if(isset($filter['filter_status']) && $filter['filter_status'] == $status_key) selected @endif>{{ $status_label }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label for="filter_by" class="block text-[11.5px] font-semibold uppercase tracking-wide mb-1.5 text-tertiary">Filter By</label>
                <select id="filter_by" class="field-control w-full">
                    <option value="discipline" @if(!isset($filter['filter_by']) || $filter['filter_by'] == 'discipline') selected @endif>Discipline Name</option>
                    <option value="short_name" @if(isset($filter['filter_by']) && $filter['filter_by'] == 'short_name') selected @endif>Short Name</option>
                </select>
            </div>
            <div>
                <label for="filter_data" class="block text-[11.5px] font-semibold uppercase tracking-wide mb-1.5 text-tertiary">Search Term</label>
                <input type="text" id="filter_data" class="field-control w-full" placeholder="Enter discipline name..." value="{{ $filter['filter_data'] ?? '' }}">
            </div>
            <div class="flex items-center gap-2">
                <button type="button" id="filter_search_btn" class="btn btn-primary !text-[12.5px] flex-1">
                    <i class="icon-search text-[13px]"></i>Search
                </button>
                <button type="button" id="filter_clear_btn" class="btn btn-outline !text-[12.5px]" title="Clear Filters" aria-label="Clear Filters">
                    <i class="icon-rotate-ccw text-[13px]"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- ============ Data Table Card ============ -->
    <div class="surface-card !p-0 overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 p-4 pb-3 border-b border-subtle">
            <h2 class="font-display font-bold text-[14px]">Disciplines List</h2>
            <div id="tableinfo" class="text-[12px] text-tertiary"></div>
        </div>

        <div class="overflow-x-auto scroll-thin">
            <table id="discipline_list" class="data-table w-full min-w-[650px]">
                <thead>
                    <tr>
                        <th scope="col" class="cursor-pointer" data-column="discipline">
                            <span class="flex items-center gap-1.5">
                                Discipline
                                <i class="icon-arrow-up-down text-[11px] text-tertiary"></i>
                            </span>
                        </th>
                        <th scope="col" class="w-36 cursor-pointer" data-column="status">
                            <span class="flex items-center gap-1.5">
                                Status
                                <i class="icon-arrow-up-down text-[11px] text-tertiary"></i>
                            </span>
                        </th>
                        <th scope="col" class="w-44 cursor-pointer" data-column="created_at">
                            <span class="flex items-center gap-1.5">
                                Created At
                                <i class="icon-arrow-up-down text-[11px] text-tertiary"></i>
                            </span>
                        </th>
                        <th scope="col" class="w-28 text-end">Actions</th>
                    </tr>
                </thead>
                <tbody id="discipline_table_body">
                    <tr>
                        <td colspan="4" class="text-center py-8 text-tertiary">
                            <div class="flex items-center justify-center gap-2">
                                <span class="animate-spin text-primary-600"><i class="icon-loader text-[18px]"></i></span>
                                <span>Loading records...</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-subtle">
            <div class="flex items-center gap-2">
                <label for="table_length_select" class="text-[12px] text-tertiary">Rows per page:</label>
                <select id="table_length_select" class="field-control text-[12px] !py-1 !px-2 w-auto">
                    <option value="10" selected>10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <div id="tablepage" class="flex items-center gap-1"></div>
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
<script src="{{ asset('js/core/disciplines.js') }}?v={{ filemtime(public_path('js/core/disciplines.js')) }}"></script>
@endpush
