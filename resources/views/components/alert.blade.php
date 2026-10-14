@props([
    'type' => 'danger',
    'dismissible' => true,
    'icon' => null,
    'message' => null,
])

@php
    $typeClasses = match ($type)
    {
        'success' => 'border-success-subtle bg-success-transparent text-success',
        'warning' => 'border-warning-subtle bg-warning-transparent text-warning',
        'info' => 'border-info-subtle bg-info-transparent text-info',
        'primary' => 'border-primary-subtle bg-primary-transparent text-primary',
        'neutral' => 'border-neutral-subtle bg-neutral-100 text-neutral-700',
        default => 'border-danger-subtle bg-danger-transparent text-danger',
    };

    $defaultIcon = match ($type)
    {
        'success' => 'icon-check-circle',
        'warning' => 'icon-triangle-alert',
        'info' => 'icon-info',
        'primary' => 'icon-info',
        'neutral' => 'icon-bell',
        default => 'icon-octagon-alert',
    };

    $iconClass = $icon ?? $defaultIcon;
@endphp

<div role="alert" data-alert {{ $attributes->merge(['class' => "surface-card p-4 rounded-lg border {$typeClasses}"]) }}>
    <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
            @if ($iconClass)
                <i class="{{ $iconClass }} text-[16px] shrink-0"></i>
            @endif
            <div class="text-[12.5px] font-medium">
                {{ $message ?? $slot }}
            </div>
        </div>
        @if ($dismissible)
            <button type="button" class="alert-dismiss-btn" data-alert-dismiss aria-label="Dismiss alert">
                <i class="icon-x text-[14px]"></i>
            </button>
        @endif
    </div>
</div>
