<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <script>
        (function() {
            try {
                const theme = localStorage.getItem('dreamscore-theme') || 'light';
                const effective = theme === 'system'
                    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                    : theme;
                document.documentElement.setAttribute('data-theme', effective);
            } catch (e) {}
        })();
    </script>

    <title>
        {{ config('app.title') }} @hasSection('title') : @yield('title') @endif
    </title>

    @include('layouts.css')
    @stack('styles')
</head>
<body>
    <div class="app-shell">
        @include('partials.sidebar')
        <div class="app-main">
            @include('partials.topbar')
            @include('partials.breadcrumb', [
                'breadcrumb' => \Illuminate\Support\Facades\View::getSection('breadcrumb', ''),
            ])
            @yield('content')
            @include('partials.footer')
        </div>
    </div>
    @include('components.modal-popup')
    @include('layouts.javascript')
    @stack('scripts')
</body>
</html>
