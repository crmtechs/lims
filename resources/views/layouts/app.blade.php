<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <script>
        (function() {
            try {
                localStorage.removeItem('dreamscore-theme');
                document.documentElement.setAttribute('data-theme', 'light');
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
        @include('layouts.sidebar')
        <div class="app-main">
            @include('layouts.topbar')
            @include('layouts.breadcrumb', [
                'breadcrumb' => \Illuminate\Support\Facades\View::getSection('breadcrumb', ''),
            ])
            @yield('content')
            @include('layouts.footer')
        </div>
    </div>
    @include('components.modal-popup')
    @include('layouts.javascript')
    @stack('scripts')
</body>
</html>
