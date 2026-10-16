<main class="p-4 lg:p-6 max-w-full mx-auto w-full flex-1">

<!-- ============ Header Bar (project-add style) ============ -->
<div class="flex flex-wrap items-center justify-between gap-3 mb-4 px-5">
    <div>
        <h1 class="font-display font-bold text-[19px]">
            {{ $data->exists ? 'Edit Discipline' : 'Create Discipline' }}
        </h1>
        <p class="text-[12px] mt-0.5 u-color-text-tertiary">
            {{ $data->exists ? 'Update discipline details and status' : 'Create new calibration discipline' }}
        </p>
    </div>
</div>

<div class="space-y-4">
    <!-- Error Alert Container -->
    <div id="form-error-alert" role="alert" data-alert class="{{ $errors->any() ? '' : 'hidden' }} surface-card p-4 rounded-lg border border-danger-subtle bg-danger-transparent text-danger">
        <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 min-w-0">
                <i class="icon-octagon-alert text-[16px] shrink-0"></i>
                <span id="form-error-message" class="text-[12.5px] font-medium">Please review the form fields with errors below.</span>
            </div>
            <button type="button" id="form-error-alert-close" class="alert-dismiss-btn" data-alert-dismiss aria-label="Dismiss alert">
                <i class="icon-x text-[14px]"></i>
            </button>
        </div>
    </div>
    <div class="surface-card p-5">
        <h2 class="font-display font-bold text-[14px] mb-4">Basic</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
                <label for="discipline" class="text-[11.5px] font-semibold uppercase tracking-wide mb-1.5 u-color-text-tertiary block">
                    Discipline <span class="u-color-color-danger-600">*</span>
                </label>
                <input type="text" id="discipline" name="discipline" value="{{ old('discipline', $data->discipline) }}" placeholder="Thermal" class="w-full field-control @error('discipline') border-danger @enderror">
                <span id="discipline-error" class="text-[11.5px] font-medium text-danger-600 block mt-1">@error('discipline') {{ $message }} @enderror</span>
            </div>

            <div>
                <label for="short_name" class="text-[11.5px] font-semibold uppercase tracking-wide mb-1.5 u-color-text-tertiary block">
                    Short Name <span class="u-color-color-danger-600">*</span>
                </label>
                <input type="text" id="short_name" name="short_name" value="{{ old('short_name', $data->short_name) }}" placeholder="TH" maxlength="3" class="w-full field-control @error('short_name') border-danger @enderror">
                <span id="short_name-error" class="text-[11.5px] font-medium text-danger-600 block mt-1">@error('short_name') {{ $message }} @enderror</span>
            </div>
            <div>
                <label class="text-[11.5px] font-semibold uppercase tracking-wide mb-1.5 u-color-text-tertiary block">
                    Status <span class="u-color-color-danger-600">*</span>
                </label>
                <div class="grid grid-cols-2 gap-3">
                    <label class="radio-option flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer u-background-surface-sunken">
                        <input type="radio" name="status" value="active" {{ old('status', $data->status ?? 'active') === 'active' ? 'checked' : '' }} class="u-accent-color-color-primary-600">
                        <span class="text-[12.5px] font-medium">Active</span>
                    </label>
                    <label class="radio-option flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer u-background-surface-sunken">
                        <input type="radio" name="status" value="inactive" {{ old('status', $data->status ?? 'active') === 'inactive' ? 'checked' : '' }} class="u-accent-color-color-primary-600">
                        <span class="text-[12.5px] font-medium">Inactive</span>
                    </label>
                </div>
                <span id="status-error" class="text-[11.5px] font-medium text-danger-600 block mt-1">@error('status') {{ $message }} @enderror</span>
            </div>
        </div>
    </div>
</div>
</main>
<!-- ============ Sticky Action Footer ============ -->
<div class="sticky bottom-0 z-40 border-t u-background-surface-base_border-color-border-subtle">
    <div class="mx-auto p-4 flex items-center justify-end gap-2">
        <button type="button" class="btn btn-primary !text-[12.5px]" id="save_discipline_btn" onclick="submit_discipline();">
            <i class="icon-check text-[13px]"></i>Save
        </button>
        <a href="{{ $data->exists ? route('core.disciplines.show', $data->uuid) : route('core.disciplines.index') }}" class="btn btn-outline !text-[12.5px]">Cancel</a>
    </div>
</div>