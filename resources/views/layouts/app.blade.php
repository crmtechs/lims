<!DOCTYPE html>
<html lang="en">
<head>
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
