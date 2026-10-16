/*jshint esversion: 6 */

let targetDeleteUuid = null;

function edit_discipline(uuid)
{
    window.location.href = `/core/disciplines/${uuid}/edit`;
}

function delete_discipline(uuid, name)
{
    targetDeleteUuid = uuid;
    $('#deleteDisciplineName').text(name || 'this discipline');
    if (typeof window.openModal === 'function')
    {
        window.openModal('deleteConfirmModal');
    }
    else
    {
        $('#deleteConfirmModal').removeClass('hidden');
    }
}

$(document).ready(function ()
{
    $('#cancelDeleteBtn').on('click', function ()
    {
        targetDeleteUuid = null;
        if (typeof window.closeModal === 'function')
        {
            window.closeModal('deleteConfirmModal');
        }
        else
        {
            $('#deleteConfirmModal').addClass('hidden');
        }
    });

    $('#confirmDeleteBtn').on('click', function ()
    {
        if (!targetDeleteUuid)
        {
            return;
        }

        const btn = $(this);
        btn.prop('disabled', true).text('Deleting...');

        $.ajax({
            url: `/core/disciplines/${targetDeleteUuid}/delete`,
            type: 'POST',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function ()
            {
                window.location.href = '/core/disciplines';
            },
            error: function ()
            {
                btn.prop('disabled', false).text('Delete');
                alert('Failed to delete discipline. Please try again.');
            }
        });
    });
});
