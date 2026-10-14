<?php

namespace App\Http\Controllers\Core;

use App\Http\Controllers\Controller;
use App\Http\Requests\Core\DisciplineStoreRequest;
use App\Http\Requests\Core\DisciplineUpdateRequest;
use App\Models\Discipline;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DisciplineController extends Controller
{
    public function index(Request $request)
    {
        $filter = [];

        if ($request->filled('filter_status'))
        {
            $filter['filter_status'] = $request->get('filter_status');
        }

        if ($request->filled('filter_by') && $request->filled('filter_data'))
        {
            $valid_filter_columns = ['discipline', 'short_name'];

            $filter_by = $request->get('filter_by');
            $filter_data = $request->get('filter_data');

            if (in_array($filter_by, $valid_filter_columns, true))
            {
                $filter['filter_by'] = $filter_by;
                $filter['filter_data'] = $filter_data;
            }
        }

        $statuses = config('dropdowns.general_status_list', [
            'active' => 'Active',
            'inactive' => 'Inactive',
        ]);

        return view('core.disciplines', compact('filter', 'statuses'));
    }

    public function data(Request $request): JsonResponse
    {
        $draw = $request->input('draw', 1);
        $start = (int) $request->input('start', 0);
        $length = (int) $request->input('length', 10);

        $order_column_name = 'discipline';
        $order_direction = 'asc';

        if ($request->has('order') && is_array($request->input('order')) && isset($request->input('order')[0]))
        {
            $order_info = $request->input('order')[0];
            $column_idx = $order_info['column'] ?? null;
            $order_direction = ($order_info['dir'] ?? 'asc') === 'desc' ? 'desc' : 'asc';

            $columns = $request->input('columns', []);

            if ($column_idx !== null && isset($columns[$column_idx]['name']))
            {
                $allowed_columns = ['discipline', 'short_name', 'status', 'created_at'];
                $requested_name = $columns[$column_idx]['name'];

                if (in_array($requested_name, $allowed_columns, true))
                {
                    $order_column_name = $requested_name;
                }
            }
        }

        $records_total = Discipline::count();

        $records_filtered_query = Discipline::query();
        $records_query = Discipline::query();

        if ($request->filled('filter_status'))
        {
            $filter_status = $request->input('filter_status');
            $records_filtered_query->where('status', $filter_status);
            $records_query->where('status', $filter_status);
        }

        if ($request->filled('filter_by') && $request->filled('filter_data'))
        {
            $filter_by = $request->input('filter_by');
            $filter_data = $request->input('filter_data');

            if ($filter_by === 'discipline')
            {
                $records_filtered_query->where('discipline', 'like', '%'.$filter_data.'%');
                $records_query->where('discipline', 'like', '%'.$filter_data.'%');
            }
            elseif ($filter_by === 'short_name')
            {
                $records_filtered_query->where('short_name', 'like', '%'.$filter_data.'%');
                $records_query->where('short_name', 'like', '%'.$filter_data.'%');
            }
        }

        if ($search_value = $request->input('search.value'))
        {
            $records_filtered_query->where(function ($query) use ($search_value)
            {
                $query->where('discipline', 'like', '%'.$search_value.'%')
                    ->orWhere('short_name', 'like', '%'.$search_value.'%')
                    ->orWhere('status', 'like', '%'.$search_value.'%');
            });

            $records_query->where(function ($query) use ($search_value)
            {
                $query->where('discipline', 'like', '%'.$search_value.'%')
                    ->orWhere('short_name', 'like', '%'.$search_value.'%')
                    ->orWhere('status', 'like', '%'.$search_value.'%');
            });
        }

        $records_filtered = $records_filtered_query->count();

        $records_query->orderBy($order_column_name, $order_direction);

        if ($length > 0)
        {
            $records_query->skip($start)->take($length);
        }

        $records = $records_query->get();

        $data = [];

        foreach ($records as $record)
        {
            $show_url = route('core.disciplines.show', $record->uuid);
            $edit_url = route('core.disciplines.edit', $record->uuid);

            $status_badge = $record->status === 'active'
                ? '<span class="badge-soft badge-success">Active</span>'
                : '<span class="badge-soft badge-danger">Inactive</span>';

            $actions = '
                <div class="flex items-center justify-end gap-1.5">
                    <a href="'.$show_url.'" class="header-icon-btn !size-7 text-[var(--text-secondary)] hover:text-primary-600" title="View details" aria-label="View">
                        <i class="icon-eye text-[14px]"></i>
                    </a>
                    <a href="'.$edit_url.'" class="header-icon-btn !size-7 text-[var(--text-secondary)] hover:text-primary-600" title="Edit" aria-label="Edit">
                        <i class="icon-edit text-[14px]"></i>
                    </a>
                    <button type="button" class="header-icon-btn !size-7 text-[var(--color-danger-600)] hover:bg-[var(--surface-sunken)] delete-discipline-btn" data-uuid="'.$record->uuid.'" data-name="'.e($record->discipline).'" title="Delete" aria-label="Delete">
                        <i class="icon-trash-2 text-[14px]"></i>
                    </button>
                </div>
            ';

            $discipline_name = '<a href="'.$show_url.'" class="font-semibold text-primary-600 hover:underline">'.e($record->discipline).'</a>';
            if ($record->short_name)
            {
                $discipline_name .= ' <span class="text-tertiary text-[12px]">('.e($record->short_name).')</span>';
            }

            $data[] = [
                'discipline' => $discipline_name,
                'status' => $status_badge,
                'created_at' => $record->created_at ? $record->created_at->format('M d, Y') : '&mdash;',
                'actions' => $actions,
            ];
        }

        return response()->json([
            'draw' => (int) $draw,
            'recordsTotal' => $records_total,
            'recordsFiltered' => $records_filtered,
            'data' => $data,
        ]);
    }

    public function create()
    {
        $data = new Discipline;
        $statuses = config('dropdowns.general_status_list', [
            'active' => 'Active',
            'inactive' => 'Inactive',
        ]);

        return view('core.disciplines_create', compact('data', 'statuses'));
    }

    public function store(DisciplineStoreRequest $request): JsonResponse
    {
        $discipline = new Discipline;
        $discipline->discipline = trim($request->input('discipline'));
        $discipline->short_name = trim($request->input('short_name'));
        $discipline->status = $request->input('status', 'active');
        $discipline->save();

        return response()->json([
            'status' => 'success',
            'id' => $discipline->uuid,
            'message' => 'Discipline created successfully.',
        ], 200);
    }

    public function show(string $uuid)
    {
        $data = Discipline::findOrFail($uuid);

        return view('core.disciplines_show', compact('data'));
    }

    public function edit(string $uuid)
    {
        $data = Discipline::findOrFail($uuid);
        $statuses = config('dropdowns.general_status_list', [
            'active' => 'Active',
            'inactive' => 'Inactive',
        ]);

        return view('core.disciplines_edit', compact('data', 'statuses'));
    }

    public function update(DisciplineUpdateRequest $request, string $uuid): JsonResponse
    {
        $discipline = Discipline::findOrFail($uuid);
        $discipline->discipline = trim($request->input('discipline'));
        $discipline->short_name = trim($request->input('short_name'));
        $discipline->status = $request->input('status', 'active');
        $discipline->save();

        return response()->json([
            'status' => 'success',
            'id' => $discipline->uuid,
            'message' => 'Discipline updated successfully.',
        ], 200);
    }

    public function delete(string $uuid): Response|JsonResponse
    {
        $discipline = Discipline::findOrFail($uuid);
        $discipline->delete();

        return response()->noContent();
    }
}
