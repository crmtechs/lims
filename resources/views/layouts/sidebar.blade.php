<!-- ================= SIDEBAR ================= -->
<aside class="app-sidebar sidebar-pattern scroll-thin" id="appSidebar" aria-label="Sidebar">

    <!-- Logo + collapse toggle -->
    <div class="flex items-center justify-between h-16 px-4 shrink-0 border-b border-[var(--sidebar-border)]">
        <a href="{{ route('dashboard') }}" class="flex items-center gap-2.5 min-w-0 rounded-xl px-2.5 py-1.5">
            <img src="{{ asset('images/logo-white.png') }}" alt="Logo" class="sidebar-logo-full max-w-[150px] object-contain shrink-0">
            <img src="{{ asset('images/logo-small.png') }}" alt="Logo" class="sidebar-logo-small size-8 object-contain shrink-0 hidden">
        </a>
        <button type="button" id="sidebarCollapseBtn" class="header-icon-btn !text-white/60 hover:!text-white hover:!bg-white/10 !size-8 shrink-0" aria-label="Collapse sidebar">
            <i class="icon-panel-left-close text-[17px]"></i>
        </button>
    </div>

    <!-- Main navigation -->
    <nav class="sidebar-inner flex-1 overflow-y-auto scroll-thin px-3 pb-4 mt-1" aria-label="Sidebar navigation">
        <ul id="sidebarMenu" role="menu" aria-label="Main navigation">
            <li class="has-submenu {{ request()->routeIs('dashboard') ? 'is-open' : '' }}" data-open="{{ request()->routeIs('dashboard') ? 'true' : 'false' }}">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-home text-[16px]"></i>
                    <span class="sidebar-label">Home</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{ route('dashboard') }}" class="sidebar-link !text-[12.5px] {{ request()->routeIs('dashboard') ? 'is-active' : '' }}" wire:navigate data-active="{{ request()->routeIs('dashboard') ? 'true' : 'false' }}"><span class="sidebar-label">Dashboard</span></a></li>
                </ul>
            </li>

            <li class="has-submenu {{ request()->routeIs('core.*') ? 'is-open' : '' }}" data-open="{{ request()->routeIs('core.*') ? 'true' : 'false' }}">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-cpu text-[16px]"></i>
                    <span class="sidebar-label">Core</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="{{ route('core.disciplines.index') }}" class="sidebar-link !text-[12.5px] {{ request()->routeIs('core.disciplines.*') ? 'is-active' : '' }}" data-active="{{ request()->routeIs('core.disciplines.*') ? 'true' : 'false' }}"><span class="sidebar-label">Disciplines</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Discipline Groups</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-folder text-[16px]"></i>
                    <span class="sidebar-label">Masters</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">LQMs</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Uncertainty Budgets</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Terms And Conditions</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Annexures</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Forms</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Reference Standards</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Files &amp; Formats</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Datasheets</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">SOPs</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Uncertainty Components</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Products (IUC)</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Equipments</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-shopping-cart text-[16px]"></i>
                    <span class="sidebar-label">Sales</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Clients</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Contacts</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Enquiries</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Quotes</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-headset text-[16px]"></i>
                    <span class="sidebar-label">CSC</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">SRFs</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Job Cards</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Delivery Challans</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Courier Management</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-wrench text-[16px]"></i>
                    <span class="sidebar-label">Technical</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Datasheets</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Jobs</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Equipment Movement Records</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Maintenance Histories</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Intermediate Checks</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Quality Planner</span></a></li>
                </ul>
            </li>

            <li class="has-submenu">
                <button type="button" class="sidebar-link w-full" data-submenu-toggle>
                    <i class="icon-list-todo text-[16px]"></i>
                    <span class="sidebar-label">Activities</span>
                    <i class="icon-chevron-right sidebar-chevron text-[11px]"></i>
                </button>
                <ul class="sidebar-submenu">
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Tasks</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Calls</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Meetings</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Emails</span></a></li>
                    <li><a href="javascript:void(0);" class="sidebar-link !text-[12.5px]"><span class="sidebar-label">Credential Manager</span></a></li>
                </ul>
            </li>

        </ul>
    </nav>
</aside>
<!-- Sidenav Menu End -->
