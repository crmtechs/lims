<!-- Footer -->
<footer class="px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] border-t text-[var(--text-tertiary)] bg-[var(--surface-card)] border-[var(--border-subtle)]">
    <p>Copyright © 2026 <span class="font-semibold text-[var(--text-secondary)]"><a href="https://crmtechs.com" target="_blank" class="hover:underline">CRM Technologies</a></span>. All rights reserved.</p>
    <div class="flex items-center gap-4">
        <span>
            License Valid Until: {{ config('license.valid_until')->format('d/m/Y') }}
        </span>
    </div>
</footer>
<!-- End Footer -->
