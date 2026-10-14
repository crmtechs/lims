<!DOCTYPE html>
<html lang="en">
    <head>
        @include('layouts.title')
        @stack('meta')
        @include('layouts.css')
        @include('layouts.javascript')
        @stack('scripts')
    </head>
    <body>
        @yield('content')
    </body>
</html>
