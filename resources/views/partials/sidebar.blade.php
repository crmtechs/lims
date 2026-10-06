<!-- ================= SIDEBAR ================= -->
<aside class="app-sidebar sidebar-pattern scroll-thin" id="appSidebar" aria-label="Sidebar">

    <!-- Logo + collapse toggle -->
    <div class="flex items-center justify-between h-16 px-4 shrink-0 border-b border-[var(--sidebar-border)]">
        <a href="{{url('index')}}" class="flex items-center gap-2.5 min-w-0 rounded-xl px-2.5 py-1.5">
            <img src="{{URL::asset('build/img/logo.svg')}}" alt="Dreams Core logo" class="sidebar-logo-full max-w-[150px] object-contain shrink-0">
            <img src="{{URL::asset('build/img/logo-small.svg')}}" alt="Dreams Core logo" class="sidebar-logo-small size-8 object-contain shrink-0 hidden">
        </a>
        <button type="button" id="sidebarCollapseBtn" class="header-icon-btn !text-white/60 hover:!text-white hover:!bg-white/10 !size-8 shrink-0" aria-label="Collapse sidebar">
            <i class="icon-panel-left-close text-[17px]"></i>
        </button>
    </div>

    <!-- Favorites -->
    <!-- Main navigation (Favorites scrolls together with the rest of the menu) -->
    <nav class="sidebar-inner flex-1 overflow-y-auto scroll-thin px-3 pb-4 mt-1" aria-label="Sidebar navigation">

        <div class="sidebar-favorites pt-2">
            <ul>
                <li class="has-submenu is-open">
                    <button type="button" class="sidebar-link w-full !px-1.5" data-submenu-toggle>
                        <span class="text-[10.5px] font-semibold uppercase tracking-wide flex-1 text-start text-[rgb(255_255_255_/_0.4)]">Favorites</span>
                        <span class="grid place-items-center size-4.5 rounded-full text-[10px] font-semibold me-1 bg-[rgb(255_255_255_/_0.12)] text-[rgb(255_255_255_/_0.7)]">6</span>
                        <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                    </button>
                    <div class="sidebar-submenu !ms-0 !ps-0 favorite-tile-panel">
                        <div class="grid grid-cols-2 gap-2 pt-1 pb-1">
                            <a href="{{url('index')}}" class="favorite-tile is-active">
                                <i class="ph ph-star favorite-tile-star"></i>
                                <span class="grid place-items-center size-9 rounded-lg badge-solid-primary"><i class="icon-layout-dashboard text-[15px]"></i></span>
                                <span class="text-[11px] font-medium text-center truncate w-full">Dashboard</span>
                            </a>
                            <a href="{{url('patients')}}" class="favorite-tile">
                                <i class="ph ph-star favorite-tile-star"></i>
                                <span class="grid place-items-center size-9 rounded-lg badge-solid-info"><i class="icon-user text-[15px]"></i></span>
                                <span class="text-[11px] font-medium text-center truncate w-full">All Patients</span>
                            </a>
                        </div>
                        <div class="grid grid-cols-2 gap-2 pt-2 hidden" data-favorites-extra>
                            <a href="{{url('appointments')}}" class="favorite-tile">
                                <i class="ph ph-star favorite-tile-star"></i>
                                <span class="grid place-items-center size-9 rounded-lg badge-solid-accent"><i class="icon-calendar-days text-[15px]"></i></span>
                                <span class="text-[11px] font-medium text-center truncate w-full">Appointments</span>
                            </a>
                            <a href="{{url('emergency')}}" class="favorite-tile">
                                <i class="ph ph-star favorite-tile-star"></i>
                                <span class="grid place-items-center size-9 rounded-lg badge-solid-danger"><i class="icon-alert-triangle text-[15px]"></i></span>
                                <span class="text-[11px] font-medium text-center truncate w-full">Emergency</span>
                            </a>
                            <a href="{{url('billing')}}" class="favorite-tile">
                                <i class="ph ph-star favorite-tile-star"></i>
                                <span class="grid place-items-center size-9 rounded-lg badge-solid-warning"><i class="icon-wallet text-[15px]"></i></span>
                                <span class="text-[11px] font-medium text-center truncate w-full">Billing</span>
                            </a>
                            <a href="{{url('doctor-directory')}}" class="favorite-tile">
                                <i class="ph ph-star favorite-tile-star"></i>
                                <span class="grid place-items-center size-9 rounded-lg badge-solid-success"><i class="icon-stethoscope text-[15px]"></i></span>
                                <span class="text-[11px] font-medium text-center truncate w-full">Doctors</span>
                            </a>
                        </div>
                        <button type="button" class="w-full text-center text-[11px] font-semibold mt-2 py-1 text-[var(--color-primary-400)]" data-favorites-more>
                            View 4 more <i class="icon-chevron-down text-[9px]"></i>
                        </button>
                    </div>
                </li>
            </ul>
        </div>

        <ul id="sidebarMenu" role="menu" aria-label="Main navigation">

            <li class="sidebar-group-title">Main</li>

            <li class="has-submenu is-open">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-layout-dashboard text-[16px]"></i>
                    <span class="sidebar-label">Dashboards</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('index')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Ecommerce</span></a></li>
                    <li><a href="{{url('ai-analytics')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">AI Analytics</span><span class="sidebar-badge badge-accent sidebar-meta">NEW</span></a></li>
                    <li><a href="{{url('analytics-ecommerce')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Business Intelligence</span></a></li>
                    <li><a href="{{url('sales-analytics')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Sales Analytics</span></a></li>
                    <li><a href="{{url('project-management')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Project Management</span></a></li>
                    <li><a href="{{url('finance-dashboard')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Finance</span></a></li>
                    <li><a href="{{url('accounting-dashboard')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Accounting</span></a></li>
                    <li><a href="{{url('banking-dashboard')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Banking</span></a></li>
                    <li><a href="{{url('crypto-analytics')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Crypto Analytics</span></a></li>
                    <li><a href="{{url('logistics-dashboard')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Logistics</span></a></li>
                    <li><a href="{{url('hospital-management')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Hospital Management</span></a></li>
                    <li><a href="{{url('school-management')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">School Management</span></a></li>
                    <li><a href="{{url('lms-analytics')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">LMS Analytics</span></a></li>
                    <li><a href="{{url('hotel-management')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Hotel Management</span></a></li>
                    <li><a href="{{url('restaurant-pos')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Restaurant POS</span></a></li>
                    <li><a href="{{url('food-delivery')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Food Delivery</span></a></li>
                    <li><a href="{{url('travel-booking')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Travel &amp; Booking</span></a></li>
                    <li><a href="{{url('seo-analytics-dashboard')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">SEO Analytics</span></a></li>
                    <li><a href="{{url('crm-dashboard')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">CRM</span></a></li>
                    <li><a href="{{url('hrm-dashboard')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">HRM</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-layout-grid text-[16px]"></i>
                    <span class="sidebar-label">Applications</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('chat')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Chat</span></a></li>
                    <li><a href="{{url('ai-chat')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">AI Chat</span></a></li>
                    <li class="has-submenu">
                        <button type="button" class="sidebar-link w-full !text-[12.5px]" data-submenu-toggle>
                            <span class="sidebar-label">Calls</span>
                            <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                        </button>
                        <ul class="sidebar-submenu">
                            <li><a href="{{url('voice-call')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Voice Call</span></a></li>
                            <li><a href="{{url('video-call')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Video Call</span></a></li>
                        </ul>
                    </li>
                    <li><a href="{{url('calendar')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Calendar</span></a></li>
                    <li><a href="{{url('email')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Email</span></a></li>
                    <li><a href="{{url('file-manager')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">File Manager</span></a></li>
                    <li><a href="{{url('kanban-board')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Kanban</span></a></li>
                    <li><a href="{{url('notes')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Notes</span></a></li>
                    <li><a href="{{url('todo')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">To Do</span></a></li>
                    <li><a href="{{url('workflow-approvals')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Workflow &amp; Approvals</span></a></li>
                </ul>
            </li>

            <li class="sidebar-group-title">Ecommerce</li>

            <li><a href="{{url('storefront')}}" class="sidebar-link"><i class="icon-store text-[16px]"></i><span class="sidebar-label">Storefront</span></a></li>
            <li><a href="{{url('products-list')}}" class="sidebar-link"><i class="icon-package text-[16px]"></i><span class="sidebar-label">Products</span></a></li>
            <li><a href="{{url('orders')}}" class="sidebar-link"><i class="icon-shopping-bag text-[16px]"></i><span class="sidebar-label">Orders</span></a></li>
            <li><a href="{{url('categories')}}" class="sidebar-link"><i class="icon-tag text-[16px]"></i><span class="sidebar-label">Categories</span></a></li>
            <li><a href="{{url('reviews')}}" class="sidebar-link"><i class="icon-star text-[16px]"></i><span class="sidebar-label">Reviews</span></a></li>

            <li class="sidebar-group-title">Business Intelligence</li>

            <li><a href="{{url('bi-overview')}}" class="sidebar-link"><i class="icon-gauge-circle text-[16px]"></i><span class="sidebar-label">BI Overview</span></a></li>
            <li><a href="{{url('data-sources')}}" class="sidebar-link"><i class="icon-database text-[16px]"></i><span class="sidebar-label">Data Sources</span></a></li>
            <li><a href="{{url('kpi-builder')}}" class="sidebar-link"><i class="icon-bar-chart-4 text-[16px]"></i><span class="sidebar-label">KPI Builder</span></a></li>
            <li><a href="{{url('insights')}}" class="sidebar-link"><i class="icon-lightbulb text-[16px]"></i><span class="sidebar-label">Insights</span></a></li>

            <li class="sidebar-group-title">Sales Analytics</li>

            <li><a href="{{url('leads')}}" class="sidebar-link"><i class="icon-target text-[16px]"></i><span class="sidebar-label">Leads</span></a></li>
            <li><a href="{{url('deals')}}" class="sidebar-link"><i class="icon-handshake text-[16px]"></i><span class="sidebar-label">Deals</span></a></li>
            <li><a href="{{url('quotations')}}" class="sidebar-link"><i class="icon-receipt-text text-[16px]"></i><span class="sidebar-label">Quotations</span></a></li>
            <li><a href="{{url('pipeline')}}" class="sidebar-link"><i class="icon-workflow text-[16px]"></i><span class="sidebar-label">Pipeline</span></a></li>

            <li class="sidebar-group-title">Logistics</li>

            <li><a href="{{url('inventory')}}" class="sidebar-link"><i class="icon-boxes text-[16px]"></i><span class="sidebar-label">Inventory</span></a></li>
            <li><a href="{{url('stock-transfer')}}" class="sidebar-link"><i class="icon-arrow-left-right text-[16px]"></i><span class="sidebar-label">Stock Transfer</span></a></li>
            <li><a href="{{url('purchase-orders')}}" class="sidebar-link"><i class="icon-clipboard-check text-[16px]"></i><span class="sidebar-label">Purchase Orders</span></a></li>
            <li><a href="{{url('suppliers')}}" class="sidebar-link"><i class="icon-truck text-[16px]"></i><span class="sidebar-label">Suppliers</span></a></li>
            <li><a href="{{url('shipments')}}" class="sidebar-link"><i class="icon-container text-[16px]"></i><span class="sidebar-label">Shipments</span></a></li>

            <li class="sidebar-group-title">CRM</li>

            <li><a href="{{url('customer-segments')}}" class="sidebar-link"><i class="icon-users text-[16px]"></i><span class="sidebar-label">Customer Segments</span></a></li>
            <li><a href="{{url('companies')}}" class="sidebar-link"><i class="icon-building-2 text-[16px]"></i><span class="sidebar-label">Companies</span></a></li>
            <li><a href="{{url('activities')}}" class="sidebar-link"><i class="icon-history text-[16px]"></i><span class="sidebar-label">Activities</span></a></li>
            <li><a href="{{url('calls-emails')}}" class="sidebar-link"><i class="icon-phone-call text-[16px]"></i><span class="sidebar-label">Calls &amp; Emails</span></a></li>

            <li class="sidebar-group-title">Project Management</li>

            <li><a href="{{url('projects')}}" class="sidebar-link"><i class="icon-gantt-chart-square text-[16px]"></i><span class="sidebar-label">Projects</span></a></li>
            <li><a href="{{url('tasks')}}" class="sidebar-link"><i class="icon-list-todo text-[16px]"></i><span class="sidebar-label">Tasks</span></a></li>
            <li><a href="{{url('team')}}" class="sidebar-link"><i class="icon-users-round text-[16px]"></i><span class="sidebar-label">Team</span></a></li>
            <li><a href="{{url('timesheets')}}" class="sidebar-link"><i class="icon-calendar-clock text-[16px]"></i><span class="sidebar-label">Timesheets</span></a></li>

            <li class="sidebar-group-title">Finance</li>

            <li><a href="{{url('accounts')}}" class="sidebar-link"><i class="icon-landmark text-[16px]"></i><span class="sidebar-label">Accounts</span></a></li>
            <li><a href="{{url('transactions-list')}}" class="sidebar-link"><i class="icon-coins text-[16px]"></i><span class="sidebar-label">Transactions</span></a></li>
            <li><a href="{{url('budgets')}}" class="sidebar-link"><i class="icon-piggy-bank text-[16px]"></i><span class="sidebar-label">Budgets</span></a></li>
            <li><a href="{{url('expenses-list')}}" class="sidebar-link"><i class="icon-wallet text-[16px]"></i><span class="sidebar-label">Expenses</span></a></li>

            <li class="sidebar-group-title">Accounting</li>

            <li><a href="{{url('ledger-explorer')}}" class="sidebar-link"><i class="icon-calculator text-[16px]"></i><span class="sidebar-label">Ledger</span></a></li>
            <li><a href="{{url('invoice-workspace')}}" class="sidebar-link"><i class="icon-receipt-euro text-[16px]"></i><span class="sidebar-label">Invoices</span></a></li>
            <li><a href="{{url('tax-filing-center')}}" class="sidebar-link"><i class="icon-file-search text-[16px]"></i><span class="sidebar-label">Tax Reports</span></a></li>
            <li><a href="{{url('match-center')}}" class="sidebar-link"><i class="icon-arrow-right-left text-[16px]"></i><span class="sidebar-label">Reconciliation</span></a></li>

            <li class="sidebar-group-title">Banking</li>

            <li><a href="{{url('bank-workspace')}}" class="sidebar-link"><i class="icon-landmark text-[16px]"></i><span class="sidebar-label">Accounts</span></a></li>
            <li><a href="{{url('card-gallery')}}" class="sidebar-link"><i class="icon-wallet-cards text-[16px]"></i><span class="sidebar-label">Cards</span></a></li>
            <li><a href="{{url('transfer-center')}}" class="sidebar-link"><i class="icon-send-to-back text-[16px]"></i><span class="sidebar-label">Transfers</span></a></li>
            <li><a href="{{url('loan-workspace')}}" class="sidebar-link"><i class="icon-scale text-[16px]"></i><span class="sidebar-label">Loans</span></a></li>
            <li><a href="{{url('international-wires')}}" class="sidebar-link"><i class="icon-globe text-[16px]"></i><span class="sidebar-label">Int'l Wires</span></a></li>

            <li class="sidebar-group-title">Crypto Analytics</li>

            <li><a href="{{url('portfolio-explorer')}}" class="sidebar-link"><i class="icon-wallet-minimal text-[16px]"></i><span class="sidebar-label">Portfolio</span></a></li>
            <li><a href="{{url('watchlist')}}" class="sidebar-link"><i class="icon-bitcoin text-[16px]"></i><span class="sidebar-label">Market Watch</span></a></li>
            <li><a href="{{url('crypto-predictions')}}" class="sidebar-link"><i class="icon-trending-up text-[16px]"></i><span class="sidebar-label">Trends</span></a></li>
            <li><a href="{{url('secure-wallet')}}" class="sidebar-link"><i class="icon-vault text-[16px]"></i><span class="sidebar-label">Vault</span></a></li>

            <li class="sidebar-group-title">Hospital Management</li>

            <li><a href="{{url('patients')}}" class="sidebar-link"><i class="icon-user-round-check text-[16px]"></i><span class="sidebar-label">Patients</span></a></li>
            <li><a href="{{url('doctor-directory')}}" class="sidebar-link"><i class="icon-stethoscope text-[16px]"></i><span class="sidebar-label">Doctors</span></a></li>
            <li><a href="{{url('appointments')}}" class="sidebar-link"><i class="icon-calendar-heart text-[16px]"></i><span class="sidebar-label">Appointments</span></a></li>
            <li><a href="{{url('floor-layout')}}" class="sidebar-link"><i class="icon-bed text-[16px]"></i><span class="sidebar-label">Wards &amp; Beds</span></a></li>
            <li><a href="{{url('medicine-catalog')}}" class="sidebar-link"><i class="icon-pill text-[16px]"></i><span class="sidebar-label">Pharmacy</span></a></li>
            <li><a href="{{url('emergency')}}" class="sidebar-link"><i class="icon-ambulance text-[16px]"></i><span class="sidebar-label">Ambulance</span></a></li>
            <li><a href="{{url('billing')}}" class="sidebar-link"><i class="icon-receipt-text text-[16px]"></i><span class="sidebar-label">Billing</span></a></li>

            <li class="sidebar-group-title">School Management</li>

            <li><a href="{{url('student-directory')}}" class="sidebar-link"><i class="icon-graduation-cap text-[16px]"></i><span class="sidebar-label">Students</span></a></li>
            <li><a href="{{url('class-workspace')}}" class="sidebar-link"><i class="icon-school text-[16px]"></i><span class="sidebar-label">Classes</span></a></li>
            <li><a href="{{url('attendance-list')}}" class="sidebar-link"><i class="icon-calendar-clock text-[16px]"></i><span class="sidebar-label">Attendance</span></a></li>
            <li><a href="{{url('exam-planner')}}" class="sidebar-link"><i class="icon-clipboard-check text-[16px]"></i><span class="sidebar-label">Exams</span></a></li>

            <li class="sidebar-group-title">LMS Analytics</li>

            <li><a href="{{url('course-catalog')}}" class="sidebar-link"><i class="icon-book-open-check text-[16px]"></i><span class="sidebar-label">Courses</span></a></li>
            <li><a href="{{url('learner-profile')}}" class="sidebar-link"><i class="icon-users-round text-[16px]"></i><span class="sidebar-label">Learners</span></a></li>
            <li><a href="{{url('quiz-builder')}}" class="sidebar-link"><i class="icon-clipboard-check text-[16px]"></i><span class="sidebar-label">Assessments</span></a></li>
            <li><a href="{{url('lms-activity-feed')}}" class="sidebar-link"><i class="icon-bar-chart-4 text-[16px]"></i><span class="sidebar-label">Engagement</span></a></li>

            <li class="sidebar-group-title">Hotel Management</li>

            <li><a href="{{url('room-explorer')}}" class="sidebar-link"><i class="icon-bed-double text-[16px]"></i><span class="sidebar-label">Rooms</span></a></li>
            <li><a href="{{url('reservation-timeline')}}" class="sidebar-link"><i class="icon-concierge-bell text-[16px]"></i><span class="sidebar-label">Reservations</span></a></li>
            <li><a href="{{url('guest-directory')}}" class="sidebar-link"><i class="icon-users-round text-[16px]"></i><span class="sidebar-label">Guests</span></a></li>
            <li><a href="{{url('housekeeping-task-board')}}" class="sidebar-link"><i class="icon-hotel text-[16px]"></i><span class="sidebar-label">Housekeeping</span></a></li>

            <li class="sidebar-group-title">Restaurant POS</li>

            <li><a href="{{url('order-board')}}" class="sidebar-link"><i class="icon-utensils-crossed text-[16px]"></i><span class="sidebar-label">Orders</span></a></li>
            <li><a href="{{url('menu-builder')}}" class="sidebar-link"><i class="icon-cooking-pot text-[16px]"></i><span class="sidebar-label">Menu</span></a></li>
            <li><a href="{{url('table-floor-map')}}" class="sidebar-link"><i class="icon-table text-[16px]"></i><span class="sidebar-label">Tables</span></a></li>
            <li><a href="{{url('kds-queue')}}" class="sidebar-link"><i class="icon-soup text-[16px]"></i><span class="sidebar-label">Kitchen Display</span></a></li>

            <li class="sidebar-group-title">Food Delivery</li>

            <li><a href="{{url('live-map')}}" class="sidebar-link"><i class="icon-bike text-[16px]"></i><span class="sidebar-label">Live Orders</span></a></li>
            <li><a href="{{url('rider-profile')}}" class="sidebar-link"><i class="icon-users-round text-[16px]"></i><span class="sidebar-label">Riders</span></a></li>
            <li><a href="{{url('partner-restaurant-profile')}}" class="sidebar-link"><i class="icon-store text-[16px]"></i><span class="sidebar-label">Restaurants</span></a></li>
            <li><a href="{{url('delivery-zones-map')}}" class="sidebar-link"><i class="icon-map text-[16px]"></i><span class="sidebar-label">Delivery Zones</span></a></li>

            <li class="sidebar-group-title">Travel &amp; Booking</li>

            <li><a href="{{url('flights-list')}}" class="sidebar-link"><i class="icon-plane text-[16px]"></i><span class="sidebar-label">Flights</span></a></li>
            <li><a href="{{url('cabs-list')}}" class="sidebar-link"><i class="icon-car text-[16px]"></i><span class="sidebar-label">Cabs</span></a></li>
            <li><a href="{{url('cruises-list')}}" class="sidebar-link"><i class="icon-ship text-[16px]"></i><span class="sidebar-label">Cruises</span></a></li>
            <li><a href="{{url('trips-list')}}" class="sidebar-link"><i class="icon-briefcase text-[16px]"></i><span class="sidebar-label">Trips</span></a></li>
            <li><a href="{{url('bookings-list')}}" class="sidebar-link"><i class="icon-ticket-check text-[16px]"></i><span class="sidebar-label">Bookings</span></a></li>
            <li><a href="{{url('itineraries-list')}}" class="sidebar-link"><i class="icon-map text-[16px]"></i><span class="sidebar-label">Itineraries</span></a></li>

            <li class="sidebar-group-title">SEO Analytics</li>

            <li><a href="{{url('keywords-list')}}" class="sidebar-link"><i class="icon-search-check text-[16px]"></i><span class="sidebar-label">Keyword Rank</span></a></li>
            <li><a href="{{url('backlinks-list')}}" class="sidebar-link"><i class="icon-link-2 text-[16px]"></i><span class="sidebar-label">Backlinks</span></a></li>
            <li><a href="{{url('site-audits-list')}}" class="sidebar-link"><i class="icon-file-search text-[16px]"></i><span class="sidebar-label">Site Audit</span></a></li>
            <li><a href="{{url('traffic-overview')}}" class="sidebar-link"><i class="icon-globe text-[16px]"></i><span class="sidebar-label">Traffic</span></a></li>

            <li class="sidebar-group-title">HRM</li>

            <li><a href="{{url('employees-list')}}" class="sidebar-link"><i class="icon-users-round text-[16px]"></i><span class="sidebar-label">Employees</span></a></li>
            <li><a href="{{url('payroll-list')}}" class="sidebar-link"><i class="icon-banknote text-[16px]"></i><span class="sidebar-label">Payroll</span></a></li>
            <li><a href="{{url('leave-requests-list')}}" class="sidebar-link"><i class="icon-plane-takeoff text-[16px]"></i><span class="sidebar-label">Leave Requests</span></a></li>
            <li><a href="{{url('reviews-list')}}" class="sidebar-link"><i class="icon-award text-[16px]"></i><span class="sidebar-label">Performance Reviews</span></a></li>

            <li class="sidebar-group-title">AI Analytics</li>

            <li><a href="{{url('insights-list')}}" class="sidebar-link"><i class="icon-sparkle text-[16px]"></i><span class="sidebar-label">AI Insights</span></a></li>
            <li><a href="{{url('chatbot-conversations')}}" class="sidebar-link"><i class="icon-bot text-[16px]"></i><span class="sidebar-label">Chatbot Assistant</span></a></li>
            <li><a href="{{url('predictions-list')}}" class="sidebar-link"><i class="icon-brain text-[16px]"></i><span class="sidebar-label">Predictions</span></a></li>
            <li><a href="{{url('model-settings-list')}}" class="sidebar-link"><i class="icon-cpu text-[16px]"></i><span class="sidebar-label">Model Settings</span></a></li>

            <li class="sidebar-group-title">Management</li>

            <li>
                <a href="{{url('customer-explorer')}}" class="sidebar-link">
                    <i class="icon-users text-[16px]"></i><span class="sidebar-label">Customers</span>
                </a>
            </li>

            <li>
                <a href="{{url('customer-invoices')}}" class="sidebar-link">
                    <i class="icon-receipt text-[16px]"></i><span class="sidebar-label">Invoices</span>
                </a>
            </li>

            <li>
                <a href="{{url('payment-center')}}" class="sidebar-link">
                    <i class="icon-credit-card text-[16px]"></i><span class="sidebar-label">Payments</span>
                </a>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-shield-check text-[16px]"></i>
                    <span class="sidebar-label">Users &amp; Access</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('user-directory')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Users</span></a></li>
                    <li><a href="{{url('role-builder')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Roles</span></a></li>
                    <li><a href="{{url('permission-matrix')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Permissions</span></a></li>
                </ul>
            </li>

            <li class="sidebar-group-title">Reports</li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-shopping-bag text-[16px]"></i>
                    <span class="sidebar-label">Sales &amp; Ecommerce</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('sales-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Sales</span></a></li>
                    <li><a href="{{url('revenue-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Revenue</span></a></li>
                    <li><a href="{{url('product-performance-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Product Performance</span></a></li>
                    <li><a href="{{url('order-summary-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Order Summary</span></a></li>
                    <li><a href="{{url('discount-coupon-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Discount &amp; Coupon</span></a></li>
                    <li><a href="{{url('customer-purchase-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Customer Purchase</span></a></li>
                    <li><a href="{{url('cart-abandonment-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Cart Abandonment</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-boxes text-[16px]"></i>
                    <span class="sidebar-label">Inventory &amp; Logistics</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('stock-summary-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Stock Summary</span></a></li>
                    <li><a href="{{url('stock-movement-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Stock Movement</span></a></li>
                    <li><a href="{{url('purchase-order-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Purchase Order</span></a></li>
                    <li><a href="{{url('supplier-performance-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Supplier Performance</span></a></li>
                    <li><a href="{{url('shipment-delivery-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Shipment / Delivery</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-handshake text-[16px]"></i>
                    <span class="sidebar-label">CRM &amp; Sales Pipeline</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('lead-conversion-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Lead Conversion</span></a></li>
                    <li><a href="{{url('deals-pipeline-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Deals Pipeline</span></a></li>
                    <li><a href="{{url('sales-rep-performance-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Sales Rep Performance</span></a></li>
                    <li><a href="{{url('crm-activity-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Activity</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-users text-[16px]"></i>
                    <span class="sidebar-label">HRM</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('hr-attendance-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Attendance</span></a></li>
                    <li><a href="{{url('payroll-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Payroll</span></a></li>
                    <li><a href="{{url('leave-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Leave</span></a></li>
                    <li><a href="{{url('employee-performance-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Employee Performance</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-gantt-chart-square text-[16px]"></i>
                    <span class="sidebar-label">Project Management</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('project-progress-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Project Progress</span></a></li>
                    <li><a href="{{url('task-completion-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Task Completion</span></a></li>
                    <li><a href="{{url('time-tracking-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Time Tracking</span></a></li>
                    <li><a href="{{url('resource-utilization-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Resource Utilization</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-headset text-[16px]"></i>
                    <span class="sidebar-label">Support / Helpdesk</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('ticket-summary-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Ticket Summary</span></a></li>
                    <li><a href="{{url('agent-performance-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Agent Performance</span></a></li>
                    <li><a href="{{url('sla-compliance-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">SLA Compliance</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-layout-grid text-[16px]"></i>
                    <span class="sidebar-label">General</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('traffic-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Traffic</span></a></li>
                    <li><a href="{{url('user-activity-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">User Activity</span></a></li>
                    <li><a href="{{url('audit-log-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Audit Log</span></a></li>
                    <li><a href="{{url('system-usage-report')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">System Usage</span></a></li>
                    <li><a href="{{url('report-builder')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Custom Report Builder</span></a></li>
                </ul>
            </li>

            <li class="sidebar-group-title">Insights</li>

            <li>
                <a href="{{url('activity-log')}}" class="sidebar-link">
                    <i class="icon-activity text-[16px]"></i><span class="sidebar-label">Activity Log</span>
                </a>
            </li>

            <li>
                <a href="{{url('audit-log')}}" class="sidebar-link">
                    <i class="icon-file-clock text-[16px]"></i><span class="sidebar-label">Audit Log</span>
                </a>
            </li>

            <li class="sidebar-group-title">UI Interface</li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-layout-grid text-[16px]"></i>
                    <span class="sidebar-label">Base UI</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('ui-alerts')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Alerts</span></a></li>
                    <li><a href="{{url('ui-accordion')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Accordion</span></a></li>
                    <li><a href="{{url('ui-avatar')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Avatar</span></a></li>
                    <li><a href="{{url('ui-badges')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Badges</span></a></li>
                    <li><a href="{{url('ui-buttons')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Buttons</span></a></li>
                    <li><a href="{{url('ui-buttons-group')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Button Group</span></a></li>
                    <li><a href="{{url('ui-breadcrumb')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Breadcrumb</span></a></li>
                    <li><a href="{{url('ui-cards')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Card</span></a></li>
                    <li><a href="{{url('ui-colors')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Colors</span></a></li>
                    <li><a href="{{url('ui-collapse')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Collapse</span></a></li>
                    <li><a href="{{url('ui-dropdowns')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Dropdowns</span></a></li>
                    <li><a href="{{url('ui-grid')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Grid</span></a></li>
                    <li><a href="{{url('ui-images')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Images</span></a></li>
                    <li><a href="{{url('ui-modals')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Modals</span></a></li>
                    <li><a href="{{url('ui-offcanvas')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Offcanvas</span></a></li>
                    <li><a href="{{url('ui-pagination')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Pagination</span></a></li>
                    <li><a href="{{url('ui-popovers')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Popovers</span></a></li>
                    <li><a href="{{url('ui-progress')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Progress</span></a></li>
                    <li><a href="{{url('ui-nav-tabs')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Tabs</span></a></li>
                    <li><a href="{{url('ui-typography')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Typography</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-sparkles text-[16px]"></i>
                    <span class="sidebar-label">Advanced UI</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('ui-dragula')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Dragula</span></a></li>
                    <li><a href="{{url('ui-clipboard')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Clipboard</span></a></li>
                    <li><a href="{{url('ui-rangeslider')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Range Slider</span></a></li>
                    <li><a href="{{url('ui-lightbox')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Lightbox</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-notebook-pen text-[16px]"></i>
                    <span class="sidebar-label">Forms</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('form-elements')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Form Elements</span></a></li>
                    <li><a href="{{url('form-select2')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Select2</span></a></li>
                    <li><a href="{{url('form-pickers')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Form Picker</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-table text-[16px]"></i>
                    <span class="sidebar-label">Tables</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('tables-basic')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Basic Tables</span></a></li>
                    <li><a href="{{url('data-tables')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Data Table</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-pie-chart text-[16px]"></i>
                    <span class="sidebar-label">Charts</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('chart-apex')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Apex Charts</span></a></li>
                    <li><a href="{{url('chart-js')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Chart Js</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-shapes text-[16px]"></i>
                    <span class="sidebar-label">Icons</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('icon-fontawesome')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Fontawesome Icons</span></a></li>
                    <li><a href="{{url('icon-lucide')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Lucide</span></a></li>
                    <li><a href="{{url('icon-phosphor')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Phosphor</span></a></li>
                </ul>
            </li>

            <li class="sidebar-group-title">Account</li>

            <li>
                <a href="{{url('account-profile')}}" class="sidebar-link">
                    <i class="icon-user-round text-[16px]"></i><span class="sidebar-label">Profile</span>
                </a>
            </li>

            <li>
                <a href="{{url('profile-settings')}}" class="sidebar-link">
                    <i class="icon-settings text-[16px]"></i><span class="sidebar-label">Settings</span>
                </a>
            </li>

            <li>
                <a href="{{url('account-notifications')}}" class="sidebar-link">
                    <i class="icon-bell text-[16px]"></i><span class="sidebar-label">Notifications</span>
                    <span class="sidebar-badge badge-danger sidebar-meta">5</span>
                </a>
            </li>

            <li class="sidebar-group-title">Pages</li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-log-in text-[16px]"></i>
                    <span class="sidebar-label">Authentication</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('login')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Login</span></a></li>
                    <li><a href="{{url('register')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Register</span></a></li>
                    <li><a href="{{url('forgot-password')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Forgot Password</span></a></li>
                    <li><a href="{{url('reset-password')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Reset Password</span></a></li>
                    <li><a href="{{url('lock-screen')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Lock Screen</span></a></li>
                    <li><a href="{{url('verify-otp')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Two-Factor Auth</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-alert-triangle text-[16px]"></i>
                    <span class="sidebar-label">Error Pages</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{url('error-404')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">404 Not Found</span></a></li>
                    <li><a href="{{url('error-500')}}" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">500 Server Error</span></a></li>
                </ul>
            </li>

            <li class="sidebar-group-title">Support</li>

            <li>
                <a href="https://dreamscore.dreamstechnologies.com/documentation/laravel.html" target="_blank" class="sidebar-link">
                    <i class="icon-book-open text-[16px]"></i><span class="sidebar-label">Documentation</span>
                </a>
            </li>

            <li>
                <a href="{{url('faq')}}" class="sidebar-link">
                    <i class="icon-help-circle text-[16px]"></i><span class="sidebar-label">FAQ</span>
                </a>
            </li>

            <li>
                <a href="https://dreamscore.dreamstechnologies.com/documentation/changelog.html" target="_blank" class="sidebar-link">
                    <i class="icon-life-buoy text-[16px]"></i><span class="sidebar-label">Changelog</span>
                </a>
            </li>

        </ul>
    </nav>

    <!-- Storage / usage meter -->
    <div class="workspace-text px-3 pb-2 shrink-0">
        <div class="rounded-xl p-3 bg-[rgb(255_255_255_/_0.04)] border border-[rgb(255_255_255_/_0.06)]">
            <div class="flex items-center justify-between">
                <span class="flex items-center gap-1.5 text-[11px] font-semibold text-white"><i class="icon-database text-[12px] text-[var(--color-primary-400)]"></i>Storage</span>
                <span class="text-[10.5px] font-semibold text-[var(--sidebar-text)]">68.4 / 100 GB</span>
            </div>
            <div class="h-1.5 rounded-full mt-2 overflow-hidden bg-[rgb(255_255_255_/_0.08)]">
                <div class="h-full rounded-full w-[68%] bg-[linear-gradient(90deg,var(--color-primary-400),var(--color-accent-500))]"></div>
            </div>
            <a href="{{url('subscription')}}" class="inline-flex items-center gap-1 text-[10.5px] font-semibold mt-2 text-[var(--color-primary-400)]">Upgrade plan<i class="icon-arrow-right text-[9px]"></i></a>
        </div>
    </div>

    <!-- User profile / logout -->
    <div class="p-3 border-t shrink-0 border-[var(--sidebar-border)]">
        <div id="sidebarUserTrigger" class="w-full flex items-center gap-2.5 rounded-lg p-2 transition-colors bg-[rgb(255_255_255_/_0.04)]">
            <a href="{{url('account-profile')}}" class="flex items-center gap-2.5 min-w-0 flex-1">
                <span class="relative shrink-0">
                    <img src="{{URL::asset('/build/img/avatar/avatar-12.jpg')}}" alt="User profile avatar" class="size-8 rounded-full object-cover border-[1.5px] border-[rgb(255_255_255_/_0.18)]">
                    <span class="absolute -bottom-0.5 -end-0.5 size-2.5 rounded-full bg-[var(--color-success-500)] border-2 border-[var(--sidebar-bg)]"></span>
                </span>
                <span class="workspace-text text-left min-w-0">
                    <span class="flex items-center gap-1.5">
                        <span class="block text-[12.5px] font-semibold text-white truncate">Amelia Hart</span>
                        <span class="inline-flex items-center px-1 py-px rounded text-[8.5px] font-bold uppercase tracking-wide shrink-0 bg-[color-mix(in_oklab,var(--color-accent-500)_30%,transparent)] text-[var(--color-accent-400,#FBBF24)]">Pro</span>
                    </span>
                    <span class="block text-[10.5px] truncate text-[var(--sidebar-text)]">Product Admin</span>
                </span>
            </a>
            <form method="POST" action="{{ route('logout') }}" id="logout-form" class="hidden">
                @csrf
            </form>
            <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();" class="workspace-text header-icon-btn !text-white/60 hover:!text-white hover:!bg-white/10 !size-7 shrink-0" title="Sign out" aria-label="Sign out"><i class="icon-log-out text-[14px]"></i></a>
        </div>
    </div>

</aside>
<!-- Sidenav Menu End -->
