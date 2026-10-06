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

    @yield('content')

    @include('layouts.javascript')
    @stack('scripts')

</body>

</html>
