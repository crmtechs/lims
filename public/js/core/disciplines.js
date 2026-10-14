/*jshint esversion: 6 */

$(document).ready(function () {
    let currentPage = 1;
    let pageSize = parseInt($('#table_length_select').val(), 10) || 10;
    let sortColumn = 'discipline';
    let sortDirection = 'asc';
    let pendingDeleteUuid = null;

    function getCsrfToken() {
        return $('meta[name="csrf-token"]').attr('content');
    }

    function loadDisciplines() {
        const tableBody = $('#discipline_table_body');
        tableBody.html(`
            <tr>
                <td colspan="4" class="text-center py-8 text-tertiary">
                    <div class="flex items-center justify-center gap-2">
                        <span class="animate-spin text-primary-600"><i class="icon-loader text-[18px]"></i></span>
                        <span>Loading disciplines...</span>
                    </div>
                </td>
            </tr>
        `);

        const requestData = {
            draw: 1,
            start: (currentPage - 1) * pageSize,
            length: pageSize,
            filter_status: $('#filter_status').val(),
            filter_by: $('#filter_by').val(),
            filter_data: $('#filter_data').val().trim(),
            order: [
                {
                    column: 0,
                    dir: sortDirection
                }
            ],
            columns: [
                {
                    name: sortColumn
                }
            ]
        };

        $.ajax({
            url: '/core/disciplines/data',
            type: 'POST',
            data: requestData,
            headers: {
                'X-CSRF-TOKEN': getCsrfToken()
            },
            success: function (response) {
                renderTable(response);
            },
            error: function () {
                tableBody.html(`
                    <tr>
                        <td colspan="4" class="text-center py-6 text-danger">
                            <i class="icon-octagon-alert me-1"></i> Failed to load disciplines. Please try again.
                        </td>
                    </tr>
                `);
            }
        });
    }

    function renderTable(response) {
        const tableBody = $('#discipline_table_body');
        const data = response.data || [];
        const total = response.recordsFiltered || 0;

        if (data.length === 0) {
            tableBody.html(`
                <tr>
                    <td colspan="4" class="text-center py-8 text-tertiary">
                        <div class="space-y-1">
                            <i class="icon-inbox text-[24px] block text-tertiary mb-1"></i>
                            <p class="font-medium">No disciplines found</p>
                            <p class="text-[11.5px]">Try adjusting your search or filter criteria.</p>
                        </div>
                    </td>
                </tr>
            `);
            $('#tableinfo').text('Showing 0 of 0 entries');
            $('#tablepage').empty();
            return;
        }

        let rowsHtml = '';
        data.forEach(function (row) {
            rowsHtml += `
                <tr class="hover:bg-[var(--surface-sunken)] transition-colors">
                    <td>${row.discipline}</td>
                    <td class="w-36">${row.status}</td>
                    <td class="w-44 text-[12.5px] text-secondary">${row.created_at}</td>
                    <td class="w-28 text-end">${row.actions}</td>
                </tr>
            `;
        });

        tableBody.html(rowsHtml);

        const startEntry = (currentPage - 1) * pageSize + 1;
        const endEntry = Math.min(currentPage * pageSize, total);
        $('#tableinfo').text(`Showing ${startEntry} to ${endEntry} of ${total} entries`);

        renderPagination(total);
    }

    function renderPagination(total) {
        const totalPages = Math.ceil(total / pageSize);
        const paginationContainer = $('#tablepage');
        paginationContainer.empty();

        if (totalPages <= 1) {
            return;
        }

        const prevDisabled = currentPage <= 1 ? 'disabled opacity-40 cursor-not-allowed' : '';
        const prevBtn = $(`
            <button type="button" class="btn btn-outline !size-8 !p-0 ${prevDisabled}" aria-label="Previous page">
                <i class="icon-chevron-left text-[12px]"></i>
            </button>
        `);
        if (currentPage > 1) {
            prevBtn.on('click', function () {
                currentPage--;
                loadDisciplines();
            });
        }
        paginationContainer.append(prevBtn);

        let startP = Math.max(1, currentPage - 2);
        let endP = Math.min(totalPages, currentPage + 2);

        for (let i = startP; i <= endP; i++) {
            const isActive = i === currentPage ? 'btn-primary' : 'btn-outline';
            const pageBtn = $(`
                <button type="button" class="btn ${isActive} !size-8 !p-0 !text-[12px] font-semibold">${i}</button>
            `);
            pageBtn.on('click', function () {
                currentPage = i;
                loadDisciplines();
            });
            paginationContainer.append(pageBtn);
        }

        const nextDisabled = currentPage >= totalPages ? 'disabled opacity-40 cursor-not-allowed' : '';
        const nextBtn = $(`
            <button type="button" class="btn btn-outline !size-8 !p-0 ${nextDisabled}" aria-label="Next page">
                <i class="icon-chevron-right text-[12px]"></i>
            </button>
        `);
        if (currentPage < totalPages) {
            nextBtn.on('click', function () {
                currentPage++;
                loadDisciplines();
            });
        }
        paginationContainer.append(nextBtn);
    }

    // Filter events
    $('#filter_search_btn').on('click', function () {
        currentPage = 1;
        loadDisciplines();
    });

    $('#filter_data').on('keypress', function (e) {
        if (e.which === 13) {
            $('#filter_search_btn').click();
        }
    });

    $('#filter_status').on('change', function () {
        currentPage = 1;
        loadDisciplines();
    });

    $('#filter_clear_btn').on('click', function () {
        $('#filter_status').val('');
        $('#filter_data').val('');
        currentPage = 1;
        loadDisciplines();
    });

    $('#table_length_select').on('change', function () {
        pageSize = parseInt($(this).val(), 10) || 10;
        currentPage = 1;
        loadDisciplines();
    });

    // Column sorting
    $('th[data-column]').on('click', function () {
        const col = $(this).data('column');
        if (sortColumn === col) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = col;
            sortDirection = 'asc';
        }
        currentPage = 1;
        loadDisciplines();
    });

    // Delete modal handling
    $(document).on('click', '.delete-discipline-btn', function (e) {
        e.preventDefault();
        pendingDeleteUuid = $(this).data('uuid');
        const disciplineName = $(this).data('name') || 'this discipline';

        $('#deleteDisciplineName').text(disciplineName);
        $('#deleteConfirmModal').removeClass('hidden');
    });

    $('#cancelDeleteBtn').on('click', function () {
        pendingDeleteUuid = null;
        $('#deleteConfirmModal').addClass('hidden');
    });

    $('#confirmDeleteBtn').on('click', function () {
        if (!pendingDeleteUuid) {
            return;
        }

        const btn = $(this);
        btn.prop('disabled', true).text('Deleting...');

        $.ajax({
            url: `/core/disciplines/${pendingDeleteUuid}/delete`,
            type: 'POST',
            headers: {
                'X-CSRF-TOKEN': getCsrfToken()
            },
            success: function () {
                $('#deleteConfirmModal').addClass('hidden');
                btn.prop('disabled', false).text('Delete');
                pendingDeleteUuid = null;
                loadDisciplines();
            },
            error: function () {
                btn.prop('disabled', false).text('Delete');
                alert('Failed to delete discipline. Please try again.');
            }
        });
    });

    // Initial load
    loadDisciplines();
});
