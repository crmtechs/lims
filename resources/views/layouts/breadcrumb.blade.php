@if (!empty($breadcrumbs))
    @php
        $heading = isset($breadcrumbs['heading']) ? $breadcrumbs['heading'] : '';
        $hierarchy = isset($breadcrumbs['hierarchy']) ? $breadcrumbs['hierarchy'] : [];
    @endphp

    <div class="px-4 lg:px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
        <div class="flex flex-wrap items-center justify-between gap-2 max-w-[1600px] mx-auto">
            <h2 class="font-display font-bold text-[13px] tracking-wide uppercase">{!! $heading !!}</h2>
            <ol class="flex flex-wrap items-center whitespace-nowrap gap-2 text-[12px]">
                @foreach ($hierarchy as $item)
                    @if (!$loop->first)
                        <li class="inline-flex items-center">
                            <i class="icon icon-chevron-right"></i>
                        </li>
                    @endif

                    @if ($loop->last || empty($item['url']))
                        @if ($loop->last)
                            <li class="inline-flex items-center font-medium text-dark" aria-current="page">
                                {!! $item['label'] ?? '' !!}
                            </li>
                        @else
                            <li class="inline-flex items-center text-gray-600">
                                {!! $item['label'] ?? '' !!}
                            </li>
                        @endif
                    @else
                        <li class="inline-flex items-center">
                            <a class="flex items-center text-gray-600 hover:text-primary" href="{{ $item['url'] }}">
                                {!! $item['label'] ?? '' !!}
                            </a>
                        </li>
                    @endif
                @endforeach
            </ol>
        </div>
    </div>
@endif