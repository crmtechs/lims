/*jshint esversion: 6 */

function submit_discipline() {
    const form = $("#discipline_edit_form");
    const saveBtn = $("#save_discipline_btn");

    const statusValue = $('input[name="status"]:checked').val() || $('#status').val() || 'active';

    const data = {
        discipline: $('#discipline').val(),
        short_name: $('#short_name').val(),
        status: statusValue
    };

    $.ajax({
        url: form.attr('action'),
        type: form.attr('method') || 'POST',
        data: data,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        beforeSend: function () {
            saveBtn.prop('disabled', true).addClass('opacity-70');
            $('.field-control').removeClass('border-danger !border-danger-500 !bg-danger-transparent');
            $('[id$="-error"]').text('');
            $('#form-error-alert').addClass('hidden');
        },
        success: function (response, status, xhr) {
            if (xhr.status === 200 || (response && response.id)) {
                const id = response.id;
                window.location.href = `/core/disciplines/${id}`;
            } else {
                window.location.href = '/core/disciplines';
            }
        },
        error: function (xhr) {
            saveBtn.prop('disabled', false).removeClass('opacity-70');

            if (xhr.status === 422) {
                const response = xhr.responseJSON;
                const errors = response ? response.errors : {};

                $('#form-error-alert').removeClass('hidden');
                $('#form-error-message').text('Please review the form fields with errors below.');

                $.each(errors, function (field, message) {
                    const inputElement = $("#" + field);
                    const errorElement = $("#" + field + "-error");

                    inputElement.addClass("border-danger");
                    const errorText = Array.isArray(message) ? message[0] : message;
                    errorElement.text(errorText);
                });
            } else {
                $('#form-error-alert').removeClass('hidden');
                $('#form-error-message').text('An unexpected error occurred while updating. Please try again.');
            }
        }
    });
}

$(document).ready(function () {
    $(document).on('input change', '.field-control', function () {
        $(this).removeClass('border-danger');
        $('#' + $(this).attr('id') + '-error').text('');
    });

    $('#discipline_edit_form').on('keydown', ':input:not(textarea)', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            return false;
        }
    });

    $('#discipline_edit_form').on('submit', function (e) {
        e.preventDefault();
        return false;
    });
});
