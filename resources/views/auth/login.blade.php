@extends('layouts.guest')
@section('title', 'Sign In')
@section('content')

    <div class="min-h-screen grid lg:grid-cols-2 bg-base">

        <!-- Left: brand panel -->
        <div class="hidden lg:flex relative items-center justify-center p-12 overflow-hidden u-background-linear-gradient-150deg-color-primary-700-color-pr">
            <div class="absolute inset-0 opacity-10 u-background-image-radial-gradient-circle-at-20-20-white-1px-t"></div>

            <div class="relative max-w-[440px] w-full">

                <h2 class="font-display font-bold text-[24px] text-white">Laboratory Information Management System</h2>
                <p class="text-[13px] mt-2 u-color-rgb-255-255-255-0-7">Comprehensive management, operations, and analytics unified in one workspace.</p>

                <div class="space-y-2 mt-5">
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>Equipment Calibration Scheduling & Tracking
                    </div>
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>Comprehensive Testing & Validation Workflows
                    </div>
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>Standard Operating Procedure (SOP) Management
                    </div>
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>Measurement Uncertainty Calculation & Reporting
                    </div>
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>Traceability to National/International Standards
                    </div>
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>Asset & Reference Standard Management
                    </div>
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>Out of Tolerance (OOT) & Non-Conformance Tracking
                    </div>
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>ISO/IEC 17025 Compliance & Audit Readiness
                    </div>
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>Automated Calibration Certificate Generation
                    </div>
                    <div class="flex items-center gap-2 text-[12.5px] text-white">
                        <i class="icon-check-circle-2 text-[15px] shrink-0 u-color-color-success-400"></i>Environmental Condition Monitoring & Logging
                    </div>
                </div>

                <div class="flex items-center gap-2 mt-6">
                    <p class="text-[12px] u-color-rgb-255-255-255-0-7">Developed By <a href="https://crmtechs.com" target="_blank" class="text-white hover:underline">CRM Technologies</a></p>
                </div>
            </div>
        </div>

        <!-- Right: form -->
        <div class="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10">
            <div class="w-full max-w-[400px] mx-auto">

                <a href="{{ url('/') }}" class="flex items-center gap-2.5 mb-10">
                    <img src="{{ asset('images/logo.png') }}" alt="Company Logo" class="login-logo">
                </a>

                <h1 class="font-display font-bold text-[22px]">Welcome To LIMS</h1>
                <p class="text-[12.5px] mt-1.5 text-tertiary">Sign In To Laboratory Information Management System</p>

                <div class="flex items-center gap-3 my-6">
                    <span class="flex-1 h-px bg-border-subtle"></span>
                    <span class="text-[11px] font-medium text-tertiary">Sign in using your credentials</span>
                    <span class="flex-1 h-px bg-border-subtle"></span>
                </div>

                <form method="POST" action="{{ route('login.check') }}" class="space-y-4">
                    @csrf
                    
                    @if($errors->any())
                    <div role="alert" class="flex items-center p-4 font-medium bg-danger-transparent rounded-lg text-danger">
                        <i class="icon icon-octagon-alert me-1"></i>{{ $errors->first() }}
                    </div>
                    @endif

                    <div>
                        <label class="text-[11.5px] font-semibold uppercase tracking-wide mb-1.5 text-tertiary" for="username">Username</label>
                        <div class="relative mt-1.5">
                            <i class="icon-user absolute top-1/2 -translate-y-1/2 start-3 text-[14px] text-tertiary"></i>
                            <input type="text" name="username" id="username" placeholder="username" class="w-full ps-9 pe-3 py-2.5 rounded-lg text-[12.5px] outline-none bg-sunken-bordered" value="{{ old('username') }}" autofocus autocomplete="username">
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between">
                            <label class="text-[11.5px] font-semibold uppercase tracking-wide mb-1.5 text-tertiary" for="password">Password</label>
                        </div>
                        <div class="relative mt-1.5">
                            <i class="icon-lock absolute top-1/2 -translate-y-1/2 start-3 text-[14px] text-tertiary"></i>
                            <input type="password" name="password" id="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" class="w-full ps-9 pe-9 py-2.5 rounded-lg text-[12.5px] outline-none bg-sunken-bordered" autocomplete="current-password">
                        </div>
                    </div>
                    <label class="flex items-center gap-2 text-[12px] font-medium">
                        <input type="checkbox" name="remember" class="size-3.5 rounded" {{ old('remember') ? 'checked' : '' }}>
                        Remember Me
                    </label>
                    <button type="submit" class="btn btn-primary w-full justify-center !text-[13px]">Sign In<i class="icon-arrow-right text-[13px]"></i></button>
                </form>
                <p class="text-center text-[12.5px] mt-6 text-tertiary">
                    <a href="{{url('forgot-password')}}" class="font-semibold text-primary-600">Forgot Password?</a>
                </p>
            </div>
        </div>
    </div>
@endsection
