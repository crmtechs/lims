// ---- kanban.js -------------------------------------------------------------------
// Drag & drop for kanban-style boards: Project Management / Task boards, Leads
// pipeline, Deals pipeline, Invoice Status Board, and Restaurant POS Live Orders Board.

// ---- Invoice Status Board -----------------------------------------------------------
(function () {
  const board = document.getElementById("invoicesKanban");
  if (!board) return;

  const lists = Array.from(board.querySelectorAll(".kanban-list"));
  let dragged = null;

  function refreshColumn(list) {
    const col = list.closest(".kanban-col");
    if (!col) return;
    const countEl = col.querySelector(".kanban-count");
    if (countEl) countEl.textContent = list.children.length;
  }

  board.addEventListener("dragstart", (e) => {
    const card = e.target.closest("[draggable='true']");
    if (!card) return;
    dragged = card;
    const list = card.closest(".kanban-list");
    if (list) card.dataset.originList = list.dataset.stage;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => card.classList.add("is-dragging"), 0);
  });

  board.addEventListener("dragend", () => {
    if (dragged) dragged.classList.remove("is-dragging");
    dragged = null;
    lists.forEach((l) => l.classList.remove("is-drop-target"));
  });

  lists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      list.classList.add("is-drop-target");

      if (!dragged) return;
      const afterEl = Array.from(list.querySelectorAll("[draggable='true']:not(.is-dragging)")).find((el) => {
        const rect = el.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
      });
      if (afterEl) {
        list.insertBefore(dragged, afterEl);
      } else {
        list.appendChild(dragged);
      }
    });

    list.addEventListener("dragleave", (e) => {
      if (e.target === list) list.classList.remove("is-drop-target");
    });

    list.addEventListener("drop", (e) => {
      e.preventDefault();
      list.classList.remove("is-drop-target");
      if (!dragged) return;
      const originStage = dragged.dataset.originList;
      refreshColumn(list);
      if (originStage && originStage !== list.dataset.stage) {
        const originEl = lists.find((l) => l.dataset.stage === originStage);
        if (originEl) refreshColumn(originEl);
      }
    });
  });
})();

// ---- Deals pipeline board ----------------------------------------------------------
(function () {
  const board = document.getElementById("dealsKanban");
  if (!board) return;

  const lists = Array.from(board.querySelectorAll(".kanban-list"));
  let dragged = null;

  function formatTotal(cents) {
    const value = cents / 1000;
    return value >= 1000 ? `$${(value / 1000).toFixed(2)}M` : `$${Math.round(value)}K`;
  }

  function refreshColumn(list) {
    const col = list.closest(".kanban-col");
    if (!col) return;
    const cards = Array.from(list.children);
    const total = cards.reduce((sum, card) => sum + Number(card.dataset.value || 0), 0);
    const countEl = col.querySelector(".kanban-count");
    const totalEl = col.querySelector(".kanban-total");
    if (countEl) countEl.textContent = cards.length;
    if (totalEl) totalEl.textContent = formatTotal(total);
  }

  board.addEventListener("dragstart", (e) => {
    const card = e.target.closest("[draggable='true']");
    if (!card) return;
    dragged = card;
    const list = card.closest(".kanban-list");
    if (list) card.dataset.originList = list.dataset.stage;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => card.classList.add("is-dragging"), 0);
  });

  board.addEventListener("dragend", (e) => {
    const card = e.target.closest("[draggable='true']");
    if (card) card.classList.remove("is-dragging");
    dragged = null;
    lists.forEach((l) => l.classList.remove("is-drop-target"));
  });

  lists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      list.classList.add("is-drop-target");

      const afterEl = Array.from(list.querySelectorAll("[draggable='true']:not(.is-dragging)")).find((el) => {
        const rect = el.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
      });
      if (!dragged) return;
      if (afterEl) {
        list.insertBefore(dragged, afterEl);
      } else {
        list.appendChild(dragged);
      }
    });

    list.addEventListener("dragleave", (e) => {
      if (e.target === list) list.classList.remove("is-drop-target");
    });

    list.addEventListener("drop", (e) => {
      e.preventDefault();
      list.classList.remove("is-drop-target");
      if (!dragged) return;
      const originList = dragged.dataset.originList;
      refreshColumn(list);
      if (originList && originList !== list.dataset.stage) {
        const originEl = lists.find((l) => l.dataset.stage === originList);
        if (originEl) refreshColumn(originEl);
      }
    });
  });
})();

// ---- Project Management / Task kanban board --------------------------------------
(function () {
  const board = document.getElementById("kanbanBoard");
  if (!board) return;

  const lists = Array.from(board.querySelectorAll(".kanban-list"));
  let dragged = null;

  function refreshColumn(list) {
    const col = list.closest(".kanban-col");
    if (!col) return;
    const countEl = col.querySelector(".kanban-count");
    if (countEl) countEl.textContent = list.children.length;
  }

  board.addEventListener("dragstart", (e) => {
    const card = e.target.closest("[draggable='true']");
    if (!card) return;
    dragged = card;
    const list = card.closest(".kanban-list");
    if (list) card.dataset.originList = list.dataset.stage;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => card.classList.add("is-dragging"), 0);
  });

  board.addEventListener("dragend", () => {
    if (dragged) dragged.classList.remove("is-dragging");
    dragged = null;
    lists.forEach((l) => l.classList.remove("is-drop-target"));
  });

  lists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      list.classList.add("is-drop-target");

      if (!dragged) return;
      const afterEl = Array.from(list.querySelectorAll("[draggable='true']:not(.is-dragging)")).find((el) => {
        const rect = el.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
      });
      if (afterEl) {
        list.insertBefore(dragged, afterEl);
      } else {
        list.appendChild(dragged);
      }
    });

    list.addEventListener("dragleave", (e) => {
      if (e.target === list) list.classList.remove("is-drop-target");
    });

    list.addEventListener("drop", (e) => {
      e.preventDefault();
      list.classList.remove("is-drop-target");
      if (!dragged) return;
      const originStage = dragged.dataset.originList;
      refreshColumn(list);
      if (originStage && originStage !== list.dataset.stage) {
        const originEl = lists.find((l) => l.dataset.stage === originStage);
        if (originEl) refreshColumn(originEl);
      }
    });
  });
})();

// ---- Leads pipeline board ----------------------------------------------------------
(function () {
  const board = document.getElementById("leadsKanban");
  if (!board) return;

  const lists = Array.from(board.querySelectorAll(".kanban-list"));
  let dragged = null;

  function formatTotal(cents) {
    const value = cents / 1000;
    return value >= 1000 ? `$${(value / 1000).toFixed(2)}M` : `$${Math.round(value)}K`;
  }

  function refreshColumn(list) {
    const col = list.closest(".kanban-col");
    if (!col) return;
    const cards = Array.from(list.children);
    const total = cards.reduce((sum, card) => sum + Number(card.dataset.value || 0), 0);
    const countEl = col.querySelector(".kanban-count");
    const totalEl = col.querySelector(".kanban-total");
    if (countEl) countEl.textContent = cards.length;
    if (totalEl) totalEl.textContent = `${cards.length} Leads - ${formatTotal(total)}`;
  }

  board.addEventListener("dragstart", (e) => {
    const card = e.target.closest("[draggable='true']");
    if (!card) return;
    dragged = card;
    const list = card.closest(".kanban-list");
    if (list) card.dataset.originList = list.dataset.stage;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => card.classList.add("is-dragging"), 0);
  });

  board.addEventListener("dragend", (e) => {
    const card = e.target.closest("[draggable='true']");
    if (card) card.classList.remove("is-dragging");
    dragged = null;
    lists.forEach((l) => l.classList.remove("is-drop-target"));
  });

  lists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      list.classList.add("is-drop-target");

      const afterEl = Array.from(list.querySelectorAll("[draggable='true']:not(.is-dragging)")).find((el) => {
        const rect = el.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
      });
      if (!dragged) return;
      if (afterEl) {
        list.insertBefore(dragged, afterEl);
      } else {
        list.appendChild(dragged);
      }
    });

    list.addEventListener("dragleave", (e) => {
      if (e.target === list) list.classList.remove("is-drop-target");
    });

    list.addEventListener("drop", (e) => {
      e.preventDefault();
      list.classList.remove("is-drop-target");
      if (!dragged) return;
      const originList = dragged.dataset.originList;
      refreshColumn(list);
      if (originList && originList !== list.dataset.stage) {
        const originEl = lists.find((l) => l.dataset.stage === originList);
        if (originEl) refreshColumn(originEl);
      }
    });
  });
})();

// ---- Restaurant POS Live Orders Board -----------------------------------------------
(function () {
  const board = document.getElementById("posOrdersBoard");
  if (!board) return;

  const lists = Array.from(board.querySelectorAll("[data-kanban-col]"));
  let dragged = null;

  function refreshColumn(list) {
    const countEl = board.querySelector(`[data-kanban-count="${list.dataset.kanbanCol}"]`);
    if (countEl) countEl.textContent = list.children.length;
  }

  board.addEventListener("dragstart", (e) => {
    const card = e.target.closest("[draggable='true']");
    if (!card) return;
    dragged = card;
    const list = card.closest("[data-kanban-col]");
    if (list) card.dataset.originCol = list.dataset.kanbanCol;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => card.classList.add("is-dragging"), 0);
  });

  board.addEventListener("dragend", () => {
    if (dragged) dragged.classList.remove("is-dragging");
    dragged = null;
    lists.forEach((l) => l.classList.remove("is-drop-target"));
  });

  lists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      list.classList.add("is-drop-target");

      if (!dragged) return;
      const afterEl = Array.from(list.querySelectorAll("[draggable='true']:not(.is-dragging)")).find((el) => {
        const rect = el.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
      });
      if (afterEl) {
        list.insertBefore(dragged, afterEl);
      } else {
        list.appendChild(dragged);
      }
    });

    list.addEventListener("dragleave", (e) => {
      if (e.target === list) list.classList.remove("is-drop-target");
    });

    list.addEventListener("drop", (e) => {
      e.preventDefault();
      list.classList.remove("is-drop-target");
      if (!dragged) return;
      const originCol = dragged.dataset.originCol;
      refreshColumn(list);
      if (originCol && originCol !== list.dataset.kanbanCol) {
        const originEl = lists.find((l) => l.dataset.kanbanCol === originCol);
        if (originEl) refreshColumn(originEl);
      }
    });
  });
})();
