<!-- ApexCharts -->
<script src="{{ asset('build/libs/apexcharts/apexcharts.min.js') }}"></script>

@if (Route::is('expense-add'))
<!-- Wizard JS -->
@vite('resources/js/wizard.js')
@endif

@if (Route::is(['invoices-kanban', 'deals', 'leads', 'kanban-board', 'housekeeping-task-board', 'project-management', 'restaurant-pos']))
@vite('resources/js/kanban.js')
@endif

<!-- Flatpickr JS -->
<script src="{{ asset('build/libs/flatpickr/flatpickr.min.js') }}"></script>
@vite('resources/js/date-range-picker.js')
@vite('resources/js/import-export.js')

@if (Route::is('calendar'))
<!-- FullCalendar JS -->
<script src="{{ asset('build/libs/fullcalendar/core.global.js') }}"></script>
<script src="{{ asset('build/libs/fullcalendar/daygrid.global.js') }}"></script>
<script src="{{ asset('build/libs/fullcalendar/interaction.global.js') }}"></script>
@vite('resources/js/calendar-data.js')
@endif

<!-- Simplebar JS -->
<script src="{{ asset('build/libs/simplebar/simplebar.min.js') }}"></script>
<!-- Preline JS -->
<script src="{{ asset('build/libs/preline/preline.js') }}"></script>

@if (Route::is('ui-rangeslider'))
<script src="{{ asset('build/libs/wnumb/wNumb.min.js') }}"></script>
<script src="{{ asset('build/libs/nouislider/nouislider.min.js') }}"></script>
@vite('resources/js/range-slider.js')
@endif

@if (Route::is(['ui-dragula', 'crm-dashboard']))
<script src="{{ asset('build/libs/dragula/dragula.min.js') }}"></script>
@endif

@if (Route::is('ui-clipboard'))
<script src="{{ asset('build/libs/clipboard/clipboard.min.js') }}"></script>
@vite('resources/js/clipboard.js')
@endif

@if (Route::is('ui-lightbox'))
<script src="{{ asset('build/libs/glightbox/js/glightbox.min.js') }}"></script>
@endif

<!-- Choices JS -->
<script src="{{ asset('build/libs/choices.js/public/assets/scripts/choices.min.js') }}"></script>
@vite('resources/js/choices-init.js')

@if (Route::is('chart-js'))
<script src="{{ asset('build/libs/chart.js/chart.umd.min.js') }}"></script>
@vite('resources/js/charjs-chart-data.js')
@endif

@if (Route::is([
'index', 'analytics-ecommerce', 'bi-overview', 'portfolio-explorer', 'chart-apex',
'ai-analytics', 'hrm-dashboard', 'sales-analytics', 'crm-dashboard', 'finance-dashboard',
'restaurant-pos', 'project-management', 'accounting-dashboard', 'banking-dashboard',
'crypto-analytics', 'logistics-dashboard', 'hospital-management', 'school-management',
'lms-analytics', 'hotel-management', 'food-delivery', 'travel-booking',
'seo-analytics-dashboard', 'menu-builder', 'shipments', 'withholding-tax',
'traffic-overview', 'partner-restaurant-profile', 'portfolio-performance', 'budgets',
'corporate-tax', 'payment-center', 'rider-profile', 'table-floor-map', 'loan-workspace',
'products-list', 'order-board', 'timesheet-details', 'emergency', 'billing',
'exam-analytics', 'report-builder', 'customs-duty', 'guest-directory',
'*-report',
]))
@vite('resources/js/chart-data.js')
@endif

@if (Route::is([
'data-tables', 'products-list', 'orders', 'categories', 'leads', 'deals', 'patients',
'suppliers', 'watchlist', 'purchase-orders', 'pharmacy-purchase-orders', 'customer-invoices',
'tasks', 'team', 'timesheets', 'sales-report', 'medicine-catalog',
'*-list',
]))
@vite('resources/js/datatable.js')
@endif

@vite('resources/js/script.js')
