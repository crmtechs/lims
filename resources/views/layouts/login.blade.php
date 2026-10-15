<!DOCTYPE html>
<html lang="en">
    <head>
        @stack('meta')
        @include('layouts.title')
        @include('layouts.css')
        @stack('styles')
    </head>
    <body>
        @yield('content')

        @include('layouts.javascript')
        @stack('scripts')
    </body>
</html>
