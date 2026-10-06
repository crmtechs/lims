<!-- ================= HEADER ================= -->
<header class="app-header">
    <!-- Premium accent line -->
    <div class="absolute inset-x-0 bottom-0 h-px pointer-events-none [background:linear-gradient(90deg,transparent,var(--color-primary-500)_20%,var(--color-accent-500)_50%,var(--color-primary-500)_80%,transparent)] opacity-[0.55]"></div>

    <div class="flex items-center gap-3 px-4 lg:px-6 h-16">

        <!-- Mobile sidebar toggle -->
        <button type="button" id="mobileSidebarBtn" class="header-icon-btn lg:hidden" aria-label="Open menu">
            <i class="icon-menu text-[18px]"></i>
        </button>

        <!-- Mobile logo (shown next to the sidebar toggle on small screens) -->
        <a href="{{url('index')}}" class="lg:hidden shrink-0" aria-label="Dreams Core">
            <img src="{{URL::asset('build/img/logo-small.svg')}}" alt="Dreams Core logo" class="size-8 object-contain">
        </a>

        <!-- Global search -->
        <button type="button" id="headerSearchBar" class="group hidden md:flex items-center gap-2.5 w-full max-w-[240px] xl:max-w-[280px] h-10 pe-3.5 ps-1.5 rounded-full transition-all hover:shadow-[var(--shadow-sm)] bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
            <span class="grid place-items-center size-7 rounded-full shrink-0 transition-colors bg-[color-mix(in_oklab,var(--color-primary-500)_16%,transparent)] text-[var(--color-primary-600)]">
                <i class="icon-search text-[13px]"></i>
            </span>
            <span class="text-[13px] flex-1 text-start truncate font-medium text-[var(--text-tertiary)]">Search orders, customers, products…</span>
            <kbd class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 transition-colors group-hover:border-[var(--color-primary-400)] bg-[var(--surface-raised)] text-[var(--text-tertiary)] border border-[var(--border-default)]">⌘K</kbd>
        </button>

        <!-- Explore + Apps -->
        <div class="hidden lg:flex items-center gap-0.5 h-10 px-1 rounded-full bg-[var(--surface-sunken)] border border-[var(--border-subtle)]">
            <div class="hs-dropdown [--strategy:static] relative">
                <button type="button" class="hs-dropdown-toggle flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors hover:bg-[var(--surface-sunken)]" aria-haspopup="menu" aria-expanded="false">
                    <i class="icon-layout-grid text-[13px]"></i>Explore<i class="icon-chevron-down text-[9px] opacity-70"></i>
                </button>
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration fixed top-[72px] start-1/2 -translate-x-1/2 w-[94vw] max-w-[840px] surface-card !p-0 overflow-hidden z-50 shadow-[var(--shadow-xl)]" role="menu" aria-orientation="vertical">

                    <!-- Search header -->
                    <div class="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-subtle)] [background:linear-gradient(180deg,var(--surface-sunken),transparent)]">
                        <span class="grid place-items-center size-9 rounded-xl shrink-0 bg-[var(--color-primary-600)] shadow-[0_6px_16px_-4px_color-mix(in_oklab,var(--color-primary-600)_55%,transparent)]"><i class="icon-layout-grid text-[16px] text-white"></i></span>
                        <div class="min-w-0 flex-1">
                            <p class="font-display font-bold text-[15px] leading-tight">Explore Dreamscore</p>
                            <p class="text-[11.5px] text-[var(--text-tertiary)]">42 workspaces &middot; jump to any app or module</p>
                        </div>
                    </div>

                    <!-- Recently visited -->
                    <div class="flex items-center gap-2 px-5 py-3 border-b overflow-x-auto scroll-thin border-[var(--border-subtle)]">
                        <span class="text-[10.5px] font-semibold uppercase tracking-wide shrink-0 text-[var(--text-tertiary)]">Recent</span>
                        <a href="{{url('orders')}}" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium shrink-0 transition-colors hover:bg-[var(--surface-sunken)] border border-[var(--border-subtle)]"><i class="icon-shopping-bag text-[11px] text-[var(--color-info-600)]"></i>Orders</a>
                        <a href="{{url('products-list')}}" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium shrink-0 transition-colors hover:bg-[var(--surface-sunken)] border border-[var(--border-subtle)]"><i class="icon-package text-[11px] text-[var(--color-accent-600)]"></i>Products</a>
                        <a href="{{url('index')}}" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium shrink-0 transition-colors hover:bg-[var(--surface-sunken)] border border-[var(--border-subtle)]"><i class="icon-store text-[11px] text-[var(--color-primary-600)]"></i>Ecommerce</a>
                        <a href="#" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium shrink-0 transition-colors hover:bg-[var(--surface-sunken)] border border-[var(--border-subtle)]"><i class="icon-contact text-[11px] text-[var(--color-success-600)]"></i>CRM</a>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_200px]">

                        <div class="p-5 lg:border-e border-[var(--border-subtle)]">
                            <p class="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide mb-3 text-[var(--text-tertiary)]"><i class="icon-layout-dashboard text-[11px]"></i>Dashboards</p>
                            <ul class="space-y-0.5">
                                <li><a href="{{url('index')}}" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-primary size-8 shrink-0"><i class="icon-store text-[13px]"></i></span><span class="flex-1">Ecommerce</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="#" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-accent size-8 shrink-0"><i class="icon-handshake text-[13px]"></i></span><span class="flex-1">Sales</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="#" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-neutral size-8 shrink-0"><i class="icon-warehouse text-[13px]"></i></span><span class="flex-1">Warehouse</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="#" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-info size-8 shrink-0"><i class="icon-contact text-[13px]"></i></span><span class="flex-1">CRM</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="#" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-success size-8 shrink-0"><i class="icon-sparkle text-[13px]"></i></span><span class="flex-1">AI Analytics</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                            </ul>
                        </div>

                        <div class="p-5 lg:border-e border-[var(--border-subtle)]">
                            <p class="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide mb-3 text-[var(--text-tertiary)]"><i class="icon-grip text-[11px]"></i>Applications</p>
                            <ul class="space-y-0.5">
                                <li><a href="{{url('calendar')}}" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-primary size-8 shrink-0"><i class="icon-calendar-days text-[13px]"></i></span><span class="flex-1">Calendar</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="{{url('chat')}}" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-info size-8 shrink-0"><i class="icon-message-circle text-[13px]"></i></span><span class="flex-1">Chat</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="{{url('email')}}" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-warning size-8 shrink-0"><i class="icon-mail text-[13px]"></i></span><span class="flex-1">Email</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="{{url('file-manager')}}" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-neutral size-8 shrink-0"><i class="icon-folder text-[13px]"></i></span><span class="flex-1">File Manager</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="#" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-accent size-8 shrink-0"><i class="icon-kanban text-[13px]"></i></span><span class="flex-1">Kanban</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                            </ul>
                        </div>

                        <div class="p-5 lg:border-e border-[var(--border-subtle)]">
                            <p class="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide mb-3 text-[var(--text-tertiary)]"><i class="icon-briefcase-business text-[11px]"></i>Management</p>
                            <ul class="space-y-0.5">
                                <li><a href="#" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-primary size-8 shrink-0"><i class="icon-users text-[13px]"></i></span><span class="flex-1">Customers</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="{{url('products-list')}}" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-accent size-8 shrink-0"><i class="icon-package text-[13px]"></i></span><span class="flex-1">Products</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="{{url('orders')}}" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-info size-8 shrink-0"><i class="icon-shopping-bag text-[13px]"></i></span><span class="flex-1">Orders</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="{{url('invoices-list')}}" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-success size-8 shrink-0"><i class="icon-receipt text-[13px]"></i></span><span class="flex-1">Invoices</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                                <li><a href="#" class="group flex items-center gap-2.5 px-2 py-2 -mx-2 rounded-lg text-[13px] font-medium transition-colors hover:bg-[var(--surface-sunken)]"><span class="icon-chip is-neutral size-8 shrink-0"><i class="icon-credit-card text-[13px]"></i></span><span class="flex-1">Payments</span><i class="icon-arrow-up-right text-[11px] opacity-0 -translate-x-1 transition-all group-hover:opacity-60 group-hover:translate-x-0 text-[var(--text-tertiary)]"></i></a></li>
                            </ul>
                        </div>

                        <div class="p-4 flex flex-col">
                            <div class="rounded-2xl p-4 text-white relative overflow-hidden flex flex-col items-start flex-1 [background:linear-gradient(155deg,var(--color-primary-700),var(--color-primary-950))]">
                                <span class="absolute -top-8 -end-8 size-24 rounded-full bg-[rgb(255_255_255_/_0.08)] blur-[2px]"></span>
                                <span class="absolute -bottom-10 -start-6 size-20 rounded-full bg-[var(--color-accent-500)] opacity-[0.18] blur-[6px]"></span>
                                <span class="grid place-items-center size-9 rounded-xl mb-3 relative bg-[rgb(255_255_255_/_0.16)]"><i class="icon-sparkle text-[16px]"></i></span>
                                <p class="text-[13px] font-semibold leading-snug relative">Explore AI Insights</p>
                                <p class="text-[11.5px] mt-1.5 relative text-[rgb(255_255_255_/_0.75)]">Smart, real-time recommendations tailored to your business.</p>
                                <a href="#" class="inline-flex items-center justify-center gap-1.5 w-full text-[11.5px] font-semibold mt-4 py-2 rounded-lg relative transition-colors hover:bg-white/90 bg-[#fff] text-[var(--color-primary-800)]">Try it now <i class="icon-arrow-up-right text-[10px]"></i></a>
                            </div>
                        </div>

                    </div>

                    <div class="flex items-center justify-between px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
                        <p class="text-[11px] text-[var(--text-tertiary)]"><span class="font-semibold text-[var(--text-primary)]">42</span> workspaces available</p>
                        <a href="#" class="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[var(--color-primary-600)]">View full directory <i class="icon-arrow-right text-[10px]"></i></a>
                    </div>
                </div>
            </div>

            <div class="hs-dropdown [--placement:bottom-start] relative">
                <button type="button" class="hs-dropdown-toggle flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors hover:bg-[var(--surface-sunken)]" aria-haspopup="menu" aria-expanded="false">
                    <i class="icon-grip text-[13px]"></i>Apps<i class="icon-chevron-down text-[9px] opacity-70"></i>
                </button>
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-3 w-[340px] surface-card !p-0 overflow-hidden z-50" role="menu" aria-orientation="vertical">
                    <div class="flex items-center justify-between px-4 py-3.5 border-b border-[var(--border-subtle)]">
                        <div>
                            <p class="font-display font-bold text-[14px]">Apps</p>
                            <p class="text-[11px] mt-0.5 text-[var(--text-tertiary)]">Jump to a workspace app</p>
                        </div>
                        <a href="{{url('profile-settings')}}" class="header-icon-btn" aria-label="App settings"><i class="icon-settings text-[15px]"></i></a>
                    </div>
                    <div class="grid grid-cols-3 gap-2 p-4">
                        <a href="{{url('calendar')}}" class="flex flex-col items-center gap-1.5 p-2 rounded-lg text-center hover:bg-[var(--surface-sunken)]">
                            <span class="grid place-items-center size-11 rounded-xl badge-solid-primary"><i class="icon-calendar-days text-[18px]"></i></span>
                            <span class="text-[11.5px] font-medium">Calendar</span>
                        </a>
                        <a href="{{url('email')}}" class="flex flex-col items-center gap-1.5 p-2 rounded-lg text-center hover:bg-[var(--surface-sunken)]">
                            <span class="grid place-items-center size-11 rounded-xl badge-solid-success"><i class="icon-mail text-[18px]"></i></span>
                            <span class="text-[11.5px] font-medium">Email</span>
                        </a>
                        <a href="{{url('chat')}}" class="flex flex-col items-center gap-1.5 p-2 rounded-lg text-center hover:bg-[var(--surface-sunken)]">
                            <span class="grid place-items-center size-11 rounded-xl badge-solid-info"><i class="icon-message-circle text-[18px]"></i></span>
                            <span class="text-[11.5px] font-medium">Chat</span>
                        </a>
                        <a href="{{url('todo')}}" class="flex flex-col items-center gap-1.5 p-2 rounded-lg text-center hover:bg-[var(--surface-sunken)]">
                            <span class="grid place-items-center size-11 rounded-xl badge-solid-accent"><i class="icon-list-todo text-[18px]"></i></span>
                            <span class="text-[11.5px] font-medium">To Do</span>
                        </a>
                        <a href="{{url('file-manager')}}" class="flex flex-col items-center gap-1.5 p-2 rounded-lg text-center hover:bg-[var(--surface-sunken)]">
                            <span class="grid place-items-center size-11 rounded-xl badge-solid-danger"><i class="icon-folder text-[18px]"></i></span>
                            <span class="text-[11.5px] font-medium">Files</span>
                        </a>
                        <a href="{{url('notes')}}" class="flex flex-col items-center gap-1.5 p-2 rounded-lg text-center hover:bg-[var(--surface-sunken)]">
                            <span class="grid place-items-center size-11 rounded-xl badge-solid-neutral"><i class="icon-notebook-text text-[18px]"></i></span>
                            <span class="text-[11.5px] font-medium">Notes</span>
                        </a>
                        <a href="{{url('voice-call')}}" class="flex flex-col items-center gap-1.5 p-2 rounded-lg text-center hover:bg-[var(--surface-sunken)]">
                            <span class="grid place-items-center size-11 rounded-xl badge-solid-accent"><i class="icon-phone text-[18px]"></i></span>
                            <span class="text-[11.5px] font-medium">Call</span>
                        </a>
                        <a href="{{url('invoices-list')}}" class="flex flex-col items-center gap-1.5 p-2 rounded-lg text-center hover:bg-[var(--surface-sunken)]">
                            <span class="grid place-items-center size-11 rounded-xl badge-solid-success"><i class="icon-receipt text-[18px]"></i></span>
                            <span class="text-[11.5px] font-medium">Invoices</span>
                        </a>
                        <a href="{{url('customer-support-tickets')}}" class="flex flex-col items-center gap-1.5 p-2 rounded-lg text-center hover:bg-[var(--surface-sunken)]">
                            <span class="grid place-items-center size-11 rounded-xl badge-solid-danger"><i class="icon-ticket text-[18px]"></i></span>
                            <span class="text-[11.5px] font-medium">Tickets</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="ms-auto flex items-center gap-2.5 lg:gap-3">

            <!-- Quick actions (desktop) -->
            <div class="hs-dropdown [--placement:bottom-end] relative hidden sm:block">
                <button type="button" class="hs-dropdown-toggle inline-flex items-center gap-2 h-10 ps-3.5 pe-3 rounded-full text-[12.5px] font-semibold text-white transition-all hover:shadow-[0_10px_20px_-8px_var(--color-primary-600)] hover:-translate-y-px bg-[var(--color-primary-600)] shadow-[0_6px_14px_-6px_color-mix(in_oklab,var(--color-primary-600)_60%,transparent)]" aria-haspopup="menu" aria-expanded="false">
                    <i class="icon-plus text-[13px]"></i>
                    <span>Quick Create</span>
                    <i class="icon-chevron-down text-[9px] opacity-80"></i>
                </button>
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-2 w-56 surface-card p-1.5 z-50" role="menu" aria-orientation="vertical">
                    <a href="{{url('invoice-add')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-receipt text-[15px] text-[var(--color-primary-600)]"></i>New Invoice</a>
                    <a href="{{url('customer-add')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-user-plus text-[15px] text-[var(--color-primary-600)]"></i>Add Customer</a>
                    <a href="{{url('product-add')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-package text-[15px] text-[var(--color-primary-600)]"></i>New Product</a>
                    <a href="{{url('task-add')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-kanban text-[15px] text-[var(--color-primary-600)]"></i>New Task</a>
                </div>
            </div>

            <!-- Quick actions (mobile) -->
            <div class="hs-dropdown [--placement:bottom-end] relative sm:hidden">
                <button type="button" class="hs-dropdown-toggle header-icon-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Quick create">
                    <i class="icon-plus text-[17px]"></i>
                </button>
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-2 w-56 surface-card p-1.5 z-50" role="menu" aria-orientation="vertical">
                    <a href="{{url('invoice-add')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-receipt text-[15px] text-[var(--color-primary-600)]"></i>New Invoice</a>
                    <a href="{{url('customer-add')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-user-plus text-[15px] text-[var(--color-primary-600)]"></i>Add Customer</a>
                    <a href="{{url('product-add')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-package text-[15px] text-[var(--color-primary-600)]"></i>New Product</a>
                    <a href="{{url('task-add')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-kanban text-[15px] text-[var(--color-primary-600)]"></i>New Task</a>
                </div>
            </div>

            <!-- Theme switcher (always visible, incl. mobile) -->
            <div class="hs-dropdown [--placement:bottom-end] [--auto-close:inside] relative">
                <button type="button" class="hs-dropdown-toggle grid place-items-center size-7 rounded-full transition-transform hover:scale-105 bg-[color-mix(in_oklab,var(--color-warning-500)_16%,transparent)] text-[var(--color-warning-600)]" aria-haspopup="menu" aria-expanded="false" aria-label="Theme">
                    <i class="icon-sun-medium text-[13.5px]" id="themeIcon"></i>
                </button>
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-2 w-44 surface-card p-1.5 z-50" role="menu" aria-orientation="vertical">
                    <button type="button" data-theme-set="light" class="theme-option w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-sun-medium text-[15px]"></i>Light<i class="icon-check text-[12px] ms-auto opacity-0"></i></button>
                    <button type="button" data-theme-set="dark" class="theme-option w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-moon text-[15px]"></i>Dark<i class="icon-check text-[12px] ms-auto opacity-0"></i></button>
                    <button type="button" data-theme-set="system" class="theme-option w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-monitor text-[15px]"></i>System<i class="icon-check text-[12px] ms-auto opacity-0"></i></button>
                </div>
            </div>

            <!-- Soft elevated toolbar: each icon in its own tinted chip -->
            <div class="hidden sm:flex items-center gap-1 h-10 px-1.5 rounded-full bg-[var(--surface-raised)] border border-[var(--border-subtle)] shadow-[var(--shadow-sm)]">

                <!-- Language selector -->
                <div class="hs-dropdown [--placement:bottom-end] relative">
                    <button type="button" class="hs-dropdown-toggle grid place-items-center size-7 rounded-full transition-transform hover:scale-105 bg-[color-mix(in_oklab,var(--color-info-500)_14%,transparent)] text-[var(--color-info-600)]" aria-haspopup="menu" aria-expanded="false" aria-label="Language">
                        <i class="icon-languages text-[13.5px]"></i>
                    </button>
                    <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-2 w-44 surface-card p-1.5 z-50" role="menu" aria-orientation="vertical">
                        <button type="button" data-lang-set="en" class="lang-option w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><span>🇺🇸</span>English<i class="icon-check text-[12px] ms-auto opacity-0"></i></button>
                        <button type="button" data-lang-set="fr" class="lang-option w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><span>🇫🇷</span>Français<i class="icon-check text-[12px] ms-auto opacity-0"></i></button>
                        <button type="button" data-lang-set="de" class="lang-option w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><span>🇩🇪</span>Deutsch<i class="icon-check text-[12px] ms-auto opacity-0"></i></button>
                        <button type="button" data-lang-set="ar" class="lang-option w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><span>🇸🇦</span>العربية<i class="icon-check text-[12px] ms-auto opacity-0"></i></button>
                    </div>
                </div>

                <!-- Fullscreen -->
                <button type="button" class="grid place-items-center size-7 rounded-full transition-transform hover:scale-105 bg-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] text-[var(--text-secondary)]" id="fullscreenBtn" aria-label="Toggle fullscreen">
                    <i class="icon-maximize text-[13.5px]" id="fullscreenIcon"></i>
                </button>

                <!-- Messages (opens chat offcanvas) -->
                <button type="button" class="relative grid place-items-center size-7 rounded-full transition-transform hover:scale-105 bg-[color-mix(in_oklab,var(--color-accent-500)_16%,transparent)] text-[var(--color-accent-600)]" id="messagesOffcanvasBtn" aria-haspopup="true" aria-expanded="false" aria-label="Messages">
                    <i class="icon-messages-square text-[13.5px]"></i>
                    <span class="absolute top-0.5 end-0.5 size-1.5 rounded-full bg-[var(--color-accent-500)] border-[1.5px] border-[var(--surface-raised)]"></span>
                </button>

                <!-- Notifications -->
                <div class="hs-dropdown [--placement:bottom-end] relative">
                    <button type="button" class="hs-dropdown-toggle relative grid place-items-center size-7 rounded-full transition-transform hover:scale-105 bg-[color-mix(in_oklab,var(--color-danger-500)_14%,transparent)] text-[var(--color-danger-600)]" aria-haspopup="menu" aria-expanded="false" aria-label="Notifications">
                        <i class="icon-bell text-[13.5px]"></i>
                    </button>
                    <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-2 w-96 surface-card !p-0 overflow-hidden z-50 shadow-[var(--shadow-xl)]" role="menu" aria-orientation="vertical">

                        <!-- Header -->
                        <div class="relative px-4 pt-4 pb-3.5 overflow-hidden [background:linear-gradient(155deg,var(--color-primary-700),var(--color-primary-950)_75%)]">
                            <span class="absolute -top-8 -end-6 size-20 rounded-full pointer-events-none bg-[rgb(255_255_255_/_0.08)] blur-[2px]"></span>
                            <div class="relative flex items-center justify-between">
                                <span class="flex items-center gap-2">
                                    <span class="font-display font-bold text-[14.5px] text-white">Notifications</span>
                                    <span class="inline-flex items-center justify-center min-w-[19px] h-[19px] px-1 rounded-full text-[10px] font-bold bg-[rgb(255_255_255_/_0.2)] text-[#fff]">4 new</span>
                                </span>
                                <button type="button" class="grid place-items-center size-7 rounded-full transition-colors hover:bg-[rgb(255_255_255_/_0.14)] text-[rgb(255_255_255_/_0.8)]" aria-label="Notification settings"><i class="icon-settings text-[13px]"></i></button>
                            </div>
                            <!-- Filter tabs -->
                            <div class="relative flex items-center gap-1.5 mt-3.5">
                                <button type="button" class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff] text-[var(--color-primary-800)]">All</button>
                                <button type="button" class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgb(255_255_255_/_0.14)] text-[rgb(255_255_255_/_0.85)]">Unread</button>
                                <button type="button" class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgb(255_255_255_/_0.14)] text-[rgb(255_255_255_/_0.85)]">Mentions</button>
                                <button type="button" class="ms-auto text-[11px] font-semibold text-[rgb(255_255_255_/_0.85)]">Mark all read</button>
                            </div>
                        </div>

                        <div class="max-h-96 overflow-y-auto scroll-thin">
                            <p class="px-4 pt-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Today</p>
                            <a href="#" class="relative flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] transition-colors">
                                <span class="absolute start-1.5 top-5 size-1.5 rounded-full bg-[var(--color-primary-500)]"></span>
                                <span class="grid place-items-center size-9 rounded-xl shrink-0 badge-solid-success"><i class="icon-check text-[15px]"></i></span>
                                <span class="min-w-0 flex-1">
                                    <span class="flex items-start justify-between gap-2">
                                        <span class="text-[12.5px] font-semibold leading-snug">Payment received</span>
                                        <span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">5m</span>
                                    </span>
                                    <span class="block text-[12px] mt-0.5 text-[var(--text-secondary)]">$2,480 from <strong>Nova Retail</strong> was credited to your account.</span>
                                    <span class="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-[color-mix(in_oklab,var(--color-success-500)_14%,transparent)] text-[var(--color-success-600)]">Finance</span>
                                </span>
                            </a>
                            <a href="#" class="relative flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] transition-colors">
                                <span class="absolute start-1.5 top-5 size-1.5 rounded-full bg-[var(--color-primary-500)]"></span>
                                <span class="grid place-items-center size-9 rounded-xl shrink-0 badge-solid-warning"><i class="icon-alert-triangle text-[15px]"></i></span>
                                <span class="min-w-0 flex-1">
                                    <span class="flex items-start justify-between gap-2">
                                        <span class="text-[12.5px] font-semibold leading-snug">Low stock alert</span>
                                        <span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">42m</span>
                                    </span>
                                    <span class="block text-[12px] mt-0.5 text-[var(--text-secondary)]">Inventory for <strong>SKU-2291</strong> has dropped below the reorder threshold.</span>
                                    <span class="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-[color-mix(in_oklab,var(--color-warning-500)_16%,transparent)] text-[var(--color-warning-600)]">Inventory</span>
                                </span>
                            </a>

                            <p class="px-4 pt-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Earlier</p>
                            <a href="#" class="flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] transition-colors">
                                <img src="{{URL::asset('/build/img/avatar/avatar-16.jpg')}}" alt="Sofia Reyes avatar" class="size-9 rounded-xl object-cover shrink-0">
                                <span class="min-w-0 flex-1">
                                    <span class="flex items-start justify-between gap-2">
                                        <span class="text-[12.5px] font-semibold leading-snug">New team member</span>
                                        <span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">3h</span>
                                    </span>
                                    <span class="block text-[12px] mt-0.5 text-[var(--text-secondary)]"><strong>Sofia Reyes</strong> joined the Design team.</span>
                                    <span class="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-[color-mix(in_oklab,var(--color-primary-500)_14%,transparent)] text-[var(--color-primary-600)]">Team</span>
                                </span>
                            </a>
                            <a href="#" class="flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] transition-colors">
                                <span class="grid place-items-center size-9 rounded-xl shrink-0 badge-solid-accent"><i class="icon-sparkle text-[15px]"></i></span>
                                <span class="min-w-0 flex-1">
                                    <span class="flex items-start justify-between gap-2">
                                        <span class="text-[12.5px] font-semibold leading-snug">Weekly AI insight ready</span>
                                        <span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">Yesterday</span>
                                    </span>
                                    <span class="block text-[12px] mt-0.5 text-[var(--text-secondary)]">Your personalized performance report has new recommendations.</span>
                                    <span class="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-[color-mix(in_oklab,var(--color-accent-500)_16%,transparent)] text-[var(--color-accent-600)]">AI Insights</span>
                                </span>
                            </a>
                        </div>

                        <a href="{{url('account-notifications')}}" class="flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold border-t border-[var(--border-subtle)] text-[var(--color-primary-600)]">View all notifications<i class="icon-arrow-right text-[11px]"></i></a>
                    </div>
                </div>

            </div>

            <!-- User profile -->
            <div class="hs-dropdown [--placement:bottom-end] relative">
                <button type="button" class="hs-dropdown-toggle flex items-center gap-2 h-10 ps-1 pe-2.5 rounded-full transition-colors hover:bg-[var(--surface-sunken)] border border-[var(--border-subtle)]" aria-haspopup="menu" aria-expanded="false">
                    <span class="relative shrink-0 rounded-full p-[2px] max-[991px]:p-0 [background:conic-gradient(from_180deg,var(--color-primary-500),var(--color-accent-500),var(--color-primary-500))] max-[991px]:[background:none]">
                        <img src="{{URL::asset('/build/img/avatar/avatar-12.jpg')}}" alt="User profile avatar" class="size-7 rounded-full object-cover block border-[2px] border-[var(--surface-base)] max-[991px]:border-0">
                    </span>
                    <span class="hidden lg:flex flex-col items-start leading-none">
                        <span class="text-[12px] font-semibold">Amelia</span>
                        <span class="text-[10px] text-[var(--text-tertiary)]">Admin</span>
                    </span>
                    <i class="hidden lg:block icon-chevron-down text-[10px] text-[var(--text-tertiary)]"></i>
                </button>
                <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-2 w-72 surface-card !p-0 overflow-hidden z-50" role="menu" aria-orientation="vertical">

                    <!-- Profile header card -->
                    <div class="relative px-4 pt-4 pb-3.5 overflow-hidden [background:linear-gradient(155deg,var(--color-primary-700),var(--color-primary-950)_75%)]">
                        <span class="absolute -top-8 -end-8 size-24 rounded-full pointer-events-none bg-[rgb(255_255_255_/_0.08)] blur-[2px]"></span>
                        <span class="absolute -bottom-10 -start-6 size-20 rounded-full pointer-events-none bg-[var(--color-accent-500)] opacity-[0.18] blur-[6px]"></span>
                        <div class="relative flex items-center gap-3">
                            <span class="relative shrink-0">
                                <img src="{{URL::asset('/build/img/avatar/avatar-12.jpg')}}" alt="Amelia Hart profile avatar" class="size-11 rounded-full object-cover border-[2px] border-[rgb(255_255_255_/_0.25)]">
                                <span class="absolute bottom-0 end-0 size-2.5 rounded-full bg-[var(--color-success-500)] border-[2px] border-[var(--color-primary-800)]"></span>
                            </span>
                            <span class="min-w-0 flex-1">
                                <span class="flex items-center gap-1.5">
                                    <span class="block text-[14px] font-display font-bold text-white truncate">Amelia Hart</span>
                                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide shrink-0 bg-[rgb(255_255_255_/_0.18)] text-[#fff]"><i class="icon-crown text-[9px]"></i>Pro</span>
                                </span>
                                <span class="block text-[11.5px] truncate text-[rgb(255_255_255_/_0.72)]">amelia@dreamsadmin.com</span>
                            </span>
                        </div>

                        <!-- Mini stat row -->
                        <div class="relative grid grid-cols-3 gap-2 mt-3.5">
                            <div class="rounded-lg py-1.5 text-center bg-[rgb(255_255_255_/_0.08)]">
                                <p class="font-display font-bold text-[13px] text-white leading-none">12</p>
                                <p class="text-[9.5px] mt-1 text-[rgb(255_255_255_/_0.65)]">Tasks Today</p>
                            </div>
                            <div class="rounded-lg py-1.5 text-center bg-[rgb(255_255_255_/_0.08)]">
                                <p class="font-display font-bold text-[13px] text-white leading-none">4</p>
                                <p class="text-[9.5px] mt-1 text-[rgb(255_255_255_/_0.65)]">Messages</p>
                            </div>
                            <div class="rounded-lg py-1.5 text-center bg-[rgb(255_255_255_/_0.08)]">
                                <p class="font-display font-bold text-[13px] text-white leading-none">98%</p>
                                <p class="text-[9.5px] mt-1 text-[rgb(255_255_255_/_0.65)]">Uptime</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-1.5">
                        <a href="{{url('account-profile')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><span class="grid place-items-center size-7 rounded-lg shrink-0 bg-[color-mix(in_oklab,var(--color-primary-500)_14%,transparent)] text-[var(--color-primary-600)]"><i class="icon-user-round text-[13.5px]"></i></span>My Profile</a>
                        <a href="{{url('profile-settings')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><span class="grid place-items-center size-7 rounded-lg shrink-0 bg-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] text-[var(--text-secondary)]"><i class="icon-settings text-[13.5px]"></i></span>Account Settings</a>
                        <a href="{{url('user-security')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><span class="grid place-items-center size-7 rounded-lg shrink-0 bg-[color-mix(in_oklab,var(--color-success-500)_14%,transparent)] text-[var(--color-success-600)]"><i class="icon-shield-check text-[13.5px]"></i></span>Security &amp; Privacy</a>
                        <a href="{{url('faq')}}" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)]"><span class="grid place-items-center size-7 rounded-lg shrink-0 bg-[color-mix(in_oklab,var(--color-info-500)_14%,transparent)] text-[var(--color-info-600)]"><i class="icon-life-buoy text-[13.5px]"></i></span>Help Center</a>
                    </div>

                    <div class="mx-3 h-px bg-[var(--border-subtle)]"></div>

                    <div class="p-1.5">
                        <form method="POST" action="{{ route('logout') }}" id="logout-form-topbar" class="hidden">
                            @csrf
                        </form>
                        <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form-topbar').submit();" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium hover:bg-[var(--surface-sunken)] text-[var(--color-danger-600)]"><span class="grid place-items-center size-7 rounded-lg shrink-0 bg-[color-mix(in_oklab,var(--color-danger-500)_12%,transparent)]"><i class="icon-log-out text-[13.5px]"></i></span>Sign Out</a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</header>

<!-- ================= CHAT OFFCANVAS ================= -->
<div id="chatOffcanvasBackdrop" class="hidden fixed inset-0 z-[60] bg-[rgb(10_12_11_/_0.5)]"></div>
<aside id="chatOffcanvas" class="fixed top-0 end-0 h-full w-full max-w-sm z-[61] flex flex-col bg-[var(--surface-raised)] [border-inline-start:1px_solid_var(--border-subtle)] shadow-[var(--shadow-xl)] [transform:translateX(100%)] [transition:transform_0.25s_cubic-bezier(0.4,0,0.2,1)]" aria-label="Messages">

    <!-- Conversation list view -->
    <div id="chatListView" class="flex flex-col h-full">
        <div class="flex items-center justify-between px-4 py-3.5 border-b shrink-0 border-[var(--border-subtle)]">
            <p class="font-display font-bold text-[15px]">Messages</p>
            <button type="button" class="header-icon-btn chat-offcanvas-close" aria-label="Close chat"><i class="icon-x text-[16px]"></i></button>
        </div>
        <div class="p-3 shrink-0">
            <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-sunken)]">
                <i class="icon-search text-[13px] text-[var(--text-tertiary)]"></i>
                <input type="text" placeholder="Search conversations…" class="flex-1 bg-transparent border-0 outline-none text-[13px]">
            </div>
        </div>
        <div class="flex-1 overflow-y-auto scroll-thin">
            <p class="px-4 pt-1 pb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">This week</p>
            <button type="button" class="chat-conv-item w-full flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] text-start" data-chat-name="Ryan Cole" data-chat-avatar="{{URL::asset('build/img/avatar/avatar-03.jpg')}}">
                <span class="relative shrink-0">
                    <img src="{{URL::asset('/build/img/avatar/avatar-03.jpg')}}" class="size-10 rounded-full object-cover" alt="Ryan Cole avatar">
                    <span class="absolute bottom-0 end-0 size-2.5 rounded-full border-2 bg-[var(--color-success-500)] border-[var(--surface-raised)]"></span>
                </span>
                <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-2"><span class="font-semibold text-[13px] truncate">Ryan Cole</span><span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">2m</span></span>
                    <span class="block text-[12px] truncate text-[var(--text-secondary)]">Can you review the Q3 forecast deck?</span>
                </span>
            </button>
            <button type="button" class="chat-conv-item w-full flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] text-start" data-chat-name="Priya Nair" data-chat-avatar="{{URL::asset('build/img/avatar/avatar-16.jpg')}}">
                <span class="relative shrink-0">
                    <img src="{{URL::asset('/build/img/avatar/avatar-16.jpg')}}" class="size-10 rounded-full object-cover" alt="Priya Nair avatar">
                    <span class="absolute bottom-0 end-0 size-2.5 rounded-full border-2 bg-[var(--color-success-500)] border-[var(--surface-raised)]"></span>
                </span>
                <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-2"><span class="font-semibold text-[13px] truncate">Priya Nair</span><span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">1h</span></span>
                    <span class="block text-[12px] truncate text-[var(--text-secondary)]">Invoice #4471 has been approved ✅</span>
                </span>
            </button>
            <button type="button" class="chat-conv-item w-full flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] text-start" data-chat-name="Diego Fernandez" data-chat-avatar="{{URL::asset('build/img/avatar/avatar-05.jpg')}}">
                <img src="{{URL::asset('/build/img/avatar/avatar-05.jpg')}}" class="size-10 rounded-full object-cover shrink-0" alt="Diego Fernandez avatar">
                <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-2"><span class="font-semibold text-[13px] truncate">Diego Fernandez</span><span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">3h</span></span>
                    <span class="block text-[12px] truncate text-[var(--text-secondary)]">Shipment for order #8821 delayed</span>
                </span>
            </button>

            <p class="px-4 pt-3 pb-2 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Earlier</p>
            <button type="button" class="chat-conv-item w-full flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] text-start" data-chat-name="Sofia Reyes" data-chat-avatar="{{URL::asset('build/img/avatar/avatar-21.jpg')}}">
                <img src="{{URL::asset('/build/img/avatar/avatar-21.jpg')}}" class="size-10 rounded-full object-cover shrink-0" alt="Sofia Reyes avatar">
                <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-2"><span class="font-semibold text-[13px] truncate">Sofia Reyes</span><span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">Mon</span></span>
                    <span class="block text-[12px] truncate text-[var(--text-secondary)]">Brand assets are ready for review</span>
                </span>
            </button>
            <button type="button" class="chat-conv-item w-full flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] text-start" data-chat-name="Alex Morgan" data-chat-avatar="{{URL::asset('build/img/avatar/avatar-04.jpg')}}">
                <img src="{{URL::asset('/build/img/avatar/avatar-04.jpg')}}" class="size-10 rounded-full object-cover shrink-0" alt="Alex Morgan avatar">
                <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-2"><span class="font-semibold text-[13px] truncate">Alex Morgan</span><span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">Mon</span></span>
                    <span class="block text-[12px] truncate text-[var(--text-secondary)]">Thanks for the fast delivery! 🙌</span>
                </span>
            </button>
            <button type="button" class="chat-conv-item w-full flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] text-start" data-chat-name="Marcus Lee" data-chat-avatar="{{URL::asset('build/img/avatar/avatar-15.jpg')}}">
                <img src="{{URL::asset('/build/img/avatar/avatar-15.jpg')}}" class="size-10 rounded-full object-cover shrink-0" alt="Marcus Lee avatar">
                <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-2"><span class="font-semibold text-[13px] truncate">Marcus Lee</span><span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">Fri</span></span>
                    <span class="block text-[12px] truncate text-[var(--text-secondary)]">Can we push the sync to 3pm?</span>
                </span>
            </button>
            <button type="button" class="chat-conv-item w-full flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-sunken)] text-start" data-chat-name="Nova Retail Team" data-chat-avatar="{{URL::asset('build/img/avatar/avatar-19.jpg')}}">
                <img src="{{URL::asset('/build/img/avatar/avatar-19.jpg')}}" class="size-10 rounded-full object-cover shrink-0" alt="Nova Retail Team avatar">
                <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-2"><span class="font-semibold text-[13px] truncate">Nova Retail Team</span><span class="text-[10.5px] shrink-0 text-[var(--text-tertiary)]">Thu</span></span>
                    <span class="block text-[12px] truncate text-[var(--text-secondary)]">Payment of $2,480 confirmed</span>
                </span>
            </button>
        </div>
    </div>

    <!-- Thread view -->
    <div id="chatThreadView" class="hidden flex-col h-full">
        <div class="flex items-center gap-3 px-4 py-3.5 border-b shrink-0 border-[var(--border-subtle)]">
            <button type="button" id="chatThreadBack" class="header-icon-btn" aria-label="Back to conversations"><i class="icon-arrow-left text-[16px]"></i></button>
            <img id="chatThreadAvatar" src="{{URL::asset('/build/img/avatar/avatar-03.jpg')}}" class="size-8 rounded-full object-cover shrink-0" alt="Chat contact avatar">
            <span class="min-w-0 flex-1">
                <span id="chatThreadName" class="block font-semibold text-[13px] truncate"></span>
                <span class="flex items-center gap-1 text-[10.5px] text-[var(--color-success-500)]"><span class="size-1.5 rounded-full bg-[var(--color-success-500)]"></span>Online</span>
            </span>
            <button type="button" class="header-icon-btn chat-offcanvas-close" aria-label="Close chat"><i class="icon-x text-[16px]"></i></button>
        </div>
        <div class="flex-1 overflow-y-auto scroll-thin p-4 space-y-3">
            <div class="flex justify-start">
                <div class="max-w-[75%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-[13px] bg-[var(--surface-sunken)]">Hey! Can you review the Q3 forecast deck when you get a chance?</div>
            </div>
            <div class="flex justify-end">
                <div class="max-w-[75%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-[13px] text-white bg-[var(--color-primary-600)]">Sure, I'll take a look this afternoon.</div>
            </div>
            <div class="flex justify-start">
                <div class="max-w-[75%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-[13px] bg-[var(--surface-sunken)]">Thanks! No rush, end of day is fine.</div>
            </div>
        </div>
        <div class="p-3 border-t shrink-0 flex items-center gap-2 border-[var(--border-subtle)]">
            <input type="text" placeholder="Type a message…" class="flex-1 px-3.5 py-2.5 rounded-xl text-[13px] border-0 outline-none bg-[var(--surface-sunken)]">
            <button type="button" class="grid place-items-center size-9 rounded-xl shrink-0 text-white bg-[var(--color-primary-600)]" aria-label="Send"><i class="icon-send text-[14px]"></i></button>
        </div>
    </div>

</aside>

<!-- ================= COMMAND PALETTE ================= -->
<div id="cmdkBackdrop" class="cmdk-backdrop hidden items-start justify-center pt-24 px-4">
    <div class="cmdk-panel w-full max-w-xl overflow-hidden animate-rise-in" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)]">
            <i class="icon-command text-[16px] text-[var(--text-tertiary)]"></i>
            <input id="cmdkInput" type="text" placeholder="Search pages, actions, customers…" autocomplete="off"
        class="flex-1 bg-transparent border-0 outline-none text-[14px] placeholder:text-[var(--text-tertiary)]">
            <kbd class="key">Esc</kbd>
        </div>
        <div id="cmdkResults" class="max-h-96 overflow-y-auto scroll-thin p-2">

            <p class="px-2.5 pt-2 pb-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Navigate</p>
            <button type="button" class="cmdk-item w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left" data-label="Dashboard Overview">
                <i class="icon-layout-dashboard text-[15px] text-[var(--color-primary-600)]"></i>
                <span class="text-[13px] font-medium">Dashboard Overview</span>
            </button>
            <button type="button" class="cmdk-item w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left" data-label="Analytics">
                <i class="icon-chart-no-axes-column text-[15px] text-[var(--color-primary-600)]"></i>
                <span class="text-[13px] font-medium">Analytics</span>
            </button>
            <button type="button" class="cmdk-item w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left" data-label="Invoices">
                <i class="icon-receipt text-[15px] text-[var(--color-primary-600)]"></i>
                <span class="text-[13px] font-medium">Invoices</span>
            </button>
            <button type="button" class="cmdk-item w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left" data-label="Customers">
                <i class="icon-users text-[15px] text-[var(--color-primary-600)]"></i>
                <span class="text-[13px] font-medium">Customers</span>
            </button>

            <p class="px-2.5 pt-3 pb-1 text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Quick actions</p>
            <button type="button" class="cmdk-item w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left" data-label="Create new invoice">
                <i class="icon-plus text-[15px] text-[var(--color-accent-500)]"></i>
                <span class="text-[13px] font-medium">Create new invoice</span>
            </button>
            <button type="button" class="cmdk-item w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left" data-label="Invite team member">
                <i class="icon-user-plus text-[15px] text-[var(--color-accent-500)]"></i>
                <span class="text-[13px] font-medium">Invite team member</span>
            </button>
            <button type="button" class="cmdk-item w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left" data-label="Toggle theme">
                <i class="icon-sun-medium text-[15px] text-[var(--color-accent-500)]"></i>
                <span class="text-[13px] font-medium">Toggle theme</span>
            </button>

        </div>
    </div>
</div>
