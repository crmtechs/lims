<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta content="Laboratory Information Management System" name="description">
<meta content="CRM Technologies" name="author">

<!-- Favicon -->
<link rel="shortcut icon" type="image/x-icon" href="{{ asset('build/img/favicon.png') }}">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="{{ asset('build/img/apple-icon.png') }}">

<link rel="stylesheet" href="{{ asset('build/libs/@phosphor-icons/web/duotone/style.css') }}">
<link rel="stylesheet" href="{{ asset('build/libs/@phosphor-icons/web/regular/style.css') }}">
<link rel="stylesheet" href="{{ asset('build/libs/@phosphor-icons/web/fill/style.css') }}">

<link rel="stylesheet" href="{{ asset('build/libs/lucide/lucide.css') }}">

<link rel="stylesheet" href="{{ asset('build/libs/simplebar/simplebar.min.css') }}">

<link rel="stylesheet" href="{{ asset('build/libs/prismjs/themes/prism.min.css') }}">

@if (Route::is('icon-fontawesome'))
<link rel="stylesheet" href="{{ asset('build/libs/@fortawesome/fontawesome-free/css/fontawesome.min.css') }}">
<link rel="stylesheet" href="{{ asset('build/libs/@fortawesome/fontawesome-free/css/all.min.css') }}">
@endif

@if (Route::is('ui-rangeslider'))
<link rel="stylesheet" href="{{ asset('build/libs/nouislider/nouislider.min.css') }}">
@endif

@if (Route::is(['ui-dragula', 'crm-dashboard']))
<link rel="stylesheet" href="{{ asset('build/libs/dragula/dragula.min.css') }}">
@endif

@if (Route::is('ui-lightbox'))
<link rel="stylesheet" href="{{ asset('build/libs/glightbox/css/glightbox.min.css') }}">
@endif

<link rel="stylesheet" href="{{ asset('build/libs/choices.js/public/assets/styles/choices.min.css') }}">
@vite('resources/css/choices-theme.css')

<link rel="stylesheet" href="{{ asset('build/libs/flatpickr/flatpickr.min.css') }}">
@vite('resources/css/date-range-picker.css')

@vite('resources/css/style.css')
<link rel="stylesheet" href="{{ asset('css/custom.css') }}">
