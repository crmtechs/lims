@extends('layouts.app')
@section('title', 'CRM Dashboard')
@section('breadcrumb', 'CRM')
@section('content')

<main class="p-4 lg:p-6 space-y-5 max-w-full mx-auto w-full">

    <!-- ============ Compact Workspace Toolbar ============ -->
    <div class="surface-card p-3.5 lg:p-4 animate-rise-in">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="min-w-0">
                <div class="flex items-center gap-2">
                    <h1 class="font-display font-bold text-[18px]">Deals Workspace</h1>
                    <span class="badge-soft badge-success !text-[10px]"><span class="size-1.5 rounded-full inline-block me-1 bg-[var(--color-success-500)] [animation:var(--animate-count-pulse)]"></span>Live</span>
                </div>
                <p class="text-[11.5px] mt-0.5 u-color-text-tertiary">312 open deals &middot; $1.86M pipeline &middot; Enterprise + Mid-Market</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="btn btn-primary !text-[12px]" data-hs-overlay="#dealDrawer"><i class="icon-plus text-[13px]"></i>New Deal</button>
            </div>
        </div>
    </div>

    <!-- ============ Compact Stat Strip ============ -->
    <div class="surface-card animate-rise-in overflow-hidden">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-[var(--border-subtle)] u-border-color-border-subtle">
            <div class="p-3.5">
                <p class="text-[10px] u-color-text-tertiary">Pipeline Value</p>
                <div class="flex items-end justify-between gap-1">
                    <p class="font-display font-bold text-[17px] mt-0.5 counter-up">$1.86M</p>
                    <div id="crmx-stat-pipeline" class="w-14 h-6"></div>
                </div>
                <p class="text-[10px] mt-0.5 u-color-color-success-600"><i class="icon-arrow-up-right text-[8px]"></i>+9.4%</p>
            </div>
            <div class="p-3.5">
                <p class="text-[10px] u-color-text-tertiary">Active Deals</p>
                <div class="flex items-end justify-between gap-1">
                    <p class="font-display font-bold text-[17px] mt-0.5 counter-up">312</p>
                    <div id="crmx-stat-deals" class="w-14 h-6"></div>
                </div>
                <p class="text-[10px] mt-0.5 u-color-color-success-600"><i class="icon-arrow-up-right text-[8px]"></i>+8.5%</p>
            </div>
            <div class="p-3.5">
                <p class="text-[10px] u-color-text-tertiary">Win Rate</p>
                <div class="flex items-end justify-between gap-1">
                    <p class="font-display font-bold text-[17px] mt-0.5 counter-up">59%</p>
                    <div id="crmx-stat-winrate" class="w-14 h-6"></div>
                </div>
                <p class="text-[10px] mt-0.5 u-color-color-success-600"><i class="icon-arrow-up-right text-[8px]"></i>+3 pts</p>
            </div>
            <div class="p-3.5">
                <p class="text-[10px] u-color-text-tertiary">Avg Deal Size</p>
                <p class="font-display font-bold text-[17px] mt-0.5 counter-up">$8,420</p>
                <p class="text-[10px] mt-0.5 u-color-color-success-600"><i class="icon-arrow-up-right text-[8px]"></i>+6.1%</p>
            </div>
            <div class="p-3.5">
                <p class="text-[10px] u-color-text-tertiary">Avg Sales Cycle</p>
                <p class="font-display font-bold text-[17px] mt-0.5 counter-up">38 days</p>
                <p class="text-[10px] mt-0.5 u-color-text-tertiary">-2 days vs plan</p>
            </div>
            <div class="p-3.5">
                <p class="text-[10px] u-color-text-tertiary">Closing This Week</p>
                <p class="font-display font-bold text-[17px] mt-0.5 counter-up">14 &middot; $268K</p>
                <p class="text-[10px] mt-0.5 u-color-color-warning-600-var-color-warning-500">5 need action</p>
            </div>
        </div>
    </div>

    <!-- ============ Top Deals — horizontal scroll cards ============ -->
    <div class="animate-rise-in">
        <div class="flex items-center justify-between mb-2.5 px-0.5">
            <h2 class="font-display font-bold text-[14px]">Top Deals</h2>
            <a href="{{url('deals')}}" class="text-[11px] font-semibold u-color-color-primary-600">View All Deals</a>
        </div>
        <div class="relative px-3">
            <div id="topDealsSlider" class="top-deals-slider">
                <div>
                    <div class="surface-card is-interactive p-4 h-full">
                        <div class="flex items-center justify-between">
                            <span class="grid place-items-center size-9 rounded-lg badge-solid-danger text-[11px] font-bold">CR</span>
                            <span class="badge-soft badge-danger !text-[10px]">92%</span>
                        </div>
                        <p class="font-display font-bold text-[13.5px] mt-2.5 truncate">Cascade Retail Grp</p>
                        <p class="text-[10.5px] truncate u-color-text-tertiary"><i class="icon-map-pin text-[9px]"></i> Chicago, IL &middot; Renewal+</p>
                        <p class="font-display font-bold text-[16px] mt-2 counter-up">$210,000</p>
                        <div class="flex items-center gap-1.5 mt-2.5">
                            <img src="{{URL::asset('build/img/avatar/avatar-15.jpg')}}" class="size-5 rounded-full" alt="Renee Foster profile photo">
                            <span class="text-[10.5px] truncate u-color-text-tertiary">Renee Foster</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="surface-card is-interactive p-4 h-full">
                        <div class="flex items-center justify-between">
                            <span class="grid place-items-center size-9 rounded-lg badge-solid-warning text-[11px] font-bold">VR</span>
                            <span class="badge-soft badge-warning !text-[10px]">68%</span>
                        </div>
                        <p class="font-display font-bold text-[13.5px] mt-2.5 truncate">Vantage Retail</p>
                        <p class="text-[10.5px] truncate u-color-text-tertiary"><i class="icon-map-pin text-[9px]"></i> Austin, TX &middot; Expansion</p>
                        <p class="font-display font-bold text-[16px] mt-2 counter-up">$142,500</p>
                        <div class="flex items-center gap-1.5 mt-2.5">
                            <img src="{{URL::asset('build/img/avatar/avatar-12.jpg')}}" class="size-5 rounded-full" alt="Marco Diaz profile photo">
                            <span class="text-[10.5px] truncate u-color-text-tertiary">Marco Diaz</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="surface-card is-interactive p-4 h-full">
                        <div class="flex items-center justify-between">
                            <span class="grid place-items-center size-9 rounded-lg badge-solid-success text-[11px] font-bold">NW</span>
                            <span class="badge-soft badge-success !text-[10px]">81%</span>
                        </div>
                        <p class="font-display font-bold text-[13.5px] mt-2.5 truncate">Northwind Corp</p>
                        <p class="text-[10.5px] truncate u-color-text-tertiary"><i class="icon-map-pin text-[9px]"></i> Seattle, WA &middot; New Business</p>
                        <p class="font-display font-bold text-[16px] mt-2 counter-up">$96,000</p>
                        <div class="flex items-center gap-1.5 mt-2.5">
                            <img src="{{URL::asset('build/img/avatar/avatar-18.jpg')}}" class="size-5 rounded-full" alt="Renee Foster profile photo">
                            <span class="text-[10.5px] truncate u-color-text-tertiary">Renee Foster</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="surface-card is-interactive p-4 h-full">
                        <div class="flex items-center justify-between">
                            <span class="grid place-items-center size-9 rounded-lg text-[11px] font-bold u-background-6d28d9_color-fff">ML</span>
                            <span class="badge-soft badge-info !text-[10px]">54%</span>
                        </div>
                        <p class="font-display font-bold text-[13.5px] mt-2.5 truncate">Meridian Labs</p>
                        <p class="text-[10.5px] truncate u-color-text-tertiary"><i class="icon-map-pin text-[9px]"></i> Boston, MA &middot; New Business</p>
                        <p class="font-display font-bold text-[16px] mt-2 counter-up">$54,200</p>
                        <div class="flex items-center gap-1.5 mt-2.5">
                            <img src="{{URL::asset('build/img/avatar/avatar-21.jpg')}}" class="size-5 rounded-full" alt="Marco Diaz profile photo">
                            <span class="text-[10.5px] truncate u-color-text-tertiary">Marco Diaz</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="surface-card is-interactive p-4 h-full">
                        <div class="flex items-center justify-between">
                            <span class="grid place-items-center size-9 rounded-lg badge-solid-info text-[11px] font-bold">BP</span>
                            <span class="badge-soft badge-success !text-[10px]">95%</span>
                        </div>
                        <p class="font-display font-bold text-[13.5px] mt-2.5 truncate">BrightPath Inc</p>
                        <p class="text-[10.5px] truncate u-color-text-tertiary"><i class="icon-map-pin text-[9px]"></i> Denver, CO &middot; Closed Won</p>
                        <p class="font-display font-bold text-[16px] mt-2 counter-up">$27,800</p>
                        <div class="flex items-center gap-1.5 mt-2.5">
                            <img src="{{URL::asset('build/img/avatar/avatar-07.jpg')}}" class="size-5 rounded-full" alt="Carlos Mendez profile photo">
                            <span class="text-[10.5px] truncate u-color-text-tertiary">Carlos Mendez</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="surface-card is-interactive p-4 h-full">
                        <div class="flex items-center justify-between">
                            <span class="grid place-items-center size-9 rounded-lg badge-solid-primary text-[11px] font-bold">OL</span>
                            <span class="badge-soft badge-danger !text-[10px]">22%</span>
                        </div>
                        <p class="font-display font-bold text-[13.5px] mt-2.5 truncate">Orbit Logistics</p>
                        <p class="text-[10.5px] truncate u-color-text-tertiary"><i class="icon-map-pin text-[9px]"></i> Miami, FL &middot; Renewal</p>
                        <p class="font-display font-bold text-[16px] mt-2 counter-up">$27,800</p>
                        <div class="flex items-center gap-1.5 mt-2.5">
                            <img src="{{URL::asset('build/img/avatar/avatar-25.jpg')}}" class="size-5 rounded-full" alt="Nora Whitfield profile photo">
                            <span class="text-[10.5px] truncate u-color-text-tertiary">Nora Whitfield</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="surface-card is-interactive p-4 h-full">
                        <div class="flex items-center justify-between">
                            <span class="grid place-items-center size-9 rounded-lg badge-solid-success text-[11px] font-bold">SH</span>
                            <span class="badge-soft badge-warning !text-[10px]">76%</span>
                        </div>
                        <p class="font-display font-bold text-[13.5px] mt-2.5 truncate">Solace Health</p>
                        <p class="text-[10.5px] truncate u-color-text-tertiary"><i class="icon-map-pin text-[9px]"></i> Portland, OR &middot; Expansion</p>
                        <p class="font-display font-bold text-[16px] mt-2 counter-up">$68,900</p>
                        <div class="flex items-center gap-1.5 mt-2.5">
                            <img src="{{URL::asset('build/img/avatar/avatar-15.jpg')}}" class="size-5 rounded-full" alt="Priya Sharma profile photo">
                            <span class="text-[10.5px] truncate u-color-text-tertiary">Priya Sharma</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="surface-card is-interactive p-4 h-full">
                        <div class="flex items-center justify-between">
                            <span class="grid place-items-center size-9 rounded-lg text-[11px] font-bold u-background-6d28d9_color-fff">HF</span>
                            <span class="badge-soft badge-info !text-[10px]">47%</span>
                        </div>
                        <p class="font-display font-bold text-[13.5px] mt-2.5 truncate">Halcyon Freight</p>
                        <p class="text-[10.5px] truncate u-color-text-tertiary"><i class="icon-map-pin text-[9px]"></i> Dallas, TX &middot; New Business</p>
                        <p class="font-display font-bold text-[16px] mt-2 counter-up">$118,400</p>
                        <div class="flex items-center gap-1.5 mt-2.5">
                            <img src="{{URL::asset('build/img/avatar/avatar-21.jpg')}}" class="size-5 rounded-full" alt="Carlos Mendez profile photo">
                            <span class="text-[10.5px] truncate u-color-text-tertiary">Carlos Mendez</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- ============ Workspace: Left Rail + Pipeline Board ============ -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

        <!-- Left Rail -->
        <aside class="lg:col-span-3 space-y-4" aria-label="Pipeline stages">
            <div class="surface-card p-4 animate-rise-in">
                <h2 class="font-display font-bold text-[13px] mb-3">Pipeline Stages</h2>
                <ul class="space-y-1">
                    <li><a href="#" class="flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-semibold bg-[color-mix(in_oklab,var(--color-primary-500)_10%,transparent)] text-[var(--color-primary-600)]"><span class="flex items-center gap-2"><span class="size-2 rounded-full u-background-4338ca"></span>New</span><span>12 &middot; $184K</span></a></li>
                    <li><a href="#" class="flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-medium u-color-text-secondary"><span class="flex items-center gap-2"><span class="size-2 rounded-full u-background-color-info-500"></span>Qualified</span><span class="u-color-text-tertiary">18 &middot; $412K</span></a></li>
                    <li><a href="#" class="flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-medium u-color-text-secondary"><span class="flex items-center gap-2"><span class="size-2 rounded-full u-background-color-warning-500"></span>Proposal</span><span class="u-color-text-tertiary">14 &middot; $528K</span></a></li>
                </ul>
            </div>

            <div class="surface-card p-4 animate-rise-in">
                <h2 class="font-display font-bold text-[13px] mb-3">Quick Filters</h2>
                <div class="flex flex-wrap gap-1.5">
                    <button type="button" class="quick-filter-chip badge-soft badge-primary !text-[10px] is-active"><i class="icon-check text-[9px]"></i>Enterprise</button>
                    <button type="button" class="quick-filter-chip badge-soft badge-neutral !text-[10px]">Mid-Market</button>
                    <button type="button" class="quick-filter-chip badge-soft badge-neutral !text-[10px]">SMB</button>
                    <button type="button" class="quick-filter-chip badge-soft badge-neutral !text-[10px]">At Risk</button>
                    <button type="button" class="quick-filter-chip badge-soft badge-neutral !text-[10px]">Renewal</button>
                    <button type="button" class="quick-filter-chip badge-soft badge-neutral !text-[10px]">Hot Lead</button>
                </div>
            </div>

            <div class="surface-card p-4 animate-rise-in">
                <div class="flex items-center justify-between mb-3">
                    <h2 class="font-display font-bold text-[13px]">Top Reps</h2>
                    <span class="badge-soft badge-neutral !text-[10px]">Quarter</span>
                </div>
                <ul class="space-y-2.5">
                    <li class="flex items-center gap-2 py-1">
                        <span class="grid place-items-center size-5 rounded-full text-[9px] font-bold shrink-0 bg-[color-mix(in_oklab,var(--color-warning-500)_18%,transparent)] text-[var(--color-warning-600,var(--color-warning-500))]">1</span>
                        <img src="{{URL::asset('build/img/avatar/avatar-15.jpg')}}" class="size-7 rounded-full shrink-0" alt="Renee Foster profile photo, rank 1">
                        <div class="min-w-0 flex-1">
                            <p class="text-[11.5px] font-semibold truncate">Renee Foster</p>
                            <div class="h-1 rounded-full overflow-hidden mt-1 u-background-surface-sunken"><div class="h-full rounded-full w-full bg-[var(--color-warning-500)]"></div></div>
                        </div>
                        <span class="text-[10.5px] font-bold shrink-0">142%</span>
                    </li>
                    <li class="flex items-center gap-2 py-1">
                        <span class="grid place-items-center size-5 rounded-full text-[9px] font-bold shrink-0 u-background-surface-sunken_color-text-tertiary">2</span>
                        <img src="{{URL::asset('build/img/avatar/avatar-25.jpg')}}" class="size-7 rounded-full shrink-0" alt="Marco Diaz profile photo, rank 2">
                        <div class="min-w-0 flex-1">
                            <p class="text-[11.5px] font-semibold truncate">Marco Diaz</p>
                            <div class="h-1 rounded-full overflow-hidden mt-1 u-background-surface-sunken"><div class="h-full rounded-full u-width-91_background-color-primary-500"></div></div>
                        </div>
                        <span class="text-[10.5px] font-bold shrink-0">128%</span>
                    </li>
                    <li class="flex items-center gap-2 py-1">
                        <span class="grid place-items-center size-5 rounded-full text-[9px] font-bold shrink-0 u-background-surface-sunken_color-text-tertiary">3</span>
                        <img src="{{URL::asset('build/img/avatar/avatar-07.jpg')}}" class="size-7 rounded-full shrink-0" alt="Carlos Mendez profile photo, rank 3">
                        <div class="min-w-0 flex-1">
                            <p class="text-[11.5px] font-semibold truncate">Carlos Mendez</p>
                            <div class="h-1 rounded-full overflow-hidden mt-1 u-background-surface-sunken"><div class="h-full rounded-full w-[79%] bg-[var(--color-primary-500)]"></div></div>
                        </div>
                        <span class="text-[10.5px] font-bold shrink-0">104%</span>
                    </li>
                </ul>
            </div>

        </aside>

        <!-- Kanban Pipeline Board -->
        <div class="lg:col-span-9 surface-card p-4 lg:p-5 animate-rise-in">
            <div class="flex items-center justify-between gap-2 mb-3.5">
                <div>
                    <h2 class="font-display font-bold text-[15px]">Deal Pipeline Board</h2>
                    <p class="text-[11px] mt-0.5 u-color-text-tertiary">Drag deals across stages &middot; 60 active opportunities</p>
                </div>
                <span class="badge-soft badge-info !text-[10.5px]">31% lead &rarr; close</span>
            </div>
            <div class="flex gap-3.5 overflow-x-auto scroll-thin pb-1.5" data-plugin="dragula" data-containers='["stage-new", "stage-qualified", "stage-proposal", "stage-negotiation", "stage-won"]'>

                <!-- New -->
                <div class="shrink-0 rounded-xl p-2.5 u-width-250px_background-surface-sunken">
                    <div class="flex items-center justify-between px-1 mb-2">
                        <span class="text-[11.5px] font-bold flex items-center gap-1.5"><span class="size-2 rounded-full u-background-4338ca"></span>New</span>
                        <span class="text-[10.5px] font-semibold u-color-text-tertiary">12 &middot; $184K</span>
                    </div>
                    <div class="space-y-2" id="stage-new">
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Halcyon Freight</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$38,000</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-neutral !text-[9px]">Logistics</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-09.jpg')}}" class="size-5 rounded-full" alt="Halcyon Freight deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">28%</span>
                            </div>
                        </div>
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Aurora Biotech</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$61,500</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-neutral !text-[9px]">Biotech</span><span class="badge-soft badge-info !text-[9px]">Hot</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-11.jpg')}}" class="size-5 rounded-full" alt="Aurora Biotech deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">22%</span>
                            </div>
                        </div>
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Prime Fixtures Co.</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$19,800</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-neutral !text-[9px]">Retail</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-14.jpg')}}" class="size-5 rounded-full" alt="Prime Fixtures Co. deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">18%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Qualified -->
                <div class="shrink-0 rounded-xl p-2.5 u-width-250px_background-surface-sunken">
                    <div class="flex items-center justify-between px-1 mb-2">
                        <span class="text-[11.5px] font-bold flex items-center gap-1.5"><span class="size-2 rounded-full u-background-color-info-500"></span>Qualified</span>
                        <span class="text-[10.5px] font-semibold u-color-text-tertiary">18 &middot; $412K</span>
                    </div>
                    <div class="space-y-2" id="stage-qualified">
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Meridian Labs</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$54,200</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-neutral !text-[9px]">Biotech</span><span class="badge-soft badge-info !text-[9px]">Watching</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-21.jpg')}}" class="size-5 rounded-full" alt="Meridian Labs deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">54%</span>
                            </div>
                        </div>
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Solace Health</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$18,400</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-warning !text-[9px]">At Risk</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-15.jpg')}}" class="size-5 rounded-full" alt="Solace Health deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">54%</span>
                            </div>
                        </div>
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Silverline Media</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$44,700</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-neutral !text-[9px]">Media</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-03.jpg')}}" class="size-5 rounded-full" alt="Silverline Media deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">47%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Proposal -->
                <div class="shrink-0 rounded-xl p-2.5 u-width-250px_background-surface-sunken">
                    <div class="flex items-center justify-between px-1 mb-2">
                        <span class="text-[11.5px] font-bold flex items-center gap-1.5"><span class="size-2 rounded-full u-background-color-warning-500"></span>Proposal</span>
                        <span class="text-[10.5px] font-semibold u-color-text-tertiary">14 &middot; $528K</span>
                    </div>
                    <div class="space-y-2" id="stage-proposal">
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Vantage Retail</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$142,500</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-neutral !text-[9px]">Retail</span><span class="badge-soft badge-warning !text-[9px]">Medium</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-12.jpg')}}" class="size-5 rounded-full" alt="Vantage Retail deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">68%</span>
                            </div>
                        </div>
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Cobalt Insurance</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$88,900</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-neutral !text-[9px]">Insurance</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-17.jpg')}}" class="size-5 rounded-full" alt="Cobalt Insurance deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">63%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Negotiation -->
                <div class="shrink-0 rounded-xl p-2.5 u-width-250px_background-surface-sunken">
                    <div class="flex items-center justify-between px-1 mb-2">
                        <span class="text-[11.5px] font-bold flex items-center gap-1.5"><span class="size-2 rounded-full u-background-6d28d9"></span>Negotiation</span>
                        <span class="text-[10.5px] font-semibold u-color-text-tertiary">9 &middot; $396K</span>
                    </div>
                    <div class="space-y-2" id="stage-negotiation">
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Cascade Retail Grp</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$210,000</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-neutral !text-[9px]">Retail</span><span class="badge-soft badge-danger !text-[9px]">High Priority</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-15.jpg')}}" class="size-5 rounded-full" alt="Cascade Retail Grp deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">92%</span>
                            </div>
                        </div>
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Orbit Logistics</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$27,800</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-danger !text-[9px]">At Risk</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-25.jpg')}}" class="size-5 rounded-full" alt="Orbit Logistics deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-text-tertiary">22%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Won -->
                <div class="shrink-0 rounded-xl p-2.5 w-[250px] bg-[color-mix(in_oklab,var(--color-success-500)_6%,var(--surface-sunken))]">
                    <div class="flex items-center justify-between px-1 mb-2">
                        <span class="text-[11.5px] font-bold flex items-center gap-1.5"><span class="size-2 rounded-full u-background-color-success-500"></span>Won</span>
                        <span class="text-[10.5px] font-semibold u-color-text-tertiary">7 &middot; $340K</span>
                    </div>
                    <div class="space-y-2" id="stage-won">
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">Northwind Corp</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$96,000</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-success !text-[9px]">Closed Won</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-18.jpg')}}" class="size-5 rounded-full" alt="Northwind Corp deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-color-success-600">100%</span>
                            </div>
                        </div>
                        <div class="surface-card is-interactive p-2.5">
                            <p class="text-[12px] font-semibold truncate">BrightPath Inc</p>
                            <p class="font-display font-bold text-[13.5px] mt-0.5">$27,800</p>
                            <div class="flex flex-wrap gap-1 mt-1.5"><span class="badge-soft badge-success !text-[9px]">Closed Won</span></div>
                            <div class="flex items-center justify-between mt-2">
                                <img src="{{URL::asset('build/img/avatar/avatar-07.jpg')}}" class="size-5 rounded-full" alt="BrightPath Inc deal owner profile photo">
                                <span class="text-[10px] font-semibold u-color-color-success-600">100%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- ============ Revenue Analytics + Deal Sources + Regional Revenue ============ -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div class="surface-card is-interactive p-5 lg:p-6 animate-rise-in lg:col-span-5 flex flex-col">
            <div class="flex items-center justify-between gap-2 mb-1">
                <h2 class="font-display font-bold text-[14px]">Revenue Analytics</h2>
                <span class="badge-soft badge-neutral !text-[10px]">Actual vs Forecast</span>
            </div>
            <p class="text-[11px] mb-1 u-color-text-tertiary">MRR trending 8% above plan</p>
            <div id="crmx-revenue-trend" class="flex-1"></div>
        </div>

        <div class="surface-card is-interactive p-5 animate-rise-in lg:col-span-3">
            <div class="flex items-center justify-between mb-1">
                <h2 class="font-display font-bold text-[14px]">Deal Sources</h2>
                <span class="badge-soft badge-neutral !text-[10px]">648 leads</span>
            </div>
            <p class="text-[11px] mb-1 u-color-text-tertiary">Where opportunities originate</p>
            <div id="crmx-customer-donut" class="mx-auto"></div>
        </div>

        <div class="surface-card is-interactive p-5 animate-rise-in lg:col-span-4">
            <div class="flex items-center justify-between mb-1">
                <h2 class="font-display font-bold text-[14px]">Revenue by Region</h2>
                <span class="badge-soft badge-neutral !text-[10px]">This quarter</span>
            </div>
            <p class="text-[11px] mb-1 u-color-text-tertiary">North America leads; APAC fastest growing</p>
            <div id="crmx-region-bar"></div>
        </div>
    </div>

    <!-- ============ Recent Deals Table ============ -->
    <div class="surface-card is-interactive p-5 animate-rise-in">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
                <h2 class="font-display font-bold text-[15px]">Recent Deals</h2>
                <p class="text-[11px] mt-0.5 u-color-text-tertiary">312 opportunities &middot; saved view: "Enterprise Pipeline"</p>
            </div>
        </div>
        <div class="overflow-x-auto scroll-thin -mx-1">
            <table class="data-table w-full min-w-[980px]">
                <thead>
                    <tr>
                        <th scope="col">Deal Name</th>
                        <th scope="col">Stage</th>
                        <th scope="col">Value</th>
                        <th scope="col">Tags</th>
                        <th scope="col">Owner</th>
                        <th scope="col">Probability</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="font-medium">Northwind Corp &middot; New Business</td>
                        <td><span class="badge-soft badge-success !text-[10px]">Won</span></td>
                        <td class="u-color-text-tertiary">$96,000</td>
                        <td><span class="flex flex-wrap gap-1"><span class="badge-soft badge-neutral !text-[9.5px]">Logistics</span><span class="badge-soft badge-success !text-[9.5px]">Low Risk</span></span></td>
                        <td><span class="flex items-center gap-1.5"><img src="{{URL::asset('build/img/avatar/avatar-18.jpg')}}" class="size-5 rounded-full" alt="Renee Foster profile photo">Renee Foster</span></td>
                        <td><span class="font-semibold u-color-color-success-600">100%</span></td>
                        <td><span class="badge-soft badge-success !text-[10px]">Active</span></td>
                    </tr>
                    <tr>
                        <td class="font-medium">Vantage Retail &middot; Expansion</td>
                        <td><span class="badge-soft badge-warning !text-[10px]">Negotiation</span></td>
                        <td class="u-color-text-tertiary">$142,500</td>
                        <td><span class="flex flex-wrap gap-1"><span class="badge-soft badge-neutral !text-[9.5px]">Retail</span><span class="badge-soft badge-warning !text-[9.5px]">Medium</span></span></td>
                        <td><span class="flex items-center gap-1.5"><img src="{{URL::asset('build/img/avatar/avatar-12.jpg')}}" class="size-5 rounded-full" alt="Marco Diaz profile photo">Marco Diaz</span></td>
                        <td><span class="font-semibold">68%</span></td>
                        <td><span class="badge-soft badge-success !text-[10px]">Active</span></td>
                    </tr>
                    <tr>
                        <td class="font-medium">Cascade Retail Grp &middot; Renewal+</td>
                        <td><span class="badge-soft badge-info !text-[10px]">Negotiation</span></td>
                        <td class="u-color-text-tertiary">$210,000</td>
                        <td><span class="flex flex-wrap gap-1"><span class="badge-soft badge-neutral !text-[9.5px]">Retail</span><span class="badge-soft badge-danger !text-[9.5px]">High Priority</span></span></td>
                        <td><span class="flex items-center gap-1.5"><img src="{{URL::asset('build/img/avatar/avatar-15.jpg')}}" class="size-5 rounded-full" alt="Renee Foster profile photo">Renee Foster</span></td>
                        <td><span class="font-semibold u-color-color-success-600">92%</span></td>
                        <td><span class="badge-soft badge-success !text-[10px]">Active</span></td>
                    </tr>
                    <tr>
                        <td class="font-medium">Solace Health &middot; New Business</td>
                        <td><span class="badge-soft badge-info !text-[10px]">Qualified</span></td>
                        <td class="u-color-text-tertiary">$18,400</td>
                        <td><span class="flex flex-wrap gap-1"><span class="badge-soft badge-neutral !text-[9.5px]">Healthcare</span><span class="badge-soft badge-warning !text-[9.5px]">At Risk</span></span></td>
                        <td><span class="flex items-center gap-1.5"><img src="{{URL::asset('build/img/avatar/avatar-15.jpg')}}" class="size-5 rounded-full" alt="Priya Sharma profile photo">Priya Sharma</span></td>
                        <td><span class="font-semibold u-color-color-warning-600-var-color-warning-500">54%</span></td>
                        <td><span class="badge-soft badge-warning !text-[10px]">Watch</span></td>
                    </tr>
                    <tr>
                        <td class="font-medium">Orbit Logistics &middot; Renewal</td>
                        <td><span class="badge-soft badge-danger !text-[10px]">Negotiation</span></td>
                        <td class="u-color-text-tertiary">$27,800</td>
                        <td><span class="flex flex-wrap gap-1"><span class="badge-soft badge-neutral !text-[9.5px]">Transportation</span><span class="badge-soft badge-danger !text-[9.5px]">At Risk</span></span></td>
                        <td><span class="flex items-center gap-1.5"><img src="{{URL::asset('build/img/avatar/avatar-25.jpg')}}" class="size-5 rounded-full" alt="Nora Whitfield profile photo">Nora Whitfield</span></td>
                        <td><span class="font-semibold u-color-color-danger-600">22%</span></td>
                        <td><span class="badge-soft badge-danger !text-[10px]">At Risk</span></td>
                    </tr>
                    <tr>
                        <td class="font-medium">BrightPath Inc &middot; New Business</td>
                        <td><span class="badge-soft badge-success !text-[10px]">Won</span></td>
                        <td class="u-color-text-tertiary">$27,800</td>
                        <td><span class="flex flex-wrap gap-1"><span class="badge-soft badge-neutral !text-[9.5px]">Education</span></span></td>
                        <td><span class="flex items-center gap-1.5"><img src="{{URL::asset('build/img/avatar/avatar-07.jpg')}}" class="size-5 rounded-full" alt="Carlos Mendez profile photo">Carlos Mendez</span></td>
                        <td><span class="font-semibold u-color-color-success-600">100%</span></td>
                        <td><span class="badge-soft badge-success !text-[10px]">Active</span></td>
                    </tr>
                    <tr>
                        <td class="font-medium">Meridian Labs &middot; New Business</td>
                        <td><span class="badge-soft badge-info !text-[10px]">Qualified</span></td>
                        <td class="u-color-text-tertiary">$54,200</td>
                        <td><span class="flex flex-wrap gap-1"><span class="badge-soft badge-neutral !text-[9.5px]">Biotech</span><span class="badge-soft badge-info !text-[9.5px]">Watching</span></span></td>
                        <td><span class="flex items-center gap-1.5"><img src="{{URL::asset('build/img/avatar/avatar-21.jpg')}}" class="size-5 rounded-full" alt="Marco Diaz profile photo">Marco Diaz</span></td>
                        <td><span class="font-semibold u-color-color-warning-600-var-color-warning-500">61%</span></td>
                        <td><span class="badge-soft badge-warning !text-[10px]">Watch</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</main>

@endsection
