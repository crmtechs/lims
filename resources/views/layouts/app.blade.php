<!DOCTYPE html>
<html lang="en">
    <head>
        @include('layouts.title')
        @include('layouts.css')
        @stack('styles')
    </head>
    <body>
        <div class="app-shell">
            @include('layouts.sidebar')
            <div class="app-main">
                @include('layouts.topbar')
                @include('layouts.breadcrumb')
                @yield('content')
                @include('layouts.footer')
            </div>
        </div>
        @include('components.modal-popup')
        @include('layouts.javascript')
        @stack('scripts')
    </body>
</html>
