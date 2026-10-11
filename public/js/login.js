$(document).ready(function () {
    function showError(message) {
        let msg = `<div role="alert" class="flex items-center p-4 font-medium bg-danger-transparent rounded-lg text-danger mb-4">
            <i class="icon icon-octagon-alert me-1"></i>${message}
        </div>`;
        $('#error-box-msg').html(msg);
    }

    $('#sign_in').on('click', function (e) {
        e.preventDefault();

        $('#error-box-msg').html('');

        let login_form = $("#login_form");
        let data = {
            username: $('#username').val(),
            password: $('#password').val(),
            remember: $('input[name="remember"]').is(':checked') ? 1 : 0
        };

        $.ajax({
            url: login_form.attr('action'),
            type: login_form.attr('method'),
            data: data,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                if (response.status === 'error') {
                    switch (response.error) {
                        case 'empty_credentials':
                            showError('Empty username or password');
                            break;
                        case 'username_does_not_exist':
                            showError('Username does not exist');
                            break;
                        case 'password_does_not_match':
                            showError('Password does not match');
                            break;
                        case 'user_inactive':
                            showError('Account inactive, contact administrator');
                            break;
                        case 'software_license_expired':
                            showError('Software license expired');
                            break;
                        case 'auth_failed':
                            showError("{{ trans('auth.failed') }}");
                            break;
                        default:
                            showError('An unknown error occurred');
                    }
                } else if (response.status === 'success') {
                    window.location.href = "{{ route('dashboard') }}";
                }
            },
            error: function () {
                showError('Server error. Please try again.');
            }
        });
    });

    $('#username, #password').keypress(function (e) {
        if (e.which == 13) {
            $('#sign_in').click();
        }
    });
});
