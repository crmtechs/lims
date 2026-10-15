function show_login_error(message)
{
    let msg = `<div role="alert" class="flex items-center p-4 font-medium bg-danger-transparent rounded-lg text-danger mb-4">
        <i class="icon icon-octagon-alert me-1"></i>${message}</div>`;
    $('#error-box-msg').html(msg);
}

function reset_sign_in()
{
    $('#sign_in').prop('disabled', false);
    $('#sign_in_spinner').addClass('hidden');
    $('#sign_in_arrow').removeClass('hidden');
}

$('#login_form').on('submit', function (e)
{
    e.preventDefault();
});

$('#sign_in').on('click', function (e)
{
    e.preventDefault();

    if ($('#sign_in').prop('disabled'))
    {
        return;
    }

    $('#error-box-msg').html('');

    let login_form = $('#login_form');
    let data = {
        username: $('#username').val(),
        password: $('#password').val(),
        remember: $('input[name="remember"]').is(':checked') ? 1 : 0
    };

    $('#sign_in').prop('disabled', true);
    $('#sign_in_arrow').addClass('hidden');
    $('#sign_in_spinner').removeClass('hidden');

    $.ajax({
        url: login_form.attr('action'),
        type: login_form.attr('method'),
        data: data,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (response)
        {
            if (response.status === 'error')
            {
                reset_sign_in();
                show_login_error(response.error_message);
            }
            else if (response.status === 'success')
            {
                window.location.href = response.redirect;
            }
        },
        error: function ()
        {
            reset_sign_in();
            show_login_error('An unknown error occurred');
        }
    });
});