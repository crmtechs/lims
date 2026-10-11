<!DOCTYPE html>
<html lang="en">
    <head>
        <title>
            {{ config('app.title') }} @hasSection('title') : @yield('title') @endif
        </title>

        @stack('meta')

        @include('layouts.css')
        @include('layouts.javascript')

        @stack('scripts')
    </head>
    <body>
        @yield('content')
    </body>
</html>
