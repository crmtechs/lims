// ---- calendar-data.js ----------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;
  if (typeof FullCalendar === "undefined") return;

  // CSS fix to ensure no scrollbars appear in any view
  calendarEl.style.overflow = 'hidden';

  const removePopup = () => {
    document.querySelector('.fc-event-popup')?.remove();
  };

  const closeOverlay = (id) => {
    if (window.HSOverlay) window.HSOverlay.close(document.querySelector(id));
  };

  const openOverlay = (id) => {
    if (window.HSOverlay) window.HSOverlay.open(document.querySelector(id));
  };

  const today = new Date();

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const addDays = (days) => {
    const date = new Date(today);
    date.setDate(today.getDate() + days);
    return formatDate(date);
  };

  const palette = [
    { backgroundColor: '#EEF2FF', borderColor: '#6366F1', textColor: '#4338CA' },
    { backgroundColor: '#FCE7F3', borderColor: '#EC4899', textColor: '#BE185D' },
    { backgroundColor: '#ECFEFF', borderColor: '#06B6D4', textColor: '#0E7490' },
    { backgroundColor: '#FFF7ED', borderColor: '#F97316', textColor: '#9A3412' },
    { backgroundColor: '#F0FDF4', borderColor: '#22C55E', textColor: '#15803D' },
    { backgroundColor: '#FAF5FF', borderColor: '#A855F7', textColor: '#7E22CE' }
  ];
  let paletteIndex = 0;
  const nextColors = () => palette[paletteIndex++ % palette.length];

  const uniqueEvents = [
    {
      title: 'Team Hall YT',
      start: addDays(0), // Today
      backgroundColor: '#EEF2FF',
      borderColor: '#6366F1',
      textColor: '#4338CA'
    },
    {
      title: 'Training Workshop',
      start: `${addDays(1)}T09:30:00`, // Tomorrow
      end: `${addDays(1)}T10:30:00`,
      backgroundColor: '#FCE7F3',
      borderColor: '#EC4899',
      textColor: '#BE185D'
    },
    {
      title: 'Wellness Session',
      start: addDays(2), // +2 days
      backgroundColor: '#ECFEFF',
      borderColor: '#06B6D4',
      textColor: '#0E7490'
    },
    {
      title: 'Team Activity',
      start: addDays(3), // +3 days
      backgroundColor: '#FFF7ED',
      borderColor: '#F97316',
      textColor: '#9A3412'
    },

    {
      title: 'Weekly Sync',
      start: addDays(4),
      allDay: true,
      backgroundColor: '#F0FDF4',
      borderColor: '#22C55E',
      textColor: '#15803D'
    },
    {
      title: 'Weekly Sync',
      start: `${addDays(4)}T09:00:00`,
      end: `${addDays(4)}T10:00:00`,
      backgroundColor: '#F0FDF4',
      borderColor: '#22C55E',
      textColor: '#15803D'
    },

    {
      title: 'Project Demo',
      start: addDays(5),
      allDay: true,
      backgroundColor: '#FAF5FF',
      borderColor: '#A855F7',
      textColor: '#7E22CE'
    },
    {
      title: 'Project Demo',
      start: `${addDays(5)}T09:00:00`,
      end: `${addDays(5)}T10:30:00`,
      backgroundColor: '#FAF5FF',
      borderColor: '#A855F7',
      textColor: '#7E22CE'
    }
  ];

  // Elements from the Add / Edit Event modals
  const addForm = {
    name: document.getElementById('event-name'),
    category: document.getElementById('event-category'),
    date: document.getElementById('event-date'),
    startTime: document.getElementById('event-start-time'),
    endTime: document.getElementById('event-end-time'),
    location: document.getElementById('event-location'),
    participants: document.getElementById('event-participants'),
    description: document.getElementById('event-description'),
    submitBtn: document.querySelector('#add-event .btn-primary')
  };

  const editForm = {
    name: document.getElementById('edit-event-name'),
    category: document.getElementById('edit-event-category'),
    date: document.getElementById('edit-event-date'),
    startTime: document.getElementById('edit-event-start-time'),
    endTime: document.getElementById('edit-event-end-time'),
    location: document.getElementById('edit-event-location'),
    participants: document.getElementById('edit-event-participants'),
    description: document.getElementById('edit-event-description'),
    submitBtn: document.querySelector('#edit-event .btn-primary')
  };

  // Combine a date input (e.g. "27 Jul, 2026") with a time input (e.g. "09:30") into an ISO-ish local datetime
  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const parsed = new Date(dateStr);
    if (isNaN(parsed)) return null;
    if (timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      if (!isNaN(h)) parsed.setHours(h, isNaN(m) ? 0 : m, 0, 0);
    } else {
      parsed.setHours(0, 0, 0, 0);
    }
    return parsed;
  };

  const resetAddForm = () => {
    addForm.name.value = '';
    addForm.category.selectedIndex = 0;
    addForm.date.value = '';
    addForm.startTime.value = '';
    addForm.endTime.value = '';
    addForm.location.value = '';
    addForm.participants.selectedIndex = 0;
    addForm.description.value = '';
  };

  let currentlyEditingEvent = null;

  const populateEditForm = (ev) => {
    editForm.name.value = ev.title || '';
    if (ev.extendedProps && ev.extendedProps.category) {
      editForm.category.value = ev.extendedProps.category;
    }
    if (ev.start) {
      editForm.date.value = ev.start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      if (!ev.allDay) {
        editForm.startTime.value = ev.start.toTimeString().slice(0, 5);
      } else {
        editForm.startTime.value = '';
      }
    }
    if (ev.end && !ev.allDay) {
      editForm.endTime.value = ev.end.toTimeString().slice(0, 5);
    } else {
      editForm.endTime.value = '';
    }
    editForm.location.value = (ev.extendedProps && ev.extendedProps.location) || '';
    editForm.description.value = (ev.extendedProps && ev.extendedProps.description) || '';
  };

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 650,
    contentHeight: 620,
    handleWindowResize: true,
    expandRows: true,
    eventDisplay: 'block',
    events: uniqueEvents,

    // Drag & drop support: move events between days, resize their duration
    editable: true,
    eventStartEditable: true,
    eventDurationEditable: true,
    dayMaxEvents: true,

    eventDrop: function (info) {
      // FullCalendar already updated the event's start/end; nothing else to persist in this demo
    },

    eventResize: function (info) {
      // FullCalendar already updated the event's end/duration
    },

    customButtons: {
      fcToday: {
        text: 'Today',
        click() { calendar.today(); }
      },
      addEvent: {
        text: '+ New Event',
        click() {
          document.querySelector('[data-hs-overlay="#add-event"]')?.click();
        }
      }
    },

    eventClick: function (info) {
      info.jsEvent.preventDefault();
      removePopup();

      const ev = info.event;
      const popup = document.createElement('div');
      popup.className = 'fc-event-popup fixed z-[9999] top-0 left-0 size-full overflow-x-hidden overflow-y-auto flex items-center justify-center p-4 backdrop-blur-sm flex-wrap';
      popup.style.background = 'rgb(15 23 42 / 0.5)';

      const description = (ev.extendedProps && ev.extendedProps.description) || 'An in company training workshop focused on enhancing employee skills through practical, hands on learning.';
      const location = (ev.extendedProps && ev.extendedProps.location) || 'Room 2A';

      popup.innerHTML = `
        <div class="max-w-[400px] min-w-[300px] w-full surface-card p-5">
          <div class="flex justify-between items-center mb-4 pb-4 border-b" style="border-color: var(--border-subtle);">
            <h4 class="font-display font-bold text-[15px]">Event Details</h4>
            <button type="button" class="popup-close header-icon-btn">
              <i class="icon-x text-[16px]"></i>
            </button>
          </div>
          <div class="mb-4 pb-4 border-b" style="border-color: var(--border-subtle);">
            <p class="font-semibold text-[13px] mb-2">${ev.title}</p>
            <p class="mb-4 text-[12.5px]" style="color: var(--text-tertiary);">${description}</p>
            <p class="flex items-center gap-2 mb-3 text-[12.5px]">
              <i class="icon-calendar text-[14px]"></i>
              <span>${ev.start.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
            <p class="flex items-center gap-2 mb-3 text-[12.5px]">
              <i class="icon-clock text-[14px]"></i>
              ${ev.allDay ? 'All Day' : ev.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p class="flex items-center gap-2 text-[12.5px]">
              <i class="icon-map-pin text-[14px]"></i>
              ${location}
            </p>
          </div>
          <div class="flex justify-between items-center">
            <div class="avatar-list-stacked">
              <img src="build/img/avatar/avatar-27.jpg" alt="JS" class="w-6 h-6 inline-flex items-center justify-center hover:-translate-y-[0.188rem] hover:z-1 transition-transform duration-150 ease-in-out -me-3.5 rounded-full border" style="border-color: var(--border-subtle);">
              <img src="build/img/avatar/avatar-28.jpg" alt="AR" class="w-6 h-6 inline-flex items-center justify-center hover:-translate-y-[0.188rem] hover:z-1 transition-transform duration-150 ease-in-out -me-3.5 rounded-full border" style="border-color: var(--border-subtle);">
              <img src="build/img/avatar/avatar-29.jpg" alt="KM" class="w-6 h-6 inline-flex items-center justify-center hover:-translate-y-[0.188rem] hover:z-1 transition-transform duration-150 ease-in-out -me-3.5 rounded-full border" style="border-color: var(--border-subtle);">
              <span class="w-6 h-6 inline-flex items-center justify-center hover:-translate-y-[0.188rem] text-[12px] -me-3.5 rounded-full border" style="background: var(--surface-sunken); border-color: var(--border-subtle);"> 1+ </span>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" class="popup-edit header-icon-btn !size-7">
                <i class="icon-pencil-line text-[13px]"></i>
              </button>
              <button type="button" class="popup-delete header-icon-btn !size-7" style="color: var(--color-danger-600);">
                <i class="icon-trash-2 text-[13px]"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(popup);
      popup.querySelector('.popup-close').onclick = removePopup;

      popup.querySelector('.popup-edit').onclick = () => {
        currentlyEditingEvent = ev;
        populateEditForm(ev);
        removePopup();
        openOverlay('#edit-event');
      };

      popup.querySelector('.popup-delete').onclick = () => {
        ev.remove();
        removePopup();
      };

      setTimeout(() => {
        window.addEventListener('click', function closeOut(e) {
          if (!popup.contains(e.target)) {
            removePopup();
            window.removeEventListener('click', closeOut);
          }
        }, { capture: true });
      }, 10);
    },

    headerToolbar: {
      start: 'prev,title,next',
      center: 'dayGridMonth,dayGridWeek,dayGridDay',
      end: 'fcToday addEvent',
    },

    views: {
      dayGridMonth: {
        displayEventTime: false,
        dayMaxEvents: true
      },
      dayGridWeek: {
        displayEventTime: true
      },
      dayGridDay: {
        displayEventTime: true
      }
    },

    eventDidMount(info) {
      const isMonthTab = info.view.type === 'dayGridMonth';
      const title = info.event.title;

      // Logic to prevent double-showing in Month view if needed
      // If it's month view and the event is the timed version, hide it to avoid duplicates
      if (isMonthTab && !info.event.allDay && (title === 'Weekly Sync' || title === 'Project Demo')) {
         info.el.style.display = 'none';
         return;
      }

      if (isMonthTab && (title === 'Strategy Meeting' || title === 'Tech Review')) {
        info.el.style.display = 'none';
        return;
      }

      info.el.style.backgroundColor = info.event.backgroundColor;
      info.el.style.borderColor = info.event.borderColor;
      info.el.style.color = info.event.textColor;
      info.el.style.borderRadius = '6px';
      info.el.style.cursor = 'grab';

      const frame = info.el.querySelector('.fc-event-main');
      if (frame) {
        frame.style.padding = '2px 4px';
        frame.style.fontWeight = '600';
      }
    }
  });

  calendar.render();

  // ---- Add Event form wiring ------------------------------------------------
  if (addForm.submitBtn) {
    addForm.submitBtn.addEventListener('click', () => {
      const title = addForm.name.value.trim();
      const dateStr = addForm.date.value.trim();
      if (!title || !dateStr) return;

      const start = combineDateTime(dateStr, addForm.startTime.value.trim());
      if (!start) return;
      const end = addForm.endTime.value.trim() ? combineDateTime(dateStr, addForm.endTime.value.trim()) : null;
      const colors = nextColors();

      calendar.addEvent({
        title,
        start,
        end: end || undefined,
        allDay: !addForm.startTime.value.trim(),
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        textColor: colors.textColor,
        extendedProps: {
          category: addForm.category.value,
          location: addForm.location.value.trim(),
          description: addForm.description.value.trim()
        }
      });

      resetAddForm();
      closeOverlay('#add-event');
    });
  }

  // ---- Edit Event form wiring -------------------------------------------------
  if (editForm.submitBtn) {
    editForm.submitBtn.addEventListener('click', () => {
      if (!currentlyEditingEvent) return;

      const title = editForm.name.value.trim();
      const dateStr = editForm.date.value.trim();
      if (!title || !dateStr) return;

      const start = combineDateTime(dateStr, editForm.startTime.value.trim());
      if (!start) return;
      const end = editForm.endTime.value.trim() ? combineDateTime(dateStr, editForm.endTime.value.trim()) : null;

      currentlyEditingEvent.setProp('title', title);
      currentlyEditingEvent.setDates(start, end, { allDay: !editForm.startTime.value.trim() });
      currentlyEditingEvent.setExtendedProp('category', editForm.category.value);
      currentlyEditingEvent.setExtendedProp('location', editForm.location.value.trim());
      currentlyEditingEvent.setExtendedProp('description', editForm.description.value.trim());

      currentlyEditingEvent = null;
      closeOverlay('#edit-event');
    });
  }
});
})();
