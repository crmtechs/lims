<!-- ================= BREADCRUMB BAR ================= -->
<div class="px-4 lg:px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
    <div class="flex flex-wrap items-center justify-between gap-2 max-w-[1600px] mx-auto">
        <h2 class="font-display font-bold text-[13px] tracking-wide uppercase">{!! $breadcrumb ?? '' !!}</h2>
        <div class="flex items-center gap-1.5 text-[12px] font-medium">
            <a href="{{ url('index') }}" class="text-[var(--color-primary-600)]">Dashboards</a>
            <span class="text-[var(--text-tertiary)]">/</span>
            <span class="text-[var(--text-tertiary)]">{!! $breadcrumb ?? '' !!}</span>
        </div>
    </div>
</div>
