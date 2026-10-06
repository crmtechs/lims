// ---- datatable.js --------------------------------------------------------------
(function () {
// Vanilla JS data table controller (search, sort, pagination, page length,
// column visibility, drag-to-reorder columns). Replaces the jQuery DataTables plugin.

function initDataTable(table, index) {
  if (!table || table.dataset.dtInit) return;
  table.dataset.dtInit = "1";

  var tableId = table.id || "dtAuto" + index;
  table.id = tableId;

  var thead = table.querySelector("thead");
  var tbody = table.querySelector("tbody");
  if (!thead || !tbody) return;

  var headerCells = Array.prototype.slice.call(thead.querySelectorAll("th"));
  var noSortIndexes = headerCells.reduce(function (acc, th, i) {
    if (th.classList.contains("no-sort")) acc.push(i);
    return acc;
  }, []);

  var allRows = Array.prototype.slice.call(tbody.querySelectorAll("tr"));

  var state = {
    page: 1,
    pageSize: 10,
    search: "",
    sortIndex: null,
    sortDir: 1,
  };

  // ---------- Search box (#tablesearch) ----------
  var searchTarget = document.getElementById("tablesearch");
  if (searchTarget && !searchTarget.querySelector(".dt-search-input")) {
    var wrap = document.createElement("div");
    wrap.style.position = "relative";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";

    var icon = document.createElement("i");
    icon.className = "icon-search dt-search-icon";
    icon.style.cssText = "position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--text-tertiary);pointer-events:none;";

    var input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search...";
    input.className = "dt-search-input";
    input.style.cssText = "border:1px solid var(--border-subtle, #e5e7eb);border-radius:8px;background:#fff;height:35px;width:220px;padding-left:32px;padding-right:12px;box-shadow:none;outline:none;";

    input.addEventListener("input", function () {
      state.search = input.value.trim().toLowerCase();
      state.page = 1;
      render();
    });

    wrap.appendChild(icon);
    wrap.appendChild(input);
    searchTarget.appendChild(wrap);
  }

  // ---------- Page length select (#tablelength) ----------
  var lengthTarget = document.getElementById("tablelength");
  if (lengthTarget && !lengthTarget.querySelector(".dt-length-select")) {
    var label = document.createElement("label");
    label.style.cssText = "display:inline-flex;align-items:center;gap:8px;white-space:nowrap;font-size:12.5px;";
    label.textContent = "Row Per Page ";

    var select = document.createElement("select");
    select.className = "dt-length-select";
    select.style.cssText = "display:inline-block;width:60px;max-width:60px;border:1px solid var(--border-subtle, #e5e7eb);border-radius:6px;padding:4px 6px;";
    [10, 25, 50, -1].forEach(function (val) {
      var opt = document.createElement("option");
      opt.value = String(val);
      opt.textContent = val === -1 ? "All" : String(val);
      select.appendChild(opt);
    });
    select.addEventListener("change", function () {
      state.pageSize = Number(select.value);
      state.page = 1;
      render();
    });

    var entriesSpan = document.createElement("span");
    entriesSpan.textContent = " Entries";

    label.appendChild(select);
    label.appendChild(entriesSpan);
    lengthTarget.appendChild(label);
  }

  // ---------- Sorting on header click ----------
  headerCells.forEach(function (th, i) {
    if (noSortIndexes.indexOf(i) !== -1) return;
    th.style.cursor = "pointer";
    th.addEventListener("click", function () {
      if (state.sortIndex === i) {
        state.sortDir = -state.sortDir;
      } else {
        state.sortIndex = i;
        state.sortDir = 1;
      }
      render();
    });
  });

  // ---------- Filtering + sorting + pagination ----------
  function getFilteredRows() {
    if (!state.search) return allRows.slice();
    return allRows.filter(function (row) {
      return row.textContent.toLowerCase().indexOf(state.search) !== -1;
    });
  }

  function getSortedRows(rows) {
    if (state.sortIndex === null) return rows;
    var idx = state.sortIndex;
    var dir = state.sortDir;
    return rows.slice().sort(function (a, b) {
      var aText = (a.children[idx] && a.children[idx].textContent.trim()) || "";
      var bText = (b.children[idx] && b.children[idx].textContent.trim()) || "";
      var aNum = parseFloat(aText.replace(/[^0-9.\-]/g, ""));
      var bNum = parseFloat(bText.replace(/[^0-9.\-]/g, ""));
      var bothNumeric = !isNaN(aNum) && !isNaN(bNum) && aText !== "" && bText !== "";
      if (bothNumeric) return (aNum - bNum) * dir;
      return aText.localeCompare(bText) * dir;
    });
  }

  function render() {
    var filtered = getSortedRows(getFilteredRows());
    var total = filtered.length;
    var pageSize = state.pageSize === -1 ? total || 1 : state.pageSize;
    var totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (state.page > totalPages) state.page = totalPages;

    var start = (state.page - 1) * pageSize;
    var visible = filtered.slice(start, state.pageSize === -1 ? total : start + pageSize);

    allRows.forEach(function (row) {
      row.style.display = "none";
    });
    visible.forEach(function (row) {
      row.style.display = "";
    });

    // Reorder visible rows to reflect current sort.
    visible.forEach(function (row) {
      tbody.appendChild(row);
    });

    renderPagination(totalPages);
    renderInfo(total, start, visible.length);
    fixLastRowBorder();
  }

  function renderInfo(total, start, count) {
    var infoTarget = document.getElementById("tableinfo");
    if (!infoTarget) return;
    infoTarget.textContent = count === 0 ? "0 - 0 Entries" : (start + 1) + " - " + (start + count) + " Entries (" + total + " total)";
  }

  function renderPagination(totalPages) {
    var pageTarget = document.getElementById("tablepage");
    if (!pageTarget) return;
    pageTarget.innerHTML = "";

    var nav = document.createElement("div");
    nav.style.cssText = "display:inline-flex;align-items:center;gap:2px;";

    function makeButton(html, disabled, active, onClick) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.innerHTML = html;
      btn.disabled = !!disabled;
      btn.className = "dt-paging-button";
      btn.style.cssText = "display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;border-radius:5px;width:26px;height:26px;padding:0;line-height:1;vertical-align:middle;cursor:" + (disabled ? "default" : "pointer") + ";opacity:" + (disabled ? "0.35" : "1") + ";";
      if (active) {
        btn.style.background = "var(--color-primary-600, #2f6fed)";
        btn.style.color = "#fff";
      }
      if (!disabled && onClick) btn.addEventListener("click", onClick);
      return btn;
    }

    nav.appendChild(makeButton('<i class="icon icon-chevron-left"></i>', state.page <= 1, false, function () {
      state.page -= 1;
      render();
    }));

    for (var p = 1; p <= totalPages; p++) {
      (function (pageNum) {
        nav.appendChild(makeButton(String(pageNum), false, pageNum === state.page, function () {
          state.page = pageNum;
          render();
        }));
      })(p);
    }

    nav.appendChild(makeButton('<i class="icon icon-chevron-right"></i>', state.page >= totalPages, false, function () {
      state.page += 1;
      render();
    }));

    pageTarget.appendChild(nav);
  }

  function fixLastRowBorder() {
    var rows = Array.prototype.slice.call(tbody.querySelectorAll("tr"));
    rows.forEach(function (row) {
      Array.prototype.forEach.call(row.querySelectorAll("td"), function (td) {
        td.style.borderBottom = "";
      });
    });
    var lastVisible = null;
    rows.forEach(function (row) {
      if (row.style.display !== "none") lastVisible = row;
    });
    if (lastVisible) {
      Array.prototype.forEach.call(lastVisible.querySelectorAll("td"), function (td) {
        td.style.borderBottom = "none";
      });
    }
  }

  // ---------- Header styling ----------
  headerCells.forEach(function (th) {
    th.style.background = "var(--surface-sunken, #f6f7f9)";
    th.style.borderBottom = "1px solid var(--border-subtle, #e4e7eb)";
  });

  // ---------- Manage Columns: show/hide + drag reorder ----------
  var columnToggles = document.querySelectorAll("#manageColumnsList .column-toggle");
  columnToggles.forEach(function (toggle) {
    toggle.addEventListener("change", function () {
      var wrapper = toggle.closest("[data-column-index]");
      var colIndex = wrapper ? Number(wrapper.getAttribute("data-column-index")) : NaN;
      if (Number.isNaN(colIndex)) return;
      setColumnVisibility(colIndex, toggle.checked);
    });
  });

  function setColumnVisibility(colIndex, visible) {
    var cells = table.querySelectorAll("thead > tr > *:nth-child(" + (colIndex + 1) + "), tbody > tr > *:nth-child(" + (colIndex + 1) + ")");
    cells.forEach(function (cell) {
      cell.style.display = visible ? "" : "none";
    });
  }

  var list = document.getElementById("manageColumnsList");
  if (list && !list.dataset.dragInit) {
    list.dataset.dragInit = "1";
    var dragEl = null;

    Array.prototype.forEach.call(list.children, function (item) {
      var handle = item.querySelector(".icon-grip-vertical");
      if (handle) {
        handle.addEventListener("mousedown", function () {
          item.setAttribute("draggable", "true");
        });
      }

      item.addEventListener("dragstart", function (e) {
        dragEl = item;
        item.classList.add("opacity-40");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", "");
      });

      item.addEventListener("dragend", function () {
        item.classList.remove("opacity-40");
        item.removeAttribute("draggable");
        dragEl = null;
      });

      item.addEventListener("dragover", function (e) {
        if (!dragEl || dragEl === item) return;
        e.preventDefault();
        var rect = item.getBoundingClientRect();
        var before = e.clientY - rect.top < rect.height / 2;
        list.insertBefore(dragEl, before ? item : item.nextSibling);
      });
    });
  }

  render();
}

document.addEventListener("DOMContentLoaded", function () {
  var tables = document.querySelectorAll(".datatable");
  tables.forEach(function (table, index) {
    initDataTable(table, index);
  });
});
})();
