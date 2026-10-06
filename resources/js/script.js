// Dreamscore common behavior: theme, sidebar, dropdown, chat-offcanvas,
// command-palette, counter, fullscreen, ui-interactions, tabs.
// Loaded unconditionally on every page. Each block is IIFE-scoped so
// identically-named locals across the original files don't collide.

import { initCarousel } from "./carousel.js";

// Show the month as static text (no dropdown) in every flatpickr calendar; only the year stays a control.
if (typeof flatpickr !== "undefined") {
  flatpickr.defaultConfig = flatpickr.defaultConfig || {};
  flatpickr.defaultConfig.monthSelectorType = "static";
}

// ---- todo-delete-modal.js ----
// todo.html: "Delete" in a row's dropdown opens the shared #todo-delete-modal, but the modal has
// no idea which row triggered it. Track the row and remove it when "Yes, Delete" is confirmed.
(function () {
  const modal = document.getElementById("todo-delete-modal");
  if (!modal) return;
  let pendingRow = null;

  document.addEventListener("click", function (e) {
    const trigger = e.target.closest('[data-hs-overlay="#todo-delete-modal"]');
    if (trigger) pendingRow = trigger.closest("tr");
  });

  document.getElementById("todo-delete-confirm-btn")?.addEventListener("click", function () {
    if (pendingRow) {
      pendingRow.remove();
      pendingRow = null;
    }
    window.closeModal?.("todo-delete-modal");
  });
})();

// ---- confirm-delete-modal.js ----
// Generic delete confirmation: any element with data-confirm-delete-trigger opens the shared
// #genericConfirmDeleteModal (from partials/confirm-delete-modal.html) instead of deleting instantly.
// Optional data-delete-title / data-delete-message customize the copy; the closest [data-delete-row],
// <tr>, or .surface-card is what gets removed when the user confirms.
(function () {
  let pendingDeleteEl = null;

  document.addEventListener("click", function (e) {
    const trigger = e.target.closest("[data-confirm-delete-trigger]");
    if (!trigger) return;
    e.preventDefault();

    pendingDeleteEl = trigger.closest("[data-delete-row], tr, .surface-card");

    const titleEl = document.getElementById("genericConfirmDeleteTitle");
    const messageEl = document.getElementById("genericConfirmDeleteMessage");
    if (titleEl) titleEl.textContent = trigger.dataset.deleteTitle || "Delete Item?";
    if (messageEl) messageEl.textContent = trigger.dataset.deleteMessage || "This action cannot be undone.";

    window.openModal?.("genericConfirmDeleteModal");
  });

  document.getElementById("genericConfirmDeleteBtn")?.addEventListener("click", function () {
    if (pendingDeleteEl) {
      pendingDeleteEl.remove();
      pendingDeleteEl = null;
    }
    window.closeModal?.("genericConfirmDeleteModal");
  });
})();

// ---- email-folder-tab.js ----
// Folder sidebar tabs (Inbox, Starred, Sent, ...): clicking one marks it active, the rest inactive,
// and swaps the list panel on email.html for an empty state (only Inbox has demo data).
document.addEventListener("click", function (e) {
  var tab = e.target.closest("[data-email-folder-tab]");
  if (!tab) return;
  e.preventDefault();
  document.querySelectorAll("[data-email-folder-tab]").forEach(function (el) {
    el.classList.remove("is-active");
  });
  tab.classList.add("is-active");

  var folder = tab.dataset.folder || tab.textContent.trim();
  var title = document.getElementById("emailFolderTitle");
  var subtitle = document.getElementById("emailFolderSubtitle");
  var listPanel = document.getElementById("emailListPanel");
  var emptyState = document.getElementById("emailFolderEmptyState");
  var emptyStateText = document.getElementById("emailFolderEmptyStateText");
  if (!title || !listPanel || !emptyState) return;

  title.textContent = folder;
  if (folder === "Inbox") {
    subtitle.textContent = "6 unread messages in your inbox";
    listPanel.classList.remove("hidden");
    emptyState.classList.add("hidden");
  } else {
    subtitle.textContent = "No messages in " + folder;
    listPanel.classList.add("hidden");
    emptyState.classList.remove("hidden");
    emptyStateText.textContent = "This folder is empty.";
  }
});

// ---- email-row.js ----
// Clicking an inbox row (outside checkbox/star/menu) opens the email view page.
document.addEventListener("click", function (e) {
  var row = e.target.closest("[data-email-row]");
  if (!row) return;
  if (e.target.closest("input, button, a")) return;
  window.location.href = row.getAttribute("data-email-row");
});

// ---- quick-filter-chip.js ----
// Generic multi-select toggle chip: click flips badge-primary/badge-neutral and the check icon.
document.addEventListener("click", function (e) {
  var chip = e.target.closest(".quick-filter-chip");
  if (!chip) return;
  var active = chip.classList.toggle("is-active");
  chip.classList.toggle("badge-primary", active);
  chip.classList.toggle("badge-neutral", !active);
  var icon = chip.querySelector(".icon-check");
  if (active && !icon) {
    chip.insertAdjacentHTML("afterbegin", '<i class="icon-check text-[9px]"></i>');
  } else if (!active && icon) {
    icon.remove();
  }
});

// ---- theme.js ----
// ---- theme.js --------------------------------------------------------------
(function () {
  const STORAGE_KEY = "dreamscore-theme";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredMode() {
    return localStorage.getItem(STORAGE_KEY) || "light";
  }

  function effectiveTheme(mode) {
    if (mode === "system") return media.matches ? "dark" : "light";
    return mode;
  }

  function iconFor(mode) {
    if (mode === "light") return "icon-sun-medium";
    if (mode === "dark") return "icon-moon";
    return "icon-monitor";
  }

  function applyTheme(mode) {
    root.setAttribute("data-theme", effectiveTheme(mode));

    const icon = document.getElementById("themeIcon");
    if (icon) {
      icon.className = icon.className.replace(/icon-\S+/, iconFor(mode));
    }

    document.querySelectorAll(".theme-option").forEach((btn) => {
      const check = btn.querySelector(".icon-check");
      if (!check) return;
      check.classList.toggle("opacity-0", btn.dataset.themeSet !== mode);
      check.classList.toggle("opacity-100", btn.dataset.themeSet === mode);
    });
  }

  function labelFor(mode) {
    if (mode === "light") return "Light mode activated";
    if (mode === "dark") return "Dark mode activated";
    return "Switched to system theme";
  }

  let toastTimer;
  function showThemeToast(mode) {
    let toast = document.getElementById("themeToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "themeToast";
      toast.className = "fixed bottom-6 start-1/2 z-[100] flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold shadow-xl transition-all duration-300";
      toast.style.background = "var(--surface-raised)";
      toast.style.border = "1px solid var(--border-default)";
      toast.style.color = "var(--text-primary)";
      toast.style.transform = "translate(-50%, 12px)";
      toast.style.opacity = "0";
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="${iconFor(mode)} text-[15px]" style="color: var(--color-primary-600);"></i>${labelFor(mode)}`;

    window.clearTimeout(toastTimer);
    requestAnimationFrame(() => {
      toast.style.transform = "translate(-50%, 0)";
      toast.style.opacity = "1";
    });
    toastTimer = window.setTimeout(() => {
      toast.style.transform = "translate(-50%, 12px)";
      toast.style.opacity = "0";
    }, 2200);
  }

  function setMode(mode) {
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode);
    showThemeToast(mode);
  }

  applyTheme(getStoredMode());

  media.addEventListener("change", () => {
    if (getStoredMode() === "system") applyTheme("system");
  });

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-theme-set]");
    if (!trigger) return;
    setMode(trigger.dataset.themeSet);
  });
})();


// ---- lang.js ----
// ---- lang.js (sidebar-only translation) -------------------------------------
(function () {
  const STORAGE_KEY = "dreamscore-lang";

  // Only sidebar text is translated. Any key without an entry for the
  // active language simply falls back to the original English text.
  const DICT = {
    fr: {
      "Favorites": "Favoris", "Dashboard": "Tableau de bord", "All Patients": "Tous les patients",
      "View 4 more": "Voir 4 de plus", "Upgrade plan": "Améliorer l'offre", "Storage": "Stockage",
      "Main": "Principal", "Dashboards": "Tableaux de bord", "Ecommerce": "E-commerce",
      "AI Analytics": "Analyse IA", "Business Intelligence": "Business Intelligence",
      "Sales Analytics": "Analyse des ventes", "Project Management": "Gestion de projet",
      "Finance": "Finance", "Accounting": "Comptabilité", "Banking": "Banque",
      "Crypto Analytics": "Analyse crypto", "Logistics": "Logistique",
      "Hospital Management": "Gestion hospitalière", "School Management": "Gestion scolaire",
      "LMS Analytics": "Analyse LMS", "Hotel Management": "Gestion hôtelière",
      "Restaurant POS": "Caisse restaurant", "Food Delivery": "Livraison de repas",
      "Travel & Booking": "Voyage & Réservation", "SEO Analytics": "Analyse SEO",
      "CRM": "GRC", "HRM": "GRH", "Applications": "Applications", "Chat": "Discussion",
      "AI Chat": "Chat IA", "Calls": "Appels", "Voice Call": "Appel vocal", "Video Call": "Appel vidéo",
      "Calendar": "Calendrier", "Email": "E-mail", "File Manager": "Gestionnaire de fichiers",
      "Kanban": "Kanban", "Notes": "Notes", "To Do": "À faire",
      "Workflow & Approvals": "Flux & Approbations", "Storefront": "Vitrine",
      "Products": "Produits", "Orders": "Commandes", "Categories": "Catégories",
      "Reviews": "Avis", "BI Overview": "Aperçu BI", "Data Sources": "Sources de données",
      "KPI Builder": "Créateur de KPI", "Insights": "Aperçus", "Leads": "Prospects",
      "Deals": "Affaires", "Quotations": "Devis", "Pipeline": "Pipeline",
      "Inventory": "Inventaire", "Stock Transfer": "Transfert de stock",
      "Purchase Orders": "Bons de commande", "Suppliers": "Fournisseurs",
      "Shipments": "Expéditions", "Customer Segments": "Segments clients",
      "Companies": "Entreprises", "Activities": "Activités", "Calls & Emails": "Appels & E-mails",
      "Projects": "Projets", "Tasks": "Tâches", "Team": "Équipe", "Timesheets": "Feuilles de temps",
      "Accounts": "Comptes", "Transactions": "Transactions", "Budgets": "Budgets",
      "Expenses": "Dépenses", "Ledger": "Grand livre", "Invoices": "Factures",
      "Tax Reports": "Rapports fiscaux", "Reconciliation": "Rapprochement",
      "Cards": "Cartes", "Transfers": "Virements", "Loans": "Prêts",
      "Int'l Wires": "Virements internationaux", "Portfolio": "Portefeuille",
      "Market Watch": "Suivi du marché", "Trends": "Tendances", "Vault": "Coffre",
      "Patients": "Patients", "Doctors": "Médecins", "Appointments": "Rendez-vous",
      "Wards & Beds": "Services & Lits", "Pharmacy": "Pharmacie", "Ambulance": "Ambulance",
      "Billing": "Facturation", "Students": "Étudiants", "Classes": "Classes",
      "Attendance": "Présence", "Exams": "Examens", "Courses": "Cours",
      "Learners": "Apprenants", "Assessments": "Évaluations", "Engagement": "Engagement",
      "Rooms": "Chambres", "Reservations": "Réservations", "Guests": "Invités",
      "Housekeeping": "Entretien ménager", "Menu": "Menu", "Tables": "Tables",
      "Kitchen Display": "Affichage cuisine", "Live Orders": "Commandes en direct",
      "Riders": "Livreurs", "Restaurants": "Restaurants", "Delivery Zones": "Zones de livraison",
      "Flights": "Vols", "Cabs": "Taxis", "Cruises": "Croisières", "Trips": "Voyages",
      "Bookings": "Réservations", "Itineraries": "Itinéraires", "Keyword Rank": "Classement mots-clés",
      "Backlinks": "Backlinks", "Site Audit": "Audit du site", "Traffic": "Trafic",
      "Employees": "Employés", "Payroll": "Paie", "Leave Requests": "Demandes de congé",
      "Performance Reviews": "Évaluations de performance", "AI Insights": "Aperçus IA",
      "Chatbot Assistant": "Assistant chatbot", "Predictions": "Prédictions",
      "Model Settings": "Paramètres du modèle", "Management": "Gestion",
      "Customers": "Clients", "Payments": "Paiements", "Users & Access": "Utilisateurs & Accès",
      "Users": "Utilisateurs", "Roles": "Rôles", "Permissions": "Autorisations",
      "Reports": "Rapports", "Sales & Ecommerce": "Ventes & E-commerce", "Sales": "Ventes",
      "Revenue": "Revenu", "Product Performance": "Performance produit",
      "Order Summary": "Résumé des commandes", "Discount & Coupon": "Remise & Coupon",
      "Customer Purchase": "Achat client", "Cart Abandonment": "Abandon de panier",
      "Inventory & Logistics": "Inventaire & Logistique", "Stock Summary": "Résumé du stock",
      "Stock Movement": "Mouvement de stock", "Purchase Order": "Bon de commande",
      "Supplier Performance": "Performance fournisseur", "Shipment / Delivery": "Expédition / Livraison",
      "CRM & Sales Pipeline": "GRC & Pipeline de ventes", "Lead Conversion": "Conversion de prospects",
      "Deals Pipeline": "Pipeline d'affaires", "Sales Rep Performance": "Performance commerciale",
      "Activity": "Activité", "Leave": "Congé", "Employee Performance": "Performance employé",
      "Project Progress": "Avancement du projet", "Task Completion": "Achèvement des tâches",
      "Time Tracking": "Suivi du temps", "Resource Utilization": "Utilisation des ressources",
      "Support / Helpdesk": "Support / Assistance", "Ticket Summary": "Résumé des tickets",
      "Agent Performance": "Performance agent", "SLA Compliance": "Conformité SLA",
      "General": "Général", "User Activity": "Activité utilisateur", "Audit Log": "Journal d'audit",
      "System Usage": "Utilisation système", "Custom Report Builder": "Créateur de rapports",
      "Activity Log": "Journal d'activité", "UI Interface": "Interface UI", "Base UI": "UI de base",
      "Alerts": "Alertes", "Accordion": "Accordéon", "Avatar": "Avatar", "Badges": "Badges",
      "Buttons": "Boutons", "Button Group": "Groupe de boutons", "Breadcrumb": "Fil d'Ariane",
      "Card": "Carte", "Colors": "Couleurs", "Collapse": "Repli", "Dropdowns": "Menus déroulants",
      "Grid": "Grille", "Images": "Images", "Modals": "Fenêtres modales", "Offcanvas": "Panneau latéral",
      "Pagination": "Pagination", "Popovers": "Popovers", "Progress": "Progression",
      "Tabs": "Onglets", "Typography": "Typographie", "Advanced UI": "UI avancée",
      "Dragula": "Dragula", "Clipboard": "Presse-papiers", "Range Slider": "Curseur de plage",
      "Lightbox": "Lightbox", "Forms": "Formulaires", "Form Elements": "Éléments de formulaire",
      "Select2": "Select2", "Form Editor": "Éditeur de formulaire", "Form Picker": "Sélecteur de formulaire",
      "Data Table": "Tableau de données", "Basic Tables": "Tableaux simples", "Charts": "Graphiques",
      "Apex Charts": "Graphiques Apex", "Chart Js": "Chart Js", "Icons": "Icônes",
      "Fontawesome Icons": "Icônes Fontawesome", "Lucide": "Lucide", "Phosphor": "Phosphor",
      "Account": "Compte", "Profile": "Profil", "Settings": "Paramètres",
      "Notifications": "Notifications", "Pages": "Pages", "Authentication": "Authentification",
      "Login": "Connexion", "Register": "Inscription", "Forgot Password": "Mot de passe oublié",
      "Reset Password": "Réinitialiser le mot de passe", "Lock Screen": "Écran verrouillé",
      "Two-Factor Auth": "Authentification à deux facteurs", "Error Pages": "Pages d'erreur",
      "404 Not Found": "404 Introuvable", "500 Server Error": "500 Erreur serveur",
      "Support": "Support", "Documentation": "Documentation", "FAQ": "FAQ",
      "Help Center": "Centre d'aide"
    },
    de: {
      "Favorites": "Favoriten", "Dashboard": "Dashboard", "All Patients": "Alle Patienten",
      "View 4 more": "4 weitere anzeigen", "Upgrade plan": "Plan upgraden", "Storage": "Speicher",
      "Main": "Hauptmenü", "Dashboards": "Dashboards", "Ecommerce": "E-Commerce",
      "AI Analytics": "KI-Analyse", "Business Intelligence": "Business Intelligence",
      "Sales Analytics": "Verkaufsanalyse", "Project Management": "Projektmanagement",
      "Finance": "Finanzen", "Accounting": "Buchhaltung", "Banking": "Banking",
      "Crypto Analytics": "Krypto-Analyse", "Logistics": "Logistik",
      "Hospital Management": "Krankenhausverwaltung", "School Management": "Schulverwaltung",
      "LMS Analytics": "LMS-Analyse", "Hotel Management": "Hotelverwaltung",
      "Restaurant POS": "Restaurant-Kasse", "Food Delivery": "Essenslieferung",
      "Travel & Booking": "Reisen & Buchung", "SEO Analytics": "SEO-Analyse",
      "CRM": "CRM", "HRM": "HRM", "Applications": "Anwendungen", "Chat": "Chat",
      "AI Chat": "KI-Chat", "Calls": "Anrufe", "Voice Call": "Sprachanruf", "Video Call": "Videoanruf",
      "Calendar": "Kalender", "Email": "E-Mail", "File Manager": "Dateimanager",
      "Kanban": "Kanban", "Notes": "Notizen", "To Do": "Aufgaben",
      "Workflow & Approvals": "Workflow & Genehmigungen", "Storefront": "Schaufenster",
      "Products": "Produkte", "Orders": "Bestellungen", "Categories": "Kategorien",
      "Reviews": "Bewertungen", "BI Overview": "BI-Übersicht", "Data Sources": "Datenquellen",
      "KPI Builder": "KPI-Ersteller", "Insights": "Einblicke", "Leads": "Leads",
      "Deals": "Deals", "Quotations": "Angebote", "Pipeline": "Pipeline",
      "Inventory": "Inventar", "Stock Transfer": "Lagertransfer",
      "Purchase Orders": "Bestellungen", "Suppliers": "Lieferanten",
      "Shipments": "Sendungen", "Customer Segments": "Kundensegmente",
      "Companies": "Unternehmen", "Activities": "Aktivitäten", "Calls & Emails": "Anrufe & E-Mails",
      "Projects": "Projekte", "Tasks": "Aufgaben", "Team": "Team", "Timesheets": "Zeiterfassung",
      "Accounts": "Konten", "Transactions": "Transaktionen", "Budgets": "Budgets",
      "Expenses": "Ausgaben", "Ledger": "Hauptbuch", "Invoices": "Rechnungen",
      "Tax Reports": "Steuerberichte", "Reconciliation": "Abstimmung",
      "Cards": "Karten", "Transfers": "Überweisungen", "Loans": "Darlehen",
      "Int'l Wires": "Internationale Überweisungen", "Portfolio": "Portfolio",
      "Market Watch": "Marktbeobachtung", "Trends": "Trends", "Vault": "Tresor",
      "Patients": "Patienten", "Doctors": "Ärzte", "Appointments": "Termine",
      "Wards & Beds": "Stationen & Betten", "Pharmacy": "Apotheke", "Ambulance": "Krankenwagen",
      "Billing": "Abrechnung", "Students": "Schüler", "Classes": "Klassen",
      "Attendance": "Anwesenheit", "Exams": "Prüfungen", "Courses": "Kurse",
      "Learners": "Lernende", "Assessments": "Bewertungen", "Engagement": "Engagement",
      "Rooms": "Zimmer", "Reservations": "Reservierungen", "Guests": "Gäste",
      "Housekeeping": "Housekeeping", "Menu": "Speisekarte", "Tables": "Tische",
      "Kitchen Display": "Küchenanzeige", "Live Orders": "Live-Bestellungen",
      "Riders": "Fahrer", "Restaurants": "Restaurants", "Delivery Zones": "Lieferzonen",
      "Flights": "Flüge", "Cabs": "Taxis", "Cruises": "Kreuzfahrten", "Trips": "Reisen",
      "Bookings": "Buchungen", "Itineraries": "Reisepläne", "Keyword Rank": "Keyword-Ranking",
      "Backlinks": "Backlinks", "Site Audit": "Website-Audit", "Traffic": "Traffic",
      "Employees": "Mitarbeiter", "Payroll": "Gehaltsabrechnung", "Leave Requests": "Urlaubsanträge",
      "Performance Reviews": "Leistungsbeurteilungen", "AI Insights": "KI-Einblicke",
      "Chatbot Assistant": "Chatbot-Assistent", "Predictions": "Vorhersagen",
      "Model Settings": "Modelleinstellungen", "Management": "Verwaltung",
      "Customers": "Kunden", "Payments": "Zahlungen", "Users & Access": "Benutzer & Zugriff",
      "Users": "Benutzer", "Roles": "Rollen", "Permissions": "Berechtigungen",
      "Reports": "Berichte", "Sales & Ecommerce": "Vertrieb & E-Commerce", "Sales": "Vertrieb",
      "Revenue": "Umsatz", "Product Performance": "Produktleistung",
      "Order Summary": "Bestellübersicht", "Discount & Coupon": "Rabatt & Gutschein",
      "Customer Purchase": "Kundenkauf", "Cart Abandonment": "Warenkorbabbruch",
      "Inventory & Logistics": "Inventar & Logistik", "Stock Summary": "Bestandsübersicht",
      "Stock Movement": "Lagerbewegung", "Purchase Order": "Bestellung",
      "Supplier Performance": "Lieferantenleistung", "Shipment / Delivery": "Versand / Lieferung",
      "CRM & Sales Pipeline": "CRM & Vertriebspipeline", "Lead Conversion": "Lead-Konversion",
      "Deals Pipeline": "Deal-Pipeline", "Sales Rep Performance": "Vertriebsleistung",
      "Activity": "Aktivität", "Leave": "Urlaub", "Employee Performance": "Mitarbeiterleistung",
      "Project Progress": "Projektfortschritt", "Task Completion": "Aufgabenerledigung",
      "Time Tracking": "Zeiterfassung", "Resource Utilization": "Ressourcennutzung",
      "Support / Helpdesk": "Support / Helpdesk", "Ticket Summary": "Ticketübersicht",
      "Agent Performance": "Agentenleistung", "SLA Compliance": "SLA-Einhaltung",
      "General": "Allgemein", "User Activity": "Benutzeraktivität", "Audit Log": "Prüfprotokoll",
      "System Usage": "Systemnutzung", "Custom Report Builder": "Berichts-Generator",
      "Activity Log": "Aktivitätsprotokoll", "UI Interface": "UI-Oberfläche", "Base UI": "Basis-UI",
      "Alerts": "Warnungen", "Accordion": "Akkordeon", "Avatar": "Avatar", "Badges": "Badges",
      "Buttons": "Schaltflächen", "Button Group": "Schaltflächengruppe", "Breadcrumb": "Breadcrumb",
      "Card": "Karte", "Colors": "Farben", "Collapse": "Einklappen", "Dropdowns": "Dropdowns",
      "Grid": "Raster", "Images": "Bilder", "Modals": "Modale", "Offcanvas": "Offcanvas",
      "Pagination": "Seitennummerierung", "Popovers": "Popovers", "Progress": "Fortschritt",
      "Tabs": "Tabs", "Typography": "Typografie", "Advanced UI": "Erweiterte UI",
      "Dragula": "Dragula", "Clipboard": "Zwischenablage", "Range Slider": "Bereichsregler",
      "Lightbox": "Lightbox", "Forms": "Formulare", "Form Elements": "Formularelemente",
      "Select2": "Select2", "Form Editor": "Formular-Editor", "Form Picker": "Formularauswahl",
      "Data Table": "Datentabelle", "Basic Tables": "Einfache Tabellen", "Charts": "Diagramme",
      "Apex Charts": "Apex-Diagramme", "Chart Js": "Chart Js", "Icons": "Symbole",
      "Fontawesome Icons": "Fontawesome-Symbole", "Lucide": "Lucide", "Phosphor": "Phosphor",
      "Account": "Konto", "Profile": "Profil", "Settings": "Einstellungen",
      "Notifications": "Benachrichtigungen", "Pages": "Seiten", "Authentication": "Authentifizierung",
      "Login": "Anmelden", "Register": "Registrieren", "Forgot Password": "Passwort vergessen",
      "Reset Password": "Passwort zurücksetzen", "Lock Screen": "Sperrbildschirm",
      "Two-Factor Auth": "Zwei-Faktor-Authentifizierung", "Error Pages": "Fehlerseiten",
      "404 Not Found": "404 Nicht gefunden", "500 Server Error": "500 Serverfehler",
      "Support": "Support", "Documentation": "Dokumentation", "FAQ": "FAQ",
      "Help Center": "Hilfezentrum"
    },
    ar: {
      "Favorites": "المفضلة", "Dashboard": "لوحة التحكم", "All Patients": "جميع المرضى",
      "View 4 more": "عرض 4 أخرى", "Upgrade plan": "ترقية الخطة", "Storage": "التخزين",
      "Main": "الرئيسية", "Dashboards": "لوحات التحكم", "Ecommerce": "التجارة الإلكترونية",
      "AI Analytics": "تحليلات الذكاء الاصطناعي", "Business Intelligence": "ذكاء الأعمال",
      "Sales Analytics": "تحليلات المبيعات", "Project Management": "إدارة المشاريع",
      "Finance": "المالية", "Accounting": "المحاسبة", "Banking": "الخدمات المصرفية",
      "Crypto Analytics": "تحليلات العملات الرقمية", "Logistics": "اللوجستيات",
      "Hospital Management": "إدارة المستشفى", "School Management": "إدارة المدرسة",
      "LMS Analytics": "تحليلات نظام التعلم", "Hotel Management": "إدارة الفندق",
      "Restaurant POS": "نقاط بيع المطعم", "Food Delivery": "توصيل الطعام",
      "Travel & Booking": "السفر والحجز", "SEO Analytics": "تحليلات السيو",
      "CRM": "إدارة علاقات العملاء", "HRM": "إدارة الموارد البشرية", "Applications": "التطبيقات",
      "Chat": "الدردشة", "AI Chat": "دردشة الذكاء الاصطناعي", "Calls": "المكالمات",
      "Voice Call": "مكالمة صوتية", "Video Call": "مكالمة فيديو", "Calendar": "التقويم",
      "Email": "البريد الإلكتروني", "File Manager": "مدير الملفات", "Kanban": "كانبان",
      "Notes": "الملاحظات", "To Do": "المهام", "Workflow & Approvals": "سير العمل والموافقات",
      "Storefront": "واجهة المتجر", "Products": "المنتجات", "Orders": "الطلبات",
      "Categories": "الفئات", "Reviews": "التقييمات", "BI Overview": "نظرة عامة على ذكاء الأعمال",
      "Data Sources": "مصادر البيانات", "KPI Builder": "منشئ مؤشرات الأداء", "Insights": "الرؤى",
      "Leads": "العملاء المحتملون", "Deals": "الصفقات", "Quotations": "عروض الأسعار",
      "Pipeline": "خط الأنابيب", "Inventory": "المخزون", "Stock Transfer": "نقل المخزون",
      "Purchase Orders": "أوامر الشراء", "Suppliers": "الموردون", "Shipments": "الشحنات",
      "Customer Segments": "شرائح العملاء", "Companies": "الشركات", "Activities": "الأنشطة",
      "Calls & Emails": "المكالمات والبريد الإلكتروني", "Projects": "المشاريع", "Tasks": "المهام",
      "Team": "الفريق", "Timesheets": "سجلات الدوام", "Accounts": "الحسابات",
      "Transactions": "المعاملات", "Budgets": "الميزانيات", "Expenses": "المصروفات",
      "Ledger": "دفتر الأستاذ", "Invoices": "الفواتير", "Tax Reports": "التقارير الضريبية",
      "Reconciliation": "التسوية", "Cards": "البطاقات", "Transfers": "التحويلات",
      "Loans": "القروض", "Int'l Wires": "التحويلات الدولية", "Portfolio": "المحفظة",
      "Market Watch": "مراقبة السوق", "Trends": "الاتجاهات", "Vault": "الخزنة",
      "Patients": "المرضى", "Doctors": "الأطباء", "Appointments": "المواعيد",
      "Wards & Beds": "الأجنحة والأسرة", "Pharmacy": "الصيدلية", "Ambulance": "الإسعاف",
      "Billing": "الفوترة", "Students": "الطلاب", "Classes": "الفصول", "Attendance": "الحضور",
      "Exams": "الامتحانات", "Courses": "الدورات", "Learners": "المتعلمون",
      "Assessments": "التقييمات", "Engagement": "التفاعل", "Rooms": "الغرف",
      "Reservations": "الحجوزات", "Guests": "الضيوف", "Housekeeping": "التدبير المنزلي",
      "Menu": "القائمة", "Tables": "الطاولات", "Kitchen Display": "شاشة المطبخ",
      "Live Orders": "الطلبات المباشرة", "Riders": "السائقون", "Restaurants": "المطاعم",
      "Delivery Zones": "مناطق التوصيل", "Flights": "الرحلات الجوية", "Cabs": "سيارات الأجرة",
      "Cruises": "الرحلات البحرية", "Trips": "الرحلات", "Bookings": "الحجوزات",
      "Itineraries": "خطط الرحلات", "Keyword Rank": "ترتيب الكلمات المفتاحية",
      "Backlinks": "الروابط الخلفية", "Site Audit": "تدقيق الموقع", "Traffic": "الزيارات",
      "Employees": "الموظفون", "Payroll": "الرواتب", "Leave Requests": "طلبات الإجازة",
      "Performance Reviews": "تقييمات الأداء", "AI Insights": "رؤى الذكاء الاصطناعي",
      "Chatbot Assistant": "مساعد الدردشة الآلي", "Predictions": "التوقعات",
      "Model Settings": "إعدادات النموذج", "Management": "الإدارة", "Customers": "العملاء",
      "Payments": "المدفوعات", "Users & Access": "المستخدمون والوصول", "Users": "المستخدمون",
      "Roles": "الأدوار", "Permissions": "الصلاحيات", "Reports": "التقارير",
      "Sales & Ecommerce": "المبيعات والتجارة الإلكترونية", "Sales": "المبيعات",
      "Revenue": "الإيرادات", "Product Performance": "أداء المنتج",
      "Order Summary": "ملخص الطلبات", "Discount & Coupon": "الخصومات والقسائم",
      "Customer Purchase": "مشتريات العملاء", "Cart Abandonment": "التخلي عن السلة",
      "Inventory & Logistics": "المخزون واللوجستيات", "Stock Summary": "ملخص المخزون",
      "Stock Movement": "حركة المخزون", "Purchase Order": "أمر الشراء",
      "Supplier Performance": "أداء المورد", "Shipment / Delivery": "الشحن / التسليم",
      "CRM & Sales Pipeline": "إدارة العملاء وخط المبيعات", "Lead Conversion": "تحويل العملاء المحتملين",
      "Deals Pipeline": "خط الصفقات", "Sales Rep Performance": "أداء مندوب المبيعات",
      "Activity": "النشاط", "Leave": "الإجازة", "Employee Performance": "أداء الموظف",
      "Project Progress": "تقدم المشروع", "Task Completion": "إنجاز المهام",
      "Time Tracking": "تتبع الوقت", "Resource Utilization": "استخدام الموارد",
      "Support / Helpdesk": "الدعم / مكتب المساعدة", "Ticket Summary": "ملخص التذاكر",
      "Agent Performance": "أداء الوكيل", "SLA Compliance": "الامتثال لاتفاقية مستوى الخدمة",
      "General": "عام", "User Activity": "نشاط المستخدم", "Audit Log": "سجل التدقيق",
      "System Usage": "استخدام النظام", "Custom Report Builder": "منشئ التقارير المخصصة",
      "Activity Log": "سجل النشاط", "UI Interface": "واجهة المستخدم", "Base UI": "الواجهة الأساسية",
      "Alerts": "التنبيهات", "Accordion": "أكورديون", "Avatar": "الصورة الرمزية",
      "Badges": "الشارات", "Buttons": "الأزرار", "Button Group": "مجموعة الأزرار",
      "Breadcrumb": "مسار التنقل", "Card": "البطاقة", "Colors": "الألوان",
      "Collapse": "الطي", "Dropdowns": "القوائم المنسدلة", "Grid": "الشبكة",
      "Images": "الصور", "Modals": "النوافذ المنبثقة", "Offcanvas": "اللوحة الجانبية",
      "Pagination": "ترقيم الصفحات", "Popovers": "النوافذ المنبثقة الصغيرة",
      "Progress": "التقدم", "Tabs": "علامات التبويب", "Typography": "الطباعة",
      "Advanced UI": "واجهة متقدمة", "Dragula": "دراجولا", "Clipboard": "الحافظة",
      "Range Slider": "شريط النطاق", "Lightbox": "لايت بوكس", "Forms": "النماذج",
      "Form Elements": "عناصر النموذج", "Select2": "سيليكت 2", "Form Editor": "محرر النموذج",
      "Form Picker": "منتقي النموذج", "Data Table": "جدول البيانات",
      "Basic Tables": "جداول أساسية", "Charts": "الرسوم البيانية", "Apex Charts": "رسوم Apex",
      "Chart Js": "Chart Js", "Icons": "الأيقونات", "Fontawesome Icons": "أيقونات Fontawesome",
      "Lucide": "Lucide", "Phosphor": "Phosphor", "Account": "الحساب", "Profile": "الملف الشخصي",
      "Settings": "الإعدادات", "Notifications": "الإشعارات", "Pages": "الصفحات",
      "Authentication": "المصادقة", "Login": "تسجيل الدخول", "Register": "التسجيل",
      "Forgot Password": "نسيت كلمة المرور", "Reset Password": "إعادة تعيين كلمة المرور",
      "Lock Screen": "شاشة القفل", "Two-Factor Auth": "المصادقة الثنائية",
      "Error Pages": "صفحات الخطأ", "404 Not Found": "404 غير موجود",
      "500 Server Error": "500 خطأ في الخادم", "Support": "الدعم",
      "Documentation": "التوثيق", "FAQ": "الأسئلة الشائعة", "Help Center": "مركز المساعدة"
    }
  };

  const SELECTOR = ".sidebar-inner .sidebar-label, .sidebar-inner .sidebar-group-title, .sidebar-inner [data-favorites-more]";

  function getStoredLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function applyLang(lang) {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (!el.dataset.i18nOriginal) el.dataset.i18nOriginal = el.textContent.trim();
      const original = el.dataset.i18nOriginal;
      const translated = (DICT[lang] && DICT[lang][original]) || original;
      // Preserve any trailing icon inside "View 4 more" style buttons.
      const icon = el.querySelector("i");
      el.textContent = translated;
      if (icon) el.appendChild(icon);
    });

    document.querySelectorAll(".lang-option").forEach((btn) => {
      const check = btn.querySelector(".icon-check");
      if (!check) return;
      check.classList.toggle("opacity-0", btn.dataset.langSet !== lang);
      check.classList.toggle("opacity-100", btn.dataset.langSet === lang);
    });
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  applyLang(getStoredLang());

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-lang-set]");
    if (!trigger) return;
    setLang(trigger.dataset.langSet);
  });
})();


// ---- sidebar.js ----
// ---- sidebar.js --------------------------------------------------------------
(function () {
  const shell = document.querySelector(".app-shell");
  const sidebar = document.getElementById("appSidebar");
  const collapseBtn = document.getElementById("sidebarCollapseBtn");
  const mobileBtn = document.getElementById("mobileSidebarBtn");
  const COLLAPSE_KEY = "dreamscore-sidebar-collapsed";

  // ---- Desktop collapse ----------------------------------------------------
  function applyCollapsed(collapsed) {
    if (!shell) return;
    shell.classList.toggle("is-collapsed", collapsed);
  }

  if (shell) {
    applyCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
  }

  if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
      const collapsed = !shell.classList.contains("is-collapsed");
      applyCollapsed(collapsed);
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    });
  }

  // ---- Hover-to-expand a collapsed sidebar (flyout, doesn't change collapsed state) ----
  if (sidebar && shell) {
    sidebar.addEventListener("mouseenter", () => {
      if (shell.classList.contains("is-collapsed")) {
        sidebar.classList.add("is-hover-expanded");
      }
    });
    sidebar.addEventListener("mouseleave", () => {
      sidebar.classList.remove("is-hover-expanded");
    });
  }

  // ---- Mobile open/close ----------------------------------------------------
  function openMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.add("is-mobile-open");
    let backdrop = document.querySelector(".sidebar-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "sidebar-backdrop";
      document.body.appendChild(backdrop);
      backdrop.addEventListener("click", closeMobileSidebar);
    }
  }

  function closeMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("is-mobile-open");
    const backdrop = document.querySelector(".sidebar-backdrop");
    if (backdrop) backdrop.remove();
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", openMobileSidebar);
  }

  // ---- Active link detection ------------------------------------------------------
  (function highlightActiveLink() {
    const menu = document.getElementById("sidebarMenu");
    if (!menu) return;

    let page = window.location.pathname.split("/").pop();
    if (!page) page = "index";

    menu.querySelectorAll("a.is-active").forEach((a) => a.classList.remove("is-active"));
    menu.querySelectorAll("li.has-submenu.is-open").forEach((li) => li.classList.remove("is-open"));

    // Links now render as absolute Laravel URLs (e.g. "http://host/orders") rather
    // than bare filenames ("orders.html"), so comparisons must go through the last
    // path segment instead of matching the raw href attribute.
    const hrefSlug = (a) => {
      const href = a.getAttribute("href") || "";
      return href.split("#")[0].split("?")[0].split("/").filter(Boolean).pop() || "index";
    };

    let link = null;
    menu.querySelectorAll("a[href]").forEach((a) => {
      if (!link && hrefSlug(a) === page) link = a;
    });

    // Explicit overrides for sub-pages whose filename doesn't share a stem with their
    // parent module's sidebar link (e.g. "menu-allergens" -> Menu, not a "menus"
    // list page). Checked before the generic stem fallback below.
    if (!link) {
      const PAGE_MODULE_MAP = {
        "account-activity-log": "accounts",
        "account-mapping-add": "ledger-explorer",
        "account-mapping": "ledger-explorer",
        "account-statements": "accounts",
        "activity-add": "activities",
        "add-categories": "categories",
        "address-add": "customer-explorer",
        "ai-recommendations": "insights-list",
        "anchor-text-report": "backlinks-list",
        "assessment-questions": "quiz-builder",
        "asset-allocation": "portfolio-explorer",
        "assignment-add": "class-workspace",
        "assignments": "class-workspace",
        "audience-details": "customer-segments",
        "audit-details": "audit-log",
        "audit-issue-details": "site-audits-list",
        "banner-slide-add": "storefront",
        "banners-hero-sliders": "storefront",
        "bed-allocation": "floor-layout",
        "bed-cleaning": "floor-layout",
        "beneficiaries": "transfer-center",
        "beneficiary-add": "transfer-center",
        "booking-cancellation": "bookings-list",
        "booking-history": "bookings-list",
        "booking-payment": "bookings-list",
        "booking-settings": "bookings-list",
        "brand-add": "products-list",
        "campaign-add": "leads",
        "card-requests": "card-gallery",
        "card-usage": "card-gallery",
        "category-details": "categories",
        "chart-of-accounts": "ledger-explorer",
        "chatbot-export": "chatbot-conversations",
        "chatbot-knowledge-add": "chatbot-conversations",
        "chatbot-knowledge-base": "chatbot-conversations",
        "chatbot-knowledge-edit": "chatbot-conversations",
        "cleaning-log-add": "housekeeping-task-board",
        "collection-add": "products-list",
        "combo-meal-add": "menu-builder",
        "combo-meals": "menu-builder",
        "company-add": "companies",
        "company-view": "companies",
        "competitor-keywords": "keywords-list",
        "consultation": "appointments",
        "corporate-tax": "tax-filing-center",
        "course-certificates": "course-catalog",
        "course-chapters": "course-catalog",
        "course-lessons": "course-catalog",
        "course-resources": "course-catalog",
        "course-reviews": "course-catalog",
        "crypto-alert-add": "watchlist",
        "currency-add": "international-wires",
        "customer-addresses": "customer-explorer",
        "customer-support-tickets": "customer-explorer",
        "customs-duty": "tax-filing-center",
        "day-planner-activity-add": "itineraries-list",
        "day-planner": "itineraries-list",
        "delivery-chat": "live-map",
        "delivery-coverage": "delivery-zones-map",
        "delivery-eta": "live-map",
        "delivery-pricing-rules": "delivery-zones-map",
        "delivery-status": "live-map",
        "difference-analysis": "match-center",
        "digital-signature": "invoice-workspace",
        "discipline-incident-add": "student-directory",
        "dispatch-add": "live-map",
        "doctor-reviews": "doctor-directory",
        "doctor-schedule": "doctor-directory",
        "domain-add": "site-audits-list",
        "domain-settings": "site-audits-list",
        "email-compose": "email",
        "emergency-case-add": "emergency",
        "employee-activity": "employees-list",
        "employee-assets": "employees-list",
        "employee-documents": "employees-list",
        "employee-salary": "payroll-list",
        "exam-analytics": "exam-planner",
        "expense-activity-log": "expenses-list",
        "feature-flag-add": "model-settings-list",
        "feature-flags": "model-settings-list",
        "filing-status": "tax-filing-center",
        "flight-activity-log": "flights-list",
        "flights-export": "flights-list",
        "flights-import": "flights-list",
        "forum-topic-add": "lms-activity-feed",
        "generated-reports": "report-builder",
        "goal-add": "kpi-builder",
        "gst-summary": "tax-filing-center",
        "guest-allocation": "guest-directory",
        "guest-documents": "guest-directory",
        "guest-loyalty": "guest-directory",
        "guest-preferences": "guest-directory",
        "guest-stay-history": "guest-directory",
        "hospital-invoice-add": "billing",
        "invoice-approval": "invoice-workspace",
        "invoice-attachments": "invoice-workspace",
        "invoice-templates": "invoice-workspace",
        "invoices-kanban": "invoice-workspace",
        "itinerary-activity-log": "itineraries-list",
        "itinerary-add": "itineraries-list",
        "itinerary-details": "itineraries-list",
        "itinerary-documents": "itineraries-list",
        "itinerary-edit": "itineraries-list",
        "journal-approval": "ledger-explorer",
        "journal-entries": "ledger-explorer",
        "kds-ready": "kds-queue",
        "kds-served": "kds-queue",
        "keyword-ranking-history": "keywords-list",
        "kitchen-status": "kds-queue",
        "landing-page-add": "storefront",
        "language-add": "storefront",
        "laundry-batch-add": "housekeeping-task-board",
        "laundry": "housekeeping-task-board",
        "learning-path": "course-catalog",
        "leave-balance": "leave-requests-list",
        "leave-calendar": "leave-requests-list",
        "ledger-audit-trail": "ledger-explorer",
        "ledger-documents": "ledger-explorer",
        "ledger-entries": "ledger-explorer",
        "lms-discussions": "lms-activity-feed",
        "lms-forums": "lms-activity-feed",
        "lms-polls": "lms-activity-feed",
        "lost-and-found": "housekeeping-task-board",
        "lost-found-item-add": "housekeeping-task-board",
        "manual-matching": "match-center",
        "market-alert-add": "watchlist",
        "market-alerts": "watchlist",
        "medicine-batches": "medicine-catalog",
        "menu-allergens": "menu-builder",
        "menu-categories": "menu-builder",
        "menu-category-add": "menu-builder",
        "menu-item-add": "menu-builder",
        "menu-offer-add": "menu-builder",
        "menu-offers": "menu-builder",
        "menu-variants": "menu-builder",
        "model-add": "model-settings-list",
        "model-api-keys": "model-settings-list",
        "model-details": "model-settings-list",
        "model-edit": "model-settings-list",
        "model-usage-logs": "model-settings-list",
        "notification-settings": "profile-settings",
        "order-dinein": "order-board",
        "order-payment": "order-board",
        "order-takeaway-add": "order-board",
        "order-takeaway": "order-board",
        "partner-restaurant-orders": "partner-restaurant-profile",
        "payment-gateway-add": "payment-center",
        "payment-gateways": "payment-center",
        "payment-payouts": "payment-center",
        "payroll-export": "payroll-list",
        "payroll-import": "payroll-list",
        "payroll-run-add": "payroll-list",
        "payslip-details": "payroll-list",
        "payslip-edit": "payroll-list",
        "pharmacy-inventory": "medicine-catalog",
        "pharmacy-purchase-order-add": "medicine-catalog",
        "pharmacy-purchase-order-view": "medicine-catalog",
        "pharmacy-purchase-orders": "medicine-catalog",
        "pharmacy-supplier-add": "medicine-catalog",
        "pharmacy-suppliers": "medicine-catalog",
        "poll-add": "lms-activity-feed",
        "portfolio-asset-add": "portfolio-explorer",
        "portfolio-performance": "portfolio-explorer",
        "prediction-accuracy": "predictions-list",
        "predictions-export": "predictions-list",
        "pricing-rule-add": "products-list",
        "product-brands": "products-list",
        "product-categories": "categories",
        "product-collections": "products-list",
        "product-media-library": "products-list",
        "question-bank-add": "quiz-builder",
        "question-bank": "quiz-builder",
        "rebalancing": "portfolio-explorer",
        "reconciliation-exceptions": "match-center",
        "referring-domains": "backlinks-list",
        "reminder-center": "profile-settings",
        "result-sheet": "exam-planner",
        "review-goals": "reviews-list",
        "review-history": "reviews-list",
        "role-matrix": "role-builder",
        "room-amenities": "room-explorer",
        "run-audit": "site-audits-list",
        "saved-insights": "insights",
        "segment-add": "customer-segments",
        "shared-itineraries": "itineraries-list",
        "shipping-zone-add": "shipments",
        "shipping-zones": "shipments",
        "split-bill": "order-board",
        "store-currencies": "storefront",
        "store-languages": "storefront",
        "storefront-landing-pages": "storefront",
        "student-discipline": "student-directory",
        "support-ticket-add": "customer-explorer",
        "table-reservations": "table-floor-map",
        "tax-exceptions": "tax-filing-center",
        "tax-region-add": "tax-filing-center",
        "tax-settings": "tax-filing-center",
        "theme-customizer": "profile-settings",
        "traffic-segment-edit": "traffic-overview",
        "traffic-sources": "traffic-overview",
        "transfer-approval": "transfer-center",
        "transfer-history": "transfer-center",
        "trip-activity-log": "trips-list",
        "trip-settings": "trips-list",
        "trips-export": "trips-list",
        "trips-import": "trips-list",
        "user-api-tokens": "user-directory",
        "user-devices": "user-directory",
        "user-security": "user-directory",
        "user-sessions": "user-directory",
        "vat-report-germany": "tax-filing-center",
        "vat-report": "tax-filing-center",
        "view-segments": "customer-segments",
        "wallet-recovery": "secure-wallet",
        "withholding-tax": "tax-filing-center",
        "workflow-actions": "workflow-approvals",
        "workflow-approval-levels": "workflow-approvals",
        "workflow-requests": "workflow-approvals"
      };

      const mappedHref = PAGE_MODULE_MAP[page];
      if (mappedHref) {
        menu.querySelectorAll("a[href]").forEach((a) => {
          if (!link && hrefSlug(a) === mappedHref) link = a;
        });
      }
    }

    // Fallback: pages without their own sidebar entry (e.g. "product-details",
    // "product-add") inherit the "active" state of their parent module link
    // (e.g. "products-list" -> Products) by matching a shared name stem.
    if (!link) {
      const SUFFIX_WORDS = ["list", "grid", "add", "edit", "view", "details", "detail", "profile",
        "directory", "catalog", "board", "gallery", "workspace", "explorer", "builder",
        "planner", "center", "timeline"];

      const stem = (filename) => {
        const tokens = filename.replace(/\.html$/, "").split("-");
        while (tokens.length > 1 && SUFFIX_WORDS.includes(tokens[tokens.length - 1])) {
          tokens.pop();
        }
        if (!tokens.length) return "";
        const last = tokens[tokens.length - 1];
        if (last.length > 3 && last.endsWith("s")) {
          tokens[tokens.length - 1] = last.slice(0, -1);
        }
        return tokens.join("-");
      };

      const pageStem = stem(page);
      if (pageStem) {
        menu.querySelectorAll("a[href$='']").forEach((a) => {
          if (link) return;
          const href = a.getAttribute("href").split("/").pop();
          if (stem(href) === pageStem) link = a;
        });
      }
    }

    if (!link) return;

    link.classList.add("is-active");

    let node = link.parentElement;
    while (node && node !== menu) {
      if (node.tagName === "LI" && node.classList.contains("has-submenu")) {
        node.classList.add("is-open");
      }
      node = node.parentElement;
    }

    // Wait for the parent submenu's max-height expand transition (300ms) to
    // finish before centering — scrolling too early measures the link at its
    // still-collapsed position and centers on the wrong spot.
    setTimeout(() => {
      link.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 320);
  })();

  // ---- Submenu accordion ------------------------------------------------------
  document.querySelectorAll("[data-submenu-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest("li.has-submenu");
      if (!li) return;
      const wasOpen = li.classList.contains("is-open");

      // collapse an expanded sidebar automatically opens on submenu click
      if (shell && shell.classList.contains("is-collapsed")) {
        applyCollapsed(false);
        localStorage.setItem(COLLAPSE_KEY, "0");
      }

      li.parentElement.querySelectorAll(":scope > li.has-submenu").forEach((sibling) => {
        if (sibling !== li) sibling.classList.remove("is-open");
      });

      li.classList.toggle("is-open", !wasOpen);
    });
  });

  // ---- Favorites: show more / show less ------------------------------------------------
  document.querySelectorAll("[data-favorites-more]").forEach((btn) => {
    const extra = btn.parentElement.querySelector("[data-favorites-extra]");
    if (!extra) return;
    const label = btn.childNodes[0];

    btn.addEventListener("click", () => {
      const isHidden = extra.classList.contains("hidden");
      extra.classList.toggle("hidden", !isHidden);
      btn.classList.toggle("is-open", isHidden);
      label.textContent = isHidden ? "View less " : "View 4 more ";
    });
  });

  // ---- Favorites: click star to fill/unfill (favorite) a tile --------------------------
  document.querySelectorAll(".favorite-tile-star").forEach((star) => {
    star.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      star.closest(".favorite-tile")?.classList.toggle("is-active");
    });
  });
})();


// ---- chat-offcanvas.js ----
// ---- chat-offcanvas.js --------------------------------------------------------------
(function () {
  const offcanvas = document.getElementById("chatOffcanvas");
  const backdrop = document.getElementById("chatOffcanvasBackdrop");
  const listView = document.getElementById("chatListView");
  const threadView = document.getElementById("chatThreadView");
  const threadName = document.getElementById("chatThreadName");
  const threadAvatar = document.getElementById("chatThreadAvatar");
  const openBtn = document.getElementById("messagesOffcanvasBtn");
  const backBtn = document.getElementById("chatThreadBack");

  function openChat() {
    if (!offcanvas || !backdrop) return;
    backdrop.classList.remove("hidden");
    offcanvas.style.transform = "translateX(0)";
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
  }

  function closeChat() {
    if (!offcanvas || !backdrop) return;
    offcanvas.style.transform = "translateX(100%)";
    window.setTimeout(() => backdrop.classList.add("hidden"), 250);
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
  }

  function showThread(name, avatar) {
    if (threadName) threadName.textContent = name;
    if (threadAvatar) threadAvatar.src = avatar;
    if (listView) listView.classList.add("hidden");
    if (threadView) {
      threadView.classList.remove("hidden");
      threadView.classList.add("flex");
    }
  }

  function showList() {
    if (threadView) {
      threadView.classList.add("hidden");
      threadView.classList.remove("flex");
    }
    if (listView) listView.classList.remove("hidden");
  }

  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showList();
      openChat();
    });
  }

  document.querySelectorAll(".chat-offcanvas-close").forEach((btn) => btn.addEventListener("click", closeChat));
  if (backdrop) backdrop.addEventListener("click", closeChat);
  if (backBtn) backBtn.addEventListener("click", showList);

  document.querySelectorAll(".chat-conv-item").forEach((item) => {
    item.addEventListener("click", () => {
      showThread(item.dataset.chatName, item.dataset.chatAvatar);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && offcanvas && !backdrop.classList.contains("hidden")) closeChat();
  });
})();


// ---- command-palette.js ----
// ---- command-palette.js --------------------------------------------------------------
(function () {
  const backdrop = document.getElementById("cmdkBackdrop");
  const input = document.getElementById("cmdkInput");
  const results = document.getElementById("cmdkResults");
  const triggers = ["headerSearchBar", "sidebarSearchBtn", "mobileSearchBtn"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function open() {
    if (!backdrop) return;
    backdrop.classList.remove("hidden");
    backdrop.classList.add("flex");
    input.value = "";
    filter("");
    requestAnimationFrame(() => input.focus());
  }

  function close() {
    if (!backdrop) return;
    backdrop.classList.add("hidden");
    backdrop.classList.remove("flex");
  }

  function filter(term) {
    const q = term.trim().toLowerCase();
    results.querySelectorAll(".cmdk-item").forEach((item) => {
      const match = item.dataset.label.toLowerCase().includes(q);
      item.classList.toggle("hidden", !match);
    });
  }

  triggers.forEach((btn) => btn.addEventListener("click", open));

  document.addEventListener("keydown", (e) => {
    const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
    if (isCmdK) {
      e.preventDefault();
      backdrop && backdrop.classList.contains("hidden") ? open() : close();
    }
    if (e.key === "Escape") close();
  });

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });
  }

  if (input) {
    input.addEventListener("input", () => filter(input.value));
  }

  if (results) {
    results.addEventListener("click", (e) => {
      const item = e.target.closest(".cmdk-item");
      if (item) close();
    });
  }
})();


// ---- counter.js ----
// ---- counter.js --------------------------------------------------------------
(function () {
  function animateCounter(el) {
    const target = parseFloat(el.dataset.counter);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = prefix + value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll("[data-counter]");

  if (counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((el) => observer.observe(el));
  }
})();


// ---- fullscreen.js ----
// ---- fullscreen.js --------------------------------------------------------------
(function () {
  const btn = document.getElementById("fullscreenBtn");
  const icon = document.getElementById("fullscreenIcon");

  if (btn) {
    btn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (!icon) return;
      icon.className = icon.className.replace(
        /icon-\S+/,
        document.fullscreenElement ? "icon-minimize-2" : "icon-maximize"
      );
    });
  }
})();


// ---- ui-interactions.js ----
// ---- ui-interactions.js --------------------------------------------------------------
// Generic, reusable interaction patterns for the UI showcase pages.
// All driven by data-attributes so showcase pages stay markup-only.
(function () {
  // ---- Accordion (single-open-at-a-time within a group) ------------------------------------
  document.querySelectorAll("[data-accordion-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest("[data-accordion-item]");
      const group = btn.closest("[data-accordion-group]");
      if (!item) return;
      const wasOpen = item.classList.contains("is-open");

      if (group && group.dataset.accordionGroup !== "multi") {
        group.querySelectorAll("[data-accordion-item]").forEach((el) => el.classList.remove("is-open"));
      }
      item.classList.toggle("is-open", !wasOpen);
    });
  });

  // ---- Collapse (independent toggles) -------------------------------------------------------
  document.querySelectorAll("[data-collapse-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.collapseToggle);
      if (!target) return;
      target.classList.toggle("is-open");
      btn.classList.toggle("is-open", target.classList.contains("is-open"));
    });
  });

  // ---- Tabs: now handled by Preline's real HSTabs (data-hs-tab) — see build/libs/preline/tabs.js.
  // [data-tabs]/[data-tab-trigger]/[data-tab-panel] attributes are kept only as CSS hooks (see
  // style.css) on the handful of pages still using them; the switching logic itself is Preline's.

  // ---- Modal / Drawer (backed by Preline's HSOverlay — build/libs/preline/overlay.js) --------
  // Every ".ui-modal"/".drawer-panel" also carries a "hs-overlay" class (see style.css) so
  // Preline's own autoInit registers it; these wrappers just translate the site's existing
  // data-modal-open/data-modal-close attribute convention into Preline calls, and stay exposed
  // on window because many pages still call openModal('id')/closeModal('id') directly from
  // inline onclick or page JS.
  window.openModal = function openModal(id) {
    const modal = typeof id === "string" ? document.getElementById(id) : id;
    if (!modal || !window.HSOverlay) return;
    window.HSOverlay.open(modal);
  };

  window.closeModal = function closeModal(modal) {
    const el = typeof modal === "string" ? document.getElementById(modal) : modal;
    if (!el || !window.HSOverlay) return;
    window.HSOverlay.close(el);
  };

  document.addEventListener(
    "click",
    (e) => {
      const openTrigger = e.target.closest("[data-modal-open]");
      if (openTrigger) {
        openModal(openTrigger.dataset.modalOpen);
        return;
      }
      const closeTrigger = e.target.closest("[data-modal-close]");
      if (closeTrigger) {
        closeModal(closeTrigger.closest(".ui-modal, .drawer-panel"));
        return;
      }
      // .ui-modal is its own backdrop (see style.css --close-when-click-inside), but Preline's
      // own click-outside-to-close is broken in this build (it compares "#"+target.id against
      // the element's plain id, which never matches) — replicate the intended behavior here: a
      // click landing directly on the .ui-modal backdrop (not its dialog content) closes it.
      if (e.target.classList.contains("ui-modal")) {
        closeModal(e.target);
      }
    },
    true
  );

  // Drawers keep their own manual "<id>Backdrop" sibling element (see style.css .drawer-backdrop)
  // instead of Preline's auto-generated one; sync its visibility off Preline's own overlay events
  // so no page needs its own open/close JS for this.
  document.addEventListener("open.hs.overlay", (e) => {
    document.getElementById(`${e.target.id}Backdrop`)?.classList.remove("hidden");
  });
  document.addEventListener("close.hs.overlay", (e) => {
    document.getElementById(`${e.target.id}Backdrop`)?.classList.add("hidden");
  });

  // ---- Step wizard (multi-step "add" forms — account-add, transaction-add, etc.) ---------------
  // Shared by any page whose markup follows the convention: panels with id="wizardStep<n>",
  // step indicators with [data-step-dot="n"]/[data-step-label="n"], nav buttons with
  // class="wizard-step-nav" + data-step-nav="n", and #wizardBackBtn/#wizardContinueBtn.
  // Call once per page: window.initWizard({ steps, finalLabel, onStepChange, onComplete }).
  window.initWizard = function initWizard({ steps, finalLabel, onStepChange, onComplete }) {
    window.currentWizardStep = 1;

    function goToStep(step) {
      if (step < 1 || step > steps) return;
      window.currentWizardStep = step;

      for (let i = 1; i <= steps; i++) {
        document.getElementById(`wizardStep${i}`)?.classList.toggle("hidden", i !== step);
        const dot = document.querySelector(`[data-step-dot="${i}"]`);
        const label = document.querySelector(`[data-step-label="${i}"]`);
        if (!dot || !label) continue;
        if (i < step) {
          dot.style.background = "var(--color-primary-600)";
          dot.style.color = "#fff";
          dot.innerHTML = '<i class="icon-check text-[11px]"></i>';
          label.style.color = "var(--text-primary)";
          label.classList.remove("font-semibold");
        } else if (i === step) {
          dot.style.background = "var(--color-primary-600)";
          dot.style.color = "#fff";
          dot.textContent = i;
          label.style.color = "var(--text-primary)";
          label.classList.add("font-semibold");
        } else {
          dot.style.background = "var(--surface-sunken)";
          dot.style.color = "var(--text-tertiary)";
          dot.textContent = i;
          label.style.color = "var(--text-tertiary)";
          label.classList.remove("font-semibold");
        }
      }

      document.getElementById("wizardBackBtn")?.classList.toggle("hidden", step === 1);
      const continueBtn = document.getElementById("wizardContinueBtn");
      if (continueBtn) {
        continueBtn.innerHTML = step === steps
          ? `<i class="icon-check text-[13px]"></i>${finalLabel}`
          : 'Continue<i class="icon-arrow-right text-[13px]"></i>';
      }

      if (onStepChange) onStepChange(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function wizardContinue() {
      if (window.currentWizardStep === steps) {
        onComplete();
        return;
      }
      goToStep(window.currentWizardStep + 1);
    }

    document.querySelectorAll(".wizard-step-nav").forEach((btn) => {
      btn.addEventListener("click", () => goToStep(Number(btn.dataset.stepNav)));
    });
    document.getElementById("wizardBackBtn")?.addEventListener("click", () => {
      goToStep(window.currentWizardStep - 1);
    });
    document.getElementById("wizardContinueBtn")?.addEventListener("click", wizardContinue);

    window.goToStep = goToStep;
    window.wizardContinue = wizardContinue;
  };

  // ---- Clickable row navigation (any [data-row-href] element — e.g. a <tr> or card that should
  // act like a link to a detail page). Skips navigation when the click landed on a dropdown
  // trigger/panel nested inside the row, so per-row action menus keep working. --------------------
  document.addEventListener("click", (e) => {
    if (e.target.closest(".hs-dropdown-toggle,.hs-dropdown-menu")) return;
    const row = e.target.closest("[data-row-href]");
    if (row) window.location.href = row.dataset.rowHref;
  });

  // ---- Report-page toolbar actions (cart-abandonment-report, customer-purchase-report,
  // discount-coupon-report, order-summary-report, product-performance-report — identical
  // "Export as PDF/Excel/CSV", "Print", "Schedule Report", etc. dropdown menu on each). ----------
  window.showSuccess = function (title, message) {
    document.getElementById("successModalTitle").textContent = title;
    document.getElementById("successModalMessage").textContent = message;
    window.openModal("successModal");
  };

  // Generic crypto coin action modals (reused by portfolio-explorer, watchlist).
  window.openCoinModal = function (name, ticker, price) {
    document.getElementById("coinDetailTitle").textContent = `${name} · ${ticker}`;
    document.getElementById("coinDetailPrice").textContent = price;
    window.openModal("coinDetailModal");
  };
  window.openAlertFormModal = function (name, ticker, price) {
    document.getElementById("alertFormTitle").textContent = `Set Alert · ${name}`;
    document.getElementById("alertFormPrice").value = price.replace(/[^0-9.]/g, "");
    window.openModal("alertFormModal");
  };

  // Generic "publish an activity" validation (reused by activity-add, day-planner-activity-add).
  window.publishActivity = function () {
    const subject = document.getElementById("actSubject").value.trim();
    if (!subject) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  };

  // Closes any open toolbar dropdown, then shows a lightweight confirmation modal.
  window.reportAction = function (title, message) {
    window.HSDropdown?.closeCurrentlyOpened();
    window.showSuccess(title, message);
  };

  // Clones the last filter-condition row inside a Filter Builder block.
  window.addFilterCondition = function (btn) {
    const container = btn.previousElementSibling;
    if (!container) return;
    const rows = container.querySelectorAll(".grid.grid-cols-3");
    const lastRow = rows[rows.length - 1];
    if (!lastRow) return;
    const clone = lastRow.cloneNode(true);
    clone.querySelectorAll("input").forEach((i) => { i.value = ""; });
    clone.querySelectorAll("select").forEach((s) => { s.selectedIndex = 0; });
    container.appendChild(clone);
  };

  // Prompts for a view name and adds it as a new saved-view badge.
  window.saveCurrentView = function (btn) {
    const name = window.prompt("Name this view:", "My Saved View");
    if (!name) return;
    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = "badge-soft badge-primary !text-[11px]";
    badge.textContent = name;
    btn.parentElement.insertBefore(badge, btn);
    window.reportAction("View saved", `"${name}" has been added to your saved views.`);
  };

  document.addEventListener("click", (e) => {
    const actionTrigger = e.target.closest("[data-report-action]");
    if (actionTrigger) {
      e.preventDefault();
      window.reportAction(actionTrigger.dataset.title, actionTrigger.dataset.message);
      return;
    }
    const addFilter = e.target.closest("[data-add-filter-condition]");
    if (addFilter) { window.addFilterCondition(addFilter); return; }
    const saveView = e.target.closest("[data-save-current-view]");
    if (saveView) window.saveCurrentView(saveView);
  });

  // ---- Fullscreen toggle (generic, any [data-fullscreen-toggle] — e.g. a report page's own
  // "Full Screen" button, distinct from the topbar's id="fullscreenBtn" one) --------------------
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-fullscreen-toggle]")) return;
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  });

  // ---- Reload-page button (any page with a plain "Refresh" action, e.g. bi-overview) ----------
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-reload-page]")) location.reload();
  });

  // ---- Print-page button (any page with a plain "Export"/"Print" action) ------------------------
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-print-page]")) window.print();
  });

  // ---- List-page action/share modal triggers (works with whichever implementation the page
  // loaded — list-toolkit.js's generic data-attribute-driven openActionModal(trigger, isBulk),
  // or a page-specific one like products-list.js's string-keyed openActionModal(type, isBulk)).
  // [data-action-modal] only applies to the generic (element-based) implementation.
  document.addEventListener("click", (e) => {
    const actionTrigger = e.target.closest("[data-action-modal]");
    if (actionTrigger) { window.openActionModal?.(actionTrigger, actionTrigger.hasAttribute("data-action-modal-bulk")); return; }
    const shareTrigger = e.target.closest("[data-open-share-modal]");
    if (shareTrigger) { window.openShareModal?.(); return; }
    const confirmTrigger = e.target.closest("[data-confirm-action-modal]");
    if (confirmTrigger) { window.confirmActionModal?.(); return; }
    const copyTrigger = e.target.closest("[data-copy-share-link]");
    if (copyTrigger) { window.copyShareLink?.(); return; }
  });

  // ---- Quick export status modal (workflow-actions/approval-levels/approvals/requests) ---------
  // Shared by any page with #exportStatusModal / #exportStatusFormat / #exportStatusFormat2 /
  // #exportStatusLoading / #exportStatusDone markup (identical across all 4 workflow pages).
  window.quickExport = function (format) {
    const fmtEl = document.getElementById("exportStatusFormat");
    if (!fmtEl) return;
    fmtEl.textContent = format;
    document.getElementById("exportStatusFormat2").textContent = format;
    document.getElementById("exportStatusLoading").classList.remove("hidden");
    document.getElementById("exportStatusDone").classList.add("hidden");
    window.openModal("exportStatusModal");
    setTimeout(() => {
      document.getElementById("exportStatusLoading").classList.add("hidden");
      document.getElementById("exportStatusDone").classList.remove("hidden");
    }, 900);
  };
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-quick-export]");
    if (!trigger) return;
    e.preventDefault();
    window.quickExport(trigger.dataset.quickExport);
  });

  // ---- Table/grid view toggle (any "-list" page with #<prefix>TableView / #<prefix>GridView /
  // #<prefix>ViewListBtn / #<prefix>ViewGridBtn markup — cabs-list, cruises-list, flights-list,
  // trips-list, watchlist, bookings-list, etc.). Call once per page: window.wireListGridToggle('cabs').
  window.wireListGridToggle = function (prefix) {
    function setView(view) {
      const isGrid = view === "grid";
      document.getElementById(`${prefix}TableView`)?.classList.toggle("hidden", isGrid);
      document.getElementById(`${prefix}GridView`)?.classList.toggle("hidden", !isGrid);
      document.getElementById(`${prefix}ViewListBtn`)?.classList.toggle("u-background-surface-sunken", !isGrid);
      document.getElementById(`${prefix}ViewGridBtn`)?.classList.toggle("u-background-surface-sunken", isGrid);
    }
    document.getElementById(`${prefix}ViewListBtn`)?.addEventListener("click", () => setView("list"));
    document.getElementById(`${prefix}ViewGridBtn`)?.addEventListener("click", () => setView("grid"));
  };

  // ---- Line-item row remove + qty stepper (order/invoice/purchase "add" forms) -----------------
  // Shared by any page with a dynamic list of line-item rows (order items, PO lines, quote lines).
  // Markup convention: a container element, rows matching rowSelector, a remove button carrying
  // [data-row-remove] inside each row, and (optionally) qty +/- buttons carrying
  // [data-qty-step="1"] / [data-qty-step="-1"] next to a qty input matching qtyInputSelector.
  window.wireRowRemove = function (containerId, rowSelector, recalc, { minRows = 0 } = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-row-remove]");
      if (!btn) return;
      const row = btn.closest(rowSelector);
      if (!row) return;
      if (minRows && container.querySelectorAll(rowSelector).length <= minRows) return;
      row.remove();
      if (recalc) recalc();
    });
  };

  window.wireQtyStepper = function (containerId, qtyInputSelector, recalc, { min = 1 } = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-qty-step]");
      if (!btn) return;
      const input = btn.parentElement.querySelector(qtyInputSelector);
      if (!input) return;
      const next = Math.max(min, parseInt(input.value, 10) + Number(btn.dataset.qtyStep));
      input.value = next;
      if (recalc) recalc();
    });
  };

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".ui-modal.is-open").forEach(closeModal);
  });

  // ---- Popover / tooltip (click-to-toggle) ------------------------------------------------------
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-popover-trigger]");
    if (trigger) {
      const panel = document.getElementById(trigger.dataset.popoverTrigger);
      const isOpen = panel && panel.classList.contains("is-open");
      document.querySelectorAll(".ui-popover.is-open").forEach((p) => p.classList.remove("is-open"));
      if (panel && !isOpen) panel.classList.add("is-open");
      e.stopPropagation();
      return;
    }
    if (!e.target.closest(".ui-popover")) {
      document.querySelectorAll(".ui-popover.is-open").forEach((p) => p.classList.remove("is-open"));
    }
  });

})();


// ---- scroll-to-top.js ----
// ---- scroll-to-top.js (generic "#scrollToTopBtn" button, reused across dashboard pages) --------
(function () {
    var btn = document.getElementById("scrollToTopBtn");
    if (!btn) return;
    window.addEventListener("scroll", function () {
        btn.classList.toggle("hidden", window.scrollY < 400);
    });
    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();

// ---- rise-in-counter.js ----
// ---- rise-in-counter.js (generic ".animate-rise-in" stagger + ".counter-up" number animation) ---
(function () {
    // Stagger the rise-in animation for each card group in document order.
    var groups = new Map();
    document.querySelectorAll("main .animate-rise-in").forEach(function (el) {
        var parent = el.parentElement;
        var idx = groups.get(parent) || 0;
        el.style.animationDelay = Math.min(idx * 0.08, 0.42) + "s";
        groups.set(parent, idx + 1);
    });

    // Count numbers up from 0 to their target value as their card scrolls into view.
    function animateCount(el, duration) {
        var text = el.textContent;
        var match = text.match(/-?[\d,]+\.?\d*/);
        if (!match) return;
        var raw = match[0];
        var prefix = text.slice(0, match.index);
        var suffix = text.slice(match.index + raw.length);
        var hasComma = raw.indexOf(",") !== -1;
        var decimalMatch = raw.match(/\.(\d+)/);
        var decimals = decimalMatch ? decimalMatch[1].length : 0;
        var target = parseFloat(raw.replace(/,/g, ""));
        var start = null;

        function frame(now) {
            if (start === null) start = now;
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = target * eased;
            var str = decimals ? value.toFixed(decimals) : Math.round(value).toString();
            if (hasComma) {
                var parts = str.split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                str = parts.join(".");
            }
            el.textContent = prefix + str + suffix;
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    var counters = document.querySelectorAll(".counter-up");
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCount(entry.target, 1200);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(function (el) { io.observe(el); });
    } else {
        counters.forEach(function (el) { animateCount(el, 1200); });
    }
})();

// ---- scroll-reveal.js (generic ".scroll-reveal" fade+rise as elements enter the viewport) ------
(function () {
    var targets = document.querySelectorAll(".scroll-reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
        targets.forEach(function (el) { el.classList.add("is-revealed"); });
        return;
    }

    var groups = new Map();
    targets.forEach(function (el) {
        var parent = el.parentElement;
        var idx = groups.get(parent) || 0;
        el.style.transitionDelay = Math.min(idx * 0.08, 0.42) + "s";
        groups.set(parent, idx + 1);
    });

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-revealed");
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    targets.forEach(function (el) { io.observe(el); });
})();

// ---- outside-close-dropdown.js (safety net: force-close "[--auto-close:outside]" dropdowns, e.g. Manage Columns, on outside click) ----
(function () {
    document.addEventListener("click", function (e) {
        document.querySelectorAll('.hs-dropdown[class*="auto-close:outside"]').forEach(function (wrapper) {
            var toggle = wrapper.querySelector(".hs-dropdown-toggle");
            var menu = wrapper.querySelector(".hs-dropdown-menu");
            if (!toggle || !menu) return;
            if (menu.classList.contains("hidden")) return;
            if (wrapper.contains(e.target)) return;
            toggle.click();
        });
    }, true);
})();

// ---- toast.js ----
// ---- toast.js (generic "show/auto-hide a page-local toast element" helper) -----------------
(function () {
  window.showToast = function showToast(elementId, message, opts) {
    opts = opts || {};
    var el = document.getElementById(elementId);
    if (!el && opts.create) {
      el = document.createElement("div");
      el.id = elementId;
      el.className = opts.create;
      document.body.appendChild(el);
    }
    if (!el) return;
    var textEl = opts.textId ? document.getElementById(opts.textId) : el;
    if (textEl) textEl.textContent = message;
    el.classList.remove("hidden");
    window.clearTimeout(el._toastTimer);
    el._toastTimer = window.setTimeout(function () {
      if (opts.removeOnHide) el.remove();
      else el.classList.add("hidden");
    }, opts.duration || 2200);
  };
})();


// ---- select-card.js ----
// ---- select-card.js (generic "click one card in a group to make it the active/selected one" toggle, reused across bed/plan/format/option picker groups) ----
(function () {
  document.querySelectorAll(".select-card-group").forEach((group) => {
    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".select-card");
      if (!btn || !group.contains(btn)) return;
      group.querySelectorAll(".select-card").forEach((card) => {
        const isActive = card === btn;
        card.classList.toggle("is-active", isActive);
        card.classList.remove(...card.dataset.activeClass.split(" "), ...card.dataset.inactiveClass.split(" "));
        card.classList.add(...(isActive ? card.dataset.activeClass : card.dataset.inactiveClass).split(" "));
        card.querySelectorAll(".select-card-check").forEach((chk) => chk.classList.toggle("hidden", !isActive));
        if (card.dataset.iconActiveClass && card.dataset.iconInactiveClass) {
          card.querySelectorAll(".select-card-icon").forEach((icon) => {
            icon.classList.toggle(card.dataset.iconActiveClass, isActive);
            icon.classList.toggle(card.dataset.iconInactiveClass, !isActive);
          });
        }
      });
    });
  });
})();


// ---- account-add.js ----
// ---- account-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
        function addOwnerRow() {
            const wrap = document.getElementById("ownerRows");
            const row = document.createElement("div");
            row.className = "owner-row flex items-center gap-2.5 p-3 rounded-lg";
            row.style.background = "var(--surface-sunken)";
            row.innerHTML = `
                <input type="text" placeholder="Full name" class="flex-1 py-2 px-2.5 rounded-lg text-[12.5px] outline-none owner-name bg-raised-bordered">
                <input type="text" placeholder="Relationship" class="flex-1 py-2 px-2.5 rounded-lg text-[12.5px] outline-none owner-relationship bg-raised-bordered">
                <div class="relative w-24 shrink-0">
                    <input type="text" placeholder="0" class="w-full py-2 px-2.5 pe-6 rounded-lg text-[12.5px] outline-none text-end owner-percent bg-raised-bordered">
                    <span class="absolute top-1/2 -translate-y-1/2 end-2 text-[11px] text-tertiary">%</span>
                </div>
                <button type="button" class="header-icon-btn !size-8 text-danger-600 owner-row-remove"><i class="icon-circle-minus text-[14px]"></i></button>
            `;
            wrap.appendChild(row);
        }

        function renderReview() {
            const nameInput = document.querySelector('#wizardStep1 input[placeholder="e.g. Operating Account"]');
            const typeSelect = document.querySelector('#wizardStep1 select');
            const selects = document.querySelectorAll('#wizardStep1 select');
            const balanceInput = document.querySelector('#wizardStep1 input[placeholder="$0.00"]');

            const general = document.getElementById("reviewGeneral");
            general.innerHTML = `
                <div><p class="text-tertiary">Account Name</p><p class="font-semibold">${nameInput?.value.trim() || "&mdash;"}</p></div>
                <div><p class="text-tertiary">Account Type</p><p class="font-semibold">${selects[0]?.value || "&mdash;"}</p></div>
                <div><p class="text-tertiary">Currency</p><p class="font-semibold">${selects[1]?.value || "&mdash;"}</p></div>
                <div><p class="text-tertiary">Opening Balance</p><p class="font-semibold">${balanceInput?.value.trim() || "$0.00"}</p></div>
            `;

            const owners = document.getElementById("reviewOwners");
            const rows = Array.from(document.querySelectorAll(".owner-row")).map((row) => {
                const name = row.querySelector(".owner-name")?.value.trim() || "Unnamed owner";
                const rel = row.querySelector(".owner-relationship")?.value.trim() || "&mdash;";
                const pct = row.querySelector(".owner-percent")?.value.trim() || "0";
                return `<div class="flex items-center justify-between p-2.5 rounded-lg bg-sunken"><span>${name} <span class="text-tertiary">&middot; ${rel}</span></span><span class="font-semibold">${pct}%</span></div>`;
            });
            owners.innerHTML = rows.join("") || `<p class="text-tertiary">No owners added.</p>`;
        }

        window.initWizard({
            steps: 3,
            finalLabel: "Create Account",
            onStepChange: (step) => { if (step === 3) renderReview(); },
            onComplete: () => { window.location.href = "accounts"; },
        });

        document.getElementById("addOwnerRowBtn")?.addEventListener("click", addOwnerRow);

        document.getElementById("ownerRows")?.addEventListener("click", (e) => {
            const removeBtn = e.target.closest(".owner-row-remove");
            if (removeBtn) removeBtn.closest(".owner-row").remove();
        });
});
})();


// ---- account-details.js ----
// ---- account-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      function freezeAccount() {
        window.closeModal("freezeAccountModal");
        const badge = document.getElementById("accountStatusBadge");
        badge.className = "badge-soft badge-neutral !bg-white/15 !text-white";
        badge.innerHTML = '<i class="icon-snowflake text-[9px]"></i>Frozen';
        window.showSuccess("Account frozen", "Operating Account (****4821) has been frozen. Outgoing transactions are now blocked.");
      }

      document.getElementById("exportStatementBtn")?.addEventListener("click", () => {
        window.showSuccess("Statement exported", "The latest statement has been generated as a PDF.");
      });
      document.getElementById("freezeAccountBtn")?.addEventListener("click", freezeAccount);
});
})();


// ---- account-mapping-add.js ----
// ---- account-mapping-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
        function publishMapping() {
            const glCode = document.getElementById("mapGlCode").value.trim();
            const glName = document.getElementById("mapGlName").value.trim();
            const external = document.getElementById("mapExternal").value.trim();
            if (!glCode || !glName || !external) {
                window.openModal("validationErrorModal");
                return;
            }
            window.openModal("publishSuccessModal");
        }

        document.getElementById("publishMappingBtn")?.addEventListener("click", publishMapping);
});
})();


// ---- account-profile.js ----
// ---- account-profile.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      function saveProfile() {
        window.closeModal("editProfileModal");
        window.showSuccess("Profile updated", "Your profile changes have been saved successfully.");
      }

      document.getElementById("saveProfileBtn")?.addEventListener("click", saveProfile);
});
})();


// ---- accounts.js ----
// ---- accounts.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll(".acct-card-nav").forEach((card) => {
            card.addEventListener("click", (e) => {
                if (e.target.closest("a, button, .hs-dropdown-menu")) return;
                window.location.href = card.dataset.href;
            });
        });
});
})();


// ---- activity-add.js ----
// ---- activity-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {

        document.querySelectorAll('input[name="activityType"]').forEach((radio) => {
            radio.addEventListener("change", () => {
                document.querySelectorAll('input[name="activityType"]').forEach((r) => {
                    const label = r.closest("label");
                    if (r.checked) {
                        label.style.background = "var(--color-primary-100)";
                        label.style.color = "var(--color-primary-700)";
                        label.style.borderColor = "var(--color-primary-300)";
                    } else {
                        label.style.background = "var(--surface-sunken)";
                        label.style.color = "";
                        label.style.borderColor = "var(--border-subtle)";
                    }
                });
            });
        });

        document.getElementById("publishActivityBtn")?.addEventListener("click", window.publishActivity);
});
})();


// ---- add-categories.js ----
// ---- add-categories.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll(".icon-pick-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".icon-pick-btn").forEach((b) => { b.style.border = "1.5px solid transparent"; b.style.background = "var(--surface-sunken)"; b.classList.remove("is-active"); });
          btn.style.border = "1.5px solid var(--color-primary-500)";
          btn.style.background = "var(--color-primary-50)";
          btn.classList.add("is-active");
        });
      });
      document.querySelectorAll(".color-pick-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".color-pick-btn").forEach((b) => { b.style.outline = "none"; b.classList.remove("is-active"); });
          btn.style.outline = "2px solid " + getComputedStyle(btn).backgroundColor;
          btn.style.outlineOffset = "2px";
          btn.classList.add("is-active");
        });
      });

      document.getElementById("catName")?.addEventListener("input", (e) => {
        const slug = document.getElementById("catSlug");
        if (!slug.dataset.touched) slug.value = e.target.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      });
      document.getElementById("catSlug")?.addEventListener("input", (e) => { e.target.dataset.touched = "true"; });

      document.getElementById("saveCategoryDraftBtn")?.addEventListener("click", function () {
        window.openModal("draftSavedModal");
      });

      document.getElementById("publishCategoryBtn")?.addEventListener("click", function () {
        const name = document.getElementById("catName").value.trim();
        const icon = document.getElementById("publishModalIcon");
        const title = document.getElementById("publishModalTitle");
        const message = document.getElementById("publishModalMessage");
        const errorsBox = document.getElementById("publishModalErrors");
        const successActions = document.getElementById("publishModalSuccessActions");
        const closeBtn = document.getElementById("publishModalCloseBtn");

        if (!name) {
          icon.style.background = "var(--color-danger-100)";
          icon.style.color = "var(--color-danger-700)";
          icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
          title.textContent = "Can't create yet";
          message.textContent = "Please fix the following before creating this category:";
          errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 text-danger-600"><i class="icon-x text-[11px]"></i>Category Name is required.</p>`;
          errorsBox.classList.remove("hidden");
          successActions.classList.add("hidden");
          closeBtn.classList.remove("hidden");
        } else {
          icon.style.background = "var(--color-success-100)";
          icon.style.color = "var(--color-success-700)";
          icon.querySelector("i").className = "icon-check text-[18px]";
          title.textContent = "Category created";
          message.textContent = `"${name}" is now live in your category tree.`;
          errorsBox.classList.add("hidden");
          successActions.classList.remove("hidden");
          closeBtn.classList.add("hidden");
        }

        window.openModal("publishModal");
      });
});
})();


// ---- address-add.js ----
// ---- address-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      document.getElementById("saveAddressDraftBtn")?.addEventListener("click", function () {
        window.openModal("draftSavedModal");
      });

      document.getElementById("publishAddressBtn")?.addEventListener("click", function () {
        const name = document.getElementById("adName").value.trim();
        const line1 = document.getElementById("adLine1").value.trim();
        const city = document.getElementById("adCity").value.trim();
        if (!name || !line1 || !city) {
          window.openModal("validationErrorModal");
          return;
        }
        window.openModal("publishSuccessModal");
      });
});
})();


// ---- ai-chat.js ----
// ---- ai-chat.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
                    function aiChatOpenThread(el, ev) {
                        if (ev) ev.preventDefault();
                        document.querySelectorAll('.ai-chat-thread-link').forEach(function (a) {
                            a.style.background = '';
                            a.style.color = 'var(--text-secondary)';
                        });
                        el.style.background = 'var(--surface-sunken)';
                        el.style.color = '';
                        document.getElementById('aiChatThreadTitle').textContent = el.dataset.thread;
                        document.getElementById('aiChatWelcome').classList.add('hidden');
                        document.getElementById('aiChatThread').classList.remove('hidden');
                    }
                    function aiChatShowWelcome() {
                        document.querySelectorAll('.ai-chat-thread-link').forEach(function (a) {
                            a.style.background = '';
                            a.style.color = 'var(--text-secondary)';
                        });
                        document.getElementById('aiChatThread').classList.add('hidden');
                        document.getElementById('aiChatWelcome').classList.remove('hidden');
                        var input = document.getElementById('aiChatInput');
                        input.value = '';
                        input.focus();
                    }
                    function aiChatSend() {
                        var input = document.getElementById('aiChatInput');
                        if (!input.value.trim()) return;
                        if (document.getElementById('aiChatWelcome').classList.contains('hidden') === false) {
                            document.getElementById('aiChatThreadTitle').textContent = input.value.trim().slice(0, 40);
                            document.getElementById('aiChatWelcome').classList.add('hidden');
                            document.getElementById('aiChatThread').classList.remove('hidden');
                        }
                        var thread = document.getElementById('aiChatThread').querySelector('[data-simplebar]');
                        var bubble = document.createElement('div');
                        bubble.className = 'flex items-start justify-end gap-2.5';
                        bubble.innerHTML = '<div class="max-w-[75%] p-3 rounded-xl text-[12.5px] text-white u-background-color-primary-600"></div>';
                        bubble.querySelector('div').textContent = input.value.trim();
                        thread.appendChild(bubble);
                        thread.scrollTop = thread.scrollHeight;
                        input.value = '';
                    }

                    document.getElementById('aiChatNewChatBtn')?.addEventListener('click', aiChatShowWelcome);
                    document.getElementById('aiChatSendBtn')?.addEventListener('click', aiChatSend);
                    document.querySelectorAll('.ai-chat-thread-link').forEach(function (link) {
                        link.addEventListener('click', function (ev) { aiChatOpenThread(link, ev); });
                    });
                    document.querySelectorAll('.ai-suggestion-card').forEach(function (card) {
                        card.addEventListener('click', function () {
                            document.getElementById('aiChatInput').value = card.dataset.prompt;
                            document.getElementById('aiChatInput').focus();
                        });
                    });
});
})();


// ---- appointment-add.js ----
// ---- appointment-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      document.getElementById("saveApptDraftBtn")?.addEventListener("click", function () {
        window.openModal("draftSavedModal");
      });

      document.getElementById("publishApptBtn")?.addEventListener("click", function () {
        const patient = document.getElementById("apptPatient").value.trim();
        const icon = document.getElementById("publishModalIcon");
        const title = document.getElementById("publishModalTitle");
        const message = document.getElementById("publishModalMessage");
        const errorsBox = document.getElementById("publishModalErrors");
        const successActions = document.getElementById("publishModalSuccessActions");
        const closeBtn = document.getElementById("publishModalCloseBtn");

        if (!patient) {
          icon.style.background = "var(--color-danger-100)";
          icon.style.color = "var(--color-danger-700)";
          icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
          title.textContent = "Can't book yet";
          message.textContent = "Please fix the following before booking this appointment:";
          errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Patient Name is required.</p>`;
          errorsBox.classList.remove("hidden");
          successActions.classList.add("hidden");
          closeBtn.classList.remove("hidden");
        } else {
          icon.style.background = "var(--color-success-100)";
          icon.style.color = "var(--color-success-700)";
          icon.querySelector("i").className = "icon-check text-[18px]";
          title.textContent = "Appointment booked";
          message.textContent = `An appointment has been booked for "${patient}".`;
          errorsBox.classList.add("hidden");
          successActions.classList.remove("hidden");
          closeBtn.classList.add("hidden");
        }

        window.openModal("publishModal");
      });
});
})();


// ---- assessment-questions.js ----
// ---- assessment-questions.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
        function addQuestionToLibrary() {
            const text = document.getElementById("aqText").value.trim();
            const topic = document.getElementById("aqTopic").value.trim();
            const type = document.getElementById("aqType").value;
            const errorEl = document.getElementById("aqError");
            if (!text || !topic) {
                errorEl.classList.remove("hidden");
                return;
            }
            errorEl.classList.add("hidden");

            const card = document.createElement("div");
            card.className = "surface-card p-4";
            card.innerHTML =
                '<div class="flex items-center justify-between"><span class="badge-soft badge-primary">' + topic + '</span><span class="badge-soft badge-neutral">' + type + '</span></div>' +
                '<p class="text-[12.5px] font-medium mt-2">' + text + '</p>';
            document.getElementById("questionList").prepend(card);

            document.getElementById("aqText").value = "";
            document.getElementById("aqTopic").value = "";
            window.closeModal(document.getElementById("addQuestionModal"));
        }

        document.getElementById("addQuestionToLibraryBtn")?.addEventListener("click", addQuestionToLibrary);
});
})();


// ---- assignment-add.js ----
// ---- assignment-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    function publishAssignment() {
        const title = document.getElementById("asgTitle").value.trim();
        const due = document.getElementById("asgDue").value.trim();
        if (!title || !due) {
            window.openModal("validationErrorModal");
            return;
        }
        window.openModal("publishSuccessModal");
    }

    document.getElementById("publishAssignmentBtn")?.addEventListener("click", publishAssignment);
});
})();


// ---- attendance-details.js ----
// ---- attendance-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      function submitRegularize() {
        window.closeModal("regularizeModal");
        window.showSuccess("Regularization submitted", "Your request for Jul 17, 2026 has been sent to Amelia Hart for approval.");
      }

      function submitLeave() {
        window.closeModal("leaveModal");
        window.showSuccess("Leave request submitted", "Your leave request has been sent for approval.");
      }

      function exportSheet() {
        window.showSuccess("Export ready", "Jordan Blake's July 2026 timesheet has been exported.");
      }

      function flagAnomaly() {
        window.closeModal("flagModal");
        const badge = document.getElementById("attendanceStatusBadge");
        badge.className = "badge-soft badge-danger !bg-white/15 !text-white";
        badge.innerHTML = '<i class="icon-flag text-[9px]"></i>Flagged';
        window.showSuccess("Record flagged", "HR has been notified to review this attendance record.");
      }

      document.getElementById("submitRegularizeBtn")?.addEventListener("click", submitRegularize);
      document.getElementById("submitLeaveBtn")?.addEventListener("click", submitLeave);
      document.getElementById("exportSheetBtn")?.addEventListener("click", exportSheet);
      document.getElementById("flagAnomalyBtn")?.addEventListener("click", flagAnomaly);
});
})();


// ---- audience-details.js ----
// ---- audience-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      function syncSegment() {
        window.closeModal("syncModal");
        window.showSuccess("Sync started", "Returning Mobile Visitors is syncing to the selected destination.");
      }

      function exportSegment() {
        window.closeModal("exportModal");
        window.showSuccess("Export ready", "18,420 members have been exported. The download will start shortly.");
      }

      function archiveSegment() {
        window.closeModal("archiveModal");
        const badge = document.getElementById("segmentStatusBadge");
        badge.className = "badge-soft badge-neutral !bg-white/15 !text-white";
        badge.innerHTML = '<i class="icon-archive text-[9px]"></i>Archived';
        window.showSuccess("Segment archived", "Returning Mobile Visitors has been archived and removed from active targeting.");
      }

      document.getElementById("syncSegmentBtn")?.addEventListener("click", syncSegment);
      document.getElementById("exportSegmentBtn")?.addEventListener("click", exportSegment);
      document.getElementById("archiveSegmentBtn")?.addEventListener("click", archiveSegment);
});
})();


// ---- audit-details.js ----
// ---- audit-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      function assignInvestigator() {
        window.closeModal("assignModal");
        window.showSuccess("Investigator assigned", "The selected investigator has been notified and added to case AUD-88214.");
      }

      function escalateCase() {
        window.closeModal("escalateModal");
        const badge = document.getElementById("auditStatusBadge");
        badge.className = "badge-soft badge-danger !bg-white/15 !text-white";
        badge.innerHTML = '<i class="icon-flag text-[9px]"></i>Escalated';
        window.showSuccess("Case escalated", "AUD-88214 has been escalated to the Security Incident Response Team.");
      }

      function resolveCase() {
        window.closeModal("resolveModal");
        const badge = document.getElementById("auditStatusBadge");
        badge.className = "badge-soft badge-success !bg-white/15 !text-white";
        badge.innerHTML = '<i class="icon-check text-[9px]"></i>Resolved';
        window.showSuccess("Case resolved", "AUD-88214 has been marked as resolved and the remediation summary was recorded.");
      }

      function flagFalsePositive() {
        window.closeModal("falsePositiveModal");
        const badge = document.getElementById("auditStatusBadge");
        badge.className = "badge-soft badge-neutral !bg-white/15 !text-white";
        badge.innerHTML = '<i class="icon-x text-[9px]"></i>Closed &middot; False Positive';
        window.showSuccess("Case closed", "AUD-88214 has been flagged as a false positive and closed.");
      }

      document.getElementById("assignInvestigatorBtn")?.addEventListener("click", assignInvestigator);
      document.getElementById("escalateCaseBtn")?.addEventListener("click", escalateCase);
      document.getElementById("resolveCaseBtn")?.addEventListener("click", resolveCase);
      document.getElementById("flagFalsePositiveBtn")?.addEventListener("click", flagFalsePositive);
});
})();


// ---- audit-log.js ----
// ---- audit-log.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
        document.getElementById("auditFilterTabs")?.addEventListener("click", (e) => {
            const tab = e.target.closest("[data-filter]");
            if (!tab) return;

            document.querySelectorAll("#auditFilterTabs button").forEach((b) => {
                b.classList.remove("btn-primary", "is-active");
                b.classList.add("btn-outline");
            });
            tab.classList.remove("btn-outline");
            tab.classList.add("btn-primary", "is-active");

            const filter = tab.dataset.filter;
            const entries = document.querySelectorAll("#auditEntries [data-category]");
            let visibleCount = 0;
            entries.forEach((entry) => {
                const show = filter === "all" || entry.dataset.category === filter;
                entry.classList.toggle("hidden", !show);
                if (show) visibleCount++;
            });
            document.getElementById("auditNoResults")?.classList.toggle("hidden", visibleCount > 0);
        });
});
})();


// ---- backlink-details.js ----
// ---- backlink-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      function recheckLink() {
        window.showSuccess("Re-check queued", "We'll verify this link's status within the next few minutes.");
      }

      document.getElementById("recheckLinkBtn")?.addEventListener("click", recheckLink);
      document.getElementById("confirmTagBtn")?.addEventListener("click", () => {
        window.showSuccess("Tag added", "The tag has been applied to this backlink.");
        window.closeModal("tagModal");
      });
      document.getElementById("confirmDisavowBtn")?.addEventListener("click", () => {
        window.showSuccess("Link disavowed", "This backlink has been added to your disavow file.");
        window.closeModal("disavowModal");
      });
});
})();


// ---- backlinks-list.js ----
// ---- backlinks-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
      function rowDomain(el) {
        const row = el.closest("tr");
        const cell = row.querySelector("td:nth-child(2)");
        return cell ? cell.textContent.trim() : "this domain";
      }

      let pendingRow = null;

      function reverifyLink(el) {
        const domain = rowDomain(el);
        document.getElementById("backlinkSuccessTitle").textContent = "Link re-verified";
        document.getElementById("backlinkSuccessMsg").textContent = `${domain} was checked and is still live and linking to your site.`;
        window.openModal("backlinkSuccessModal");
      }

      function openDisavowModal(el) {
        pendingRow = el.closest("tr");
        document.getElementById("disavowDomainMsg").textContent = `${rowDomain(el)} will be flagged to search engines as a link you don't vouch for.`;
        window.openModal("disavowModal");
      }

      function confirmDisavow() {
        window.closeModal("disavowModal");
        if (pendingRow) pendingRow.style.opacity = "0.5";
        document.getElementById("backlinkSuccessTitle").textContent = "Backlink disavowed";
        document.getElementById("backlinkSuccessMsg").textContent = "This link has been added to your disavow file.";
        window.openModal("backlinkSuccessModal");
      }

      function openDeleteModal(el) {
        pendingRow = el.closest("tr");
        document.getElementById("deleteDomainMsg").textContent = `Remove ${rowDomain(el)} from your tracked backlinks? This cannot be undone.`;
        window.openModal("deleteBacklinkModal");
      }

      function confirmDelete() {
        window.closeModal("deleteBacklinkModal");
        if (pendingRow) pendingRow.remove();
        document.getElementById("backlinkSuccessTitle").textContent = "Backlink removed";
        document.getElementById("backlinkSuccessMsg").textContent = "This backlink is no longer being tracked.";
        window.openModal("backlinkSuccessModal");
      }

      document.addEventListener("click", (e) => {
        const reverify = e.target.closest("[data-reverify-link]");
        if (reverify) { reverifyLink(reverify); return; }
        const disavow = e.target.closest("[data-open-disavow-modal]");
        if (disavow) { openDisavowModal(disavow); return; }
        const del = e.target.closest("[data-open-delete-modal]");
        if (del) { openDeleteModal(del); return; }
        if (e.target.closest("[data-confirm-disavow]")) { confirmDisavow(); return; }
        if (e.target.closest("[data-confirm-delete]")) { confirmDelete(); return; }
      });
});
})();


// ---- bank-workspace.js ----
// ---- bank-workspace.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function openFreezeModal(name, number) {
    document.getElementById("freezeAccountName").textContent = name;
    document.getElementById("freezeAccountNumber").innerHTML = number;
    document.getElementById("freezeSuccessName").textContent = name;
    window.openModal("freezeModal");
  }

  document.querySelectorAll("[data-open-freeze-modal]").forEach((el) => {
    el.addEventListener("click", () => openFreezeModal(el.dataset.openFreezeModal, el.dataset.freezeNumber));
  });

  document.getElementById("confirmFreezeBtn")?.addEventListener("click", () => {
    window.closeModal("freezeModal");
    window.openModal("freezeSuccessModal");
  });

  document.getElementById("toggleOpBalanceBtn")?.addEventListener("click", function () {
    const b = document.getElementById("opAccountBalance");
    const i = this.querySelector("i");
    const hidden = b.dataset.hidden === "1";
    b.textContent = hidden ? "$842,600.00" : "•••••••••";
    b.dataset.hidden = hidden ? "0" : "1";
    i.className = hidden ? "icon-eye text-[11px]" : "icon-eye-off text-[11px]";
  });
});
})();


// ---- banner-slide-add.js ----
// ---- banner-slide-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("publishSlideBtn")?.addEventListener("click", function () {
    const heading = document.getElementById("slideHeading").value.trim();
    const link = document.getElementById("slideLink").value.trim();
    if (!heading || !link) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- beneficiary-add.js ----
// ---- beneficiary-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("publishBeneficiaryBtn")?.addEventListener("click", function () {
    const name = document.getElementById("benName").value.trim();
    const account = document.getElementById("benAccount").value.trim();
    if (!name || !account) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- bi-overview.js ----
// ---- bi-overview.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('kpiRow')?.addEventListener('click', function (e) {
    const card = e.target.closest('.kpi-card');
    if (!card) return;
    this.querySelectorAll('.kpi-card').forEach(c => c.classList.remove('is-active'));
    card.classList.add('is-active');
  });
});
})();


// ---- booking-details.js ----
// ---- booking-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("cancelBookingBtn")?.addEventListener("click", () => {
    window.closeModal("cancelBookingModal");
    const badge = document.getElementById("bookingStatusBadge");
    badge.className = "badge-soft badge-danger !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-x text-[9px]"></i>Cancelled';
    window.showSuccess("Booking cancelled", "Booking BK-7712 has been cancelled and a refund has been initiated.");
  });
});
})();


// ---- bookings-list.js ----
// ---- bookings-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.wireListGridToggle('bookings');
});
})();


// ---- brand-add.js ----
// ---- brand-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("brandName")?.addEventListener("input", (e) => {
    const slug = document.getElementById("brandSlug");
    if (!slug.dataset.touched) slug.value = e.target.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  });
  document.getElementById("brandSlug")?.addEventListener("input", (e) => { e.target.dataset.touched = "true"; });

  document.getElementById("saveBrandDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishBrandBtn")?.addEventListener("click", function () {
    const name = document.getElementById("brandName").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!name) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't create yet";
      message.textContent = "Please fix the following before creating this brand:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 text-danger-600"><i class="icon-x text-[11px]"></i>Brand Name is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Brand created";
      message.textContent = `"${name}" is now available to attach to products.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- budget-add.js ----
// ---- budget-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  // ---- Start / End date pickers ---------------------------------------------
  const startDateEl = document.getElementById("budgetStartDate");
  const endDateEl = document.getElementById("budgetEndDate");
  if (startDateEl && endDateEl && typeof flatpickr !== "undefined") {
    const endPicker = flatpickr(endDateEl, {
      dateFormat: "M j, Y",
    });
    flatpickr(startDateEl, {
      dateFormat: "M j, Y",
      onChange: (selectedDates) => {
        if (selectedDates[0]) endPicker.set("minDate", selectedDates[0]);
      },
    });
  }

  let budgetWizardStep = 1;
  const BUDGET_WIZARD_STEPS = 3;

  function renderBudgetWizardStep() {
    document.querySelectorAll("[data-wizard-step]").forEach((panel) => {
      panel.classList.toggle("hidden", Number(panel.dataset.wizardStep) !== budgetWizardStep);
    });
    document.querySelectorAll("[data-wizard-step-indicator]").forEach((indicator) => {
      const step = Number(indicator.dataset.wizardStepIndicator);
      const badge = indicator.querySelector("span:first-child");
      const label = indicator.querySelector("span:last-child");
      if (step < budgetWizardStep) {
        badge.className = "grid place-items-center size-7 rounded-full text-[12px] font-bold bg-primary-solid";
        badge.innerHTML = '<i class="icon-check text-[12px]"></i>';
        label.className = "text-[12.5px] font-semibold";
      } else if (step === budgetWizardStep) {
        badge.className = "grid place-items-center size-7 rounded-full text-[12px] font-bold bg-primary-solid";
        badge.textContent = step;
        label.className = "text-[12.5px] font-semibold";
      } else {
        badge.className = "grid place-items-center size-7 rounded-full text-[12px] font-bold bg-sunken-text-tertiary";
        badge.textContent = step;
        label.className = "text-[12.5px] text-tertiary";
      }
    });
    document.getElementById("budgetWizardBackBtn").classList.toggle("hidden", budgetWizardStep === 1);
    const nextBtn = document.getElementById("budgetWizardNextBtn");
    nextBtn.innerHTML = budgetWizardStep === BUDGET_WIZARD_STEPS
      ? '<i class="icon-check text-[13px]"></i>Submit Budget'
      : 'Continue<i class="icon-arrow-right text-[13px]"></i>';
  }

  function budgetWizardNext() {
    if (budgetWizardStep === BUDGET_WIZARD_STEPS) {
      window.showToast("budgetToast", "Budget submitted for approval", {
        create: "fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg text-[12.5px] font-semibold u-background-surface-elevated-1f2421_color-fff_box-shadow-0-8p",
        removeOnHide: true
      });
      return;
    }
    budgetWizardStep++;
    renderBudgetWizardStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function budgetWizardBack() {
    if (budgetWizardStep === 1) return;
    budgetWizardStep--;
    renderBudgetWizardStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.getElementById("budgetWizardBackBtn")?.addEventListener("click", budgetWizardBack);
  document.getElementById("budgetWizardNextBtn")?.addEventListener("click", budgetWizardNext);

  function addBudgetLineItem() {
    const list = document.getElementById("budgetLineItems");
    const row = document.createElement("div");
    row.className = "flex items-center gap-2.5 p-3 rounded-lg bg-sunken";
    row.innerHTML = '<input type="text" placeholder="Line item name" class="flex-1 py-2 px-2.5 rounded-lg text-[12.5px] outline-none bg-raised-bordered">'
      + '<input type="text" placeholder="$0.00" class="w-32 py-2 px-2.5 rounded-lg text-[12.5px] outline-none bg-raised-bordered">'
      + '<button type="button" class="header-icon-btn !size-8 text-danger-600" data-row-remove><i class="icon-circle-minus text-[14px]"></i></button>';
    list.appendChild(row);
  }

  document.getElementById("addBudgetLineItemBtn")?.addEventListener("click", addBudgetLineItem);
  window.wireRowRemove("budgetLineItems", ".bg-sunken", null, { minRows: 1 });
});
})();


// ---- budget-details.js ----
// ---- budget-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("freezeBudgetBtn")?.addEventListener("click", () => {
    window.closeModal("freezeModal");
    const badge = document.getElementById("budgetStatusBadge");
    badge.className = "badge-soft badge-danger !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-shield-off text-[9px]"></i>Frozen';
    window.showSuccess("Budget frozen", "Q3 Engineering Budget is now frozen. No new spend can be committed.");
  });

  document.getElementById("addNoteBtn")?.addEventListener("click", () => {
    const input = document.getElementById("noteInput");
    if (input && input.value.trim()) {
      window.showSuccess("Note added", "Your note has been added to this budget.");
      input.value = "";
    }
  });

  document.getElementById("addLineItemBtn")?.addEventListener("click", () => {
    window.closeModal("addLineItemModal");
    window.showSuccess("Line item added", "The new category has been added to this budget.");
  });

  document.getElementById("submitReviseBtn")?.addEventListener("click", () => {
    window.closeModal("reviseModal");
    window.showSuccess("Revision submitted", "Your revision request has been sent for finance approval.");
  });
});
})();


// ---- cabs-list.js ----
// ---- cabs-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.wireListGridToggle('cabs');
});
})();


// ---- calls-emails.js ----
// ---- calls-emails.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll("[data-select-thread]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.querySelectorAll("[data-select-thread]").forEach((b) => {
        b.classList.remove("u-background-surface-sunken");
      });
      btn.classList.add("u-background-surface-sunken");
    });
  });
});
})();


// ---- campaign-add.js ----
// ---- campaign-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("publishCampaignBtn")?.addEventListener("click", function () {
    const name = document.getElementById("campName").value.trim();
    const code = document.getElementById("campCode").value.trim();
    if (!name || !code) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- card-gallery.js ----
// ---- card-gallery.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.filterCards = function () {
    const status = document.getElementById("cardStatusFilter").value;
    const network = document.getElementById("cardNetworkFilter").value;
    const query = document.getElementById("cardSearchInput").value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll(".card-tile").forEach((tile) => {
      const matchesStatus = status === "all" || tile.getAttribute("data-status") === status;
      const matchesNetwork = network === "all" || tile.getAttribute("data-network") === network;
      const matchesSearch = !query || tile.getAttribute("data-search").indexOf(query) !== -1;
      const show = matchesStatus && matchesNetwork && matchesSearch;
      tile.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    document.getElementById("cardGridEmpty").classList.toggle("hidden", visible !== 0);
  };

  function openRequestCardModal() {
    document.getElementById("requestCardFormStep").classList.remove("hidden");
    document.getElementById("requestCardDoneStep").classList.add("hidden");
    document.getElementById("reqCardholderInput").value = "";
    document.getElementById("reqCardholderError").classList.add("hidden");
    window.openModal("requestCardModal");
  }

  function submitCardRequest() {
    const name = document.getElementById("reqCardholderInput").value.trim();
    document.getElementById("reqCardholderError").classList.toggle("hidden", !!name);
    if (!name) return;
    document.getElementById("requestCardFormStep").classList.add("hidden");
    document.getElementById("requestCardDoneStep").classList.remove("hidden");
  }

  const CARD_ACTIONS = {
    freeze: { title: "Freeze this card?", icon: "icon-snowflake", bg: "var(--color-info-100)", color: "var(--color-info-700)", confirmBg: "var(--color-info-600)", confirmLabel: "Freeze Card", message: (h, l) => `Card ending in ${l} (${h}) will be blocked from all new charges until unfrozen.` },
    unfreeze: { title: "Unfreeze this card?", icon: "icon-sun", bg: "var(--color-success-100)", color: "var(--color-success-700)", confirmBg: "var(--color-success-600)", confirmLabel: "Unfreeze Card", message: (h, l) => `Card ending in ${l} (${h}) will become active again for new charges.` },
    limit: { title: "Set spending limit", icon: "icon-sliders-horizontal", bg: "var(--color-primary-100)", color: "var(--color-primary-700)", confirmBg: "var(--color-primary-600)", confirmLabel: "Save Limit", message: (h, l) => `Update the monthly spending limit for ${h}'s card ending in ${l}.`, showLimit: true },
    cancel: { title: "Cancel this card?", icon: "icon-x-circle", bg: "var(--color-danger-100)", color: "var(--color-danger-700)", confirmBg: "var(--color-danger-600)", confirmLabel: "Cancel Card", message: (h, l) => `Card ending in ${l} (${h}) will be permanently cancelled. This cannot be undone.` },
  };

  function openCardAction(type, holder, last4) {
    const cfg = CARD_ACTIONS[type];
    if (!cfg) return;
    const iconWrap = document.getElementById("cardActionIcon");
    iconWrap.style.background = cfg.bg;
    iconWrap.style.color = cfg.color;
    iconWrap.querySelector("i").className = `${cfg.icon} text-[18px]`;
    document.getElementById("cardActionTitle").textContent = cfg.title;
    document.getElementById("cardActionMessage").textContent = cfg.message(holder, last4);
    document.getElementById("cardLimitField").classList.toggle("hidden", !cfg.showLimit);
    const confirmBtn = document.getElementById("cardActionConfirmBtn");
    confirmBtn.textContent = cfg.confirmLabel;
    confirmBtn.style.background = cfg.confirmBg;
    confirmBtn.style.color = "#fff";
    window.openModal("cardActionModal");
  }

  document.getElementById("openVirtualCardsBtn")?.addEventListener("click", () => window.openModal("virtualCardsModal"));
  document.getElementById("openRequestCardBtn")?.addEventListener("click", openRequestCardModal);
  document.getElementById("submitCardRequestBtn")?.addEventListener("click", submitCardRequest);
  document.getElementById("generateVirtualCardBtn")?.addEventListener("click", () => {
    window.closeModal("virtualCardsModal");
    openRequestCardModal();
  });
  document.querySelectorAll("[data-card-action]").forEach((el) => {
    el.addEventListener("click", () => openCardAction(el.dataset.cardAction, el.dataset.cardHolder, el.dataset.cardLast4));
  });

  document.getElementById("cardSearchInput")?.addEventListener("input", window.filterCards);
  document.getElementById("cardStatusFilter")?.addEventListener("change", window.filterCards);
  document.getElementById("cardNetworkFilter")?.addEventListener("change", window.filterCards);
});
})();


// ---- categories.js ----
// ---- categories.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function setCategoryView(mode) {
    const listView = document.getElementById("categoryListView");
    const gridView = document.getElementById("categoryGridView");
    const listBtn = document.getElementById("catListViewBtn");
    const gridBtn = document.getElementById("catGridViewBtn");
    const isGrid = mode === "grid";
    listView.classList.toggle("hidden", isGrid);
    gridView.classList.toggle("hidden", !isGrid);
    listBtn.style.background = isGrid ? "" : "var(--surface-sunken)";
    gridBtn.style.background = isGrid ? "var(--surface-sunken)" : "";
  }

  document.getElementById("catListViewBtn")?.addEventListener("click", () => setCategoryView("list"));
  document.getElementById("catGridViewBtn")?.addEventListener("click", () => setCategoryView("grid"));
});
})();


// ---- chart-of-accounts.js ----
// ---- chart-of-accounts.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  // ---- Group expand/collapse ----
  function toggleGroup(btn) {
    const body = btn.nextElementSibling;
    const chevron = btn.querySelector(".coa-chevron");
    const isHidden = body.classList.contains("hidden");
    if (isHidden) {
      body.classList.remove("hidden");
      chevron.className = "coa-chevron icon-chevron-down text-[12px]";
      chevron.style.color = "var(--text-tertiary)";
    } else {
      body.classList.add("hidden");
      chevron.className = "coa-chevron icon-chevron-right text-[12px]";
      chevron.style.color = "var(--text-tertiary)";
    }
  }
  function setAllGroups(expand) {
    document.querySelectorAll(".coa-group-toggle").forEach((btn) => {
      const body = btn.nextElementSibling;
      const chevron = btn.querySelector(".coa-chevron");
      body.classList.toggle("hidden", !expand);
      chevron.className = `coa-chevron icon-chevron-${expand ? "down" : "right"} text-[12px]`;
      chevron.style.color = "var(--text-tertiary)";
    });
  }

  document.querySelectorAll("[data-toggle-group]").forEach((btn) => {
    btn.addEventListener("click", () => toggleGroup(btn));
  });
  document.querySelectorAll("[data-set-all-groups]").forEach((btn) => {
    btn.addEventListener("click", () => setAllGroups(btn.dataset.setAllGroups === "true"));
  });

  // ---- Search + type filter ----
  function filterAccounts() {
    const q = document.getElementById("coaSearch").value.trim().toLowerCase();
    const type = document.getElementById("coaTypeFilter").value;
    let anyVisible = false;

    document.querySelectorAll(".coa-group").forEach((group) => {
      const groupType = group.dataset.type;
      const typeMatch = type === "all" || type === groupType;
      let groupHasMatch = false;

      group.querySelectorAll(".coa-row").forEach((row) => {
        const nameMatch = !q || row.dataset.name.includes(q);
        const show = typeMatch && nameMatch;
        row.classList.toggle("hidden", !show);
        if (show) { groupHasMatch = true; anyVisible = true; }
      });

      group.classList.toggle("hidden", !groupHasMatch);
      if (groupHasMatch && (q || type !== "all")) {
        const body = group.querySelector(".coa-group-body");
        const chevron = group.querySelector(".coa-chevron");
        body.classList.remove("hidden");
        if (chevron) { chevron.className = "coa-chevron icon-chevron-down text-[12px]"; chevron.style.color = "var(--text-tertiary)"; }
      }
    });

    document.getElementById("coaEmptyState").classList.toggle("hidden", anyVisible);
  }
  document.getElementById("coaSearch")?.addEventListener("input", filterAccounts);
  document.getElementById("coaTypeFilter")?.addEventListener("change", filterAccounts);

  // ---- Add / Edit account modal ----
  function openAddAccountModal() {
    document.getElementById("accountModalTitle").textContent = "Add Account";
    document.getElementById("accountModalSubmitBtn").textContent = "Add Account";
    document.getElementById("accNumberInput").value = "";
    document.getElementById("accNameInput").value = "";
    document.getElementById("accBalanceInput").value = "";
    document.getElementById("accNameError").classList.add("hidden");
    window.openModal("accountModal");
  }

  function openEditAccountModal(number, name, type, balance) {
    document.getElementById("accountModalTitle").textContent = "Edit Account";
    document.getElementById("accountModalSubmitBtn").textContent = "Save Changes";
    document.getElementById("accNumberInput").value = number;
    document.getElementById("accNameInput").value = name;
    document.getElementById("accTypeInput").value = type;
    document.getElementById("accBalanceInput").value = balance;
    document.getElementById("accNameError").classList.add("hidden");
    window.openModal("accountModal");
  }

  function submitAccount() {
    const name = document.getElementById("accNameInput").value.trim();
    const number = document.getElementById("accNumberInput").value.trim();
    document.getElementById("accNameError").classList.toggle("hidden", !!(name && number));
    if (!name || !number) return;
    window.closeModal("accountModal");
  }

  document.getElementById("openAddAccountModalBtn")?.addEventListener("click", openAddAccountModal);
  document.getElementById("accountModalSubmitBtn")?.addEventListener("click", submitAccount);
  document.querySelectorAll("[data-edit-account]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const d = btn.dataset;
      openEditAccountModal(d.accNumber, d.accName, d.accType, d.accBalance);
    });
  });

  // ---- Archive / Restore ----
  function openArchiveModal(number, name, isRestore) {
    const icon = document.getElementById("archiveModalIcon");
    const title = document.getElementById("archiveModalTitle");
    const message = document.getElementById("archiveModalMessage");
    const confirmBtn = document.getElementById("archiveModalConfirmBtn");

    if (isRestore) {
      icon.style.background = "var(--color-success-100)"; icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-rotate-ccw text-[18px]";
      title.textContent = "Restore account?";
      message.textContent = `${number} · ${name} will become active again and available for new transactions.`;
      confirmBtn.textContent = "Restore";
      confirmBtn.style.background = "var(--color-success-600)";
    } else {
      icon.style.background = "var(--color-danger-100)"; icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-archive text-[18px]";
      title.textContent = "Archive account?";
      message.textContent = `${number} · ${name} will be hidden from new transactions but its history is preserved.`;
      confirmBtn.textContent = "Archive";
      confirmBtn.style.background = "var(--color-danger-600)";
    }
    confirmBtn.style.color = "#fff";
    window.openModal("archiveModal");
  }

  document.querySelectorAll("[data-archive-account]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const d = btn.dataset;
      openArchiveModal(d.accNumber, d.accName, d.accRestore === "true");
    });
  });
});
})();


// ---- leave-requests-list.js ----
// ---- leave-requests-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const icon = document.getElementById("leaveActionModalIcon");
  const title = document.getElementById("leaveActionModalTitle");
  const message = document.getElementById("leaveActionModalMessage");
  const confirmBtn = document.getElementById("leaveActionModalConfirmBtn");
  if (!icon || !title || !message || !confirmBtn) return;

  document.querySelectorAll("[data-leave-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.leaveName;
      const isApprove = btn.dataset.leaveAction === "approve";

      if (isApprove) {
        icon.style.background = "var(--color-success-100)"; icon.style.color = "var(--color-success-700)";
        icon.querySelector("i").className = "icon-check text-[18px]";
        title.textContent = "Approve leave request?";
        message.textContent = `${name}'s leave request will be approved and marked accordingly.`;
        confirmBtn.textContent = "Approve";
        confirmBtn.style.background = "var(--color-success-600)";
      } else {
        icon.style.background = "var(--color-danger-100)"; icon.style.color = "var(--color-danger-700)";
        icon.querySelector("i").className = "icon-x text-[18px]";
        title.textContent = "Reject leave request?";
        message.textContent = `${name}'s leave request will be rejected.`;
        confirmBtn.textContent = "Reject";
        confirmBtn.style.background = "var(--color-danger-600)";
      }
      confirmBtn.style.color = "#fff";

      confirmBtn.onclick = () => {
        window.closeModal("leaveActionModal");
        const row = btn.closest("tr");
        const statusCell = row?.querySelector("td:nth-last-child(2) span");
        if (statusCell) {
          statusCell.className = isApprove ? "badge-soft badge-success" : "badge-soft badge-danger";
          statusCell.textContent = isApprove ? "Approved" : "Rejected";
        }
        window.showSuccess(
          isApprove ? "Leave approved" : "Leave rejected",
          `${name}'s leave request has been ${isApprove ? "approved" : "rejected"}.`
        );
      };

      window.openModal("leaveActionModal");
    });
  });
});
})();


// ---- chatbot-conversation-details.js ----
// ---- chatbot-conversation-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("exportTranscriptBtn")?.addEventListener("click", () => {
    window.showSuccess("Transcript exported", "A PDF copy of this transcript has been saved to your downloads.");
  });

  document.getElementById("escalateConversationBtn")?.addEventListener("click", () => {
    window.closeModal("handoffModal");
    const badge = document.getElementById("convStatusBadge");
    badge.className = "badge-soft badge-warning !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-user-round text-[9px]"></i>Escalated';
    window.showSuccess("Conversation escalated", "Nina Torres has been handed off to a human agent.");
  });

  document.getElementById("addToTrainingBtn")?.addEventListener("click", () => {
    window.closeModal("trainModal");
    window.showSuccess("Added to training set", "This conversation will be reviewed for use in future bot training.");
  });

  document.getElementById("flagConversationBtn")?.addEventListener("click", () => {
    window.closeModal("flagModal");
    window.showSuccess("Conversation flagged", "Conversation #CNV-58214 has been sent to the quality review queue.");
  });
});
})();


// ---- cleaning-log-add.js ----
// ---- cleaning-log-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("publishCleaningBtn")?.addEventListener("click", function () {
    const bed = document.getElementById("cleanBed").value.trim();
    const ward = document.getElementById("cleanWard").value.trim();
    if (!bed || !ward) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- collection-add.js ----
// ---- collection-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("collectionName")?.addEventListener("input", (e) => {
    const slug = document.getElementById("collectionSlug");
    if (!slug.dataset.touched) slug.value = e.target.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  });
  document.getElementById("collectionSlug")?.addEventListener("input", (e) => { e.target.dataset.touched = "true"; });

  document.getElementById("saveCollectionDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishCollectionBtn")?.addEventListener("click", function () {
    const name = document.getElementById("collectionName").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!name) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't create yet";
      message.textContent = "Please fix the following before creating this collection:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Collection Name is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Collection created";
      message.textContent = `"${name}" is now live in your collection list.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- combo-meal-add.js ----
// ---- combo-meal-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function recalcComboTotals() {
    if (!document.getElementById("cmSubtotal")) return;
    let subtotal = 0;
    document.querySelectorAll(".combo-item").forEach((row) => { subtotal += parseFloat(row.dataset.price); });
    document.getElementById("cmSubtotal").textContent = `$${subtotal.toFixed(2)}`;
    const priceInput = document.getElementById("cmPrice");
    const price = parseFloat(priceInput.value);
    const savingsEl = document.getElementById("cmSavings");
    if (!isNaN(price) && price > 0 && subtotal > 0) {
      const savings = subtotal - price;
      savingsEl.textContent = `$${savings.toFixed(2)} (${((savings / subtotal) * 100).toFixed(1)}%)`;
    } else {
      savingsEl.textContent = "—";
    }
  }

  window.wireRowRemove("cmItemsList", ".combo-item", recalcComboTotals);

  function addComboItem() {
    const list = document.getElementById("cmItemsList");
    const row = document.createElement("div");
    row.className = "combo-item flex items-center gap-3 p-2.5 rounded-lg";
    row.style.background = "var(--surface-sunken)";
    row.dataset.price = "6.00";
    row.innerHTML = `
      <img src="build/img/card/card-04.jpg" class="size-11 rounded-lg object-cover shrink-0" alt="">
      <span class="min-w-0 flex-1">
        <span class="block text-[12.5px] font-semibold truncate">Garlic Bread</span>
        <span class="block text-[11px] u-color-text-tertiary">$6.00</span>
      </span>
      <button type="button" class="header-icon-btn !size-7 shrink-0" data-row-remove><i class="icon-trash-2 text-[12px] u-color-color-danger-600"></i></button>
    `;
    list.appendChild(row);
    recalcComboTotals();
  }

  document.getElementById("cmPrice")?.addEventListener("input", recalcComboTotals);

  function publishCombo() {
    const name = document.getElementById("cmName").value.trim();
    const price = document.getElementById("cmPrice").value.trim();
    const itemCount = document.querySelectorAll(".combo-item").length;
    if (!name || !price || itemCount === 0) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  }

  document.getElementById("addComboItemBtn")?.addEventListener("click", addComboItem);
  document.getElementById("saveComboDraftBtn")?.addEventListener("click", () => window.openModal("draftSavedModal"));
  document.getElementById("publishComboBtn")?.addEventListener("click", publishCombo);

  recalcComboTotals();
});
})();


// ---- company-add.js ----
// ---- company-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveCompanyDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishCompanyBtn")?.addEventListener("click", function () {
    const name = document.getElementById("coName").value.trim();
    const email = document.getElementById("coEmail").value.trim();
    if (!name || !email) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- cruises-list.js ----
// ---- cruises-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    window.wireListGridToggle('cruises');
});
})();


// ---- currency-add.js ----
// ---- currency-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveCurrencyDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishCurrencyBtn")?.addEventListener("click", function () {
    const code = document.getElementById("currencyCode").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!code) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't add yet";
      message.textContent = "Please fix the following before adding this currency:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Currency selection is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Currency added";
      message.textContent = `"${code}" is now available at checkout.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- customer-add.js ----
// ---- customer-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveCustomerDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishCustomerBtn")?.addEventListener("click", function () {
    const name = document.getElementById("cuName").value.trim();
    const email = document.getElementById("cuEmail").value.trim();
    if (!name || !email) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- customer-purchase-report.js ----
// ---- customer-purchase-report.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    var cohorts = [
        { label: "Feb 2026", size: 214, values: [100, 68, 54, 47, 41, 38, 35] },
        { label: "Mar 2026", size: 248, values: [100, 71, 59, 52, 46, 42, null] },
        { label: "Apr 2026", size: 196, values: [100, 64, 50, 44, 39, null, null] },
        { label: "May 2026", size: 231, values: [100, 62, 48, 41, null, null, null] },
        { label: "Jun 2026", size: 172, values: [100, 58, 43, null, null, null, null] },
        { label: "Jul 2026", size: 158, values: [100, 55, null, null, null, null, null] },
    ];
    var body = document.getElementById("cohortTableBody");
    if (body) {
        var rows = cohorts.map(function (row) {
            var cells = row.values.map(function (v) {
                if (v === null) return '<td class="px-2 py-2.5 rounded-lg u-background-surface-sunken_color-text-tertiary">&mdash;</td>';
                var alpha = Math.max(0.08, v / 100);
                var color = alpha > 0.55 ? "#fff" : "var(--text-primary)";
                return '<td class="px-2 py-2.5 rounded-lg" style="background: color-mix(in srgb, var(--color-primary-600) ' + Math.round(alpha * 100) + '%, var(--surface-sunken)); color: ' + color + ';">' + v + '%</td>';
            }).join("");
            return '<tr><td class="text-start px-2 py-2.5 font-semibold">' + row.label + '</td><td class="px-2 py-2.5 u-color-text-tertiary_font-weight-500">' + row.size + '</td>' + cells + '</tr>';
        }).join("");
        body.innerHTML = rows;
    }
});
})();


// ---- data-sources.js ----
// ---- data-sources.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("sourceTypePicker")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".source-type-btn");
        if (!btn) return;
        document.querySelectorAll("#sourceTypePicker .source-type-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
    });

    // openModal/closeModal are provided globally by script.js (adds/removes "is-open",
    // which .ui-modal's opacity/transform transition requires) — don't redefine them here.
    function openDeleteSourceModal(name) {
        document.getElementById("deleteSourceName").textContent = name;
        openModal("deleteSourceModal");
    }
    window.openDeleteSourceModal = openDeleteSourceModal;

    const SRC_META = {
        "Stripe API": { type: "API", owner: "Finance", records: "812K", health: '<span class="badge-soft badge-success"><i class="icon-check text-[9px]"></i>Healthy</span>' },
        "Shopify Webhook": { type: "Webhook", owner: "Ecommerce", records: "2.6M", health: '<span class="badge-soft badge-success"><i class="icon-check text-[9px]"></i>Healthy</span>' },
        "MySQL – CRM": { type: "Database", owner: "Sales Ops", records: "&mdash;", health: '<span class="badge-soft badge-danger"><i class="icon-x text-[9px]"></i>Failed</span>' },
        "Meta Ads API": { type: "API", owner: "Marketing", records: "328K", health: '<span class="badge-soft badge-success"><i class="icon-check text-[9px]"></i>Healthy</span>' },
    };

    function viewSourceDetails(name) {
        const meta = SRC_META[name] || {};
        document.getElementById("sdName").textContent = name;
        document.getElementById("sdType").textContent = meta.type || "—";
        document.getElementById("sdOwner").textContent = meta.owner || "—";
        document.getElementById("sdRecords").innerHTML = meta.records || "—";
        const row = [...document.querySelectorAll("[data-source-row]")].find((tr) => tr.textContent.includes(name));
        document.getElementById("sdLastSync").textContent = row ? row.querySelector(".src-last-sync").textContent : "—";
        document.getElementById("sdHealth").innerHTML = row ? row.querySelector(".src-health").innerHTML : (meta.health || "—");
        openModal("sourceDetailsModal");
    }
    window.viewSourceDetails = viewSourceDetails;

    function editSourceConnection(name) {
        document.getElementById("editSourceName").value = name;
        openModal("editSourceModal");
    }
    window.editSourceConnection = editSourceConnection;

    function syncSourceNow(name, btn) {
        const row = btn.closest("[data-source-row]");
        if (row) {
            const cell = row.querySelector(".src-last-sync");
            if (cell) cell.textContent = "Just now";
            const health = row.querySelector(".src-health");
            if (health) health.innerHTML = '<span class="badge-soft badge-success"><i class="icon-check text-[9px]"></i>Healthy</span>';
        }
        window.showToast("sourceToast",`Sync triggered for ${name}`);
    }
    window.syncSourceNow = syncSourceNow;

    function disableSource(name, btn) {
        const row = btn.closest("[data-source-row]");
        if (row) {
            const health = row.querySelector(".src-health");
            const isDisabled = btn.textContent.trim() === "Enable";
            if (health) health.innerHTML = isDisabled
                ? '<span class="badge-soft badge-success"><i class="icon-check text-[9px]"></i>Healthy</span>'
                : '<span class="badge-soft badge-neutral"><i class="icon-pause text-[9px]"></i>Disabled</span>';
            btn.innerHTML = isDisabled
                ? '<i class="icon-pause text-[13px]"></i>Disable'
                : '<i class="icon-play text-[13px]"></i>Enable';
        }
        window.showToast("sourceToast",`${name} ${btn.textContent.trim() === "Enable" ? "disabled" : "enabled"}`);
    }
    window.disableSource = disableSource;

    document.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-source-action]");
        if (!trigger) return;
        const name = trigger.dataset.sourceName;
        switch (trigger.dataset.sourceAction) {
            case "view": viewSourceDetails(name); break;
            case "edit": editSourceConnection(name); break;
            case "sync": syncSourceNow(name, trigger); break;
            case "disable": disableSource(name, trigger); break;
            case "delete": openDeleteSourceModal(name); break;
        }
    });

    document.getElementById("saveEditSourceBtn")?.addEventListener("click", () => {
        window.closeModal("editSourceModal");
        window.showToast("sourceToast","Connection updated");
    });
});
})();


// ---- day-planner-activity-add.js ----
// ---- day-planner-activity-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("publishActivityBtn")?.addEventListener("click", window.publishActivity);

    document.querySelectorAll('input[name="activityType"]').forEach((radio) => {
        radio.addEventListener("change", () => {
            document.querySelectorAll('input[name="activityType"]').forEach((r) => {
                const label = r.closest("label");
                if (r.checked) {
                    label.style.background = "var(--color-primary-100)";
                    label.style.color = "var(--color-primary-700)";
                    label.style.borderColor = "var(--color-primary-300)";
                } else {
                    label.style.background = "var(--surface-sunken)";
                    label.style.color = "";
                    label.style.borderColor = "var(--border-subtle)";
                }
            });
        });
    });
});
})();


// ---- day-planner.js ----
// ---- day-planner.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    var group = document.getElementById("day-planner-tabs");
    if (!group) return;
    var buttons = group.querySelectorAll(".day-tab-btn[data-tab-trigger]");
    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            buttons.forEach(function (b) {
                b.style.background = "var(--surface-sunken)";
                b.style.color = "var(--text-tertiary)";
            });
            btn.style.background = "var(--color-primary-600)";
            btn.style.color = "#fff";
        });
    });
});
})();


// ---- deal-view.js ----
// ---- deal-view.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const stageBadgeMap = {
    "New": { icon: "icon-inbox", cls: "badge-neutral" },
    "Qualified": { icon: "icon-search-check", cls: "badge-info" },
    "Proposal": { icon: "icon-file-text", cls: "badge-accent" },
    "Negotiation": { icon: "icon-handshake", cls: "badge-warning" },
    "Won": { icon: "icon-check", cls: "badge-success" },
    "Lost": { icon: "icon-x", cls: "badge-danger" },
  };

  function setStageBadge(value) {
    const badge = document.getElementById("dealStageBadge");
    const cfg = stageBadgeMap[value] || stageBadgeMap["New"];
    badge.className = `badge-soft ${cfg.cls} !bg-white/15 !text-white`;
    badge.innerHTML = `<i class="${cfg.icon} text-[9px]"></i>${value}`;
  }

  document.getElementById("saveDealEditsBtn")?.addEventListener("click", () => {
    const name = document.getElementById("editDealNameInput").value.trim();
    document.getElementById("editDealNameError").classList.toggle("hidden", !!name);
    if (!name) return;
    setStageBadge(document.getElementById("editDealStageSelect").value);
    window.closeModal("editDealModal");
    window.showSuccess("Deal updated", "Your changes have been saved.");
  });

  document.getElementById("changeStageBtn")?.addEventListener("click", () => {
    const value = document.getElementById("stageSelectInput").value;
    window.closeModal("stageModal");
    setStageBadge(value);
    window.showSuccess("Stage updated", `This deal is now in the "${value}" stage.`);
  });

  document.getElementById("reassignOwnerBtn")?.addEventListener("click", () => {
    window.closeModal("reassignModal");
    window.showSuccess("Owner reassigned", "This deal has been reassigned to the selected owner.");
  });

  document.getElementById("deleteDealBtn")?.addEventListener("click", () => {
    window.closeModal("deleteDealModal");
    window.location.href = "deals";
  });
});
})();


// ---- discipline-incident-add.js ----
// ---- discipline-incident-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveIncidentDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishIncidentBtn")?.addEventListener("click", function () {
    const student = document.getElementById("incStudent").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!student) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't log yet";
      message.textContent = "Please fix the following before logging this incident:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Student is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Incident logged";
      message.textContent = `The incident involving "${student}" has been recorded.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- doctor-add.js ----
// ---- doctor-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveDoctorDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishDoctorBtn")?.addEventListener("click", function () {
    const name = document.getElementById("drName").value.trim();
    const specialization = document.getElementById("drSpecialization").value.trim();
    const email = document.getElementById("drEmail").value.trim();
    const errors = [];
    if (!name) errors.push("Full Name is required.");
    if (!specialization) errors.push("Specialization is required.");
    if (!email) errors.push("Email is required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't add yet";
      message.textContent = "Please fix the following before adding this doctor:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Doctor added";
      message.textContent = `"${name}" has been added to the directory.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- domain-add.js ----
// ---- domain-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveDomainDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishDomainBtn")?.addEventListener("click", function () {
    const name = document.getElementById("dmName").value.trim();
    const errors = [];
    const domainPattern = /^([a-z0-9-]+\.)+[a-z]{2,}$/i;
    if (!name) errors.push("Domain Name is required.");
    else if (!domainPattern.test(name)) errors.push("Enter a valid domain, e.g. www.mystore.com.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't add yet";
      message.textContent = "Please fix the following before continuing:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Domain added";
      message.textContent = `"${name}" has been added and is pending DNS verification.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- email.js ----
// ---- email.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function emailBulkAction(action) {
    const checked = document.querySelectorAll(".email-checkbox:checked");
    const rows = checked.length ? [...checked].map((c) => c.closest("tr")) : [...document.querySelectorAll(".email-checkbox")].map((c) => c.closest("tr"));
    const scope = checked.length ? `${rows.length} email${rows.length === 1 ? "" : "s"}` : "all emails";

    if (action === "delete") {
      rows.forEach((tr) => tr.remove());
      window.showToast("emailToast",`Deleted ${scope}`);
    } else if (action === "archive") {
      rows.forEach((tr) => tr.remove());
      window.showToast("emailToast",`Archived ${scope}`);
    } else if (action === "spam") {
      rows.forEach((tr) => tr.remove());
      window.showToast("emailToast",`Moved ${scope} to spam`);
    } else if (action === "read") {
      rows.forEach((tr) => tr.classList.remove("font-semibold"));
      window.showToast("emailToast",`Marked ${scope} as read`);
    } else if (action === "unread") {
      rows.forEach((tr) => tr.classList.add("font-semibold"));
      window.showToast("emailToast",`Marked ${scope} as unread`);
    }
    document.getElementById("emailBulkMenu").classList.add("hidden");
  }

  document.querySelectorAll("[data-email-bulk-action]").forEach((btn) => {
    btn.addEventListener("click", () => emailBulkAction(btn.dataset.emailBulkAction));
  });

  document.getElementById("emailDeleteConfirmBtn")?.addEventListener("click", () => {
    emailBulkAction("delete");
    window.closeModal?.("emailDeleteConfirmModal");
  });
});
})();


// ---- employee-add.js ----
// ---- employee-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const WIZARD_STEPS = 3;
  let currentWizardStep = 1;

  function goToStep(n) {
    if (n < 1 || n > WIZARD_STEPS) return;
    const prevN = currentWizardStep;
    currentWizardStep = n;
    for (let i = 1; i <= WIZARD_STEPS; i++) {
      const panel = document.getElementById('wizardStep' + i);
      if (panel) {
        if (i === n) {
          panel.classList.remove('hidden');
          panel.style.opacity = '0';
          panel.style.transform = i > prevN ? 'translateX(16px)' : 'translateX(-16px)';
          panel.style.transition = 'none';
          requestAnimationFrame(() => {
            panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateX(0)';
          });
        } else {
          panel.classList.add('hidden');
        }
      }
      const dot = document.querySelector('[data-step-dot="' + i + '"]');
      if (dot) {
        dot.style.background = i <= n ? 'var(--color-primary-600)' : 'var(--surface-sunken)';
        dot.style.color = i <= n ? '#fff' : 'var(--text-tertiary)';
        if (i === n) {
          dot.style.transform = 'scale(1.15)';
          setTimeout(() => { dot.style.transform = 'scale(1)'; }, 220);
        } else {
          dot.style.transform = 'scale(1)';
        }
      }
      const label = document.querySelector('[data-step-label="' + i + '"]');
      if (label) label.style.color = i === n ? 'var(--color-primary-600)' : 'var(--text-tertiary)';
      const line = document.querySelector('[data-step-line="' + i + '"]');
      if (line) line.style.background = i < n ? 'var(--color-primary-600)' : 'var(--surface-sunken)';
    }
    const backBtn = document.querySelector('[data-step-back]');
    if (backBtn) backBtn.style.visibility = n === 1 ? 'hidden' : 'visible';
    const nextBtn = document.querySelector('[data-step-next]');
    if (nextBtn) nextBtn.innerHTML = n === WIZARD_STEPS ? 'Submit<i class="icon-check text-[13px]"></i>' : 'Continue<i class="icon-arrow-right text-[13px]"></i>';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function wizardContinue() {
    if (currentWizardStep === WIZARD_STEPS) {
      window.openModal('empCreatedModal');
      return;
    }
    if (currentWizardStep === 2) renderEmpReview();
    goToStep(currentWizardStep + 1);
  }

  function renderEmpReview() {
    const el = document.getElementById('empReview');
    if (!el) return;
    const inputs = document.querySelectorAll('#wizardStep1 input, #wizardStep1 select, #wizardStep2 input, #wizardStep2 select');
    let rows = '';
    inputs.forEach((input) => {
      const label = input.closest('div').querySelector('label');
      if (!label) return;
      const value = input.value || input.placeholder || '—';
      rows += '<div class="flex items-center justify-between py-2 border-b u-border-color-border-subtle"><span class="u-color-text-tertiary">' + label.textContent + '</span><span class="font-semibold">' + value + '</span></div>';
    });
    el.innerHTML = rows;
  }

  function handleEmpFiles(files) {
    const list = document.getElementById('empFileList');
    if (!list) return;
    Array.from(files).forEach((file) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between p-2.5 rounded-lg text-[12px]';
      row.style.background = 'var(--surface-sunken)';
      row.innerHTML = '<span class="inline-flex items-center gap-2"><i class="icon-file-text text-[13px]"></i>' + file.name + '</span><i class="icon-check text-[13px] u-color-color-success-600"></i>';
      list.appendChild(row);
    });
  }

  document.getElementById('empDropzone')?.addEventListener('click', () => {
    document.getElementById('empFileInput').click();
  });
  document.getElementById('empFileInput')?.addEventListener('change', function () {
    handleEmpFiles(this.files);
  });
  document.querySelector('[data-step-back]')?.addEventListener('click', () => goToStep(currentWizardStep - 1));
  document.querySelector('[data-step-next]')?.addEventListener('click', wizardContinue);

  goToStep(1);
});
})();


// ---- employees-list.js ----
// ---- employees-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  let pendingDeleteEmp = null;

  window.confirmDeleteEmp = function (name) {
    pendingDeleteEmp = name;
    document.getElementById("empDeleteTitle").textContent = `Delete ${name}?`;
    window.openModal("empDeleteModal");
  };

  window.doDeleteEmp = function () {
    window.closeModal("empDeleteModal");
    document.getElementById("empSuccessTitle").textContent = "Employee deleted";
    document.getElementById("empSuccessMessage").textContent = `${pendingDeleteEmp} has been removed from the directory.`;
    window.openModal("empSuccessModal");
  };

  document.querySelectorAll("[data-emp-delete]").forEach((el) => {
    el.addEventListener("click", () => {
      confirmDeleteEmp(el.dataset.empName);
    });
  });
  document.getElementById("empDeleteConfirmBtn")?.addEventListener("click", doDeleteEmp);

  const empCards = document.querySelectorAll(".emp-card");
  if (empCards.length) {
    window.filterEmployees = function () {
      const dept = document.getElementById("empDeptFilter").value;
      const status = document.getElementById("empStatusFilter").value;
      const query = document.getElementById("empSearchInput").value.trim().toLowerCase();
      let visible = 0;
      empCards.forEach((card) => {
        const matchesDept = dept === "all" || card.dataset.department === dept;
        const matchesStatus = status === "all" || card.dataset.status === status;
        const matchesSearch = !query || card.dataset.search.indexOf(query) !== -1;
        const show = matchesDept && matchesStatus && matchesSearch;
        card.classList.toggle("hidden", !show);
        if (show) visible++;
      });
      document.getElementById("empGridEmpty")?.classList.toggle("hidden", visible !== 0);
    };

    document.getElementById("empSearchInput")?.addEventListener("input", window.filterEmployees);
    document.getElementById("empDeptFilter")?.addEventListener("change", window.filterEmployees);
    document.getElementById("empStatusFilter")?.addEventListener("change", window.filterEmployees);
  }
});
})();


// ---- expense-add.js ----
// ---- expense-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const wizard = document.getElementById('expenseWizard');
  if (!wizard) return;

  wizard.addEventListener('wizard:step', (e) => {
    if (e.detail.step !== 3) return;
    const categorySelect = document.getElementById('expCategory');
    document.getElementById('reviewCategory').textContent = categorySelect.value || '—';
    document.getElementById('reviewAmount').textContent = document.getElementById('expAmount').value || '—';
    document.getElementById('reviewProject').textContent = document.getElementById('expProject').value || '—';
    document.getElementById('reviewDate').textContent = document.getElementById('expDate').value || '—';
  });

  const submitBtn = document.querySelector('[data-wizard-submit]');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      window.location.href = 'expenses-list';
    });
  }
});
})();


// ---- faq.js ----
// ---- faq.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.filterFaq = function (term) {
    var q = term.trim().toLowerCase();
    var input = document.getElementById('faqSearch');
    if (input && input.value !== term) input.value = term;

    var items = document.querySelectorAll('.faq-item');
    var visibleCount = 0;

    items.forEach(function (item) {
      var kw = (item.querySelector('.faq-q').getAttribute('data-kw') + ' ' + item.textContent).toLowerCase();
      var match = q === '' || kw.indexOf(q) !== -1;
      item.style.display = match ? '' : 'none';
      if (match) {
        visibleCount++;
        if (q !== '') item.setAttribute('open', '');
      }
    });

    document.querySelectorAll('section[id^="cat-"]').forEach(function (section) {
      var anyVisible = Array.prototype.some.call(section.querySelectorAll('.faq-item'), function (i) {
        return i.style.display !== 'none';
      });
      section.style.display = anyVisible ? '' : 'none';
    });

    document.getElementById('faqNoResults').classList.toggle('hidden', visibleCount !== 0);
  };

  document.getElementById('faqSearch')?.addEventListener('input', function (e) {
    filterFaq(e.target.value);
  });

  document.querySelectorAll('[data-faq-filter]').forEach(function (el) {
    el.addEventListener('click', function () {
      filterFaq(el.dataset.faqFilter);
    });
  });
});
})();


// ---- feature-flag-add.js ----
// ---- feature-flag-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("ffName")?.addEventListener("input", (e) => {
    const keyField = document.getElementById("ffKey");
    if (!keyField.dataset.touched) {
      keyField.value = e.target.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    }
  });
  document.getElementById("ffKey")?.addEventListener("input", (e) => { e.target.dataset.touched = "1"; });

  document.getElementById("ffRollout")?.addEventListener("input", (e) => {
    document.getElementById("ffRolloutValue").textContent = e.target.value + "%";
  });

  document.getElementById("saveFlagDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishFlagBtn")?.addEventListener("click", function () {
    const name = document.getElementById("ffName").value.trim();
    const key = document.getElementById("ffKey").value.trim();
    const errors = [];
    if (!name) errors.push("Flag Name is required.");
    if (!key) errors.push("Flag Key is required.");
    else if (!/^[a-z0-9_]+$/.test(key)) errors.push("Flag Key can only contain lowercase letters, numbers, and underscores.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't create yet";
      message.textContent = "Please fix the following before creating this flag:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Feature flag created";
      message.textContent = `"${name}" has been created and is ready to configure.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- flight-details.js ----
// ---- flight-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.changeGate = function () {
    window.closeModal("gateModal");
    window.showSuccess("Gate updated", "Flight DL 1842 has been reassigned and passengers notified.");
  };

  window.resendManifest = function () {
    window.showSuccess("Manifest resent", "The passenger manifest was resent to the operations team.");
  };

  window.reportDelay = function () {
    window.closeModal("delayModal");
    const badge = document.getElementById("flightStatusBadge");
    badge.className = "badge-soft badge-warning !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-clock text-[9px]"></i>Delayed';
    window.showSuccess("Delay reported", "Flight status updated and passengers will be notified.");
  };

  document.getElementById("resendManifestBtn")?.addEventListener("click", resendManifest);
  document.getElementById("changeGateBtn")?.addEventListener("click", changeGate);
  document.getElementById("reportDelayBtn")?.addEventListener("click", reportDelay);
});
})();


// ---- flights-list.js ----
// ---- flights-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.wireListGridToggle('flights');
});
})();


// ---- floor-layout.js ----
// ---- floor-layout.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const BED_DATA = {
    '301-A': { room: 'Room 301 &middot; Double', status: 'Occupied', tone: 'danger', icon: 'icon-bed', patient: 'K. Ferro &middot; 54M', mrn: 'MRN-8821', note: 'Chest pain &middot; STEMI suspected', since: 'Admitted Jul 24, 9:12 AM' },
    '301-B': { room: 'Room 301 &middot; Double', status: 'Occupied', tone: 'danger', icon: 'icon-bed', patient: 'R. Danso &middot; 8M', mrn: 'MRN-8834', note: 'Severe allergic reaction', since: 'Admitted Jul 25, 6:40 PM' },
    '302-A': { room: 'Room 302 &middot; Double', status: 'Available', tone: 'success', icon: 'icon-bed', note: 'Cleaned and ready for next admission', since: 'Ready since 9:10 AM' },
    '302-B': { room: 'Room 302 &middot; Double', status: 'Cleaning', tone: 'warning', icon: 'icon-spray-can', note: 'Housekeeping in progress', since: 'ETA 15 min' },
    '303':   { room: 'Room 303 &middot; Single', status: 'Occupied', tone: 'danger', icon: 'icon-bed', patient: 'T. Wexler &middot; 32F', mrn: 'MRN-8790', note: 'Post-op recovery &middot; compound fracture', since: 'Admitted Jul 25, 11:05 AM' },
    '304-A': { room: 'Room 304 &middot; Double', status: 'Maintenance', tone: 'neutral', icon: 'icon-wrench', note: 'Bed motor fault &middot; ticket #482', since: 'Reported Jul 24, 3:30 PM' },
    '304-B': { room: 'Room 304 &middot; Double', status: 'Available', tone: 'success', icon: 'icon-bed', note: 'Cleaned and ready for next admission', since: 'Ready since 7:45 AM' },
    '305-A': { room: 'Room 305 &middot; Double', status: 'Occupied', tone: 'danger', icon: 'icon-bed', patient: 'N. Osei &middot; 67M', mrn: 'MRN-8865', note: 'Acute abdominal pain', since: 'Admitted Jul 25, 2:20 PM' },
    '305-B': { room: 'Room 305 &middot; Double', status: 'Cleaning', tone: 'warning', icon: 'icon-spray-can', note: 'Housekeeping in progress', since: 'ETA 8 min' },
    '306':   { room: 'Room 306 &middot; Single', status: 'Occupied', tone: 'danger', icon: 'icon-bed', patient: 'M. Quist &middot; 45F', mrn: 'MRN-8901', note: 'Isolation precautions', since: 'Admitted Jul 23, 8:15 AM' },
  };

  function showBedDetail(bedId) {
    const bed = BED_DATA[bedId];
    if (!bed) return;

    document.getElementById('bedDetailTitle').textContent = 'Bed ' + bedId;
    document.getElementById('bedDetailRoom').innerHTML = bed.room;

    const badge = document.getElementById('bedDetailStatusBadge');
    badge.textContent = bed.status;
    badge.className = 'badge-soft text-[10px] badge-' + bed.tone;

    const iconWrap = document.getElementById('bedDetailIconWrap');
    const icon = document.getElementById('bedDetailIcon');
    icon.className = bed.icon + ' text-[18px]';
    iconWrap.style.background = 'var(--color-' + bed.tone + '-50)';
    icon.style.color = 'var(--color-' + bed.tone + '-600)';

    let rows = '';
    if (bed.patient) {
      rows += '<div class="flex items-center justify-between text-[12px]"><span class="u-color-text-tertiary">Patient</span><span class="font-semibold">' + bed.patient + '</span></div>';
      rows += '<div class="flex items-center justify-between text-[12px]"><span class="u-color-text-tertiary">MRN</span><span class="font-semibold">' + bed.mrn + '</span></div>';
    }
    rows += '<div class="flex items-center justify-between text-[12px]"><span class="u-color-text-tertiary">Notes</span><span class="font-semibold text-right ms-3">' + bed.note + '</span></div>';
    rows += '<div class="flex items-center justify-between text-[12px]"><span class="u-color-text-tertiary">Since</span><span class="font-semibold">' + bed.since + '</span></div>';
    document.getElementById('bedDetailBody').innerHTML = rows;

    window.openModal('bedDetailModal');
  }

  function closeBedDetailModal() {
    window.closeModal('bedDetailModal');
  }

  document.getElementById('wardMapGrid')?.addEventListener('click', (e) => {
    const tile = e.target.closest('[data-bed-id]');
    if (!tile) return;
    showBedDetail(tile.dataset.bedId);
  });

  document.getElementById('bedDetailReassignBtn')?.addEventListener('click', closeBedDetailModal);
});
})();


// ---- forum-topic-add.js ----
// ---- forum-topic-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveTopicDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishTopicBtn")?.addEventListener("click", function () {
    const title = document.getElementById("topicTitle").value.trim();
    const body = document.getElementById("topicBody").value.trim();
    const errors = [];
    if (!title) errors.push("Title is required.");
    if (!body) errors.push("Message is required.");

    const icon = document.getElementById("publishModalIcon");
    const modalTitle = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      modalTitle.textContent = "Can't post yet";
      message.textContent = "Please fix the following before posting:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      modalTitle.textContent = "Topic posted";
      message.textContent = `"${title}" is now live in the forum.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- generated-reports.js ----
// ---- generated-reports.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.filterReportTab = function (cat, btn) {
    document.querySelectorAll(".report-tab").forEach(function (t) { t.classList.remove("active"); });
    btn.classList.add("active");
    var rows = document.querySelectorAll("#reportsTableBody tr");
    var visible = 0;
    rows.forEach(function (row) {
      var match = cat === "all" || row.getAttribute("data-report-cat") === cat;
      row.classList.toggle("hidden", !match);
      if (match) visible++;
    });
    document.getElementById("reportsEmptyState").classList.toggle("hidden", visible !== 0);
  };

  document.querySelectorAll(".report-tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterReportTab(btn.dataset.reportTab, btn);
    });
  });

  var currentReportName = null;

  var reportData = {
    "Weekly Business Summary — Jul 21": { type: "Weekly Digest", date: "Jul 21, 2026", insights: ["Checkout conversion rose 4.2% week-over-week after the new payment step shipped.", "Mobile traffic now accounts for 61% of sessions, up from 54% last week.", "Returning customers drove 38% of revenue, the highest share this quarter."] },
    "Checkout Funnel Deep Dive": { type: "On-Demand", date: "Jul 19, 2026", insights: ["18% of drop-off happens at the shipping-address step.", "Guest checkout users convert 12% higher than accounts requiring sign-in.", "Cart abandonment spikes on mobile Safari specifically."] },
    "Monthly Business Summary — June": { type: "Monthly Digest", date: "Jul 1, 2026", insights: ["Revenue grew 9.6% month-over-month, led by the Electronics category.", "Customer acquisition cost decreased 6% following the new referral program.", "Support ticket volume dropped 14% after the FAQ redesign."] },
    "Weekly Business Summary — Jul 14": { type: "Weekly Digest", date: "Jul 14, 2026", insights: ["New signups up 7% following the homepage banner refresh.", "Average order value held steady at $86.40.", "Email campaign open rate improved to 34%."] },
    "Cart Abandonment Root Cause": { type: "On-Demand", date: "Jul 12, 2026", insights: ["Unexpected shipping costs are the top cited abandonment reason (41%).", "Abandonment is 2.3x higher for first-time visitors vs. returning customers.", "Recovery emails sent within 1 hour recover 22% of abandoned carts."] },
    "Weekly Business Summary — Jul 7": { type: "Weekly Digest", date: "Jul 7, 2026", insights: ["Site-wide conversion rate held at 3.1%.", "Loyalty program enrollments up 11% this week.", "Return rate remained flat at 4.8%."] },
    "Q2 Revenue Performance": { type: "Quarterly Digest", date: "Jul 2, 2026", insights: ["Q2 revenue exceeded forecast by 6.4%.", "Subscription renewals contributed 44% of quarterly revenue.", "The Northeast region outperformed all other regions by 18%."] },
    "New Customer Segment Discovery": { type: "On-Demand", date: "Jun 28, 2026", insights: ["A new high-value segment of weekend bulk-buyers was identified.", "This segment has 2.1x the average order value of typical customers.", "Targeted campaigns to this segment are estimated to add $42K/quarter."] },
    "Weekly Business Summary — Jun 23": { type: "Weekly Digest", date: "Jun 23, 2026", insights: ["Traffic from organic search rose 5% week-over-week.", "Refund rate improved slightly to 2.9%.", "Top-selling category remained Home & Kitchen."] },
    "Monthly Business Summary — May": { type: "Monthly Digest", date: "Jun 1, 2026", insights: ["May revenue grew 4.1% over April.", "Customer satisfaction score rose to 4.6/5.", "Inventory turnover improved across 3 of 5 major categories."] }
  };

  window.viewReport = function (name) {
    var r = reportData[name];
    if (!r) return;
    currentReportName = name;
    document.getElementById("viewReportTitle").textContent = name;
    document.getElementById("viewReportMeta").textContent = r.type + " · " + r.date;
    document.getElementById("viewReportInsights").innerHTML = r.insights.map(function (i) {
      return '<div class="flex items-start gap-2 p-2.5 rounded-lg text-[12.5px] u-background-surface-sunken"><i class="icon-lightbulb text-[13px] mt-0.5 shrink-0 u-color-color-primary-500"></i>' + i + '</div>';
    }).join("");
    document.getElementById("viewReportDownloadBtn").onclick = function () { downloadReport(name); };
    window.openModal("viewReportModal");
  };

  window.downloadReport = function (name) {
    window.showToast("reportToast",name + " downloaded");
  };

  window.renameReport = function (name) {
    currentReportName = name;
    document.getElementById("renameReportInput").value = name;
    window.openModal("renameReportModal");
  };

  window.saveReportRename = function () {
    var newName = document.getElementById("renameReportInput").value.trim() || currentReportName;
    window.closeModal("renameReportModal");
    window.showToast("reportToast","Renamed to \"" + newName + "\"");
  };

  window.openDeleteReportModal = function (name) {
    currentReportName = name;
    document.getElementById("deleteReportName").textContent = name;
    window.openModal("deleteReportModal");
  };

  window.confirmDeleteReport = function () {
    window.closeModal("deleteReportModal");
    window.showToast("reportToast",currentReportName + " deleted");
  };

  document.getElementById("reportsTableBody")?.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-report-view]"))) { viewReport(t.dataset.reportView); return; }
    if ((t = e.target.closest("[data-report-download]"))) { downloadReport(t.dataset.reportDownload); return; }
    if ((t = e.target.closest("[data-report-rename]"))) { renameReport(t.dataset.reportRename); return; }
    if ((t = e.target.closest("[data-report-delete]"))) { openDeleteReportModal(t.dataset.reportDelete); return; }
  });

  document.getElementById("saveReportRenameBtn")?.addEventListener("click", saveReportRename);
  document.getElementById("confirmDeleteReportBtn")?.addEventListener("click", confirmDeleteReport);

});
})();


// ---- goal-add.js ----
// ---- goal-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveGoalDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishGoalBtn")?.addEventListener("click", function () {
    const name = document.getElementById("goalName").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!name) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't create yet";
      message.textContent = "Please fix the following before creating this goal:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Goal Name is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Goal created";
      message.textContent = `"${name}" has been added to your review goals.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- guest-add.js ----
// ---- guest-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function saveGuestDraft() {
    window.openModal("draftSavedModal");
  }

  function publishGuest() {
    const name = document.getElementById("guestName").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!name) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't add guest yet";
      message.textContent = "Please fix the following before adding this guest:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Full Name is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Guest added";
      message.textContent = `"${name}" has been added to the guest directory.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  }

  document.getElementById("guestDropzone")?.addEventListener("click", () => {
    document.getElementById("guestFileInput").click();
  });

  document.getElementById("saveGuestDraftBtn")?.addEventListener("click", saveGuestDraft);
  document.getElementById("publishGuestBtn")?.addEventListener("click", publishGuest);
});
})();


// ---- housekeeping-task-add.js ----
// ---- housekeeping-task-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.createTask = function () {
    const room = document.getElementById("taskRoom").value.trim();
    const icon = document.getElementById("taskCreateModalIcon");
    const titleEl = document.getElementById("taskCreateModalTitle");
    const message = document.getElementById("taskCreateModalMessage");
    const successActions = document.getElementById("taskCreateModalSuccessActions");
    const closeBtn = document.getElementById("taskCreateModalCloseBtn");

    if (!room) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      titleEl.textContent = "Can't create yet";
      message.textContent = "Room / Location is required.";
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      titleEl.textContent = "Task created";
      message.textContent = `"${room}" has been added to the task board.`;
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("taskCreateModal");
  };

  document.getElementById("createTaskBtn")?.addEventListener("click", window.createTask);
});
})();


// ---- insights-list.js ----
// ---- insights-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.INSIGHTS = [
    {
      icon: "icon-trending-down", bg: "var(--color-danger-50)", fg: "var(--color-danger-600)",
      badge: "High Impact", badgeClass: "badge-danger",
      title: "Mobile checkout abandonment spike", time: "Generated 2 hours ago",
      summary: "Checkout abandonment rose 14% this week, concentrated on mobile Safari. Likely linked to the new payment step added Jul 18.",
      metrics: [["14%", "Abandonment ↑"], ["68%", "Of drop-offs on iOS"], ["$18.2K", "Est. revenue at risk"]],
      recommendation: "Roll back or A/B test the new payment confirmation step for mobile Safari users to confirm it's the root cause.",
      factors: ["New payment step added Jul 18", "82% of affected sessions on iOS Safari", "Cart-to-payment time increased by 40s"]
    },
    {
      icon: "icon-trending-up", bg: "var(--color-success-50)", fg: "var(--color-success-600)",
      badge: "Opportunity", badgeClass: "badge-success",
      title: "Email campaign outperforming benchmark by 3.2x", time: "Generated 5 hours ago",
      summary: "The 'Summer Refresh' campaign is converting at 3.2x your account's average, driven by a strong subject line and segment targeting.",
      metrics: [["3.2x", "Vs. avg. CTR"], ["24.6%", "Open rate"], ["+$9.4K", "Attributed revenue"]],
      recommendation: "Clone this campaign's subject line and segment logic into your next two scheduled sends.",
      factors: ["Segment: purchased in last 90 days", "Subject line uses personalization tokens", "Sent Tuesday 10am local time"]
    },
    {
      icon: "icon-triangle-alert", bg: "var(--color-warning-50)", fg: "var(--color-warning-600)",
      badge: "Medium Impact", badgeClass: "badge-warning",
      title: "Inventory for SKU-4471 projected to run out in 6 days", time: "Generated yesterday",
      summary: "Based on the last 14 days of sell-through velocity, SKU-4471 (Wireless Charging Pad) will be out of stock by Aug 2.",
      metrics: [["6 days", "To stockout"], ["42/day", "Avg. sell-through"], ["252", "Units remaining"]],
      recommendation: "Raise a purchase order with your primary supplier now — lead time is typically 5 days.",
      factors: ["Sell-through up 18% after featured placement", "No reorder currently scheduled", "Supplier lead time: 5 days"]
    },
    {
      icon: "icon-users", bg: "var(--color-info-50)", fg: "var(--color-info-600)",
      badge: "Trend", badgeClass: "badge-info",
      title: "New customer segment forming around bundle purchases", time: "Generated 2 days ago",
      summary: "A cluster of ~1,200 customers is emerging who exclusively buy multi-item bundles rather than single products.",
      metrics: [["1,204", "Customers in segment"], ["+31%", "Vs. last month"], ["$86", "Avg. order value"]],
      recommendation: "Create a dedicated bundle-focused email flow and landing page to nurture this segment.",
      factors: ["Bundle AOV is 2.1x single-item AOV", "62% are repeat purchasers", "Concentrated in Home & Kitchen category"]
    },
    {
      icon: "icon-clock-alert", bg: "var(--color-danger-50)", fg: "var(--color-danger-600)",
      badge: "High Impact", badgeClass: "badge-danger",
      title: "Average support response time up 40% this month", time: "Generated 3 days ago",
      summary: "First-response time has climbed from 2h 10m to 3h 02m, correlating with a 22% rise in ticket volume.",
      metrics: [["+40%", "Response time"], ["+22%", "Ticket volume"], ["-6pts", "CSAT"]],
      recommendation: "Add temporary coverage during 2–6pm peak hours or enable auto-triage for common ticket types.",
      factors: ["Ticket volume peaks 2–6pm daily", "Two agents on leave this week", "No auto-triage rules active"]
    },
    {
      icon: "icon-target", bg: "var(--color-success-50)", fg: "var(--color-success-600)",
      badge: "Opportunity", badgeClass: "badge-success",
      title: "Cross-sell potential detected between Templates and Add-ons", time: "Generated 4 days ago",
      summary: "Customers who buy Templates are 4.6x more likely to purchase Add-ons within 14 days than the general customer base.",
      metrics: [["4.6x", "Higher affinity"], ["14 days", "Purchase window"], ["+$12K", "Potential upside"]],
      recommendation: "Add an Add-ons recommendation block to the Templates purchase-confirmation email.",
      factors: ["Pattern consistent across last 3 months", "Strongest among first-time buyers", "No current cross-sell prompt exists"]
    },
    {
      icon: "icon-globe", bg: "var(--color-info-50)", fg: "var(--color-info-600)",
      badge: "Trend", badgeClass: "badge-info",
      title: "APAC traffic share grew from 12% to 19% this quarter", time: "Generated 5 days ago",
      summary: "Session share from APAC regions has grown steadily, led by Singapore and India, without a matching increase in localized content.",
      metrics: [["+7pts", "Share growth"], ["Singapore", "Top region"], ["0", "Localized pages"]],
      recommendation: "Prioritize a localization pass for top landing pages and evaluate APAC-specific pricing.",
      factors: ["No ad spend increase in the region", "Mostly organic and referral sessions", "Mobile share 2.3x higher than other regions"]
    },
    {
      icon: "icon-credit-card", bg: "var(--color-warning-50)", fg: "var(--color-warning-600)",
      badge: "Medium Impact", badgeClass: "badge-warning",
      title: "Failed payment retries up 22% for annual plans", time: "Generated 6 days ago",
      summary: "Annual-plan renewals are seeing more card-decline retries than usual, mostly on expired cards.",
      metrics: [["+22%", "Retry rate"], ["58%", "Expired card"], ["$21.4K", "At-risk renewals"]],
      recommendation: "Trigger a card-update reminder email 7 days before annual renewal dates.",
      factors: ["Spike began after last billing cycle", "Concentrated among 2023 signups", "No pre-renewal reminder currently sent"]
    },
    {
      icon: "icon-user-minus", bg: "var(--color-danger-50)", fg: "var(--color-danger-600)",
      badge: "High Impact", badgeClass: "badge-danger",
      title: "Churn risk rising among free-trial users past day 10", time: "Generated 1 week ago",
      summary: "Trial users who haven't completed onboarding by day 10 are converting to paid at half the normal rate.",
      metrics: [["-50%", "Conversion rate"], ["Day 10", "Risk threshold"], ["340", "Users at risk"]],
      recommendation: "Send a targeted onboarding-completion nudge to trial users who reach day 8 without finishing setup.",
      factors: ["Onboarding completion is the strongest conversion predictor", "No nudge currently exists for day 8–10", "Affects 340 active trials this cycle"]
    }
  ];

  window.openInsight = function openInsight(index) {
    const d = INSIGHTS[index];
    if (!d) return;

    const iconWrap = document.getElementById("insightModalIcon");
    iconWrap.style.background = d.bg;
    iconWrap.style.color = d.fg;
    document.getElementById("insightModalIconEl").className = d.icon + " text-[18px]";

    const badge = document.getElementById("insightModalBadge");
    badge.textContent = d.badge;
    badge.className = "badge-soft " + d.badgeClass;

    document.getElementById("insightModalTitle").textContent = d.title;
    document.getElementById("insightModalTime").textContent = d.time;
    document.getElementById("insightModalSummary").textContent = d.summary;
    document.getElementById("insightModalRecommendation").textContent = d.recommendation;

    const metricsEl = document.getElementById("insightModalMetrics");
    metricsEl.innerHTML = d.metrics.map(function (m) {
      return '<div class="rounded-lg p-2.5 text-center u-background-surface-sunken">' +
        '<p class="font-display font-bold text-[15px]">' + m[0] + '</p>' +
        '<p class="text-[10.5px] mt-0.5 u-color-text-tertiary">' + m[1] + '</p></div>';
    }).join("");

    const factorsEl = document.getElementById("insightModalFactors");
    factorsEl.innerHTML = d.factors.map(function (f) {
      return '<li class="flex items-start gap-2 text-[12.5px]"><i class="icon-dot text-[6px] mt-2 u-color-text-tertiary"></i><span>' + f + '</span></li>';
    }).join("");

    window.openModal("insightDetailModal");
  };

  document.getElementById("insightsGrid")?.addEventListener("click", function (e) {
    const trigger = e.target.closest("[data-insight-index]");
    if (trigger) window.openInsight(Number(trigger.dataset.insightIndex));
  });
});
})();


// ---- international-wires.js ----
// ---- international-wires.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.filterWires = function filterWires() {
    const status = document.getElementById("wireStatusFilter").value;
    const currency = document.getElementById("wireCurrencyFilter").value;
    const query = document.getElementById("wireSearchInput").value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll(".wire-tile").forEach((tile) => {
      const matchesStatus = status === "all" || tile.getAttribute("data-status") === status;
      const matchesCurrency = currency === "all" || tile.getAttribute("data-currency") === currency;
      const matchesSearch = !query || tile.getAttribute("data-search").indexOf(query) !== -1;
      const show = matchesStatus && matchesCurrency && matchesSearch;
      tile.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    document.getElementById("wireGridEmpty").classList.toggle("hidden", visible !== 0);
  };

  window.openWireDetails = function openWireDetails(name, swift, iban, send, receive, rate, status) {
    document.getElementById("wdName").textContent = name;
    document.getElementById("wdSwift").textContent = swift;
    document.getElementById("wdIban").innerHTML = iban;
    document.getElementById("wdSend").textContent = send;
    document.getElementById("wdReceive").innerHTML = receive;
    document.getElementById("wdRate").textContent = rate;
    document.getElementById("wdStatus").innerHTML = status;
    window.openModal("wireDetailsModal");
  };

  window.submitWire = function submitWire() {
    window.closeModal("newWireModal");
    window.openModal("wireSuccessModal");
  };

  document.getElementById("wireSearchInput")?.addEventListener("input", window.filterWires);
  document.getElementById("wireStatusFilter")?.addEventListener("change", window.filterWires);
  document.getElementById("wireCurrencyFilter")?.addEventListener("change", window.filterWires);

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-wire-details]");
    if (!btn) return;
    window.openWireDetails(btn.dataset.wireName, btn.dataset.wireSwift, btn.dataset.wireIban, btn.dataset.wireSend, btn.dataset.wireReceive, btn.dataset.wireRate, btn.dataset.wireStatus);
  });

  document.getElementById("wireSendBtn")?.addEventListener("click", window.submitWire);
});
})();


// ---- inventory.js ----
// ---- inventory.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const INV_DATA = [
    { name: "Smart Watch Ultra", sku: "SKU-48120", wh: "Warehouse A", qty: 312, reserved: 48, avail: 264, reorder: 80, value: "$62.4K", status: "In Stock", badge: "badge-success" },
    { name: "Aurora Headset", sku: "SKU-48121", wh: "Warehouse A", qty: 204, reserved: 22, avail: 182, reorder: 60, value: "$28.9K", status: "In Stock", badge: "badge-success" },
    { name: "Cascade Jacket", sku: "SKU-32209", wh: "Warehouse B", qty: 18, reserved: 4, avail: 14, reorder: 25, value: "$1.7K", status: "Low Stock", badge: "badge-warning" },
    { name: "Flex Resistance Set", sku: "SKU-77310", wh: "Warehouse C", qty: 0, reserved: 0, avail: 0, reorder: 40, value: "$0.00", status: "Out of Stock", badge: "badge-danger" },
    { name: "Halo Smart Lamp", sku: "SKU-55102", wh: "Warehouse B", qty: 9, reserved: 2, avail: 7, reorder: 20, value: "$0.9K", status: "Low Stock", badge: "badge-warning" },
    { name: "Trailblazer Backpack", sku: "SKU-91847", wh: "Warehouse D", qty: 156, reserved: 12, avail: 144, reorder: 50, value: "$9.4K", status: "In Stock", badge: "badge-success" },
    { name: "Nimbus Bluetooth Speaker", sku: "SKU-63321", wh: "Warehouse A", qty: 88, reserved: 6, avail: 82, reorder: 30, value: "$5.2K", status: "In Stock", badge: "badge-success" },
    { name: "Ridgeline Hiking Boots", sku: "SKU-40218", wh: "Warehouse C", qty: 42, reserved: 8, avail: 34, reorder: 35, value: "$6.8K", status: "Low Stock", badge: "badge-warning" },
    { name: "Zenith Yoga Mat", sku: "SKU-28850", wh: "Warehouse D", qty: 214, reserved: 15, avail: 199, reorder: 60, value: "$3.1K", status: "In Stock", badge: "badge-success" },
    { name: "Ember Camping Stove", sku: "SKU-70094", wh: "Warehouse B", qty: 0, reserved: 0, avail: 0, reorder: 20, value: "$0.00", status: "Out of Stock", badge: "badge-danger" },
  ];

  const invBody = document.getElementById("invTableBody");
  if (!invBody) return;
  INV_DATA.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="font-medium">${item.name}</td>
      <td class="u-color-text-tertiary">${item.sku}</td>
      <td class="u-color-text-tertiary">${item.wh}</td>
      <td>${item.qty}</td>
      <td class="u-color-text-tertiary">${item.reserved}</td>
      <td>${item.avail}</td>
      <td class="u-color-text-tertiary">${item.reorder}</td>
      <td class="font-semibold">${item.value}</td>
      <td><span class="badge-soft ${item.badge}">${item.status}</span></td>
      <td>
        <div class="hs-dropdown [--placement:bottom-end] relative">
          <button type="button" class="hs-dropdown-toggle header-icon-btn !size-8" aria-haspopup="menu" aria-expanded="false"><i class="icon-more-vertical text-[14px]"></i></button>
          <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-1 w-44 surface-card !p-1.5 z-50" role="menu" aria-orientation="vertical">
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-inv-action="view" data-inv-index="${i}"><i class="icon-eye text-[13px]"></i>View</button>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-inv-action="edit" data-inv-index="${i}"><i class="icon-edit text-[13px]"></i>Edit</button>
            <a href="stock-transfer" class="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-arrow-left-right text-[13px]"></i>Transfer</a>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-inv-action="adjust" data-inv-index="${i}"><i class="icon-sliders-horizontal text-[13px]"></i>Adjust Stock</button>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-inv-action="reserve" data-inv-index="${i}"><i class="icon-lock text-[13px]"></i>Reserve</button>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-print-page><i class="icon-scan-line text-[13px]"></i>Print Barcode</button>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-inv-action="history" data-inv-index="${i}"><i class="icon-history text-[13px]"></i>History</button>
            <div class="h-px my-1 u-background-border-subtle"></div>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start u-color-color-danger-600" data-inv-action="delete" data-inv-index="${i}"><i class="icon-trash-2 text-[13px]"></i>Delete</button>
          </div>
        </div>
      </td>
    `;
    invBody.appendChild(tr);
  });

  let editingInvIndex = null;

  function openAddItemModal() {
    editingInvIndex = null;
    document.getElementById("addItemModalTitle").textContent = "Add Inventory Item";
    document.getElementById("submitAddItemBtn").textContent = "Add Item";
    document.getElementById("itemNameInput").value = "";
    document.getElementById("itemSkuInput").value = "";
    document.getElementById("itemWarehouseInput").value = "Warehouse A";
    document.getElementById("itemQtyInput").value = "0";
    document.getElementById("itemReorderInput").value = "0";
    document.getElementById("itemNameError").classList.add("hidden");
    window.openModal("addItemModal");
  }

  function openEditItemModal(i) {
    const item = INV_DATA[i];
    editingInvIndex = i;
    document.getElementById("addItemModalTitle").textContent = "Edit Inventory Item";
    document.getElementById("submitAddItemBtn").textContent = "Save Changes";
    document.getElementById("itemNameInput").value = item.name;
    document.getElementById("itemSkuInput").value = item.sku;
    document.getElementById("itemWarehouseInput").value = item.wh;
    document.getElementById("itemQtyInput").value = item.qty;
    document.getElementById("itemReorderInput").value = item.reorder;
    document.getElementById("itemNameError").classList.add("hidden");
    window.openModal("addItemModal");
  }

  function submitAddItem() {
    const name = document.getElementById("itemNameInput").value.trim();
    document.getElementById("itemNameError").classList.toggle("hidden", !!name);
    if (!name) return;
    if (editingInvIndex !== null) {
      const item = INV_DATA[editingInvIndex];
      item.name = name;
      item.sku = document.getElementById("itemSkuInput").value.trim() || item.sku;
      item.wh = document.getElementById("itemWarehouseInput").value;
      item.qty = Number(document.getElementById("itemQtyInput").value) || 0;
      item.reorder = Number(document.getElementById("itemReorderInput").value) || 0;
      item.avail = Math.max(0, item.qty - item.reserved);
      const row = invBody.children[editingInvIndex];
      row.children[0].textContent = item.name;
      row.children[1].textContent = item.sku;
      row.children[2].textContent = item.wh;
      row.children[3].textContent = item.qty;
      row.children[5].textContent = item.avail;
      row.children[6].textContent = item.reorder;
    }
    window.closeModal("addItemModal");
  }

  function viewInvItem(i) {
    const item = INV_DATA[i];
    document.getElementById("invDetailName").textContent = item.name;
    document.getElementById("invDetailSku").textContent = item.sku;
    document.getElementById("invDetailWarehouse").textContent = item.wh;
    document.getElementById("invDetailQty").textContent = item.qty;
    document.getElementById("invDetailReserved").textContent = item.reserved;
    document.getElementById("invDetailAvailable").textContent = item.avail;
    document.getElementById("invDetailValue").textContent = item.value;
    document.getElementById("invDetailStatus").innerHTML = `<span class="badge-soft ${item.badge}">${item.status}</span>`;
    window.openModal("invDetailModal");
  }

  function openAdjustStock(i) {
    document.getElementById("adjustItemName").textContent = INV_DATA[i].name;
    window.openModal("adjustStockModal");
  }

  function openInvHistory(i) {
    document.getElementById("historyItemName").textContent = INV_DATA[i].name;
    window.openModal("invHistoryModal");
  }

  const INV_ACTIONS = {
    reserve: { title: "Reserve stock?", icon: "icon-lock", bg: "var(--color-primary-100)", color: "var(--color-primary-700)", confirmBg: "var(--color-primary-600)", confirmLabel: "Reserve", message: (item) => `Reserve available units of ${item.name} for an upcoming order.` },
    delete: { title: "Delete item?", icon: "icon-trash-2", bg: "var(--color-danger-100)", color: "var(--color-danger-700)", confirmBg: "var(--color-danger-600)", confirmLabel: "Delete", message: (item) => `${item.name} (${item.sku}) will be permanently removed from inventory.` },
  };

  function invAction(type, i) {
    const item = INV_DATA[i];
    const cfg = INV_ACTIONS[type];
    const iconWrap = document.getElementById("invActionIcon");
    iconWrap.style.background = cfg.bg;
    iconWrap.style.color = cfg.color;
    iconWrap.querySelector("i").className = `${cfg.icon} text-[18px]`;
    document.getElementById("invActionTitle").textContent = cfg.title;
    document.getElementById("invActionMessage").textContent = cfg.message(item);
    const confirmBtn = document.getElementById("invActionConfirmBtn");
    confirmBtn.textContent = cfg.confirmLabel;
    confirmBtn.style.background = cfg.confirmBg;
    confirmBtn.style.color = "#fff";
    window.openModal("invActionModal");
  }

  document.getElementById("addItemBtn")?.addEventListener("click", openAddItemModal);
  document.getElementById("submitAddItemBtn")?.addEventListener("click", submitAddItem);

  invBody.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-inv-action]");
    if (!btn) return;
    const i = Number(btn.dataset.invIndex);
    switch (btn.dataset.invAction) {
      case "view": viewInvItem(i); break;
      case "edit": openEditItemModal(i); break;
      case "adjust": openAdjustStock(i); break;
      case "reserve": invAction("reserve", i); break;
      case "history": openInvHistory(i); break;
      case "delete": invAction("delete", i); break;
    }
  });
});
})();


// ---- invoice-add.js ----
// ---- invoice-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById("invoiceLineItems");
  if (list) {
    function addRow() {
      const row = document.createElement("div");
      row.className = "grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_100px] gap-2 items-center p-3 rounded-lg u-background-surface-sunken";
      row.innerHTML = '<input type="text" placeholder="Item description" class="w-full py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-card_border-1px-solid-border-subtle">'
        + '<input type="number" placeholder="Qty" value="1" class="w-full py-2 px-2.5 rounded-lg text-[12.5px] outline-none text-center u-background-surface-card_border-1px-solid-border-subtle">'
        + '<input type="text" placeholder="Rate" class="w-full py-2 px-2.5 rounded-lg text-[12.5px] outline-none text-center u-background-surface-card_border-1px-solid-border-subtle">'
        + '<div class="flex items-center gap-1.5"><span class="flex-1 text-[12.5px] font-semibold text-end">$0.00</span>'
        + '<button type="button" class="header-icon-btn !size-7" aria-label="Remove line item" data-row-remove><i class="icon-x text-[12px]"></i></button></div>';
      list.appendChild(row);
    }
    document.getElementById("addInvoiceLineBtn")?.addEventListener("click", addRow);
    window.wireRowRemove("invoiceLineItems", ".u-background-surface-sunken", null, { minRows: 1 });
  }

  window.saveInvoiceDraft = function saveInvoiceDraft() {
    window.openModal("draftSavedModal");
  };

  window.publishInvoice = function publishInvoice() {
    const customer = document.getElementById("invCustomer").value.trim();
    const errors = [];
    if (!customer) errors.push("Customer Name is required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't send yet";
      message.textContent = "Please fix the following before sending:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Invoice sent";
      message.textContent = `Invoice for "${customer}" has been created and sent.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  };

  document.getElementById("addInvoiceLineBtn")?.addEventListener("click", window.addInvoiceLine);
  document.getElementById("saveInvoiceDraftBtn")?.addEventListener("click", window.saveInvoiceDraft);
  document.getElementById("publishInvoiceBtn")?.addEventListener("click", window.publishInvoice);
});
})();


// ---- invoice-details.js ----
// ---- invoice-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.issueCreditNote = function issueCreditNote() {
    window.closeModal(document.getElementById("creditNoteModal"));
  };

  document.getElementById("issueCreditNoteBtn")?.addEventListener("click", issueCreditNote);
});
})();


// ---- invoice-templates.js ----
// ---- invoice-templates.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.setTemplateFilter = function setTemplateFilter(cat, btn) {
    document.querySelectorAll(".template-filter-tab").forEach(function (tab) {
      tab.classList.remove("u-background-color-primary-600_color-fff");
      tab.classList.add("u-background-surface-sunken_color-text-tertiary");
    });
    btn.classList.add("u-background-color-primary-600_color-fff");
    btn.classList.remove("u-background-surface-sunken_color-text-tertiary");

    document.querySelectorAll(".template-card").forEach(function (card) {
      const cardCat = card.dataset.templateCat;
      const match = cat === "all" || cardCat === "all" || cardCat === cat;
      card.style.display = match ? "" : "none";
    });
  };

  document.addEventListener("click", function (e) {
    const tab = e.target.closest("[data-template-filter]");
    if (!tab) return;
    window.setTemplateFilter(tab.dataset.templateFilter, tab);
  });
});
})();


// ---- invoice-workspace.js ----
// ---- invoice-workspace.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  var INVOICES = {
    inv1: {
      number: "INV-3421", client: "Northwind Traders", statusKey: "overdue",
      statusBadgeClass: "badge-soft badge-warning", statusLabel: "Overdue &middot; 6 days",
      subline: "Northwind Traders &middot; Due Jul 15, 2026",
      amount: "$8,400.00", dateLabel: "Issued", dateValue: "Jun 15, 2026",
      terms: "Net 30", reminders: "2", progressPercent: 0,
      progressLabel: "0% collected &middot; 6 days overdue", progressColor: "var(--color-warning-500)",
      showReminderBtn: true,
      aiText: "Northwind Traders has paid late 3 of the last 5 invoices. Consider requesting a 50% deposit on their next order or switching to Net 15 terms.",
      items: [
        { desc: "Consulting Services (40 hrs)", qty: 40, rate: 150 },
        { desc: "Software License (Annual)", qty: 1, rate: 1800 },
        { desc: "Onboarding Support", qty: 1, rate: 200 },
      ],
      taxRate: 0.05,
      snapshot: { method: "Bank Transfer", onTime: "40%", onTimePercent: 40, ringColor: "var(--color-warning-500)", lifetime: "$62,900.00" },
      activity: [
        { icon: "icon-file-plus", color: "badge-solid-neutral", text: "Invoice created", time: "Jun 15, 2026" },
        { icon: "icon-send", color: "badge-solid-info", text: "Sent to Northwind Traders", time: "Jun 15, 2026" },
        { icon: "icon-eye", color: "badge-solid-primary", text: "Viewed by client", time: "Jun 18, 2026" },
        { icon: "icon-bell-ring", color: "badge-solid-warning", text: "Reminder sent (1 of 2)", time: "Jul 16, 2026" },
        { icon: "icon-bell-ring", color: "badge-solid-warning", text: "Reminder sent (2 of 2)", time: "Jul 22, 2026" },
      ],
    },
    inv2: {
      number: "INV-3420", client: "Blue Harbor Co.", statusKey: "paid",
      statusBadgeClass: "badge-soft badge-success", statusLabel: "Paid",
      subline: "Blue Harbor Co. &middot; Paid Jul 10, 2026",
      amount: "$2,800.00", dateLabel: "Paid On", dateValue: "Jul 10, 2026",
      terms: "Net 30", reminders: "0", progressPercent: 100,
      progressLabel: "100% collected &middot; Paid in full", progressColor: "var(--color-success-500)",
      showReminderBtn: false,
      aiText: "Blue Harbor Co. pays consistently on time with a 92% on-time rate. Consider offering an early-renewal discount to lock in next quarter's contract.",
      items: [
        { desc: "Website Maintenance &mdash; July", qty: 1, rate: 2800 },
      ],
      taxRate: 0,
      snapshot: { method: "Credit Card", onTime: "92%", onTimePercent: 92, ringColor: "var(--color-success-500)", lifetime: "$18,400.00" },
      activity: [
        { icon: "icon-file-plus", color: "badge-solid-neutral", text: "Invoice created", time: "Jun 01, 2026" },
        { icon: "icon-send", color: "badge-solid-info", text: "Sent to Blue Harbor Co.", time: "Jun 01, 2026" },
        { icon: "icon-eye", color: "badge-solid-primary", text: "Viewed by client", time: "Jun 02, 2026" },
        { icon: "icon-check-circle", color: "badge-solid-success", text: "Payment received via Credit Card", time: "Jul 10, 2026" },
      ],
    },
    inv3: {
      number: "INV-3419", client: "Summit Retail Group", statusKey: "sent",
      statusBadgeClass: "badge-soft badge-info", statusLabel: "Sent",
      subline: "Summit Retail Group &middot; Due Aug 02, 2026",
      amount: "$6,100.00", dateLabel: "Issued", dateValue: "Jul 02, 2026",
      terms: "Net 30", reminders: "0", progressPercent: 0,
      progressLabel: "0% collected &middot; Due in 2 days", progressColor: "var(--color-info-500)",
      showReminderBtn: true,
      aiText: "Summit Retail Group typically views invoices within 3 days but pays close to the due date. A friendly reminder before Aug 2 may speed up payment.",
      items: [
        { desc: "Q3 Retail Analytics Package", qty: 1, rate: 6100 },
      ],
      taxRate: 0,
      snapshot: { method: "ACH", onTime: "78%", onTimePercent: 78, ringColor: "var(--color-info-500)", lifetime: "$41,200.00" },
      activity: [
        { icon: "icon-file-plus", color: "badge-solid-neutral", text: "Invoice created", time: "Jul 02, 2026" },
        { icon: "icon-send", color: "badge-solid-info", text: "Sent to Summit Retail Group", time: "Jul 02, 2026" },
        { icon: "icon-eye", color: "badge-solid-primary", text: "Viewed by client", time: "Jul 05, 2026" },
      ],
    },
    inv4: {
      number: "INV-3418", client: "Cedar Analytics", statusKey: "draft",
      statusBadgeClass: "badge-soft badge-neutral", statusLabel: "Draft",
      subline: "Cedar Analytics &middot; Not yet sent",
      amount: "$14,200.00", dateLabel: "Created", dateValue: "Jul 28, 2026",
      terms: "Net 15", reminders: "0", progressPercent: 0,
      progressLabel: "Not sent yet", progressColor: "var(--color-neutral-400)",
      showReminderBtn: false,
      aiText: "This invoice hasn't been sent yet. Cedar Analytics is a new client with no payment history &mdash; sending early gives more buffer before the Net 15 term lapses.",
      items: [
        { desc: "Data Pipeline Overhaul", qty: 1, rate: 10000 },
        { desc: "Custom Dashboard Build", qty: 1, rate: 4200 },
      ],
      taxRate: 0,
      snapshot: { method: "&mdash;", onTime: "&mdash;", onTimePercent: 0, ringColor: "var(--color-neutral-300)", lifetime: "$0.00" },
      activity: [
        { icon: "icon-file-plus", color: "badge-solid-neutral", text: "Draft created", time: "Jul 28, 2026" },
      ],
    },
  };

  function formatCurrency(n) {
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  window.selectInvoice = function selectInvoice(id, el) {
    var inv = INVOICES[id];
    if (!inv) return;

    document.querySelectorAll(".invoice-row").forEach(function (row) {
      row.classList.remove("u-background-surface-sunken");
      row.style.borderInlineStart = "";
    });
    if (el) {
      el.classList.add("u-background-surface-sunken");
      var borderColor = inv.statusKey === "overdue" ? "var(--color-warning-500)" : inv.statusKey === "paid" ? "var(--color-success-500)" : inv.statusKey === "sent" ? "var(--color-info-500)" : "var(--color-neutral-400)";
      el.style.borderInlineStart = "3px solid " + borderColor;
    }

    document.getElementById("detailNumber").textContent = inv.number;
    var badge = document.getElementById("detailStatusBadge");
    badge.className = inv.statusBadgeClass;
    badge.innerHTML = inv.statusLabel;
    document.getElementById("detailSubline").innerHTML = inv.subline;
    document.getElementById("detailAmount").textContent = inv.amount;
    document.getElementById("detailDateLabel").textContent = inv.dateLabel;
    document.getElementById("detailDateValue").textContent = inv.dateValue;
    document.getElementById("detailTerms").textContent = inv.terms;
    document.getElementById("detailReminders").textContent = inv.reminders;
    document.getElementById("detailProgressLabel").innerHTML = inv.progressLabel;
    var bar = document.getElementById("detailProgressBar");
    bar.style.width = inv.progressPercent + "%";
    bar.style.background = inv.progressColor;
    document.getElementById("detailReminderBtn").style.display = inv.showReminderBtn ? "" : "none";

    var subtotal = inv.items.reduce(function (sum, item) { return sum + item.qty * item.rate; }, 0);
    var tax = subtotal * inv.taxRate;
    var total = subtotal + tax;
    document.getElementById("detailItemsBody").innerHTML = inv.items.map(function (item) {
      return "<tr><td>" + item.desc + "</td><td class=\"text-end\">" + item.qty + "</td><td class=\"text-end\">" + formatCurrency(item.rate) + "</td><td class=\"text-end font-semibold\">" + formatCurrency(item.qty * item.rate) + "</td></tr>";
    }).join("");
    document.getElementById("detailSubtotal").textContent = formatCurrency(subtotal);
    document.getElementById("detailTax").textContent = formatCurrency(tax);
    document.getElementById("detailTotal").textContent = formatCurrency(total);
  };

  window.filterInvoices = function filterInvoices(status, el) {
    document.querySelectorAll(".filter-chip").forEach(function (chip) {
      chip.classList.remove("u-background-color-primary-600_color-fff");
      chip.classList.add("u-background-surface-sunken");
    });
    if (el) {
      el.classList.remove("u-background-surface-sunken");
      el.classList.add("u-background-color-primary-600_color-fff");
    }
    applyInvoiceListFilters(status, document.getElementById("invoiceSearchInput").value);
  };

  window.searchInvoices = function searchInvoices(query) {
    var activeChip = document.querySelector(".filter-chip.u-background-color-primary-600_color-fff");
    applyInvoiceListFilters(activeChip ? activeChip.getAttribute("data-filter") : "all", query);
  };

  function applyInvoiceListFilters(status, query) {
    var q = (query || "").trim().toLowerCase();
    var visible = 0;
    document.querySelectorAll(".invoice-row").forEach(function (row) {
      var matchesStatus = status === "all" || row.getAttribute("data-status") === status;
      var matchesSearch = !q || row.getAttribute("data-search").indexOf(q) !== -1;
      var show = matchesStatus && matchesSearch;
      row.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    document.getElementById("invoiceListEmpty").classList.toggle("hidden", visible !== 0);
    document.getElementById("invoiceListCount").textContent = "Showing " + visible + " of 31,400";
  }

  document.querySelectorAll(".filter-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterInvoices(chip.getAttribute("data-filter"), chip);
    });
  });

  document.querySelectorAll(".invoice-row").forEach(function (row) {
    row.addEventListener("click", function () {
      selectInvoice(row.getAttribute("data-invoice-id"), row);
    });
  });

  document.getElementById("invoiceSearchInput")?.addEventListener("input", function () {
    searchInvoices(this.value);
  });
});
})();


// ---- keyword-details.js ----
// ---- keyword-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function setAlert() {
    window.closeModal("alertModal");
    window.showSuccess("Alert saved", "You will be notified when the rank for this keyword changes.");
  }

  function removeKeyword() {
    window.closeModal("removeModal");
    window.showSuccess("Keyword removed", "“admin dashboard template” is no longer being tracked.");
  }

  document.getElementById("setAlertBtn")?.addEventListener("click", setAlert);
  document.getElementById("removeKeywordBtn")?.addEventListener("click", removeKeyword);
});
})();


// ---- kpi-builder.js ----
// ---- kpi-builder.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("vizTypeGroup")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".viz-type-btn");
    if (!btn) return;
    document.querySelectorAll(".viz-type-btn").forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.style.background = active ? "var(--color-primary-600)" : "";
      b.style.color = active ? "#fff" : "";
    });
  });
});
})();


// ---- landing-page-add.js ----
// ---- landing-page-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("lpTitle")?.addEventListener("input", (e) => {
    const slug = document.getElementById("lpSlug");
    if (!slug.dataset.touched) slug.value = e.target.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  });
  document.getElementById("lpSlug")?.addEventListener("input", (e) => { e.target.dataset.touched = "true"; });

  window.saveLpDraft = document.getElementById("saveLpDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });;

  window.publishLp = document.getElementById("publishLpBtn")?.addEventListener("click", function () {
    const title = document.getElementById("lpTitle").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const titleEl = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!title) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      titleEl.textContent = "Can't publish yet";
      message.textContent = "Please fix the following before publishing this page:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Page Title is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      titleEl.textContent = "Landing page published";
      message.textContent = `"${title}" is now live on your storefront.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });;
});
})();


// ---- language-add.js ----
// ---- language-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.saveLangDraft = document.getElementById("saveLangDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });;

  window.publishLang = document.getElementById("publishLangBtn")?.addEventListener("click", function () {
    const name = document.getElementById("langName").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!name) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't add yet";
      message.textContent = "Please fix the following before adding this language:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Language selection is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Language added";
      message.textContent = `"${name}" is now available on your storefront.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });;
});
})();


// ---- laundry-batch-add.js ----
// ---- laundry-batch-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.saveBatchDraft = document.getElementById("saveBatchDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });;

  window.publishBatch = document.getElementById("publishBatchBtn")?.addEventListener("click", function () {
    const count = document.getElementById("batchCount").value.trim();
    const type = document.getElementById("batchType").value;
    const errors = [];
    if (!count || isNaN(Number(count)) || Number(count) <= 0) errors.push("A valid Item Count is required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't log batch yet";
      message.textContent = "Please fix the following before logging:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Batch logged";
      message.textContent = `A new ${type} batch of ${count} items has been logged.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });;
});
})();


// ---- lead-view.js ----
// ---- lead-view.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.convertLead = function convertLead() {
    window.closeModal("convertModal");
    window.showSuccess("Lead converted", "Renee Foster has been converted into a deal in your pipeline.");
  };

  window.reassignOwner = function reassignOwner() {
    window.closeModal("reassignModal");
    window.showSuccess("Owner reassigned", "This lead has been reassigned to the selected owner.");
  };

  window.changeStatus = function changeStatus() {
    const value = document.getElementById("statusSelectInput").value;
    window.closeModal("statusModal");
    const badge = document.getElementById("leadStatusBadge");
    const map = {
      "New": { icon: "icon-sparkle", cls: "badge-neutral" },
      "Contacted": { icon: "icon-loader", cls: "badge-info" },
      "Qualified": { icon: "icon-badge-check", cls: "badge-success" },
      "Unqualified": { icon: "icon-x-circle", cls: "badge-danger" },
    };
    const cfg = map[value] || map["New"];
    badge.className = `badge-soft ${cfg.cls} !bg-white/15 !text-white`;
    badge.innerHTML = `<i class="${cfg.icon} text-[9px]"></i>${value}`;
    window.showSuccess("Status updated", `This lead is now marked as "${value}".`);
  };

  window.deleteLead = function deleteLead() {
    window.closeModal("deleteLeadModal");
    window.location.href = "leads";
  };

  document.getElementById("convertLeadBtn")?.addEventListener("click", convertLead);
  document.getElementById("reassignOwnerBtn")?.addEventListener("click", reassignOwner);
  document.getElementById("changeStatusBtn")?.addEventListener("click", changeStatus);
  document.getElementById("deleteLeadBtn")?.addEventListener("click", deleteLead);
});
})();


// ---- leads.js ----
// ---- leads.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.openAddLeadModal = function openAddLeadModal() {
    document.getElementById("leadNameInput").value = "";
    document.getElementById("leadNameError").classList.add("hidden");
    window.openModal("addLeadModal");
  };
  window.closeAddLeadModal = function closeAddLeadModal() {
    window.closeModal("addLeadModal");
  };
  window.submitAddLead = function submitAddLead() {
    const name = document.getElementById("leadNameInput").value.trim();
    document.getElementById("leadNameError").classList.toggle("hidden", !!name);
    if (!name) return;
    window.closeAddLeadModal();
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.closeAddLeadModal();
  });

  document.getElementById("openAddLeadBtn")?.addEventListener("click", window.openAddLeadModal);
  document.getElementById("addLeadCloseBtn")?.addEventListener("click", window.closeAddLeadModal);
  document.getElementById("addLeadCancelBtn")?.addEventListener("click", window.closeAddLeadModal);
  document.getElementById("addLeadSubmitBtn")?.addEventListener("click", window.submitAddLead);
});
})();


// ---- leave-request-details.js ----
// ---- leave-request-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.approveLeave = function approveLeave() {
    window.closeModal("approveModal");
    const badge = document.getElementById("leaveStatusBadge");
    badge.className = "badge-soft badge-success !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-check text-[9px]"></i>Approved';
    window.showSuccess("Leave request approved", "Priya Nair has been notified. Her leave balance has been updated.");
  };

  window.rejectLeave = function rejectLeave() {
    window.closeModal("rejectModal");
    const badge = document.getElementById("leaveStatusBadge");
    badge.className = "badge-soft badge-danger !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-x text-[9px]"></i>Rejected';
    window.showSuccess("Leave request rejected", "Priya Nair has been notified with the reason provided.");
  };

  document.getElementById("confirmApprovalBtn")?.addEventListener("click", window.approveLeave);
  document.getElementById("rejectRequestBtn")?.addEventListener("click", window.rejectLeave);
});
})();


// ---- leave-requests-list.js ----
// ---- leave-requests-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  var tabs = document.querySelectorAll(".status-tab");
  var rows = document.querySelectorAll("#leaveRequestsBody tr");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.style.background = "var(--surface-sunken)";
        t.style.color = "var(--text-tertiary)";
      });
      tab.classList.add("is-active");
      tab.style.background = "var(--color-primary-600)";
      tab.style.color = "#fff";

      var status = tab.getAttribute("data-status-tab");
      rows.forEach(function (row) {
        var badge = row.querySelector("td:nth-child(5) span");
        var rowStatus = badge ? badge.textContent.trim() : "";
        row.style.display = (status === "All" || rowStatus === status) ? "" : "none";
      });
    });
  });
});
})();


// ---- ledger-explorer.js ----
// ---- ledger-explorer.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".hs-dropdown-toggle,.hs-dropdown-menu")) return;

    const opener = e.target.closest("[data-open-drawer]");
    if (opener) {
      document.getElementById(opener.dataset.openDrawer)?.classList.remove("translate-x-full");
      return;
    }

    const closer = e.target.closest("[data-close-drawer]");
    if (closer) {
      document.getElementById(closer.dataset.closeDrawer)?.classList.add("translate-x-full");
      if (closer.hasAttribute("data-hide-self")) closer.classList.add("hidden");
    }
  });
});
})();


// ---- loan-workspace.js ----
// ---- loan-workspace.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.submitExtraPayment = function submitExtraPayment() {
    window.closeModal("extraPaymentModal");
    window.openModal("loanSuccessModal");
  };

  document.getElementById("submitExtraPaymentBtn")?.addEventListener("click", window.submitExtraPayment);
});
})();


// ---- lost-found-item-add.js ----
// ---- lost-found-item-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveItemDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishItemBtn")?.addEventListener("click", function () {
    const desc = document.getElementById("itemDesc").value.trim();
    const location = document.getElementById("itemLocation").value.trim();
    const errors = [];
    if (!desc) errors.push("Item Description is required.");
    if (!location) errors.push("Room / Location Found is required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't log item yet";
      message.textContent = "Please fix the following before logging:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Item logged";
      message.textContent = `"${desc}" has been added to Lost & Found.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- market-alert-add.js ----
// ---- market-alert-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveAlertDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishAlertBtn")?.addEventListener("click", function () {
    const symbol = document.getElementById("alertSymbol").value.trim();
    const target = document.getElementById("alertTarget").value.trim();
    const errors = [];
    if (!symbol) errors.push("Asset / Symbol is required.");
    if (!target || isNaN(Number(target)) || Number(target) <= 0) errors.push("A valid Target Value is required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't create alert yet";
      message.textContent = "Please fix the following before creating:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Alert created";
      message.textContent = `You'll be notified when ${symbol} hits your target.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- match-center.js ----
// ---- match-center.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function runAutoMatch() {
      document.getElementById("autoMatchRunStep").classList.add("hidden");
      document.getElementById("autoMatchDoneStep").classList.remove("hidden");
  }

  // Reset the Auto Match modal's step state whenever it closes (Preline manages open/close itself).
  document.getElementById("autoMatchModal")?.addEventListener("close.hs.overlay", () => {
      document.getElementById("autoMatchRunStep").classList.remove("hidden");
      document.getElementById("autoMatchDoneStep").classList.add("hidden");
  });

  document.getElementById("runAutoMatchBtn")?.addEventListener("click", runAutoMatch);
  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".js-remove-card");
    if (removeBtn) removeBtn.closest(".surface-card").remove();
  });
});
})();


// ---- medicine-add.js ----
// ---- medicine-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveMedicineDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishMedicineBtn")?.addEventListener("click", function () {
    const name = document.getElementById("medName").value.trim();
    const price = document.getElementById("medPrice").value.trim();
    const errors = [];
    if (!name) errors.push("Medicine Name is required.");
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errors.push("A valid Unit Price is required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't add yet";
      message.textContent = "Please fix the following before adding:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Medicine added";
      message.textContent = `"${name}" has been added to the catalog.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- menu-builder.js ----
// ---- menu-builder.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {

    (function () {
        const tabs = document.getElementById('menuCategoryTabs');
        const grid = document.getElementById('menuItemGrid');
        if (!tabs || !grid) return;
        const cards = grid.querySelectorAll('[data-category]');
        tabs.addEventListener('click', function (e) {
            const btn = e.target.closest('[data-category-filter]');
            if (!btn) return;
            tabs.querySelectorAll('[data-category-filter]').forEach(function (b) {
                b.classList.remove('u-background-color-primary-600_color-fff');
                b.classList.add('u-background-surface-sunken_color-text-tertiary');
            });
            btn.classList.add('u-background-color-primary-600_color-fff');
            btn.classList.remove('u-background-surface-sunken_color-text-tertiary');
            const filter = btn.dataset.categoryFilter;
            cards.forEach(function (card) {
                card.style.display = (filter === 'All' || card.dataset.category === filter) ? '' : 'none';
            });
        });
    })();

    let menuItemActiveCard = null;
    let menuItemActiveButton = null;
    let menuItemPendingAction = null;

    function getMenuItemName(card) {
        return card.querySelector(".font-semibold.leading-snug").textContent.trim();
    }

    function cardFromMenuElement(el) {
        return el.closest("[data-category]");
    }

    window.editMenuItem = function editMenuItem(el) {
        const card = cardFromMenuElement(el);
        menuItemActiveCard = card;
        document.getElementById("menuItemEditName").value = getMenuItemName(card);
        document.getElementById("menuItemEditCategory").value = card.dataset.category;
        document.getElementById("menuItemEditPrice").value = card.querySelector(".u-color-color-primary-600").textContent.trim();
        window.openModal("menuItemEditModal");
    };

    window.saveMenuItemEdit = function saveMenuItemEdit() {
        if (!menuItemActiveCard) return;
        const name = document.getElementById("menuItemEditName").value.trim();
        const category = document.getElementById("menuItemEditCategory").value.trim();
        const price = document.getElementById("menuItemEditPrice").value.trim();
        menuItemActiveCard.querySelector(".font-semibold.leading-snug").textContent = name;
        menuItemActiveCard.querySelector("p.text-\\[11px\\].mt-0\\.5").textContent = category;
        menuItemActiveCard.dataset.category = category;
        menuItemActiveCard.querySelector(".u-color-color-primary-600").textContent = price;
        window.closeModal("menuItemEditModal");
        window.showToast("menuItemToast",name + " updated");
    };

    function openMenuItemConfirm(config) {
        document.getElementById("menuItemConfirmIcon").className = "size-10 rounded-xl flex items-center justify-center mx-auto " + config.iconBg;
        document.getElementById("menuItemConfirmIcon").innerHTML = '<i class="' + config.icon + ' text-[18px] ' + config.iconColor + '"></i>';
        document.getElementById("menuItemConfirmTitle").textContent = config.title;
        document.getElementById("menuItemConfirmMessage").textContent = config.message;
        const btn = document.getElementById("menuItemConfirmBtn");
        btn.textContent = config.confirmLabel;
        btn.className = "btn !text-[12.5px] w-full " + config.confirmClass;
        menuItemPendingAction = config.action;
        window.openModal("menuItemConfirmModal");
    }

    window.duplicateMenuItem = function duplicateMenuItem(el) {
        const card = cardFromMenuElement(el);
        menuItemActiveCard = card;
        openMenuItemConfirm({
            action: "duplicate",
            icon: "icon-copy", iconBg: "u-background-color-info-100", iconColor: "u-color-color-info-600",
            title: "Duplicate Item",
            message: "Add a copy of “" + getMenuItemName(card) + "” to the menu?",
            confirmLabel: "Yes, Duplicate",
            confirmClass: "u-background-color-info-600_color-fff"
        });
    };

    window.toggleMenuItem86 = function toggleMenuItem86(el) {
        const card = cardFromMenuElement(el);
        const isRestoring = el.textContent.trim() === "Restore Item";
        menuItemActiveCard = card;
        menuItemActiveButton = el;
        openMenuItemConfirm({
            action: "toggle86",
            icon: isRestoring ? "icon-rotate-ccw" : "icon-ban",
            iconBg: isRestoring ? "u-background-color-success-100" : "u-background-color-warning-100",
            iconColor: isRestoring ? "u-color-color-success-600" : "u-color-color-warning-600",
            title: isRestoring ? "Restore Item" : "Mark 86'd",
            message: isRestoring
                ? "Make “" + getMenuItemName(card) + "” available for ordering again?"
                : "Hide “" + getMenuItemName(card) + "” from ordering? You can restore it anytime.",
            confirmLabel: isRestoring ? "Yes, Restore" : "Yes, Mark 86'd",
            confirmClass: isRestoring ? "u-background-color-success-600_color-fff" : "u-background-color-warning-600_color-fff"
        });
    };

    window.deleteMenuItem = function deleteMenuItem(el) {
        const card = cardFromMenuElement(el);
        menuItemActiveCard = card;
        openMenuItemConfirm({
            action: "delete",
            icon: "icon-trash-2", iconBg: "u-background-color-danger-100", iconColor: "u-color-color-danger-600",
            title: "Delete Item",
            message: "Remove “" + getMenuItemName(card) + "” from the menu? This can't be undone.",
            confirmLabel: "Yes, Delete",
            confirmClass: "u-background-color-danger-600_color-fff"
        });
    };

    window.confirmMenuItemAction = function confirmMenuItemAction() {
        const card = menuItemActiveCard;
        if (!card) return;
        const name = getMenuItemName(card);
        if (menuItemPendingAction === "duplicate") {
            const clone = card.cloneNode(true);
            card.after(clone);
            window.HSDropdown?.autoInit();
            window.showToast("menuItemToast",name + " duplicated");
        } else if (menuItemPendingAction === "toggle86") {
            const btn = menuItemActiveButton;
            const isRestoring = btn.textContent.trim() === "Restore Item";
            btn.innerHTML = isRestoring
                ? '<i class="icon-ban text-[13px]"></i>Mark 86\'d'
                : '<i class="icon-rotate-ccw text-[13px]"></i>Restore Item';
            window.showToast("menuItemToast",isRestoring ? name + " restored to menu" : name + " marked 86'd — hidden from ordering");
        } else if (menuItemPendingAction === "delete") {
            card.remove();
            window.showToast("menuItemToast",name + " removed");
        }
        window.closeModal("menuItemConfirmModal");
    };

    document.addEventListener("click", function (e) {
        const editBtn = e.target.closest("[data-menu-edit]");
        if (editBtn) { window.editMenuItem(editBtn); return; }
        const dupBtn = e.target.closest("[data-menu-duplicate]");
        if (dupBtn) { window.duplicateMenuItem(dupBtn); return; }
        const toggleBtn = e.target.closest("[data-menu-toggle86]");
        if (toggleBtn) { window.toggleMenuItem86(toggleBtn); return; }
        const delBtn = e.target.closest("[data-menu-delete]");
        if (delBtn) { window.deleteMenuItem(delBtn); return; }
    });

    document.getElementById("menuItemEditSaveBtn")?.addEventListener("click", window.saveMenuItemEdit);
    document.getElementById("menuItemConfirmBtn")?.addEventListener("click", window.confirmMenuItemAction);

});
})();


// ---- menu-category-add.js ----
// ---- menu-category-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveCategoryDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishCategoryBtn")?.addEventListener("click", function () {
    const name = document.getElementById("mcName").value.trim();
    if (!name) {
      window.openModal("validationErrorModal");
      return;
    }
    document.getElementById("publishSuccessMsg").textContent = `"${name}" has been added to your menu.`;
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- menu-item-add.js ----
// ---- menu-item-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveMenuItemDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishMenuItemBtn")?.addEventListener("click", function () {
    const name = document.getElementById("miName").value.trim();
    const category = document.getElementById("miCategory").value;
    const price = document.getElementById("miPrice").value;
    if (!name || !category || !price) {
      window.openModal("validationErrorModal");
      return;
    }
    document.getElementById("publishSuccessMsg").textContent = `"${name}" has been added to ${category}.`;
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- menu-offer-add.js ----
// ---- menu-offer-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveOfferDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishOfferBtn")?.addEventListener("click", function () {
    const title = document.getElementById("moTitle").value.trim();
    const type = document.getElementById("moType").value;
    const value = document.getElementById("moValue").value.trim();
    if (!title || !type || !value) {
      window.openModal("validationErrorModal");
      return;
    }
    document.getElementById("publishSuccessMsg").textContent = `"${title}" is now live for eligible customers.`;
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- model-details.js ----
// ---- model-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function startRetrain() {
    window.closeModal("retrainModal");
    window.showSuccess("Retraining started", "A new training run has been queued on the 8x A100 cluster. You'll be notified when it completes.");
  }

  function confirmRollback() {
    window.closeModal("rollbackModal");
    window.showSuccess("Rollback complete", "Traffic has been routed to the previous model version.");
  }

  window.startRetrain = startRetrain;
  window.confirmRollback = confirmRollback;

  document.getElementById("startRetrainBtn")?.addEventListener("click", startRetrain);
  document.getElementById("confirmRollbackBtn")?.addEventListener("click", confirmRollback);
});
})();


// ---- order-add.js ----
// ---- order-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function saveNewCustomer() {
    const name = document.getElementById("ncName").value.trim();
    const email = document.getElementById("ncEmail").value.trim();
    if (!name || !email) return;
    document.getElementById("oCustomerName").textContent = name;
    document.querySelector("#oCustomerName").nextElementSibling.textContent = `${email} · New customer`;
    window.closeModal("newCustomerModal");
  }

  function recalcOrderTotals() {
    if (!document.getElementById("oSubtotal")) return;
    let subtotal = 0;
    document.querySelectorAll(".order-item").forEach((row) => {
      const price = parseFloat(row.dataset.price);
      const qty = parseInt(row.querySelector(".oi-qty").value, 10);
      const lineTotal = price * qty;
      row.querySelector(".oi-line-total").textContent = `$${lineTotal.toFixed(2)}`;
      subtotal += lineTotal;
    });
    const shippingSelected = document.querySelector('input[name="oShip"]:checked');
    const shippingCost = shippingSelected ? (shippingSelected.closest("label").querySelector("span.text-\\[12px\\]").textContent.trim() === "Free" ? 0 : parseFloat(shippingSelected.closest("label").querySelector("span.text-\\[12px\\]").textContent.replace("$", ""))) : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;
    document.getElementById("oSubtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("oShipping").textContent = shippingCost ? `$${shippingCost.toFixed(2)}` : "Free";
    document.getElementById("oTax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("oTotal").textContent = `$${total.toFixed(2)}`;
  }

  window.wireQtyStepper("oItemsList", ".oi-qty", recalcOrderTotals);
  window.wireRowRemove("oItemsList", ".order-item", recalcOrderTotals);

  function addOrderItem() {
    const list = document.getElementById("oItemsList");
    const row = document.createElement("div");
    row.className = "order-item flex items-center gap-3 p-2.5 rounded-lg";
    row.style.background = "var(--surface-sunken)";
    row.dataset.price = "34.00";
    row.innerHTML = `
      <img src="build/img/card/card-03.jpg" class="size-11 rounded-lg object-cover shrink-0" alt="">
      <span class="min-w-0 flex-1">
        <span class="block text-[12.5px] font-semibold truncate">Ceramic Pour-Over Set</span>
        <span class="block text-[11px] u-color-text-tertiary">SKU: CP-2024-WHT &middot; $34.00 each</span>
      </span>
      <div class="flex items-center gap-1 shrink-0">
        <button type="button" class="header-icon-btn !size-7" data-qty-step="-1"><i class="icon-minus text-[11px]"></i></button>
        <input type="text" class="oi-qty w-9 text-center text-[12.5px] font-semibold bg-transparent outline-none" value="1" readonly>
        <button type="button" class="header-icon-btn !size-7" data-qty-step="1"><i class="icon-plus text-[11px]"></i></button>
      </div>
      <span class="oi-line-total text-[12.5px] font-semibold w-16 text-end shrink-0">$34.00</span>
      <button type="button" class="header-icon-btn !size-7 shrink-0" data-row-remove><i class="icon-trash-2 text-[12px] u-color-color-danger-600"></i></button>
    `;
    list.appendChild(row);
    recalcOrderTotals();
  }

  document.querySelectorAll('input[name="oShip"]').forEach((r) => r.addEventListener("change", recalcOrderTotals));

  document.getElementById("saveNewCustomerBtn")?.addEventListener("click", saveNewCustomer);
  document.getElementById("addOrderItemBtn")?.addEventListener("click", addOrderItem);
  document.getElementById("saveOrderDraftBtn")?.addEventListener("click", () => window.openModal("draftSavedModal"));
  document.getElementById("createOrderBtn")?.addEventListener("click", () => window.openModal("orderCreatedModal"));

  recalcOrderTotals();
});
})();


// ---- order-board.js ----
// ---- order-board.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function viewOrderDetail(btn) {
      const card = btn.closest(".order-card");
      if (!card) return;
      const clone = card.cloneNode(true);
      clone.classList.remove("order-card", "is-interactive", "surface-card", "!p-0", "overflow-hidden", "u-opacity-85");
      clone.classList.add("rounded-xl", "overflow-hidden", "border", "u-border-color-border-subtle");
      const footer = clone.lastElementChild;
      if (footer && footer.tagName === "BUTTON") footer.remove();
      const body = document.getElementById("orderDetailBody");
      body.innerHTML = "";
      body.appendChild(clone);
      window.openModal("orderDetailModal");
  }
  function setOrderFilter(channel, btn) {
      document.querySelectorAll(".order-filter-tab").forEach((tab) => {
          tab.classList.remove("u-background-color-primary-600_color-fff");
          tab.classList.add("u-background-surface-sunken_color-text-tertiary");
      });
      btn.classList.remove("u-background-surface-sunken_color-text-tertiary");
      btn.classList.add("u-background-color-primary-600_color-fff");

      const cards = document.querySelectorAll("#orderBoardGrid .order-card");
      let visibleCount = 0;
      cards.forEach((card) => {
          const match = channel === "all" || card.getAttribute("data-order-channel") === channel;
          card.classList.toggle("hidden", !match);
          if (match) visibleCount++;
      });

      document.getElementById("orderBoardEmpty").classList.toggle("hidden", visibleCount > 0);
      document.getElementById("orderBoardLoadMore").classList.toggle("hidden", channel !== "all");
  }

  document.querySelectorAll("[data-view-order]").forEach((btn) => {
    btn.addEventListener("click", () => viewOrderDetail(btn));
  });

  document.querySelectorAll(".order-filter-tab[data-order-filter]").forEach((btn) => {
    btn.addEventListener("click", () => setOrderFilter(btn.dataset.orderFilter, btn));
  });
});
})();


// ---- order-dinein.js ----
// ---- order-dinein.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function formatMoney(n) { return "$" + n.toFixed(2); }

  function filterMenuItems(category, chip) {
      document.querySelectorAll(".menu-cat-chip").forEach((el) => {
          el.classList.remove("u-background-color-primary-600_color-fff");
          el.classList.add("u-background-surface-sunken_color-text-tertiary");
      });
      chip.classList.remove("u-background-surface-sunken_color-text-tertiary");
      chip.classList.add("u-background-color-primary-600_color-fff");
      document.querySelectorAll("#menuItemsGrid .menu-item-tile").forEach((tile) => {
          tile.style.display = (category === "All" || tile.dataset.category === category) ? "" : "none";
      });
  }

  function confirmSendToKitchen() {
      window.closeModal("sendToKitchenModal");
      window.showToast("dineinToast", "Order sent to kitchen", {
        create: "fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg text-[12.5px] font-semibold u-background-surface-elevated-1f2421_color-fff_box-shadow-0-8p",
        removeOnHide: true
      });
  }

  function recalcOrder() {
      const rows = document.querySelectorAll("#orderRows .order-row");
      let subtotal = 0, itemCount = 0;
      rows.forEach((row) => {
          const price = parseFloat(row.dataset.price);
          const qty = parseInt(row.dataset.qty, 10);
          subtotal += price * qty;
          itemCount += qty;
          row.querySelector(".line-total").textContent = formatMoney(price * qty);
      });
      const tax = subtotal * 0.08;
      const service = subtotal * 0.05;
      const total = subtotal + tax + service;
      document.getElementById("orderItemCount").textContent = itemCount + (itemCount === 1 ? " item" : " items");
      document.getElementById("orderSubtotal").textContent = formatMoney(subtotal);
      document.getElementById("orderTax").textContent = formatMoney(tax);
      document.getElementById("orderService").textContent = formatMoney(service);
      document.getElementById("orderTotal").textContent = formatMoney(total);
  }

  function adjustOrderQty(btn, delta) {
      const row = btn.closest(".order-row");
      const qty = parseInt(row.dataset.qty, 10) + delta;
      if (qty <= 0) {
          row.remove();
      } else {
          row.dataset.qty = qty;
          row.querySelector(".qty-value").textContent = qty;
      }
      recalcOrder();
  }

  function addOrderItem(name, price) {
      const rows = document.getElementById("orderRows");
      const existing = Array.from(rows.querySelectorAll(".order-row")).find((row) => row.dataset.name === name);
      if (existing) {
          existing.dataset.qty = parseInt(existing.dataset.qty, 10) + 1;
          existing.querySelector(".qty-value").textContent = existing.dataset.qty;
      } else {
          const row = document.createElement("div");
          row.className = "order-row flex items-center gap-2.5 p-2.5 rounded-lg u-background-surface-sunken";
          row.dataset.name = name;
          row.dataset.price = price;
          row.dataset.qty = 1;
          row.innerHTML = `
              <div class="flex items-center gap-1.5 shrink-0">
                  <button type="button" class="header-icon-btn !size-6" data-qty-step="-1"><i class="icon-minus text-[11px]"></i></button>
                  <span class="qty-value text-[12px] font-bold w-4 text-center">1</span>
                  <button type="button" class="header-icon-btn !size-6" data-qty-step="1"><i class="icon-plus text-[11px]"></i></button>
              </div>
              <div class="min-w-0 flex-1">
                  <p class="text-[12.5px] font-semibold truncate">${name}</p>
              </div>
              <span class="line-total text-[12.5px] font-semibold shrink-0">${formatMoney(price)}</span>
          `;
          rows.appendChild(row);
      }
      recalcOrder();
  }

  document.getElementById("menuCategoryChips")?.addEventListener("click", (e) => {
      const chip = e.target.closest(".menu-cat-chip");
      if (!chip) return;
      filterMenuItems(chip.dataset.categoryFilter, chip);
  });

  document.getElementById("menuItemsGrid")?.addEventListener("click", (e) => {
      const tile = e.target.closest(".menu-item-tile");
      if (!tile) return;
      addOrderItem(tile.dataset.itemName, parseFloat(tile.dataset.itemPrice));
  });

  document.getElementById("orderRows")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-qty-step]");
      if (!btn) return;
      adjustOrderQty(btn, Number(btn.dataset.qtyStep));
  });

  document.getElementById("confirmSendToKitchenBtn")?.addEventListener("click", confirmSendToKitchen);
});
})();


// ---- order-takeaway-add.js ----
// ---- order-takeaway-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function recalcToTotals() {
    if (!document.getElementById("toSubtotal")) return;
    let subtotal = 0;
    document.querySelectorAll(".to-item").forEach((row) => {
      const price = parseFloat(row.dataset.price);
      const qty = parseInt(row.querySelector(".to-qty").value, 10);
      const lineTotal = price * qty;
      row.querySelector(".to-line-total").textContent = `$${lineTotal.toFixed(2)}`;
      subtotal += lineTotal;
    });
    const tax = subtotal * 0.08;
    document.getElementById("toSubtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("toTax").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("toTotal").textContent = `$${(subtotal + tax).toFixed(2)}`;
  }

  window.wireQtyStepper("toItemsList", ".to-qty", recalcToTotals);
  window.wireRowRemove("toItemsList", ".to-item", recalcToTotals);

  function addTakeawayItem() {
    const list = document.getElementById("toItemsList");
    const row = document.createElement("div");
    row.className = "to-item flex items-center gap-3 p-2.5 rounded-lg";
    row.style.background = "var(--surface-sunken)";
    row.dataset.price = "9.00";
    row.innerHTML = `
      <span class="min-w-0 flex-1">
        <span class="block text-[12.5px] font-semibold truncate">Garden Salad</span>
        <span class="block text-[11px] u-color-text-tertiary">$9.00 each</span>
      </span>
      <div class="flex items-center gap-1 shrink-0">
        <button type="button" class="header-icon-btn !size-7" data-qty-step="-1"><i class="icon-minus text-[11px]"></i></button>
        <input type="text" class="to-qty w-9 text-center text-[12.5px] font-semibold bg-transparent outline-none" value="1" readonly>
        <button type="button" class="header-icon-btn !size-7" data-qty-step="1"><i class="icon-plus text-[11px]"></i></button>
      </div>
      <span class="to-line-total text-[12.5px] font-semibold w-16 text-end shrink-0">$9.00</span>
      <button type="button" class="header-icon-btn !size-7 shrink-0" data-row-remove><i class="icon-trash-2 text-[12px] u-color-color-danger-600"></i></button>
    `;
    list.appendChild(row);
    recalcToTotals();
  }

  function submitTakeaway() {
    const name = document.getElementById("toName").value.trim();
    const phone = document.getElementById("toPhone").value.trim();
    if (!name || !phone) {
      window.openModal("validationErrorModal");
      return;
    }
    document.getElementById("publishSuccessMsg").textContent = `The takeaway order for ${name} has been sent to the kitchen.`;
    window.openModal("publishSuccessModal");
  }

  document.getElementById("addTakeawayItemBtn")?.addEventListener("click", addTakeawayItem);
  document.getElementById("saveTakeawayDraftBtn")?.addEventListener("click", () => window.openModal("draftSavedModal"));
  document.getElementById("submitTakeawayBtn")?.addEventListener("click", submitTakeaway);

  recalcToTotals();
});
})();


// ---- order-view.js ----
// ---- order-view.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function markShipped() {
    window.closeModal("shipModal");
    const badge = document.getElementById("orderStatusBadge");
    badge.className = "badge-soft badge-primary !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-truck text-[9px]"></i>Shipped';
    window.showSuccess("Order marked as shipped", "Priya Sharma has been notified with tracking details.");
  }

  function resendConfirmation() {
    window.showSuccess("Confirmation resent", "The order confirmation email was resent to priya.sharma@gmail.com.");
  }

  function issueRefund() {
    window.closeModal("refundModal");
    window.showSuccess("Refund issued", "$315.22 has been refunded to the original payment method.");
  }

  function cancelOrder() {
    window.closeModal("cancelOrderModal");
    const badge = document.getElementById("orderStatusBadge");
    badge.className = "badge-soft badge-danger !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-x text-[9px]"></i>Cancelled';
    window.showSuccess("Order cancelled", "Order #ORD-20481 has been cancelled and refunded.");
  }

  document.getElementById("markShippedBtn")?.addEventListener("click", markShipped);
  document.getElementById("issueRefundBtn")?.addEventListener("click", issueRefund);
  document.getElementById("cancelOrderConfirmBtn")?.addEventListener("click", cancelOrder);
});
})();


// ---- order-workspace.js ----
// ---- order-workspace.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function markShipped() {
    window.closeModal("shipModal");
    const badge = document.getElementById("orderStatusBadge");
    badge.className = "badge-soft badge-primary !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-truck text-[9px]"></i>Shipped';
    window.showSuccess("Handed off to carrier", "Diane Whitfield has been notified with tracking details.");
  }

  function updatePickPack() {
    window.closeModal("pickPackModal");
    window.showSuccess("Progress saved", "Pick & pack checklist has been updated.");
  }

  function addItem() {
    window.closeModal("addItemModal");
    window.showSuccess("Item added", "The line item has been added to this order.");
  }

  function addTag() {
    window.closeModal("addTagModal");
    window.showSuccess("Tag added", "The new tag has been applied to this order.");
  }

  window.markShipped = markShipped;
  window.updatePickPack = updatePickPack;
  window.addItem = addItem;
  window.addTag = addTag;

  document.getElementById("confirmHandoffBtn")?.addEventListener("click", markShipped);
  document.getElementById("savePickPackBtn")?.addEventListener("click", updatePickPack);
  document.getElementById("addItemBtn")?.addEventListener("click", addItem);
  document.getElementById("addTagBtn")?.addEventListener("click", addTag);
});
})();


// ---- patient-profile.js ----
// ---- patient-profile.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function savePrescription() {
    window.closeModal("prescriptionModal");
    window.showSuccess("Prescription saved", "The new prescription has been added to Renee Foster's medication list.");
  }

  function dischargePatient() {
    window.closeModal("dischargeModal");
    const badge = document.getElementById("patientStatusBadge");
    badge.className = "badge-soft badge-neutral !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-check-check text-[9px]"></i>Discharged';
    window.showSuccess("Patient discharged", "Renee Foster has been discharged and the admission record is closed.");
  }

  window.savePrescription = savePrescription;
  window.dischargePatient = dischargePatient;

  document.getElementById("savePrescriptionBtn")?.addEventListener("click", savePrescription);
  document.getElementById("dischargePatientBtn")?.addEventListener("click", dischargePatient);
});
})();


// ---- payment-gateway-add.js ----
// ---- payment-gateway-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveGatewayDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishGatewayBtn")?.addEventListener("click", function () {
    const provider = document.getElementById("pgProvider").value;
    const pub = document.getElementById("pgPublicKey").value.trim();
    const secret = document.getElementById("pgSecretKey").value.trim();
    if (!provider || !pub || !secret) {
      window.openModal("validationErrorModal");
      return;
    }
    document.getElementById("publishSuccessMsg").textContent = `${provider} has been connected successfully.`;
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- payslip-details.js ----
// ---- payslip-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function downloadPayslip() {
    window.closeModal("downloadModal");
    window.showSuccess("Payslip downloading", "PS-2026-0731 is being generated and will download shortly.");
  }

  function submitDispute() {
    window.closeModal("disputeModal");
    window.showSuccess("Dispute submitted", "The payroll team has been notified and will review your payslip.");
  }

  document.getElementById("downloadPayslipBtn")?.addEventListener("click", downloadPayslip);
  document.getElementById("submitDisputeBtn")?.addEventListener("click", submitDispute);
});
})();


// ---- pharmacy-purchase-order-add.js ----
// ---- pharmacy-purchase-order-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function recalcPoTotals() {
    if (!document.getElementById("poItemCount")) return;
    let total = 0;
    let count = 0;
    document.querySelectorAll(".po-item").forEach((row) => {
      const price = parseFloat(row.dataset.price);
      const qty = parseInt(row.querySelector(".po-qty").value, 10) || 0;
      const lineTotal = price * qty;
      row.querySelector(".po-line-total").textContent = `$${lineTotal.toFixed(2)}`;
      total += lineTotal;
      count++;
    });
    document.getElementById("poItemCount").textContent = count;
    document.getElementById("poTotal").textContent = `$${total.toFixed(2)}`;
  }

  window.wireRowRemove("poItemsList", ".po-item", recalcPoTotals);

  function addPoItem() {
    const list = document.getElementById("poItemsList");
    const row = document.createElement("div");
    row.className = "po-item flex items-center gap-3 p-2.5 rounded-lg";
    row.style.background = "var(--surface-sunken)";
    row.dataset.price = "0.05";
    row.innerHTML = `
      <span class="min-w-0 flex-1">
        <span class="block text-[12.5px] font-semibold truncate">Insulin Glargine</span>
        <span class="block text-[11px] u-color-text-tertiary">$0.05 per unit</span>
      </span>
      <input type="number" class="po-qty w-20 text-center text-[12.5px] font-semibold rounded-lg py-1.5 outline-none u-background-surface-base_border-1px-solid-border-subtle" value="100">
      <span class="po-line-total text-[12.5px] font-semibold w-20 text-end shrink-0">$5.00</span>
      <button type="button" class="header-icon-btn !size-7 shrink-0" data-row-remove><i class="icon-trash-2 text-[12px] u-color-color-danger-600"></i></button>
    `;
    list.appendChild(row);
    recalcPoTotals();
  }

  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("po-qty")) recalcPoTotals();
  });

  function submitPo() {
    const supplier = document.getElementById("poSupplier").value;
    if (!supplier) {
      window.openModal("validationErrorModal");
      return;
    }
    document.getElementById("publishSuccessMsg").textContent = `The purchase order to ${supplier} has been created.`;
    window.openModal("publishSuccessModal");
  }

  document.getElementById("addPoItemBtn")?.addEventListener("click", addPoItem);
  document.getElementById("savePoDraftBtn")?.addEventListener("click", () => window.openModal("draftSavedModal"));
  document.getElementById("submitPoBtn")?.addEventListener("click", submitPo);

  recalcPoTotals();
});
})();


// ---- pharmacy-supplier-add.js ----
// ---- pharmacy-supplier-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveSupplierDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishSupplierBtn")?.addEventListener("click", function () {
    const name = document.getElementById("psName").value.trim();
    const email = document.getElementById("psEmail").value.trim();
    if (!name || !email) {
      window.openModal("validationErrorModal");
      return;
    }
    document.getElementById("publishSuccessMsg").textContent = `"${name}" has been added to your suppliers.`;
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- poll-add.js ----
// ---- poll-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function addPollOption() {
    const wrap = document.getElementById("pollOptions");
    const count = wrap.children.length + 1;
    const row = document.createElement("div");
    row.className = "flex items-center gap-2";
    row.innerHTML = `<input type="text" placeholder="Option ${count}" class="w-full field-control"><button type="button" class="header-icon-btn !size-8" data-row-remove><i class="icon-x text-[12px]"></i></button>`;
    wrap.appendChild(row);
  }

  function savePollDraft() {
    window.openModal("draftSavedModal");
  }

  function publishPoll() {
    const question = document.getElementById("pollQuestion").value.trim();
    const options = Array.from(document.querySelectorAll("#pollOptions input")).map((i) => i.value.trim()).filter(Boolean);
    const errors = [];
    if (!question) errors.push("Question is required.");
    if (options.length < 2) errors.push("At least 2 answer options are required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't launch yet";
      message.textContent = "Please fix the following before launching:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Poll launched";
      message.textContent = `"${question}" is now live for learners to vote.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  }

  window.addPollOption = addPollOption;
  window.savePollDraft = savePollDraft;
  window.publishPoll = publishPoll;

  window.wireRowRemove("pollOptions", ".flex.items-center.gap-2", null);

  document.getElementById("addPollOptionBtn")?.addEventListener("click", addPollOption);
  document.getElementById("savePollDraftBtn")?.addEventListener("click", savePollDraft);
  document.getElementById("publishPollBtn")?.addEventListener("click", publishPoll);
});
})();


// ---- portfolio-asset-add.js ----
// ---- portfolio-asset-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveAssetDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishAssetBtn")?.addEventListener("click", function () {
    const symbol = document.getElementById("paSymbol").value.trim();
    const qty = document.getElementById("paQty").value;
    if (!symbol || !qty) {
      window.openModal("validationErrorModal");
      return;
    }
    document.getElementById("publishSuccessMsg").textContent = `${symbol} has been added to your portfolio.`;
    window.openModal("publishSuccessModal");
  });
});
})();


// ---- portfolio-explorer.js ----
// ---- portfolio-explorer.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-view-coin]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.openCoinModal(btn.dataset.coinName, btn.dataset.coinTicker, btn.dataset.coinPrice);
    });
  });

  document.querySelectorAll('[data-alert-coin]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.openAlertFormModal(btn.dataset.coinName, btn.dataset.coinTicker, btn.dataset.coinPrice);
    });
  });

  document.querySelectorAll('[data-watchlist-coin]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.showToast("watchlistToast", `${btn.dataset.coinName} added to watchlist`, { textId: "watchlistToastText" });
    });
  });
});
})();


// ---- pricing-rule-add.js ----
// ---- pricing-rule-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveRuleDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishRuleBtn")?.addEventListener("click", function () {
    const zone = document.getElementById("prZone").value.trim();
    const baseFee = document.getElementById("prBaseFee").value.trim();
    const errors = [];
    if (!zone) errors.push("Zone Name is required.");
    if (!baseFee || isNaN(Number(baseFee)) || Number(baseFee) < 0) errors.push("A valid Base Fee is required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't save yet";
      message.textContent = "Please fix the following before saving:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Pricing rule saved";
      message.textContent = `"${zone}" pricing rule is now live.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- product-add.js ----
// ---- product-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function renderVariantChip(value) {
    const chip = document.createElement("span");
    chip.className = "inline-flex items-center gap-1 pl-2 pr-1 py-1 rounded-full text-[11px] font-semibold text-white";
    chip.style.background = "var(--color-primary-600)";
    chip.textContent = value;
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "grid place-items-center size-3.5 rounded-full hover:bg-white/20";
    removeBtn.innerHTML = '<i class="icon-x text-[8px]"></i>';
    removeBtn.onclick = () => chip.remove();
    chip.appendChild(removeBtn);
    return chip;
  }

  function openVariantOptionModal(name, values) {
    document.getElementById("variantOptionModalTitle").textContent = name ? `Edit "${name}" Option` : "Add Variant Option";
    document.getElementById("variantOptionName").value = name || "";
    const valuesWrap = document.getElementById("variantOptionValues");
    const input = document.getElementById("variantOptionValueInput");
    valuesWrap.querySelectorAll("span").forEach((s) => s.remove());
    (values || []).forEach((v) => valuesWrap.insertBefore(renderVariantChip(v), input));
    input.value = "";
    window.openModal("variantOptionModal");
  }

  document.getElementById("variantOptionValueInput")?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || !e.target.value.trim()) return;
    e.preventDefault();
    const wrap = document.getElementById("variantOptionValues");
    wrap.insertBefore(renderVariantChip(e.target.value.trim()), e.target);
    e.target.value = "";
  });

  function openProductPreview() {
    const name = document.getElementById("pName").value.trim();
    const desc = document.getElementById("pDesc").value.trim();
    const price = document.getElementById("pPrice").value.trim();
    const category = document.getElementById("pCategory").value;

    document.getElementById("previewName").textContent = name || "Wireless Noise-Cancelling Headphones";
    document.getElementById("previewDesc").textContent = desc || "Describe the product's features, materials, and benefits…";
    document.getElementById("previewPrice").textContent = price ? `$${Number(price).toFixed(2)}` : "$0.00";
    document.getElementById("previewCategory").textContent = category || "Electronics";

    window.openModal("productPreviewModal");
  }

  function saveProductDraft() {
    window.openModal("draftSavedModal");
  }

  function publishProduct() {
    const name = document.getElementById("pName").value.trim();
    const price = document.getElementById("pPrice").value.trim();
    const errors = [];
    if (!name) errors.push("Product Name is required.");
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errors.push("A valid Price is required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't publish yet";
      message.textContent = "Please fix the following before publishing:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Product published";
      message.textContent = `"${name}" is now live on your storefront.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  }

  window.openVariantOptionModal = openVariantOptionModal;
  window.openProductPreview = openProductPreview;
  window.saveProductDraft = saveProductDraft;
  window.publishProduct = publishProduct;

  document.querySelectorAll("[data-variant-option-name]").forEach((el) => {
    el.addEventListener("click", () => {
      const values = el.dataset.variantOptionValues ? el.dataset.variantOptionValues.split(",") : [];
      openVariantOptionModal(el.dataset.variantOptionName, values);
    });
  });
  document.getElementById("addVariantOptionBtn")?.addEventListener("click", () => {
    openVariantOptionModal("", []);
  });

  document.querySelectorAll("[data-select-on-focus]").forEach((el) => {
    el.addEventListener("focus", () => el.select());
  });

  document.getElementById("saveProductDraftBtn")?.addEventListener("click", saveProductDraft);
  document.getElementById("publishProductBtn")?.addEventListener("click", publishProduct);
});
})();


// ---- product-details.js ----
// ---- product-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const thumbs = Array.from(document.querySelectorAll(".pd-thumb"));
  const mainImage = document.getElementById("pdMainImage");
  if (!thumbs.length || !mainImage) return;

  const activate = (index) => {
    const thumb = thumbs[index];
    mainImage.src = thumb.dataset.src;
    thumbs.forEach((t) => {
      t.classList.remove("is-active");
      t.style.borderColor = "transparent";
    });
    thumb.classList.add("is-active");
    thumb.style.borderColor = "var(--color-primary-500)";
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => activate(index));
  });

  const step = (delta) => {
    const current = thumbs.findIndex((t) => t.classList.contains("is-active"));
    activate((current + delta + thumbs.length) % thumbs.length);
  };
  document.getElementById("pdPrevBtn")?.addEventListener("click", () => step(-1));
  document.getElementById("pdNextBtn")?.addEventListener("click", () => step(1));
});
})();



// ---- project-add.js ----
// ---- project-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll(".priority-pick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".priority-pick-btn").forEach((b) => { b.style.opacity = "0.5"; b.classList.remove("is-active"); });
      btn.style.opacity = "1";
      btn.classList.add("is-active");
    });
  });

  document.getElementById("saveProjectDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishProjectBtn")?.addEventListener("click", function () {
    const name = document.getElementById("projectName").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!name) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't create yet";
      message.textContent = "Please fix the following before creating this project:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Project Name is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Project created";
      message.textContent = `"${name}" is now live on your projects board.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- purchase-order-add.js ----
// ---- purchase-order-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function recalcPOLine(row) {
    const qty = parseFloat(row.querySelector(".po-qty").value) || 0;
    const price = parseFloat(row.querySelector(".po-price").value) || 0;
    const tax = parseFloat(row.querySelector(".po-tax").value) || 0;
    const subtotal = qty * price * (1 + tax / 100);
    row.querySelector(".po-subtotal").textContent = "$" + subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return { base: qty * price, tax: qty * price * (tax / 100) };
  }

  function recalcPOTotals() {
    let subtotal = 0, taxTotal = 0;
    document.querySelectorAll("#poLineItems tr").forEach((row) => {
      const { base, tax } = recalcPOLine(row);
      subtotal += base;
      taxTotal += tax;
    });
    const discount = parseFloat(document.getElementById("poDiscount").value) || 0;
    const shipping = parseFloat(document.getElementById("poShipping").value) || 0;
    const total = subtotal + taxTotal - discount + shipping;

    document.getElementById("poSubtotal").textContent = "$" + subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("poTax").textContent = "$" + taxTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("poTotal").textContent = "$" + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  document.getElementById("poLineItems")?.addEventListener("input", recalcPOTotals);
  document.getElementById("poDiscount")?.addEventListener("input", recalcPOTotals);
  document.getElementById("poShipping")?.addEventListener("input", recalcPOTotals);

  window.wireRowRemove("poLineItems", "tr", recalcPOTotals, { minRows: 1 });

  function addPOLine() {
    const tbody = document.getElementById("poLineItems");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" placeholder="Product name" class="w-full py-1.5 px-2 rounded-lg text-[12.5px] outline-none u-background-surface-sunken_border-1px-solid-border-subtle"></td>
      <td><input type="number" value="1" class="po-qty w-full py-1.5 px-2 rounded-lg text-[12.5px] outline-none text-center u-background-surface-sunken_border-1px-solid-border-subtle"></td>
      <td><input type="text" value="0.00" class="po-price w-full py-1.5 px-2 rounded-lg text-[12.5px] outline-none text-center u-background-surface-sunken_border-1px-solid-border-subtle"></td>
      <td><input type="text" value="0" class="po-tax w-full py-1.5 px-2 rounded-lg text-[12.5px] outline-none text-center u-background-surface-sunken_border-1px-solid-border-subtle"></td>
      <td class="po-subtotal font-semibold">$0.00</td>
      <td><button type="button" class="header-icon-btn !size-7" data-row-remove><i class="icon-x text-[13px]"></i></button></td>
    `;
    tbody.appendChild(row);
  }

  function openPOPreview() {
    document.getElementById("poPreviewVendor").textContent = document.getElementById("poVendor").value;
    document.getElementById("poPreviewTotal").textContent = document.getElementById("poTotal").textContent;
    window.openModal("poPreviewModal");
  }

  function submitPO() {
    window.openModal("poSubmitModal");
  }

  document.getElementById("openPOPreviewBtn")?.addEventListener("click", openPOPreview);
  document.getElementById("addPOLineBtn")?.addEventListener("click", addPOLine);
  document.getElementById("submitPOBtn")?.addEventListener("click", submitPO);
});
})();


// ---- purchase-orders.js ----
// ---- purchase-orders.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const PO_DATA = [
    { no: "PO-8821", supplier: "Nova Components Ltd", items: "12 items", amount: "$48,200", delivery: "Jul 28, 2026", status: "Ordered", statusBadge: "badge-info", statusIcon: "icon-clock", payment: "Partial", paymentBadge: "badge-warning" },
    { no: "PO-8820", supplier: "Cedarline Textiles", items: "6 items", amount: "$18,900", delivery: "Jul 24, 2026", status: "Pending Approval", statusBadge: "badge-neutral", statusIcon: "icon-hourglass", payment: "Unpaid", paymentBadge: "badge-danger" },
    { no: "PO-8819", supplier: "Solstice Electronics", items: "24 items", amount: "$96,400", delivery: "Jul 19, 2026", status: "Received", statusBadge: "badge-success", statusIcon: "icon-check", payment: "Paid", paymentBadge: "badge-success" },
    { no: "PO-8818", supplier: "Harbor Freight Supply", items: "8 items", amount: "$12,340", delivery: "Jul 15, 2026", status: "Received", statusBadge: "badge-success", statusIcon: "icon-check", payment: "Paid", paymentBadge: "badge-success" },
    { no: "PO-8817", supplier: "Northline Packaging Co.", items: "30 items", amount: "$54,900", delivery: "Jul 12, 2026", status: "Received", statusBadge: "badge-success", statusIcon: "icon-check", payment: "Paid", paymentBadge: "badge-success" },
    { no: "PO-8816", supplier: "Nova Components Ltd", items: "4 items", amount: "$9,200", delivery: "Jul 10, 2026", status: "Cancelled", statusBadge: "badge-danger", statusIcon: "icon-x", payment: "Refunded", paymentBadge: "badge-neutral" },
  ];

  const tbody = document.getElementById("poTableBody");
  if (!tbody) return;
  PO_DATA.forEach((po, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" class="row-select size-4 rounded u-accent-color-color-primary-600"></td>
      <td><button type="button" class="font-semibold hover:underline u-color-color-primary-600" data-po-view="${i}">${po.no}</button></td>
      <td>${po.supplier}</td>
      <td class="u-color-text-tertiary">${po.items}</td>
      <td class="font-semibold">${po.amount}</td>
      <td class="u-color-text-tertiary">${po.delivery}</td>
      <td><span class="badge-soft ${po.statusBadge}"><i class="${po.statusIcon} text-[9px]"></i>${po.status}</span></td>
      <td><span class="badge-soft ${po.paymentBadge}">${po.payment}</span></td>
      <td>
        <div class="hs-dropdown [--placement:bottom-end] relative">
          <button type="button" class="hs-dropdown-toggle header-icon-btn !size-8" aria-haspopup="menu" aria-expanded="false"><i class="icon-more-vertical text-[14px]"></i></button>
          <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-1 w-44 surface-card !p-1.5 z-50" role="menu" aria-orientation="vertical">
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-po-view="${i}"><i class="icon-eye text-[13px]"></i>View</button>
            <a href="purchase-order-add" class="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-pencil text-[13px]"></i>Edit</a>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-title="Approve purchase order?" data-title-bulk="Approve purchase orders?" data-message="The purchase order will be approved and sent to the vendor." data-icon="icon-check" data-bg="var(--color-success-100)" data-color="var(--color-success-700)" data-confirm-bg="var(--color-success-600)" data-confirm-label="Approve" data-action-modal><i class="icon-check text-[13px]"></i>Approve</button>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-title="Mark as received?" data-title-bulk="Mark as received?" data-message="Confirm that all items for this purchase order have arrived at the warehouse." data-icon="icon-package-check" data-bg="var(--color-primary-100)" data-color="var(--color-primary-700)" data-confirm-bg="var(--color-primary-600)" data-confirm-label="Mark Received" data-action-modal><i class="icon-package-check text-[13px]"></i>Mark Received</button>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-print-page><i class="icon-printer text-[13px]"></i>Print</button>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-po-email="${i}"><i class="icon-mail text-[13px]"></i>Email Supplier</button>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-open-share-modal><i class="icon-share-2 text-[13px]"></i>Share</button>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-title="Duplicate purchase order?" data-title-bulk="Duplicate purchase orders?" data-message="A new draft will be created with the same items and supplier." data-icon="icon-copy" data-bg="var(--color-primary-100)" data-color="var(--color-primary-700)" data-confirm-bg="var(--color-primary-600)" data-confirm-label="Duplicate" data-action-modal><i class="icon-copy text-[13px]"></i>Duplicate</button>
            <div class="h-px my-1 u-background-border-subtle"></div>
            <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start u-color-color-danger-600" data-title="Delete purchase order?" data-title-bulk="Delete purchase orders?" data-message="This action cannot be undone. The purchase order will be permanently removed." data-icon="icon-trash-2" data-bg="var(--color-danger-100)" data-color="var(--color-danger-700)" data-confirm-bg="var(--color-danger-600)" data-confirm-label="Delete" data-action-modal><i class="icon-trash-2 text-[13px]"></i>Delete</button>
          </div>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".fixed.inset-0.z-50:not(.hidden)").forEach((m) => m.classList.add("hidden"));
  });

  function viewPO(i) {
    const po = PO_DATA[i];
    document.getElementById("poDetailNumber").textContent = po.no;
    document.getElementById("poDetailSupplier").textContent = po.supplier;
    document.getElementById("poDetailItems").textContent = po.items;
    document.getElementById("poDetailAmount").textContent = po.amount;
    document.getElementById("poDetailDelivery").textContent = po.delivery;
    document.getElementById("poDetailStatus").innerHTML = `<span class="badge-soft ${po.statusBadge}"><i class="${po.statusIcon} text-[9px]"></i>${po.status}</span>`;
    document.getElementById("poDetailPayment").innerHTML = `<span class="badge-soft ${po.paymentBadge}">${po.payment}</span>`;
    window.openModal("poDetailModal");
  }

  function emailPO(i) {
    const po = PO_DATA[i];
    document.getElementById("poEmailTo").value = po.supplier.toLowerCase().replace(/[^a-z0-9]+/g, "") + "@vendor.com";
    document.getElementById("poEmailSubject").value = `Purchase Order ${po.no} — ${po.supplier}`;
    window.openModal("poEmailModal");
  }

  document.addEventListener("click", function (e) {
    const viewBtn = e.target.closest("[data-po-view]");
    if (viewBtn) { viewPO(Number(viewBtn.dataset.poView)); return; }
    const emailBtn = e.target.closest("[data-po-email]");
    if (emailBtn) { emailPO(Number(emailBtn.dataset.poEmail)); return; }
  });
});
})();


// ---- question-bank-add.js ----
// ---- question-bank-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function publishQuestion() {
    const text = document.getElementById("qText").value.trim();
    const topic = document.getElementById("qTopic").value.trim();
    if (!text || !topic) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  }

  document.getElementById("publishQuestionBtn")?.addEventListener("click", publishQuestion);
});
})();


// ---- quiz-builder.js ----
// ---- quiz-builder.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function updateQuizStats() {
    if (!document.getElementById("statQuestionCount")) return;
    const cards = document.querySelectorAll("#quizQuestions [data-question-card]");
    document.getElementById("statQuestionCount").textContent = cards.length;
    let total = 0;
    cards.forEach((card) => { total += parseInt(card.getAttribute("data-points"), 10) || 0; });
    document.getElementById("statTotalPoints").textContent = total + " pts";
  }
  function openAddQuestionModal() {
    document.getElementById("newQuestionText").value = "";
    document.getElementById("newQuestionPoints").value = "10";
    document.getElementById("newQuestionError").classList.add("hidden");
    document.getElementById("newQuestionOptions").innerHTML = `
      <div class="flex items-center gap-2">
          <input type="radio" name="newQuestionCorrect" checked class="size-4 shrink-0 u-accent-color-color-success-600">
          <input type="text" placeholder="Option 1 (correct)" class="w-full field-control">
      </div>
      <div class="flex items-center gap-2">
          <input type="radio" name="newQuestionCorrect" class="size-4 shrink-0 u-accent-color-color-success-600">
          <input type="text" placeholder="Option 2" class="w-full field-control">
      </div>
      <div class="flex items-center gap-2">
          <input type="radio" name="newQuestionCorrect" class="size-4 shrink-0 u-accent-color-color-success-600">
          <input type="text" placeholder="Option 3" class="w-full field-control">
      </div>`;
    window.openModal("addQuestionModal");
  }
  function closeAddQuestionModal() {
    window.closeModal("addQuestionModal");
  }
  function addQuestionOption() {
    const wrap = document.getElementById("newQuestionOptions");
    const count = wrap.children.length + 1;
    const row = document.createElement("div");
    row.className = "flex items-center gap-2";
    row.innerHTML = `
      <input type="radio" name="newQuestionCorrect" class="size-4 shrink-0 u-accent-color-color-success-600">
      <input type="text" placeholder="Option ${count}" class="w-full field-control">`;
    wrap.appendChild(row);
  }
  function removeQuestion(btn) {
    const card = btn.closest("[data-question-card]");
    if (card) card.remove();
    renumberQuestions();
    updateQuizStats();
  }
  function renumberQuestions() {
    document.querySelectorAll("#quizQuestions [data-question-card] .badge-soft.badge-primary").forEach((badge, i) => {
      badge.textContent = "Question " + (i + 1);
    });
  }
  function submitAddQuestion() {
    const text = document.getElementById("newQuestionText").value.trim();
    const errorEl = document.getElementById("newQuestionError");
    errorEl.classList.toggle("hidden", !!text);
    if (!text) return;

    const points = parseInt(document.getElementById("newQuestionPoints").value, 10) || 10;

    const optionRows = Array.from(document.querySelectorAll("#newQuestionOptions > div"));
    const options = optionRows
      .map((row) => ({
        text: row.querySelector("input[type='text']").value.trim(),
        correct: row.querySelector("input[type='radio']").checked,
      }))
      .filter((opt) => opt.text);

    const list = document.getElementById("quizQuestions");
    const qNum = list.querySelectorAll("[data-question-card]").length + 1;

    const section = document.createElement("section");
    section.className = "surface-card p-5";
    section.setAttribute("data-question-card", "");
    section.setAttribute("data-points", String(points));
    section.innerHTML = `
      <div class="flex items-start justify-between gap-3 mb-3.5">
          <div class="flex items-center gap-3">
              <span class="grid place-items-center size-8 rounded-lg shrink-0 u-color-text-tertiary"><i class="icon-grip-vertical text-[14px]"></i></span>
              <div class="flex items-center gap-2 flex-wrap">
                  <span class="badge-soft badge-primary">Question ${qNum}</span>
                  <span class="badge-soft badge-neutral">Multiple Choice</span>
                  <span class="badge-soft badge-neutral question-points">${points} pts</span>
              </div>
          </div>
          <div class="flex items-center gap-1">
              <button type="button" class="header-icon-btn !size-7" title="Duplicate"><i class="icon-copy text-[12px]"></i></button>
              <button type="button" class="header-icon-btn !size-7" title="Delete" data-remove-question><i class="icon-trash-2 text-[12px]"></i></button>
          </div>
      </div>
      <input type="text" value="${text.replace(/"/g, "&quot;")}" class="w-full py-2 px-2.5 rounded-lg text-[12.5px] outline-none mb-3" style="background: var(--surface-sunken); border: 1px solid var(--border-subtle);">
      <div class="space-y-2">
          ${options
            .map(
              (opt) => `<label class="flex items-center gap-2 p-2.5 rounded-lg text-[12px]" style="background: ${opt.correct ? "var(--color-success-50)" : "var(--surface-sunken)"};"><input type="radio" ${opt.correct ? "checked" : ""} class="size-4" style="accent-color: var(--color-success-600);">${opt.text.replace(/</g, "&lt;")}${opt.correct ? '<i class="icon-check-circle-2 text-[13px] ms-auto" style="color: var(--color-success-600);"></i>' : ""}</label>`
            )
            .join("")}
      </div>`;
    list.appendChild(section);

    closeAddQuestionModal();
    updateQuizStats();
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAddQuestionModal();
  });
  updateQuizStats();

  window.openAddQuestionModal = openAddQuestionModal;
  window.closeAddQuestionModal = closeAddQuestionModal;
  window.addQuestionOption = addQuestionOption;
  window.removeQuestion = removeQuestion;
  window.submitAddQuestion = submitAddQuestion;

  document.getElementById("addQuestionBtn")?.addEventListener("click", openAddQuestionModal);
  document.getElementById("addQuestionOptionBtn")?.addEventListener("click", addQuestionOption);
  document.getElementById("submitAddQuestionBtn")?.addEventListener("click", submitAddQuestion);
  document.getElementById("quizQuestions")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-question]");
    if (btn) removeQuestion(btn);
  });
});
})();


// ---- quotations.js ----
// ---- quotations.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const QUOTE_DATA = [
    { no: "QT-3481", customer: "Northwind Corp", items: "6 items", amount: "$18,400", discount: "5%", status: "Pending", badge: "badge-neutral", expiry: "Jul 28, 2026", created: "Jul 14, 2026", owner: "Maya Ross", probability: 60, terms: "Net 30" },
    { no: "QT-3480", customer: "Vantage Retail", items: "12 items", amount: "$42,000", discount: "10%", status: "Approved", badge: "badge-success", expiry: "Aug 4, 2026", created: "Jul 9, 2026", owner: "Daniel Cho", probability: 100, terms: "Net 15" },
    { no: "QT-3479", customer: "Orbit Logistics", items: "3 items", amount: "$9,600", discount: "&mdash;", status: "Rejected", badge: "badge-danger", expiry: "Jul 22, 2026", created: "Jul 5, 2026", owner: "Priya Nair", probability: 0, terms: "Net 30" },
    { no: "QT-3478", customer: "BrightPath Inc", items: "8 items", amount: "$27,800", discount: "7.5%", status: "Expired", badge: "badge-warning", expiry: "Jul 10, 2026", created: "Jun 20, 2026", owner: "Maya Ross", probability: 0, terms: "Net 45" },
    { no: "QT-3477", customer: "Cascade Manufacturing", items: "14 items", amount: "$61,200", discount: "12%", status: "Approved", badge: "badge-success", expiry: "Aug 8, 2026", created: "Jul 12, 2026", owner: "Leo Fischer", probability: 100, terms: "Net 60" },
    { no: "QT-3476", customer: "Northwind Corp", items: "2 items", amount: "$5,400", discount: "&mdash;", status: "Pending", badge: "badge-neutral", expiry: "Jul 30, 2026", created: "Jul 18, 2026", owner: "Daniel Cho", probability: 45, terms: "Net 30" },
    { no: "QT-3475", customer: "Silverline Retail Group", items: "9 items", amount: "$33,150", discount: "8%", status: "Approved", badge: "badge-success", expiry: "Aug 2, 2026", created: "Jul 8, 2026", owner: "Priya Nair", probability: 100, terms: "Net 15" },
    { no: "QT-3474", customer: "Vantage Retail", items: "5 items", amount: "$14,720", discount: "&mdash;", status: "Rejected", badge: "badge-danger", expiry: "Jul 18, 2026", created: "Jul 2, 2026", owner: "Leo Fischer", probability: 0, terms: "Net 30" },
    { no: "QT-3473", customer: "Orbit Logistics", items: "20 items", amount: "$88,400", discount: "15%", status: "Approved", badge: "badge-success", expiry: "Aug 12, 2026", created: "Jul 15, 2026", owner: "Maya Ross", probability: 100, terms: "Net 60" },
    { no: "QT-3472", customer: "BrightPath Inc", items: "7 items", amount: "$21,900", discount: "6%", status: "Pending", badge: "badge-neutral", expiry: "Jul 26, 2026", created: "Jul 16, 2026", owner: "Daniel Cho", probability: 70, terms: "Net 30" },
    { no: "QT-3471", customer: "Cascade Manufacturing", items: "4 items", amount: "$12,300", discount: "&mdash;", status: "Approved", badge: "badge-success", expiry: "Aug 6, 2026", created: "Jul 11, 2026", owner: "Priya Nair", probability: 100, terms: "Net 45" },
    { no: "QT-3470", customer: "Silverline Retail Group", items: "11 items", amount: "$47,650", discount: "9%", status: "Expired", badge: "badge-warning", expiry: "Jul 8, 2026", created: "Jun 18, 2026", owner: "Leo Fischer", probability: 0, terms: "Net 30" },
  ];

  const QUOTE_STATUS_ICON = { Pending: "icon-clock-4", Approved: "icon-check-check", Rejected: "icon-x-circle", Expired: "icon-hourglass" };
  let quoteFilter = "All";

  function daysUntil(dateStr) {
    const d = new Date(dateStr.replace("&mdash;", ""));
    if (isNaN(d)) return null;
    const diff = Math.ceil((d - new Date("2026-07-21")) / 86400000);
    return diff;
  }

  function hashIndex(str, mod) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h % mod;
  }

  function avatarSrc(name, poolSize) {
    const n = (hashIndex(name, poolSize) + 1).toString().padStart(2, "0");
    return `build/img/avatar/avatar-${n}.jpg`;
  }

  function renderQuoteWidgets() {
    const grid = document.getElementById("quoteWidgetGrid");
    if (!grid) return;
    grid.innerHTML = "";
    QUOTE_DATA.forEach((q, i) => {
      if (quoteFilter !== "All" && q.status !== quoteFilter) return;
      const ownerAvatar = avatarSrc(q.owner, 29);
      const left = daysUntil(q.expiry);
      const isLive = q.status === "Pending" || q.status === "Approved";
      let daysLabel, daysTone;
      if (!isLive) {
        daysLabel = q.status === "Rejected" ? "Closed lost" : "Closed";
        daysTone = "u-color-text-tertiary";
      } else if (left === null) {
        daysLabel = "&mdash;";
        daysTone = "u-color-text-tertiary";
      } else if (left < 0) {
        daysLabel = "Overdue";
        daysTone = "u-color-color-danger-600";
      } else if (left <= 3) {
        daysLabel = left + "d left";
        daysTone = "u-color-color-warning-600";
      } else {
        daysLabel = left + "d left";
        daysTone = "u-color-text-tertiary";
      }
      const card = document.createElement("div");
      card.className = "surface-card is-interactive !p-0 overflow-hidden relative";
      card.innerHTML = `
        <div class="p-4">
          <div class="flex items-start justify-between gap-2">
            <span class="flex items-center gap-2.5 min-w-0">
              <img src="${avatarSrc(q.customer, 29)}" alt="${q.customer}" class="size-10 rounded-xl object-cover shrink-0">
              <span class="min-w-0">
                <span class="block font-display font-bold text-[13.5px] truncate cursor-pointer hover:underline" data-quote-preview="${i}">${q.no}</span>
                <span class="block text-[11.5px] truncate u-color-text-tertiary">${q.customer}</span>
              </span>
            </span>
            <div class="hs-dropdown [--placement:bottom-end] relative shrink-0">
              <button type="button" class="hs-dropdown-toggle header-icon-btn !size-8" aria-haspopup="menu" aria-expanded="false"><i class="icon-more-vertical text-[14px]"></i></button>
              <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 opacity-0 hidden transition-[opacity,margin] duration mt-1 w-48 surface-card !p-1.5 z-50" role="menu" aria-orientation="vertical">
                <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-quote-preview="${i}"><i class="icon-eye text-[13px]"></i>Preview</button>
                <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-print-page><i class="icon-file-down text-[13px]"></i>Download PDF</button>
                <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-quote-action="duplicate" data-quote-index="${i}"><i class="icon-copy text-[13px]"></i>Duplicate</button>
                <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start" data-quote-action="approve" data-quote-index="${i}"><i class="icon-check text-[13px]"></i>Approve</button>
                <a href="invoice-workspace" class="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)]"><i class="icon-file-text text-[13px]"></i>Convert to Invoice</a>
                <div class="h-px my-1 u-background-border-subtle"></div>
                <button type="button" class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium hover:bg-[var(--surface-sunken)] text-start u-color-color-danger-600" data-quote-action="delete" data-quote-index="${i}"><i class="icon-trash-2 text-[13px]"></i>Delete</button>
              </div>
            </div>
          </div>

          <div class="flex items-end justify-between gap-2 mt-3.5 pt-3.5 border-t u-border-color-border-subtle">
            <div>
              <p class="text-[10px] u-color-text-tertiary">Quote Amount</p>
              <p class="font-display font-bold text-[19px] leading-none mt-1">${q.amount}</p>
            </div>
            <span class="badge-soft ${q.badge} flex items-center gap-1 shrink-0"><i class="${QUOTE_STATUS_ICON[q.status]} text-[11px]"></i>${q.status}</span>
          </div>

          <div class="grid grid-cols-2 gap-x-2.5 gap-y-2 mt-3.5 pt-3.5 border-t u-border-color-border-subtle text-[11.5px]">
            <span class="flex items-center gap-1.5 u-color-text-tertiary"><i class="icon-package text-[12px]"></i>${q.items}</span>
            <span class="flex items-center gap-1.5 u-color-text-tertiary"><i class="icon-percent text-[12px]"></i>${q.discount === "&mdash;" ? "No discount" : q.discount + " off"}</span>
            <span class="flex items-center gap-1.5 u-color-text-tertiary"><i class="icon-file-text text-[12px]"></i>${q.terms}</span>
            <span class="flex items-center gap-1.5 ${daysTone}"><i class="icon-hourglass text-[12px]"></i>${daysLabel}</span>
            <span class="flex items-center gap-1.5 u-color-text-tertiary"><i class="icon-calendar-plus text-[12px]"></i>Created ${q.created}</span>
            <span class="flex items-center gap-1.5 u-color-text-tertiary"><i class="icon-calendar-x text-[12px]"></i>Expires ${q.expiry}</span>
            <span class="col-span-2 flex items-center gap-1.5 u-color-text-tertiary"><i class="icon-percent-circle text-[12px]"></i>${q.probability}% win probability</span>
          </div>
        </div>

        <div class="px-4 py-2.5 flex items-center justify-between u-background-surface-sunken">
          <span class="flex items-center gap-1.5 min-w-0">
            <img src="${ownerAvatar}" alt="${q.owner}" class="size-5 rounded-full object-cover shrink-0">
            <span class="text-[11px] font-medium truncate u-color-text-secondary">${q.owner}</span>
          </span>
          <button type="button" class="text-[11.5px] font-semibold flex items-center gap-1 shrink-0 u-color-color-primary-600" data-quote-preview="${i}">View<i class="icon-arrow-right text-[11px]"></i></button>
        </div>
      `;
      grid.appendChild(card);
    });
    window.HSDropdown?.autoInit();
  }

  function setQuoteFilter(status, btn) {
    quoteFilter = status;
    document.querySelectorAll(".quote-filter-chip").forEach((el) => el.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderQuoteWidgets();
  }

  document.querySelectorAll(".quote-filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => setQuoteFilter(btn.dataset.quoteFilter, btn));
  });

  document.getElementById("quoteWidgetGrid")?.addEventListener("click", (e) => {
    const previewBtn = e.target.closest("[data-quote-preview]");
    if (previewBtn) {
      previewQuote(Number(previewBtn.dataset.quotePreview));
      return;
    }
    const actionBtn = e.target.closest("[data-quote-action]");
    if (actionBtn) {
      quoteAction(actionBtn.dataset.quoteAction, Number(actionBtn.dataset.quoteIndex));
    }
  });

  renderQuoteWidgets();

  function closeQuoteModal(id) { window.closeModal(id); }

  function previewQuote(i) {
    const q = QUOTE_DATA[i];
    document.getElementById("qPreviewNumber").textContent = q.no;
    document.getElementById("qPreviewCustomer").textContent = q.customer;
    document.getElementById("qPreviewItems").textContent = q.items;
    document.getElementById("qPreviewAmount").textContent = q.amount;
    document.getElementById("qPreviewDiscount").innerHTML = q.discount;
    document.getElementById("qPreviewStatus").innerHTML = `<span class="badge-soft ${q.badge}">${q.status}</span>`;
    document.getElementById("qPreviewExpiry").textContent = q.expiry;
    window.openModal("quotePreviewModal");
  }

  const QUOTE_ACTIONS = {
    duplicate: { title: "Duplicate quotation?", icon: "icon-copy", bg: "var(--color-primary-100)", color: "var(--color-primary-700)", confirmBg: "var(--color-primary-600)", confirmLabel: "Duplicate", message: (q) => `A new draft copy of ${q.no} for ${q.customer} will be created.` },
    approve: { title: "Approve quotation?", icon: "icon-check", bg: "var(--color-success-100)", color: "var(--color-success-700)", confirmBg: "var(--color-success-600)", confirmLabel: "Approve", message: (q) => `${q.no} (${q.amount}) will be marked as approved and the customer notified.` },
    delete: { title: "Delete quotation?", icon: "icon-trash-2", bg: "var(--color-danger-100)", color: "var(--color-danger-700)", confirmBg: "var(--color-danger-600)", confirmLabel: "Delete", message: (q) => `${q.no} will be permanently removed. This cannot be undone.` },
  };
  let pendingQuoteAction = null;

  function quoteAction(type, i) {
    pendingQuoteAction = { type, i };
    const q = QUOTE_DATA[i];
    const cfg = QUOTE_ACTIONS[type];
    const iconWrap = document.getElementById("qActionIcon");
    iconWrap.style.background = cfg.bg;
    iconWrap.style.color = cfg.color;
    iconWrap.querySelector("i").className = `${cfg.icon} text-[18px]`;
    document.getElementById("qActionTitle").textContent = cfg.title;
    document.getElementById("qActionMessage").textContent = cfg.message(q);
    const confirmBtn = document.getElementById("qActionConfirmBtn");
    confirmBtn.textContent = cfg.confirmLabel;
    confirmBtn.style.background = cfg.confirmBg;
    confirmBtn.style.color = "#fff";
    window.openModal("quoteActionModal");
  }

  function confirmQuoteAction() {
    closeQuoteModal("quoteActionModal");
  }

  // ---- New Quotation modal ----
  function recalcQuoteTotal() {
    let total = 0;
    document.querySelectorAll("#quoteLineItems > div").forEach((row) => {
      const qty = parseFloat(row.querySelector(".quote-qty").value) || 0;
      const price = parseFloat(row.querySelector(".quote-price").value) || 0;
      total += qty * price;
    });
    const discount = parseFloat(document.getElementById("quoteDiscount").value) || 0;
    total = total * (1 - discount / 100);
    document.getElementById("quoteTotal").textContent = "$" + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  document.getElementById("quoteLineItems")?.addEventListener("input", recalcQuoteTotal);
  document.getElementById("quoteDiscount")?.addEventListener("input", recalcQuoteTotal);
  window.wireRowRemove("quoteLineItems", "div", recalcQuoteTotal, { minRows: 1 });

  function addQuoteLine() {
    const wrap = document.getElementById("quoteLineItems");
    const row = document.createElement("div");
    row.className = "flex items-center gap-1.5";
    row.innerHTML = `
      <input type="text" placeholder="Item name" class="flex-1 py-1.5 px-2 rounded-lg text-[12px] outline-none u-background-surface-sunken_border-1px-solid-border-subtle">
      <input type="number" placeholder="Qty" value="1" class="quote-qty w-14 py-1.5 px-2 rounded-lg text-[12px] outline-none text-center u-background-surface-sunken_border-1px-solid-border-subtle">
      <input type="text" placeholder="Price" value="0" class="quote-price w-20 py-1.5 px-2 rounded-lg text-[12px] outline-none text-center u-background-surface-sunken_border-1px-solid-border-subtle">
      <button type="button" class="header-icon-btn !size-7" data-row-remove><i class="icon-x text-[13px]"></i></button>
    `;
    wrap.appendChild(row);
  }

  function openNewQuoteModal() {
    document.getElementById("quoteError").classList.add("hidden");
    window.openModal("newQuoteModal");
  }

  function saveQuoteDraft() {
    closeQuoteModal("newQuoteModal");
  }

  function sendQuote() {
    const hasItem = Array.from(document.querySelectorAll("#quoteLineItems > div")).some((row) => row.querySelector("input").value.trim());
    if (!hasItem) {
      document.getElementById("quoteError").classList.remove("hidden");
      return;
    }
    closeQuoteModal("newQuoteModal");
  }

  document.getElementById("addQuoteLineBtn")?.addEventListener("click", addQuoteLine);
  document.getElementById("newQuoteBtn")?.addEventListener("click", openNewQuoteModal);
  document.getElementById("quoteSaveDraftBtn")?.addEventListener("click", saveQuoteDraft);
  document.getElementById("quoteSendBtn")?.addEventListener("click", sendQuote);
  document.getElementById("qActionConfirmBtn")?.addEventListener("click", confirmQuoteAction);
});
})();


// ---- reservation-add.js ----
// ---- reservation-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveResDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishResBtn")?.addEventListener("click", function () {
    const guest = document.getElementById("resGuest").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!guest) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't book yet";
      message.textContent = "Please fix the following before booking this reservation:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Guest Name is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Reservation booked";
      message.textContent = `A table has been reserved for "${guest}".`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- reviews.js ----
// ---- reviews.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  // ---- Filter drawer interactivity (rating toggle, filter-check counting, reset, clear-all)
  // is handled generically by list-toolkit.js, which this page also loads. Keep only the
  // "Filters" button's count badge in sync with the drawer's own live badge, since that one
  // lives outside the drawer and list-toolkit.js doesn't know about it.
  const filterActiveBadge = document.getElementById("filterActiveBadge");
  const filterActiveCount = document.getElementById("filterActiveCount");
  if (filterActiveBadge && filterActiveCount) {
    const syncFilterActiveCount = () => {
      filterActiveCount.textContent = filterActiveBadge.textContent.replace(/\D/g, "") || "0";
    };
    new MutationObserver(syncFilterActiveCount).observe(filterActiveBadge, { childList: true, characterData: true, subtree: true });
    syncFilterActiveCount();
  }

  function openAiModerationModal() {
    const runningStep = document.getElementById("aiModRunningStep");
    const doneStep = document.getElementById("aiModDoneStep");
    const bar = document.getElementById("aiModProgressBar");
    const pct = document.getElementById("aiModProgressPct");
    const statusLine = document.getElementById("aiModStatusLine");

    runningStep.classList.remove("hidden");
    doneStep.classList.add("hidden");
    bar.style.width = "0%";
    pct.textContent = "0%";
    window.openModal("aiModerationModal");

    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 22 + 8);
      bar.style.width = `${progress}%`;
      pct.textContent = `${Math.round(progress)}%`;
      statusLine.textContent = `Checking review #${Math.min(42, Math.round((progress / 100) * 42))} of 42…`;
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          runningStep.classList.add("hidden");
          doneStep.classList.remove("hidden");
        }, 300);
      }
    }, 220);
  }

  document.getElementById("runAiModerationBtn")?.addEventListener("click", openAiModerationModal);
});
})();


// ---- role-add.js ----
// ---- role-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveRoleDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishRoleBtn")?.addEventListener("click", function () {
    const name = document.getElementById("roleName").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!name) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't create yet";
      message.textContent = "Please fix the following before creating this role:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Role Name is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Role created";
      message.textContent = `"${name}" is now available to assign to users.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- role-builder.js ----
// ---- role-builder.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    function openRoleModal(card) {
        const d = card.dataset;
        const iconEl = document.getElementById("roleModalIcon");
        iconEl.className = "icon-chip size-10" + (d.roleChip ? " " + d.roleChip : "");
        iconEl.innerHTML = `<i class="${d.roleIcon} text-[17px]"></i>`;

        document.getElementById("roleModalName").textContent = d.roleName;

        const badgeEl = document.getElementById("roleModalBadge");
        badgeEl.textContent = d.roleBadge;
        badgeEl.className = "badge-soft !text-[10.5px] " + (d.roleBadge === "System" ? "badge-neutral" : "badge-primary");

        document.getElementById("roleModalUsers").textContent = d.roleUsers;
        document.getElementById("roleModalPerms").textContent = d.rolePerms;
        document.getElementById("roleModalEdited").textContent = d.roleEdited;

        const permListEl = document.getElementById("roleModalPermList");
        permListEl.innerHTML = "";
        d.rolePermlist.split(",").forEach((perm) => {
            const span = document.createElement("span");
            span.className = "badge-soft badge-neutral !text-[11px]";
            span.textContent = perm.trim();
            permListEl.appendChild(span);
        });

        window.openModal("roleModal");
    }

    document.querySelectorAll('[data-role-card]').forEach((btn) => {
        btn.addEventListener('click', () => openRoleModal(btn));
    });
});
})();


// ---- room-explorer.js ----
// ---- room-explorer.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function filterByFloor(floor, btn) {
    document.querySelectorAll('#floorFilterTabs button').forEach((b) => {
      b.classList.remove('btn-primary');
      b.classList.add('btn-outline');
    });
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');

    document.querySelectorAll('#roomList > [data-floor]').forEach((card) => {
      card.classList.toggle('hidden', floor !== 'all' && card.dataset.floor !== floor);
    });
  }

  function addRoom() {
    const number = document.getElementById("roomNumber").value.trim();
    const rate = document.getElementById("roomRate").value.trim();
    const errors = [];
    if (!number) errors.push("Room Number is required.");
    if (!rate) errors.push("Rate / Night is required.");

    const errorsBox = document.getElementById("addRoomErrors");
    if (errors.length) {
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      return;
    }

    errorsBox.classList.add("hidden");
    const type = document.getElementById("roomType").value;
    document.getElementById("addRoomSuccessMessage").textContent = `Room ${number} (${type}) has been added to the inventory.`;
    window.closeModal("addRoomModal");
    window.openModal("addRoomSuccessModal");
  }

  document.querySelectorAll("#floorFilterTabs button[data-floor]").forEach((btn) => {
    btn.addEventListener("click", () => filterByFloor(btn.dataset.floor, btn));
  });

  document.getElementById("addRoomSubmitBtn")?.addEventListener("click", addRoom);
});
})();


// ---- room-gallery.js ----
// ---- room-gallery.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const lightboxImages = [
    { src: "build/img/room-gallery/bedroom.jpg", caption: "Bedroom" },
    { src: "build/img/room-gallery/bathroom.jpg", caption: "Bathroom" },
    { src: "build/img/room-gallery/city-view.jpg", caption: "City View" },
    { src: "build/img/room-gallery/living-area.jpg", caption: "Living Area" },
    { src: "build/img/room-gallery/mini-bar.jpg", caption: "Mini Bar" },
    { src: "build/img/room-gallery/balcony.jpg", caption: "Balcony" },
    { src: "build/img/room-gallery/closet.jpg", caption: "Closet" },
    { src: "build/img/room-gallery/workspace.jpg", caption: "Desk & Workspace" },
  ];
  let lightboxIndex = 0;

  function renderLightbox() {
    const item = lightboxImages[lightboxIndex];
    document.getElementById("lightboxImg").src = item.src;
    document.getElementById("lightboxImg").alt = item.caption;
    document.getElementById("lightboxCaption").textContent = item.caption;
    document.getElementById("lightboxCounter").textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
  }

  function openLightbox(index) {
    lightboxIndex = index;
    renderLightbox();
    window.openModal("galleryLightbox");
    document.body.classList.add("overflow-hidden");
  }

  function closeLightbox() {
    window.closeModal("galleryLightbox");
    document.body.classList.remove("overflow-hidden");
  }

  function stepLightbox(delta) {
    lightboxIndex = (lightboxIndex + delta + lightboxImages.length) % lightboxImages.length;
    renderLightbox();
  }

  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("galleryLightbox");
    if (!lightbox || lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
  window.stepLightbox = stepLightbox;

  document.getElementById("galleryGrid")?.addEventListener("click", function (e) {
    const item = e.target.closest("[data-lightbox-index]");
    if (item) openLightbox(Number(item.dataset.lightboxIndex));
  });

  document.getElementById("lightboxBackdrop")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxCloseBtn")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrevBtn")?.addEventListener("click", function () { stepLightbox(-1); });
  document.getElementById("lightboxNextBtn")?.addEventListener("click", function () { stepLightbox(1); });
  document.getElementById("lightboxOverlay")?.addEventListener("click", function (e) {
    if (e.target === this) closeLightbox();
  });
});
})();


// ---- segment-add.js ----
// ---- segment-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    function addRuleRow() {
        const wrap = document.getElementById("rulesWrap");
        const row = wrap.firstElementChild.cloneNode(true);
        wrap.appendChild(row);
    }
    function publishSegment() {
        const name = document.getElementById("segName").value.trim();
        if (!name) {
            window.openModal("validationErrorModal");
            return;
        }
        window.openModal("publishSuccessModal");
    }

    document.getElementById("addRuleRowBtn")?.addEventListener("click", addRuleRow);
    document.getElementById("publishSegmentBtn")?.addEventListener("click", publishSegment);
});
})();


// ---- shipments.js ----
// ---- shipments.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {

    window.openTrackingModal = function openTrackingModal(tracking, carrier) {
        document.getElementById("trackingModalTitle").textContent = tracking;
        document.getElementById("trackingModalSubtitle").textContent = `Shipped via ${carrier}`;
        window.openModal("trackingModal");
    };

    document.querySelectorAll('[data-tracking-number]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            window.openTrackingModal(btn.dataset.trackingNumber, btn.dataset.trackingCarrier);
        });
    });

});
})();


// ---- shipping-zone-add.js ----
// ---- shipping-zone-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveZoneDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });

  document.getElementById("publishZoneBtn")?.addEventListener("click", function () {
    const name = document.getElementById("zoneName").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!name) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't create yet";
      message.textContent = "Please fix the following before creating this zone:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Zone Name is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Zone created";
      message.textContent = `"${name}" is now live in your shipping zones.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });
});
})();


// ---- stock-transfer.js ----
// ---- stock-transfer.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function openCreateTransferModal() {
    document.getElementById("transferSkuInput").value = "";
    document.getElementById("transferSkuError").classList.add("hidden");
    window.openModal("createTransferModal");
  }
  function closeCreateTransferModal() {
    window.closeModal("createTransferModal");
  }
  function submitCreateTransfer() {
    const sku = document.getElementById("transferSkuInput").value.trim();
    document.getElementById("transferSkuError").classList.toggle("hidden", !!sku);
    if (!sku) return;
    closeCreateTransferModal();
  }
  document.getElementById("createTransferBtn")?.addEventListener("click", openCreateTransferModal);
  document.getElementById("submitCreateTransferBtn")?.addEventListener("click", submitCreateTransfer);
});
})();


// ---- storefront.js ----
// ---- storefront.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.openStoreConfigModal = function openStoreConfigModal(templateId, title) {
    const tpl = document.getElementById(templateId);
    const modal = document.getElementById('storeConfigModal');
    const body = document.getElementById('storeConfigModalBody');
    const titleEl = document.getElementById('storeConfigModalTitle');
    if (!tpl || !modal || !body || !titleEl) return;
    titleEl.textContent = title;
    body.innerHTML = '';
    body.appendChild(tpl.content.cloneNode(true));
    window.openModal('storeConfigModal');
  };

  window.closeStoreConfigModal = function closeStoreConfigModal() {
    const modal = document.getElementById('storeConfigModal');
    window.closeModal(modal);
    window.setTimeout(() => {
      const body = document.getElementById('storeConfigModalBody');
      if (body) body.innerHTML = '';
    }, 200);
  };

  document.querySelectorAll('[data-store-config-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.openStoreConfigModal(btn.dataset.storeConfigOpen, btn.dataset.storeConfigTitle);
    });
  });

  const storeConfigModal = document.getElementById('storeConfigModal');
  if (storeConfigModal) {
    storeConfigModal.addEventListener('click', function (e) {
      if (e.target.closest('[data-store-config-cancel]')) {
        window.closeStoreConfigModal();
      }
    });
  }

  const maintenanceModeToggle = document.getElementById('maintenanceModeToggle');
  if (maintenanceModeToggle) {
    maintenanceModeToggle.addEventListener('change', function () {
      document.getElementById('maintenanceStatusLabel').textContent = this.checked ? 'Store is offline' : 'Store is currently live';
    });
  }

  const copyBypassLinkBtn = document.getElementById('copyBypassLinkBtn');
  if (copyBypassLinkBtn) {
    const tooltip = copyBypassLinkBtn.querySelector('.hs-tooltip-content');
    copyBypassLinkBtn.addEventListener('click', function () {
      navigator.clipboard.writeText('https://dreamsadmin-store.com/?bypass=8f2ka91x');
      if (!tooltip) return;
      const oldText = tooltip.textContent;
      tooltip.textContent = 'Copied!';
      setTimeout(() => (tooltip.textContent = oldText), 1500);
    });
  }
});
})();


// ---- student-directory.js ----
// ---- student-directory.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function enrollStudent() {
    const name = document.getElementById("stuName").value.trim();
    const roll = document.getElementById("stuRoll").value.trim();
    const guardian = document.getElementById("stuGuardian").value.trim();
    const email = document.getElementById("stuEmail").value.trim();
    const errors = [];
    if (!name) errors.push("Full Name is required.");
    if (!roll) errors.push("Roll Number is required.");
    if (!guardian) errors.push("Guardian Name is required.");
    if (!email) errors.push("Email is required.");

    const errorsBox = document.getElementById("enrollModalErrors");
    if (errors.length) {
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      return;
    }

    errorsBox.classList.add("hidden");
    document.getElementById("enrollSuccessMessage").textContent = `"${name}" has been added to the directory.`;
    window.closeModal("enrollStudentModal");
    window.openModal("enrollSuccessModal");
  }

  document.getElementById("enrollStudentBtn")?.addEventListener("click", enrollStudent);
});
})();


// ---- subscription.js ----
// ---- subscription.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('billingToggle');
  if (!toggle) return;
  var buttons = toggle.querySelectorAll('.billing-cycle-btn');
  var prices = document.querySelectorAll('.plan-price');
  var labels = document.querySelectorAll('.plan-cycle-label');

  function setCycle(cycle) {
    buttons.forEach(function (btn) {
      var active = btn.dataset.billingCycle === cycle;
      btn.classList.toggle('is-active', active);
      btn.style.color = active ? '#fff' : 'var(--text-tertiary)';
      btn.style.background = active ? 'var(--color-primary-600)' : 'transparent';
    });
    prices.forEach(function (el) { el.textContent = el.dataset[cycle]; });
    labels.forEach(function (el) { el.textContent = el.dataset[cycle]; });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () { setCycle(btn.dataset.billingCycle); });
  });

  setCycle('annual');
});
})();


// ---- suppliers.js ----
// ---- suppliers.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  let currentSupplierData = null;

  function rowDataFor(el) {
    const panel = el.closest(".hs-dropdown-menu");
    const source = panel ? panel.querySelector("[data-name]") : null;
    return source ? source.dataset : null;
  }

  window.openSupplierProfile = function openSupplierProfile(el) {
    const d = el.dataset;
    currentSupplierData = d;
    const iconMap = { "Nova Components Ltd": "icon-truck", "Cedarline Textiles": "icon-shirt", "Solstice Electronics": "icon-smartphone", "Lumio Home Goods": "icon-lamp", "Harbor Freight Supply": "icon-container" };
    const badgeMap = { "Nova Components Ltd": "badge-solid-primary", "Cedarline Textiles": "badge-solid-accent", "Solstice Electronics": "badge-solid-info", "Lumio Home Goods": "badge-solid-neutral", "Harbor Freight Supply": "badge-solid-warning" };
    const statusBadgeMap = { "Preferred": "badge-primary", "Active": "badge-success", "Inactive": "badge-neutral" };

    document.getElementById("spNameText").textContent = d.name;
    document.getElementById("spCategoryCountry").textContent = d.category + " · " + d.country;
    document.getElementById("spRating").textContent = d.rating;
    document.getElementById("spOrders").textContent = d.orders;
    document.getElementById("spSpend").textContent = d.spend;
    document.getElementById("spOnTime").textContent = d.ontime;
    document.getElementById("spEmail").textContent = "purchasing@" + d.name.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".com";
    document.getElementById("spPhone").textContent = d.phone;

    const nameIcon = document.getElementById("spName");
    nameIcon.className = "grid place-items-center size-12 rounded-lg shrink-0 " + (badgeMap[d.name] || "badge-solid-primary");
    nameIcon.innerHTML = '<i class="' + (iconMap[d.name] || "icon-truck") + ' text-[20px]"></i>';

    const statusEl = document.getElementById("spStatus");
    statusEl.textContent = d.status;
    statusEl.className = "ms-auto badge-soft shrink-0 " + (statusBadgeMap[d.status] || "badge-neutral");

    window.openModal("supplierProfileModal");
  };
  window.closeSupplierProfile = function closeSupplierProfile() {
    window.closeModal("supplierProfileModal");
  };

  window.openAddSupplierModal = function openAddSupplierModal() {
    document.getElementById("addSupplierModal").dataset.mode = "add";
    document.getElementById("addSupplierModalTitle").textContent = "Add Supplier";
    document.getElementById("addSupplierSubmitBtn").textContent = "Add Supplier";
    document.getElementById("supplierNameInput").value = "";
    document.getElementById("supplierPhoneInput").value = "";
    document.getElementById("supplierNameError").classList.add("hidden");
    window.openModal("addSupplierModal");
  };
  window.closeAddSupplierModal = function closeAddSupplierModal() {
    window.closeModal("addSupplierModal");
  };
  window.openEditSupplierModal = function openEditSupplierModal(el) {
    const d = el ? rowDataFor(el) : currentSupplierData;
    document.getElementById("addSupplierModal").dataset.mode = "edit";
    document.getElementById("addSupplierModalTitle").textContent = "Edit Supplier";
    document.getElementById("addSupplierSubmitBtn").textContent = "Save Changes";
    document.getElementById("supplierNameInput").value = d ? d.name : "";
    document.getElementById("supplierPhoneInput").value = d ? d.phone : "";
    document.getElementById("supplierNameError").classList.add("hidden");
    const categorySelect = document.getElementById("supplierCategorySelect");
    if (categorySelect && d && d.category) {
      const match = Array.from(categorySelect.options).find((o) => o.value === d.category);
      if (match) categorySelect.value = match.value;
    }
    window.openModal("addSupplierModal");
  };
  window.submitAddSupplier = function submitAddSupplier() {
    const name = document.getElementById("supplierNameInput").value.trim();
    document.getElementById("supplierNameError").classList.toggle("hidden", !!name);
    if (!name) return;
    closeAddSupplierModal();
  };

  const orderStatusBadge = { "Delivered": "badge-success", "In Transit": "badge-info", "Cancelled": "badge-danger" };
  window.openSupplierOrders = function openSupplierOrders(el) {
    const d = rowDataFor(el);
    document.getElementById("soSupplierName").textContent = d ? d.name : "Supplier";
    document.getElementById("soOrderCount").textContent = (d ? d.orders : "0") + " total orders · " + (d ? d.spend : "$0") + " lifetime spend";

    const sample = [
      { po: "PO-8821", date: "Jul 24, 2026", items: 3, amount: "$12.4K", status: "Delivered" },
      { po: "PO-8798", date: "Jul 15, 2026", items: 5, amount: "$8.1K", status: "In Transit" },
      { po: "PO-8761", date: "Jun 30, 2026", items: 2, amount: "$4.6K", status: "Delivered" },
      { po: "PO-8710", date: "Jun 12, 2026", items: 1, amount: "$1.9K", status: "Cancelled" },
    ];
    document.getElementById("soOrdersList").innerHTML = sample.map((o) => `
      <div class="flex items-center gap-3 px-5 py-2.5">
        <div class="min-w-0 flex-1">
          <p class="text-[12.5px] font-semibold truncate">${o.po}</p>
          <p class="text-[10.5px] u-color-text-tertiary">${o.date} · ${o.items} item${o.items > 1 ? "s" : ""}</p>
        </div>
        <span class="badge-soft ${orderStatusBadge[o.status] || "badge-neutral"} shrink-0">${o.status}</span>
        <span class="text-[12px] font-semibold shrink-0 w-14 text-end">${o.amount}</span>
      </div>
    `).join("");

    window.openModal("supplierOrdersModal");
  };
  window.closeSupplierOrders = function closeSupplierOrders() {
    window.closeModal("supplierOrdersModal");
  };

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeAddSupplierModal();
    closeSupplierOrders();
  });

  document.getElementById("addSupplierBtn")?.addEventListener("click", openAddSupplierModal);
  document.getElementById("addSupplierModalCloseBtn")?.addEventListener("click", closeAddSupplierModal);
  document.getElementById("addSupplierCancelBtn")?.addEventListener("click", closeAddSupplierModal);
  document.getElementById("addSupplierSubmitBtn")?.addEventListener("click", submitAddSupplier);

  document.getElementById("supplierProfileCloseIconBtn")?.addEventListener("click", closeSupplierProfile);
  document.getElementById("supplierProfileCloseBtn")?.addEventListener("click", closeSupplierProfile);
  document.getElementById("supplierProfileEditBtn")?.addEventListener("click", () => {
    closeSupplierProfile();
    openEditSupplierModal();
  });

  document.getElementById("supplierOrdersCloseIconBtn")?.addEventListener("click", closeSupplierOrders);
  document.getElementById("supplierOrdersCloseBtn")?.addEventListener("click", closeSupplierOrders);

  document.querySelectorAll("[data-supplier-view-profile]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openSupplierProfile(el);
    });
  });
  document.querySelectorAll("[data-supplier-edit]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openEditSupplierModal(el);
    });
  });
  document.querySelectorAll("[data-supplier-view-orders]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openSupplierOrders(el);
    });
  });
  document.querySelectorAll("[data-supplier-profile-quick]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openSupplierProfile(document.querySelector("#" + el.dataset.supplierProfileQuick + " a"));
    });
  });
});
})();


// ---- support-ticket-add.js ----
// ---- support-ticket-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.saveTicketDraft = document.getElementById("saveTicketDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });;

  window.publishTicket = document.getElementById("publishTicketBtn")?.addEventListener("click", function () {
    const subject = document.getElementById("tkSubject").value.trim();
    const description = document.getElementById("tkDescription").value.trim();
    if (!subject || !description) {
      window.openModal("validationErrorModal");
      return;
    }
    window.openModal("publishSuccessModal");
  });;
});
})();


// ---- table-floor-map.js ----
// ---- table-floor-map.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function confirmTableTransfer() {
    const target = document.getElementById("transferTargetTable").value;
    window.closeModal("transferTableModal");
    window.showToast("floorMapToast","Order transferred to " + target.split(" ")[0]);
  }
  document.getElementById("confirmMergeBtn")?.addEventListener("click", () => {
    window.closeModal("mergeTablesModal");
    window.showToast("floorMapToast","T9 and T10 merged");
  });
  document.getElementById("confirmTransferBtn")?.addEventListener("click", confirmTableTransfer);
  document.querySelectorAll(".merge-table-btn").forEach((btn) => {
    btn.addEventListener("click", () => btn.classList.toggle("is-active"));
  });
});
})();


// ---- task-add.js ----
// ---- task-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.saveCardDraft = document.getElementById("saveCardDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });;

  window.publishCard = document.getElementById("publishCardBtn")?.addEventListener("click", function () {
    const title = document.getElementById("cardTitle").value.trim();
    const errors = [];
    if (!title) errors.push("Title is required.");

    const icon = document.getElementById("publishModalIcon");
    const modalTitle = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      modalTitle.textContent = "Can't add card yet";
      message.textContent = "Please fix the following before adding:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      modalTitle.textContent = "Card added";
      message.textContent = `"${title}" has been added to the board.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });;
});
})();


// ---- tasks-add.js ----
// ---- tasks-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.saveTaskDraft = document.getElementById("saveTaskDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });;

  window.publishTask = document.getElementById("publishTaskBtn")?.addEventListener("click", function () {
    const title = document.getElementById("taskTitle").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const titleEl = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!title) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      titleEl.textContent = "Can't create yet";
      message.textContent = "Please fix the following before creating this task:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Task Title is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      titleEl.textContent = "Task created";
      message.textContent = `"${title}" has been added to your task list.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });;
});
})();


// ---- tax-region-add.js ----
// ---- tax-region-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.saveTaxRegionDraft = document.getElementById("saveTaxRegionDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });;

  window.publishTaxRegion = document.getElementById("publishTaxRegionBtn")?.addEventListener("click", function () {
    const name = document.getElementById("taxRegionName").value.trim();
    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (!name) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't add yet";
      message.textContent = "Please fix the following before adding this tax region:";
      errorsBox.innerHTML = `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>Region Name is required.</p>`;
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Tax region added";
      message.textContent = `"${name}" is now configured for tax collection.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });;
});
})();


// ---- timesheet-add.js ----
// ---- timesheet-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.saveTimesheetDraft = document.getElementById("saveTimesheetDraftBtn")?.addEventListener("click", function () {
    window.openModal("draftSavedModal");
  });;

  window.submitTimesheet = document.getElementById("submitTimesheetBtn")?.addEventListener("click", function () {
    const employee = document.getElementById("tsEmployee").value;
    const hours = document.getElementById("tsHours").value.trim();
    const errors = [];
    if (!hours || isNaN(Number(hours)) || Number(hours) <= 0) errors.push("A valid number of Hours is required.");

    const icon = document.getElementById("publishModalIcon");
    const title = document.getElementById("publishModalTitle");
    const message = document.getElementById("publishModalMessage");
    const errorsBox = document.getElementById("publishModalErrors");
    const successActions = document.getElementById("publishModalSuccessActions");
    const closeBtn = document.getElementById("publishModalCloseBtn");

    if (errors.length) {
      icon.style.background = "var(--color-danger-100)";
      icon.style.color = "var(--color-danger-700)";
      icon.querySelector("i").className = "icon-triangle-alert text-[18px]";
      title.textContent = "Can't submit yet";
      message.textContent = "Please fix the following before submitting:";
      errorsBox.innerHTML = errors.map((e) => `<p class="text-[12px] flex items-center gap-2 u-color-color-danger-600"><i class="icon-x text-[11px]"></i>${e}</p>`).join("");
      errorsBox.classList.remove("hidden");
      successActions.classList.add("hidden");
      closeBtn.classList.remove("hidden");
    } else {
      icon.style.background = "var(--color-success-100)";
      icon.style.color = "var(--color-success-700)";
      icon.querySelector("i").className = "icon-check text-[18px]";
      title.textContent = "Time entry submitted";
      message.textContent = `${hours}h logged for ${employee} and sent for approval.`;
      errorsBox.classList.add("hidden");
      successActions.classList.remove("hidden");
      closeBtn.classList.add("hidden");
    }

    window.openModal("publishModal");
  });;
});
})();


// ---- timesheet-details.js ----
// ---- timesheet-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.approveEntry = function approveEntry() {
    const badge = document.getElementById("timesheetStatusBadge");
    if (badge) badge.innerHTML = '<i class="icon-check text-[9px]"></i>Approved';
  };
  document.getElementById("approveEntryBtn")?.addEventListener("click", window.approveEntry);
});
})();


// ---- transaction-add.js ----
// ---- transaction-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  let txnType = "Debit";
  let txnFiles = [];

  function setTxnType(type) {
    txnType = type;
    document.querySelectorAll('#txnTypeToggle [data-txn-type]').forEach((btn) => {
      const active = btn.dataset.txnType === type;
      btn.classList.toggle("is-active", active);
      btn.style.background = active ? (type === "Debit" ? "var(--color-danger-500)" : "var(--color-success-500)") : "var(--surface-sunken)";
      btn.style.color = active ? "#fff" : "var(--text-secondary)";
    });
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function renderFileList() {
    const list = document.getElementById("txnFileList");
    list.innerHTML = txnFiles.map((f, i) => `
      <div class="flex items-center gap-2.5 p-2.5 rounded-lg u-background-surface-sunken">
        <i class="icon-file-text text-[15px] u-color-text-tertiary"></i>
        <span class="flex-1 text-[12.5px] truncate">${f.name}</span>
        <span class="text-[11px] u-color-text-tertiary">${formatBytes(f.size)}</span>
        <button type="button" class="header-icon-btn !size-7 txn-file-remove" data-file-index="${i}"><i class="icon-x text-[12px]"></i></button>
      </div>
    `).join("");
  }

  function handleTxnFiles(fileList) {
    Array.from(fileList).forEach((f) => txnFiles.push(f));
    renderFileList();
  }

  document.getElementById("txnFileInput")?.addEventListener("change", (e) => handleTxnFiles(e.target.files));
  document.getElementById("txnFileList")?.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".txn-file-remove");
    if (!removeBtn) return;
    txnFiles.splice(Number(removeBtn.dataset.fileIndex), 1);
    renderFileList();
  });
  const txnDropzone = document.getElementById("txnDropzone");
  if (!txnDropzone) return;
  txnDropzone.addEventListener("dragover", (e) => { e.preventDefault(); txnDropzone.style.borderColor = "var(--color-primary-500)"; });
  txnDropzone.addEventListener("dragleave", () => { txnDropzone.style.borderColor = "var(--border-default)"; });
  txnDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    txnDropzone.style.borderColor = "var(--border-default)";
    if (e.dataTransfer.files.length) handleTxnFiles(e.dataTransfer.files);
  });

  function renderReview() {
    const account = document.getElementById("txnAccount").value;
    const amount = document.getElementById("txnAmount").value.trim() || "$0.00";
    const date = document.getElementById("txnDate").value.trim() || "&mdash;";
    const description = document.getElementById("txnDescription").value.trim() || "No description provided.";

    document.getElementById("reviewDetails").innerHTML = `
      <div><p class="u-color-text-tertiary">Account</p><p class="font-semibold">${account}</p></div>
      <div><p class="u-color-text-tertiary">Type</p><p class="font-semibold">${txnType}</p></div>
      <div><p class="u-color-text-tertiary">Amount</p><p class="font-semibold" style="color: ${txnType === 'Debit' ? 'var(--color-danger-600)' : 'var(--color-success-600)'};">${txnType === 'Debit' ? '&ndash;' : '+'}${amount}</p></div>
      <div><p class="u-color-text-tertiary">Date</p><p class="font-semibold">${date}</p></div>
    `;
    document.getElementById("reviewDescription").textContent = description;
    document.getElementById("reviewAttachments").textContent = txnFiles.length
      ? `${txnFiles.length} file${txnFiles.length > 1 ? "s" : ""} attached`
      : "No files attached.";
  }

  window.initWizard({
    steps: 3,
    finalLabel: "Create Transaction",
    onStepChange: (step) => { if (step === 3) renderReview(); },
    onComplete: () => {
      const amount = document.getElementById("txnAmount").value.trim() || "$0.00";
      document.getElementById("txnCreatedMsg").textContent = `${txnType === "Debit" ? "-" : "+"}${amount} has been recorded successfully.`;
      window.openModal("txnCreatedModal");
    },
  });

  document.querySelectorAll('#txnTypeToggle [data-txn-type]').forEach((btn) => {
    btn.addEventListener("click", () => setTxnType(btn.dataset.txnType));
  });
});
})();


// ---- transaction-details.js ----
// ---- transaction-details.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function issueTxnRefund() {
    window.closeModal("refundTxnModal");
    window.showSuccess("Refund issued", "$48,200.00 has been refunded to Nova Components Ltd.");
  }

  function flagDisputed() {
    window.closeModal("disputeModal");
    const badge = document.getElementById("txnStatusBadge");
    badge.className = "badge-soft badge-warning !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-flag text-[9px]"></i>Disputed';
    window.showSuccess("Transaction flagged", "TXN-88231 has been routed to the risk team for review.");
  }

  function voidTxn() {
    window.closeModal("voidModal");
    const badge = document.getElementById("txnStatusBadge");
    badge.className = "badge-soft badge-danger !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-x text-[9px]"></i>Voided';
    window.showSuccess("Transaction voided", "TXN-88231 has been voided and funds reversed.");
  }

  window.issueTxnRefund = issueTxnRefund;
  window.flagDisputed = flagDisputed;
  window.voidTxn = voidTxn;

  document.getElementById("issueTxnRefundBtn")?.addEventListener("click", issueTxnRefund);
  document.getElementById("flagDisputedBtn")?.addEventListener("click", flagDisputed);
  document.getElementById("voidTxnBtn")?.addEventListener("click", voidTxn);
});
})();


// ---- transactions-list.js ----
// ---- transactions-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  let pendingDeleteTxn = null, pendingDeleteBulk = false;

  function setTxnFilter(label, btn) {
    document.querySelectorAll("#txnFilterTabs button").forEach((b) => {
      b.classList.remove("u-background-color-primary-600_color-fff");
    });
    btn.classList.add("u-background-color-primary-600_color-fff");

    const rows = document.querySelectorAll("#txnTable tbody tr");
    rows.forEach((row) => {
      if (label === "All") {
        row.style.display = "";
        return;
      }
      const typeText = row.children[4]?.textContent.trim();
      const statusText = row.children[6]?.textContent.trim();
      row.style.display = typeText === label || statusText === label ? "" : "none";
    });
  }

  function showTxnSuccess(title, message) {
    document.getElementById("txnSuccessTitle").textContent = title;
    document.getElementById("txnSuccessMessage").textContent = message;
    window.openModal("txnSuccessModal");
  }

  function duplicateTxn(ref) {
    showTxnSuccess("Transaction duplicated", `A copy of ${ref} has been created as a draft.`);
  }

  function printTxn(ref) {
    showTxnSuccess("Sent to printer", `${ref} has been queued for printing.`);
  }

  function markReconciled() {
    const count = document.querySelectorAll(".row-select:checked").length;
    showTxnSuccess("Marked as reconciled", `${count} transaction(s) marked as reconciled.`);
  }

  function confirmDeleteTxn(ref, isBulk) {
    pendingDeleteTxn = ref;
    pendingDeleteBulk = !!isBulk;
    document.getElementById("txnDeleteTitle").textContent = isBulk
      ? `Delete ${document.querySelectorAll(".row-select:checked").length} selected transaction(s)?`
      : `Delete transaction ${ref}?`;
    window.openModal("txnDeleteModal");
  }

  function doDeleteTxn() {
    window.closeModal("txnDeleteModal");
    showTxnSuccess("Transaction deleted", pendingDeleteBulk ? "Selected transactions have been deleted." : `${pendingDeleteTxn} has been deleted.`);
  }

  document.querySelectorAll("#txnFilterTabs button[data-txn-filter]").forEach((btn) => {
    btn.addEventListener("click", () => setTxnFilter(btn.dataset.txnFilter, btn));
  });

  document.querySelectorAll("[data-duplicate-txn]").forEach((btn) => {
    btn.addEventListener("click", () => duplicateTxn(btn.dataset.duplicateTxn));
  });

  document.querySelectorAll("[data-print-txn]").forEach((btn) => {
    btn.addEventListener("click", () => printTxn(btn.dataset.printTxn));
  });

  document.querySelectorAll("[data-delete-txn]").forEach((btn) => {
    btn.addEventListener("click", () => confirmDeleteTxn(btn.dataset.deleteTxn));
  });

  document.getElementById("txnMarkReconciledBtn")?.addEventListener("click", markReconciled);
  document.getElementById("txnBulkDeleteBtn")?.addEventListener("click", () => confirmDeleteTxn(null, true));
  document.getElementById("txnDeleteConfirmBtn")?.addEventListener("click", doDeleteTxn);
});
})();


// ---- transfer-center.js ----
// ---- transfer-center.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function openQuickSend(name, account) {
    document.getElementById("quickSendName").textContent = name;
    document.getElementById("quickSendAccount").textContent = account;
    document.getElementById("quickSendAvatar").textContent = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
    window.openModal("quickSendModal");
  }

  function submitTransfer(fromModalId) {
    window.closeModal(fromModalId);
    document.getElementById("transferSuccessMsg").textContent = "Your transfer is being processed and will complete shortly.";
    window.openModal("transferSuccessModal");
  }

  window.openQuickSend = openQuickSend;
  window.submitTransfer = submitTransfer;

  document.querySelectorAll('[data-quick-send-name]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openQuickSend(btn.dataset.quickSendName, btn.dataset.quickSendAccount);
    });
  });

  document.querySelectorAll('[data-submit-transfer]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      submitTransfer(btn.dataset.submitTransfer);
    });
  });
});
})();


// ---- trips-list.js ----
// ---- trips-list.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.wireListGridToggle('trips');
});
})();


// ---- user-profile-detail.js ----
// ---- user-profile-detail.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function saveRole() {
    window.closeModal("editRoleModal");
    window.showSuccess("Role updated", "Sofia Reyes' role and access permissions have been saved.");
  }

  function resetPassword() {
    window.showSuccess("Password reset sent", "A password reset link was emailed to sofia.reyes@dreamsadmin.com.");
  }

  function impersonateUser() {
    window.showSuccess("Impersonation session started", "You are now viewing the app as Sofia Reyes.");
  }

  function revokeSession() {
    window.closeModal("revokeSessionModal");
    window.showSuccess("Session revoked", "iPhone 15 Pro has been signed out.");
  }

  function suspendUser() {
    window.closeModal("suspendModal");
    const badge = document.getElementById("userStatusBadge");
    badge.className = "badge-soft badge-warning !bg-white/15 !text-white";
    badge.innerHTML = '<i class="icon-ban text-[9px]"></i>Suspended';
    window.showSuccess("Account suspended", "Sofia Reyes' access has been suspended and all sessions revoked.");
  }

  function deleteUser() {
    window.closeModal("deleteUserModal");
    window.showSuccess("User deleted", "Sofia Reyes has been permanently removed from the workspace.");
  }

  document.getElementById("resetPasswordBtn")?.addEventListener("click", resetPassword);
  document.getElementById("impersonateUserBtn")?.addEventListener("click", impersonateUser);
  document.getElementById("saveRoleBtn")?.addEventListener("click", saveRole);
  document.getElementById("revokeSessionBtn")?.addEventListener("click", revokeSession);
  document.getElementById("suspendUserBtn")?.addEventListener("click", suspendUser);
  document.getElementById("deleteUserBtn")?.addEventListener("click", deleteUser);
});
})();


// ---- wallet-recovery.js ----
// ---- wallet-recovery.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function openAddGuardianModal() {
    document.getElementById("addGuardianFormStep").classList.remove("hidden");
    document.getElementById("addGuardianVerifyStep").classList.add("hidden");
    document.getElementById("guardianNameInput").value = "";
    document.getElementById("guardianEmailInput").value = "";
    document.getElementById("guardianNameError").classList.add("hidden");
    document.getElementById("guardianEmailError").classList.add("hidden");
    window.openModal("addGuardianModal");
  }

  function submitAddGuardian() {
    const name = document.getElementById("guardianNameInput").value.trim();
    const email = document.getElementById("guardianEmailInput").value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.getElementById("guardianNameError").classList.toggle("hidden", !!name);
    document.getElementById("guardianEmailError").classList.toggle("hidden", emailValid);
    if (!name || !emailValid) return;

    document.getElementById("addGuardianFormStep").classList.add("hidden");
    document.getElementById("addGuardianVerifyEmail").textContent = email;
    document.getElementById("addGuardianVerifyStep").classList.remove("hidden");
  }

  const GUARDIAN_ACTIONS = {
    edit: { title: "Edit guardian", icon: "icon-edit", bg: "var(--color-primary-100)", color: "var(--color-primary-700)", confirmBg: "var(--color-primary-600)", confirmLabel: "Save Changes", showFields: true },
    remove: { title: "Remove guardian?", icon: "icon-trash-2", bg: "var(--color-danger-100)", color: "var(--color-danger-700)", confirmBg: "var(--color-danger-600)", confirmLabel: "Remove", message: (n) => `${n} will lose guardian access. This may lower your recovery threshold below the required minimum.` },
    resend: { title: "Resend invite?", icon: "icon-send", bg: "var(--color-primary-100)", color: "var(--color-primary-700)", confirmBg: "var(--color-primary-600)", confirmLabel: "Resend", message: (n) => `A new verification email will be sent to ${n}.` },
    "start-recovery": { title: "Start recovery request?", icon: "icon-shield-alert", bg: "var(--color-warning-100)", color: "var(--color-warning-700)", confirmBg: "var(--color-warning-600)", confirmLabel: "Start Request", message: () => "All active guardians will be notified and asked to approve this request. You'll need 3 of 5 approvals within 72 hours." },
  };

  function openGuardianModal(type, name, email) {
    const cfg = GUARDIAN_ACTIONS[type];
    if (!cfg) return;
    const iconWrap = document.getElementById("guardianActionIcon");
    iconWrap.style.background = cfg.bg;
    iconWrap.style.color = cfg.color;
    iconWrap.querySelector("i").className = `${cfg.icon} text-[18px]`;
    document.getElementById("guardianActionTitle").textContent = cfg.title;
    document.getElementById("guardianActionMessage").textContent = cfg.message ? cfg.message(name) : "";
    document.getElementById("guardianActionMessage").classList.toggle("hidden", cfg.showFields);
    document.getElementById("guardianEditFields").classList.toggle("hidden", !cfg.showFields);
    if (cfg.showFields) {
      document.getElementById("guardianEditName").value = name || "";
      document.getElementById("guardianEditEmail").value = email || "";
    }
    const confirmBtn = document.getElementById("guardianActionConfirmBtn");
    confirmBtn.textContent = cfg.confirmLabel;
    confirmBtn.style.background = cfg.confirmBg;
    confirmBtn.style.color = "#fff";
    window.openModal("guardianActionModal");
  }

  document.getElementById("openAddGuardianBtn")?.addEventListener("click", openAddGuardianModal);
  document.getElementById("submitAddGuardianBtn")?.addEventListener("click", submitAddGuardian);
  document.querySelectorAll("[data-guardian-action]").forEach((el) => {
    el.addEventListener("click", () => {
      openGuardianModal(el.dataset.guardianAction, el.dataset.guardianName, el.dataset.guardianEmail);
    });
  });
});
})();


// ---- watchlist-add.js ----
// ---- watchlist-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  function addToWatchlist() {
    const picked = document.querySelector('input[name="assetPick"]:checked');
    const name = picked ? picked.closest(".asset-option").querySelector(".font-semibold").textContent : "Asset";
    document.getElementById("watchlistAddedTitle").textContent = `${name} added to watchlist`;
    window.openModal("watchlistAddedModal");
  }

  window.addToWatchlist = addToWatchlist;

  document.getElementById("addToWatchlistBtn")?.addEventListener("click", addToWatchlist);
});
})();


// ---- watchlist.js ----
// ---- watchlist.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  window.wireListGridToggle('watchlist');

  document.querySelectorAll("[data-open-coin-modal]").forEach((el) => {
    el.addEventListener("click", () => window.openCoinModal(el.dataset.openCoinModal, el.dataset.coinTicker, el.dataset.coinPrice));
  });
  document.querySelectorAll("[data-open-alert-form-modal]").forEach((el) => {
    el.addEventListener("click", () => window.openAlertFormModal(el.dataset.openAlertFormModal, el.dataset.coinTicker, el.dataset.coinPrice));
  });
});
})();


// ---- deals.js ----
// ---- deals.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {

    function setDealsView(mode) {
        const board = document.getElementById('dealsBoardView');
        const list = document.getElementById('dealsListView');
        const boardBtn = document.getElementById('dealsViewBoardBtn');
        const listBtn = document.getElementById('dealsViewListBtn');
        if (mode === 'list') {
            board.classList.add('hidden');
            list.classList.remove('hidden');
            listBtn.classList.add('is-active');
            boardBtn.classList.remove('is-active');
        } else {
            list.classList.add('hidden');
            board.classList.remove('hidden');
            boardBtn.classList.add('is-active');
            listBtn.classList.remove('is-active');
        }
    }
    document.getElementById('dealsViewBoardBtn')?.addEventListener('click', () => setDealsView('board'));
    document.getElementById('dealsViewListBtn')?.addEventListener('click', () => setDealsView('list'));

    function openAddDealModal() {
        document.getElementById("dealNameInput").value = "";
        document.getElementById("dealNameError").classList.add("hidden");
        window.openModal("addDealModal");
    }
    document.getElementById("openAddDealBtn")?.addEventListener("click", openAddDealModal);
    document.querySelectorAll(".js-open-add-deal").forEach((btn) => btn.addEventListener("click", openAddDealModal));

    function submitAddDeal() {
        const name = document.getElementById("dealNameInput").value.trim();
        document.getElementById("dealNameError").classList.toggle("hidden", !!name);
        if (!name) return;
        window.closeModal("addDealModal");
    }
    document.getElementById("submitAddDealBtn")?.addEventListener("click", submitAddDeal);

    let editDealRow = null;

    function openEditDealModal(triggerEl) {
        editDealRow = triggerEl.closest("tr");
        if (editDealRow) {
            const cells = editDealRow.children;
            const dealLink = cells[1].querySelector("a");
            const companyEl = cells[1].querySelector("p");
            const ownerName = cells[2].querySelector("span:last-child");
            const value = cells[3].textContent.trim().replace(/[^0-9.]/g, "");
            const stage = cells[4].textContent.trim();
            const probability = cells[5].textContent.trim().replace(/[^0-9]/g, "");
            const closeDate = cells[6].textContent.trim();

            document.getElementById("editDealNameInput").value = dealLink ? dealLink.textContent.trim() : "";
            document.getElementById("editDealCompanyInput").value = companyEl ? companyEl.textContent.trim() : "";
            document.getElementById("editDealValueInput").value = value;
            document.getElementById("editDealStageInput").value = stage;
            document.getElementById("editDealProbabilityInput").value = probability;
            document.getElementById("editDealCloseInput").value = closeDate;
            document.getElementById("editDealOwnerInput").value = ownerName ? ownerName.textContent.trim() : "";
        }
        document.getElementById("editDealNameError").classList.add("hidden");
        window.openModal("editDealModal");
    }
    document.querySelectorAll("[data-open-edit-deal]").forEach((btn) => {
        btn.addEventListener("click", () => openEditDealModal(btn));
    });

    document.getElementById("submitEditDealBtn")?.addEventListener("click", () => {
        const name = document.getElementById("editDealNameInput").value.trim();
        document.getElementById("editDealNameError").classList.toggle("hidden", !!name);
        if (!name) return;
        window.closeModal("editDealModal");
    });

});
})();


// ---- theme-customizer.js ----
// ---- theme-customizer.js (preset selection + color palette pickers) --------------------
(() => {
    const presetGroup = document.getElementById('themePresetGroup');
    const paletteGroup = document.getElementById('colorPaletteGroup');
    if (!presetGroup || !paletteGroup) return;

    const setField = (field, value) => {
        const colorInput = paletteGroup.querySelector(`[data-color-field="${field}"]`);
        const textInput = paletteGroup.querySelector(`[data-color-text="${field}"]`);
        if (colorInput) colorInput.value = value;
        if (textInput) textInput.value = value.toUpperCase();
    };

    presetGroup.querySelectorAll('.theme-preset-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            presetGroup.querySelectorAll('.theme-preset-btn').forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            ['primary', 'accent', 'background', 'text'].forEach((field) => {
                const value = btn.getAttribute(`data-${field}`);
                if (value) setField(field, value);
            });
        });
    });

    paletteGroup.querySelectorAll('[data-color-field]').forEach((colorInput) => {
        colorInput.addEventListener('input', () => {
            const field = colorInput.getAttribute('data-color-field');
            const textInput = paletteGroup.querySelector(`[data-color-text="${field}"]`);
            if (textInput) textInput.value = colorInput.value.toUpperCase();
        });
    });

    paletteGroup.querySelectorAll('[data-color-text]').forEach((textInput) => {
        textInput.addEventListener('input', () => {
            const field = textInput.getAttribute('data-color-text');
            const colorInput = paletteGroup.querySelector(`[data-color-field="${field}"]`);
            if (colorInput && /^#[0-9A-Fa-f]{6}$/.test(textInput.value)) {
                colorInput.value = textInput.value;
            }
        });
    });
})();


// ---- index.js ----
// ---- index.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
    var label = document.getElementById('heroDateLabel');
    if (label) {
        label.textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    (function () {
        const btn = document.getElementById("refreshDataBtn");
        if (!btn) return;
        const icon = btn.querySelector("i");
        btn.addEventListener("click", () => {
            if (btn.disabled) return;
            btn.disabled = true;
            icon.classList.add("animate-spin");
            setTimeout(() => {
                icon.classList.remove("animate-spin");
                btn.disabled = false;
            }, 900);
        });
    })();
});
})();



// ---- erp-script.js ----
// ---- erp-script.js -------------------------------------------------------------
/*
Author       : Dreams Technologies
Template Name: Dreams ERP - Tailwind Admin Dashboard
*/
(function() {
	"use strict";

	// Initialize Flatpickr on elements with data-provider="flatpickr"
	document.querySelectorAll('[data-provider="flatpickr"]').forEach((el) => {
		const config = {
			disableMobile: true,
		};

		// --- 1. Handle Wrap Mode ---
		if (el.getAttribute("data-wrap") === "true") {
			config.wrap = true;

			// Crucial: This manually updates the <span> text
			config.onChange = function(selectedDates, dateStr, instance) {
				// Find the span INSIDE the current picker container
				const displaySpan = instance.element.querySelector('[data-input-span]');
				if (displaySpan) {
					displaySpan.textContent = dateStr;
				}
			};
		}

		if (el.hasAttribute("data-date-format")) {
			config.dateFormat = el.getAttribute("data-date-format");
		}
		if (el.hasAttribute("data-enable-time")) {
			config.enableTime = true;
			config.dateFormat = config.dateFormat ?
				`${config.dateFormat} H:i` :
				"Y-m-d H:i";
		}
		if (el.hasAttribute("data-altFormat")) {
			config.altInput = true;
			config.altFormat = el.getAttribute("data-altFormat");
		}
		if (el.hasAttribute("data-minDate")) {
			config.minDate = el.getAttribute("data-minDate");
		}
		if (el.hasAttribute("data-maxDate")) {
			config.maxDate = el.getAttribute("data-maxDate");
		}
		if (el.hasAttribute("data-default-date")) {
			const defaultDate = el.getAttribute("data-default-date");
			// Check if it's a valid date string
			if (
				!["true", "false", "", null].includes(defaultDate) &&
				!isNaN(Date.parse(defaultDate))
			) {
				config.defaultDate = defaultDate;
			}
		}
		if (el.hasAttribute("data-multiple-date")) {
			config.mode = "multiple";
		}
		if (el.hasAttribute("data-range-date")) {
			config.mode = "range";
		}
		if (el.hasAttribute("data-inline-date")) {
			config.inline = true;
			const inlineDate = el.getAttribute("data-inline-date");
			if (
				!["true", "false", "", null].includes(inlineDate) &&
				!isNaN(Date.parse(inlineDate))
			) {
				config.defaultDate = inlineDate;
			}
		}
		if (el.hasAttribute("data-disable-date")) {
			config.disable = el.getAttribute("data-disable-date").split(",");
		}
		if (el.hasAttribute("data-week-number")) {
			config.weekNumbers = true;
		}
		flatpickr(el, config);
	});

	// Time Picker
	document.querySelectorAll('[data-provider="timepickr"]').forEach((item) => {
		const attrs = item.attributes;
		const config = {
			enableTime: true,
			noCalendar: true,
			dateFormat: "H:i",
		};

		if (attrs["data-time-hrs"]) {
			config.time_24hr = true;
		}

		if (attrs["data-min-time"]) {
			config.minTime = attrs["data-min-time"].value;
		}

		if (attrs["data-max-time"]) {
			config.maxTime = attrs["data-max-time"].value;
		}

		if (attrs["data-default-time"]) {
			config.defaultDate = attrs["data-default-time"].value;
		}

		if (attrs["data-time-inline"]) {
			config.inline = true;
			config.defaultDate = attrs["data-time-inline"].value;
		}

		flatpickr(item, config);
	});

	// Choices
	function initChoices() {
		document.querySelectorAll("[data-choices]").forEach((item) => {
			if (item.dataset.choicesInit) return;
			item.dataset.choicesInit = "true";

			const config = {
				allowHTML: true,
			};
			const attrs = item.attributes;

			if (attrs["data-choices-groups"]) {
				config.placeholderValue = "This is a placeholder set in the config";
			}
			if (attrs["data-choices-search-false"]) {
				config.searchEnabled = false;
			}
			if (attrs["data-choices-search-true"]) {
				config.searchEnabled = true;
			}
			if (attrs["data-choices-removeItem"]) {
				config.removeItemButton = true;
			}
			if (attrs["data-choices-sorting-false"]) {
				config.shouldSort = false;
			}
			if (attrs["data-choices-sorting-true"]) {
				config.shouldSort = true;
			}
			if (attrs["data-choices-multiple-remove"]) {
				config.removeItemButton = true;
			}
			if (attrs["data-choices-limit"]) {
				config.maxItemCount = parseInt(attrs["data-choices-limit"].value);
			}
			if (attrs["data-choices-editItem-true"]) {
				config.editItems = true;
			}
			if (attrs["data-choices-editItem-false"]) {
				config.editItems = false;
			}
			if (attrs["data-choices-text-unique-true"]) {
				config.duplicateItemsAllowed = false;
			}
			if (attrs["data-choices-text-disabled-true"]) {
				config.addItems = false;
			}

			const instance = new Choices(item, config);

			if (attrs["data-choices-text-disabled-true"]) {
				instance.disable();
			}
		});
	}

	// Call it when the DOM is ready
	document.addEventListener("DOMContentLoaded", initChoices);

	// Show code preview
	document.addEventListener("click", function(e) {
		const btn = e.target.closest('[data-toggle="code"]');
		if (!btn) return;

		const card = btn.closest(".preview-card");
		const preview = card?.querySelector(".preview-content");
		const code = card?.querySelector(".code");
		const text = btn.querySelector(".code-btn");

		if (!preview || !code || !text) return;

		// Toggle visibility
		preview.classList.toggle("hidden");
		code.classList.toggle("hidden");

		// Toggle button text
		text.textContent =
			text.textContent.trim() === "Show Code" ? "Show Preview" : "Show Code";
	});

	// Copy Code
	document.addEventListener("click", function(e) {
		const copyBtn = e.target.closest("[data-copy]");
		if (!copyBtn) return;

		const code = copyBtn.closest("pre")?.querySelector("code");
		if (!code) return;

		const text = code.innerText;
		navigator.clipboard.writeText(text).then(() => {
			const span = copyBtn.querySelector("span");
			if (!span) return;

			const oldText = span.textContent;
			span.textContent = "Copied!";
			setTimeout(() => (span.textContent = oldText), 1500);
		});
	});

	document.addEventListener('DOMContentLoaded', function () {
		const masterCheckbox = document.getElementById('select-all');
		const rowCheckboxes = document.querySelectorAll('.email-checkbox');

		if (masterCheckbox) {
			// Event 1: Clicking "Select All" toggles all row checkboxes
			masterCheckbox.addEventListener('change', function () {
				const isChecked = this.checked;
				rowCheckboxes.forEach(function (checkbox) {
					checkbox.checked = isChecked;
				});
			});

			// Event 2: Unchecking a single row checkbox updates the master state
			rowCheckboxes.forEach(function (checkbox) {
				checkbox.addEventListener('change', function () {
					// Check if all individual checkboxes are currently marked true
					const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
					masterCheckbox.checked = allChecked;
					
					// Optional: Handle partial/indeterminate state
					const anyChecked = Array.from(rowCheckboxes).some(cb => cb.checked);
					masterCheckbox.indeterminate = anyChecked && !allChecked;
				});
			});
		}
	});

	document.addEventListener('DOMContentLoaded', () => {
		// Select all favorite buttons on the page
		const favButtons = document.querySelectorAll('.fav-icon');

		favButtons.forEach(button => {
			button.addEventListener('click', function() {
			// Find the icon inside the clicked button
			const icon = this.querySelector('i');
			
			if (icon) {
				// Toggle the icon fill states
				icon.classList.toggle('ph');
				icon.classList.toggle('ph-fill');
				
				// Toggle the Tailwind warning text color (yellow/gold)
				icon.classList.toggle('text-warning');
			}
			});
		});
	});

	// Collapse
	document.addEventListener('click', function(e) {
		const targetBtn = e.target.closest('[data-collapse-target]');
		if (targetBtn) {
			targetBtn.getAttribute('data-collapse-target').split(',').forEach(function(selector) {
				const box = document.querySelector(selector.trim());
				if (!box) return;
				box.style.maxHeight = (box.style.maxHeight && box.style.maxHeight !== '0px')
					? '0px'
					: box.scrollHeight + 'px';
			});
			return;
		}

		const btn = e.target.closest('[data-collapse-btn]');
		if (btn) {
			const card = btn.closest('.preview-content');
			const box = card ? card.querySelector('[data-collapse-box]') : null;
			if (!box) return;
			if (box.classList.contains('w-0')) {
				const content = box.firstElementChild;
				box.style.width = (box.style.width && box.style.width !== '0px')
					? '0px'
					: (content ? content.scrollWidth + 'px' : '350px');
			} else {
				box.style.maxHeight = (box.style.maxHeight && box.style.maxHeight !== '0px')
					? '0px'
					: box.scrollHeight + 'px';
			}
		}
	});

})();


// ---- crm-top-deals-slider.js ----
(function () {
	function initTopDealsSlider() {
		var el = document.getElementById("topDealsSlider");
		if (!el) return;
		initCarousel(el, {
			prevClass: "top-deals-arrow top-deals-arrow--prev",
			nextClass: "top-deals-arrow top-deals-arrow--next",
		});
	}

	document.addEventListener("DOMContentLoaded", initTopDealsSlider);
})();


// ---- products-list.js ----------------------------------------------------------
(function () {
// ---- Date range picker ----------------------------------------------------
const dateRangeEl = document.getElementById("productsDateRange");
if (dateRangeEl && typeof flatpickr !== "undefined") {
  const productsDateFp = flatpickr(dateRangeEl, {
    mode: "range",
    showMonths: window.drpMonthsForViewport ? window.drpMonthsForViewport() : (window.innerWidth < 640 ? 1 : 2),
    dateFormat: "M j",
    defaultDate: ["2026-07-01", "2026-07-20"],
    onReady: (selectedDates, dateStr, instance) => {
      instance.input.value = dateStr.replace(" to ", " – ");
    },
    onChange: (selectedDates, dateStr, instance) => {
      if (selectedDates.length === 2) instance.input.value = dateStr.replace(" to ", " – ");
    },
  });
  window.drpRegisterInstance?.(productsDateFp);
}

// ---- Filter drawer -----------------------------------------------------
document.addEventListener("click", (e) => {
  const openTrigger = e.target.closest("[data-drawer-open]");
  if (openTrigger) {
    const panel = document.getElementById(openTrigger.dataset.drawerOpen);
    const backdrop = document.querySelector(".drawer-backdrop");
    if (panel) { panel.classList.remove("hidden"); requestAnimationFrame(() => panel.classList.add("is-open")); }
    if (backdrop) backdrop.classList.remove("hidden");
    return;
  }
  const closeTrigger = e.target.closest("[data-drawer-close]");
  if (closeTrigger) {
    const panel = document.getElementById(closeTrigger.dataset.drawerClose) || closeTrigger.closest(".drawer-panel");
    closeDrawer(panel);
  }
});

function closeDrawer(panel) {
  if (!panel) return;
  panel.classList.remove("is-open");
  const backdrop = document.querySelector(".drawer-backdrop");
  window.setTimeout(() => {
    panel.classList.add("hidden");
    if (backdrop) backdrop.classList.add("hidden");
  }, 250);
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll(".drawer-panel.is-open").forEach(closeDrawer);
});

// ---- Bulk selection ------------------------------------------------------
const selectAll = document.getElementById("selectAllRows");
const rowCheckboxes = () => Array.from(document.querySelectorAll(".row-select"));
const bulkBar = document.getElementById("bulkActionsBar");
const bulkCount = document.getElementById("bulkCount");

function refreshBulkBar() {
  const checked = rowCheckboxes().filter((c) => c.checked);
  if (!bulkBar || !bulkCount) return;
  bulkBar.classList.toggle("hidden", checked.length === 0);
  bulkCount.textContent = checked.length;
  if (selectAll) selectAll.checked = checked.length > 0 && checked.length === rowCheckboxes().length;
}

if (selectAll) {
  selectAll.addEventListener("change", () => {
    rowCheckboxes().forEach((c) => { c.checked = selectAll.checked; });
    refreshBulkBar();
  });
}

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("row-select")) refreshBulkBar();
});

// ---- Advanced Filters drawer ---------------------------------------------
const filterDrawerEl = document.getElementById("filterDrawer");

if (filterDrawerEl) {
  const chipsList = document.getElementById("filterChipsList");
  const chipsEmpty = document.getElementById("filterChipsEmpty");
  const activeBadge = document.getElementById("filterActiveBadge");
  const categoryCount = document.getElementById("categorySelectedCount");
  const brandSelect = document.getElementById("brandFilterSelect");
  const priceMinInput = document.getElementById("priceMinInput");
  const priceMaxInput = document.getElementById("priceMaxInput");
  const priceTrack = document.getElementById("priceRangeTrack");
  const priceFill = document.getElementById("priceRangeFill");
  const priceHandleMin = document.getElementById("priceHandleMin");
  const priceHandleMax = document.getElementById("priceHandleMax");
  const priceLabel = document.getElementById("priceRangeLabel");
  const ratingGroup = document.getElementById("ratingGroup");
  const tagGroup = document.getElementById("tagGroup");

  // This drawer content (price slider, rating/tag groups, brand select) is specific to
  // products-list.html/products-grid.html; other pages reuse the #filterDrawer id for a
  // differently-structured drawer, so bail out unless the full set of controls is present.
  if (!priceMinInput || !priceMaxInput || !priceTrack || !priceHandleMin || !priceHandleMax
      || !ratingGroup || !tagGroup || !brandSelect) {
    return;
  }

  const PRICE_BOUNDS = { min: 0, max: 1000 };

  function styleToggleBtn(btn, active, activeBg) {
    btn.classList.toggle("is-active", active);
    if (active) {
      btn.style.background = activeBg;
      btn.style.color = "#fff";
    } else {
      btn.style.background = "var(--surface-sunken)";
      btn.style.color = "var(--text-secondary)";
    }
  }

  function paintToggleGroups() {
    ratingGroup.querySelectorAll(".rating-btn").forEach((btn) => {
      styleToggleBtn(btn, btn.classList.contains("is-active"), "var(--color-warning-500)");
    });
    tagGroup.querySelectorAll(".tag-btn").forEach((btn) => {
      styleToggleBtn(btn, btn.classList.contains("is-active"), "var(--color-primary-600)");
    });
  }

  // ---- Category count ----
  function refreshCategoryCount() {
    const n = document.querySelectorAll(".category-check:checked").length;
    if (categoryCount) categoryCount.textContent = `${n} selected`;
  }

  // ---- Price slider ----
  function valueToPercent(v) {
    return ((v - PRICE_BOUNDS.min) / (PRICE_BOUNDS.max - PRICE_BOUNDS.min)) * 100;
  }
  function percentToValue(p) {
    return Math.round(PRICE_BOUNDS.min + (p / 100) * (PRICE_BOUNDS.max - PRICE_BOUNDS.min));
  }
  function renderPriceSlider() {
    const min = Number(priceMinInput.value);
    const max = Number(priceMaxInput.value);
    const minPct = valueToPercent(min);
    const maxPct = valueToPercent(max);
    priceHandleMin.style.left = `${minPct}%`;
    priceHandleMax.style.left = `${maxPct}%`;
    priceFill.style.left = `${minPct}%`;
    priceFill.style.right = `${100 - maxPct}%`;
    priceLabel.textContent = `$${min} – $${max}`;
  }
  function setPriceFromInputs() {
    let min = Math.max(PRICE_BOUNDS.min, Math.min(Number(priceMinInput.value) || 0, PRICE_BOUNDS.max));
    let max = Math.max(PRICE_BOUNDS.min, Math.min(Number(priceMaxInput.value) || PRICE_BOUNDS.max, PRICE_BOUNDS.max));
    if (min > max) { const t = min; min = max; max = t; }
    priceMinInput.value = min;
    priceMaxInput.value = max;
    renderPriceSlider();
    renderFilterChips();
  }
  if (priceMinInput && priceMaxInput) {
    [priceMinInput, priceMaxInput].forEach((input) => {
      input.addEventListener("input", setPriceFromInputs);
    });
  }

  function dragHandle(handle, isMin) {
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      handle.classList.add("cursor-grabbing");

      function onMove(ev) {
        const rect = priceTrack.getBoundingClientRect();
        let pct = ((ev.clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        let value = percentToValue(pct);
        if (isMin) {
          value = Math.min(value, Number(priceMaxInput.value));
          priceMinInput.value = value;
        } else {
          value = Math.max(value, Number(priceMinInput.value));
          priceMaxInput.value = value;
        }
        renderPriceSlider();
      }
      function onUp() {
        handle.classList.remove("cursor-grabbing");
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        renderFilterChips();
      }
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    });
  }
  dragHandle(priceHandleMin, true);
  dragHandle(priceHandleMax, false);

  // ---- Rating (single-select, click again to clear) ----
  ratingGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".rating-btn");
    if (!btn) return;
    const wasActive = btn.classList.contains("is-active");
    ratingGroup.querySelectorAll(".rating-btn").forEach((b) => b.classList.remove("is-active"));
    if (!wasActive) btn.classList.add("is-active");
    paintToggleGroups();
    renderFilterChips();
  });

  // ---- Tags (multi-select) ----
  tagGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag-btn");
    if (!btn) return;
    btn.classList.toggle("is-active");
    paintToggleGroups();
    renderFilterChips();
  });

  // ---- Status / Category checkboxes ----
  document.querySelectorAll(".filter-check").forEach((chk) => {
    chk.addEventListener("change", () => {
      refreshCategoryCount();
      renderFilterChips();
    });
  });

  // ---- Brand select ----
  brandSelect.addEventListener("change", renderFilterChips);

  // ---- Chip rendering ----
  function renderFilterChips() {
    const chips = [];

    document.querySelectorAll(".filter-check:checked").forEach((chk) => {
      chips.push({ label: chk.dataset.label, onRemove: () => { chk.checked = false; refreshCategoryCount(); renderFilterChips(); } });
    });

    const activeRating = ratingGroup.querySelector(".rating-btn.is-active");
    if (activeRating) {
      chips.push({ label: `${activeRating.dataset.value} Rating`, onRemove: () => { activeRating.classList.remove("is-active"); paintToggleGroups(); renderFilterChips(); } });
    }

    tagGroup.querySelectorAll(".tag-btn.is-active").forEach((btn) => {
      chips.push({ label: btn.dataset.value, onRemove: () => { btn.classList.remove("is-active"); paintToggleGroups(); renderFilterChips(); } });
    });

    if (brandSelect.value !== "All Brands") {
      chips.push({ label: brandSelect.value, onRemove: () => { brandSelect.value = "All Brands"; renderFilterChips(); } });
    }

    const min = Number(priceMinInput.value);
    const max = Number(priceMaxInput.value);
    if (min !== PRICE_BOUNDS.min || max !== PRICE_BOUNDS.max) {
      chips.push({ label: `$${min} – $${max}`, onRemove: () => { priceMinInput.value = PRICE_BOUNDS.min; priceMaxInput.value = PRICE_BOUNDS.max; renderPriceSlider(); renderFilterChips(); } });
    }

    chipsList.innerHTML = "";
    chips.forEach((chip) => {
      const el = document.createElement("span");
      el.className = "inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-semibold";
      el.style.background = "var(--surface-card)";
      el.style.border = "1px solid var(--border-subtle)";
      el.textContent = chip.label;
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "grid place-items-center size-4 rounded-full hover:bg-[var(--surface-sunken)]";
      removeBtn.innerHTML = '<i class="icon-x text-[9px]"></i>';
      removeBtn.addEventListener("click", chip.onRemove);
      el.appendChild(removeBtn);
      chipsList.appendChild(el);
    });

    chipsEmpty.classList.toggle("hidden", chips.length > 0);
    activeBadge.textContent = `${chips.length} active`;

    const applyBtn = document.getElementById("filterApplyBtn");
    if (applyBtn) {
      const total = 128;
      const shown = Math.max(4, total - chips.length * 17);
      applyBtn.textContent = `Show ${shown} Results`;
    }
  }

  // ---- Clear all / Reset ----
  function resetAllFilters() {
    document.querySelectorAll(".filter-check").forEach((chk) => { chk.checked = false; });
    ratingGroup.querySelectorAll(".rating-btn").forEach((b) => b.classList.remove("is-active"));
    tagGroup.querySelectorAll(".tag-btn").forEach((b) => b.classList.remove("is-active"));
    brandSelect.value = "All Brands";
    priceMinInput.value = PRICE_BOUNDS.min;
    priceMaxInput.value = PRICE_BOUNDS.max;
    paintToggleGroups();
    refreshCategoryCount();
    renderPriceSlider();
    renderFilterChips();
  }

  document.getElementById("filterClearAllBtn").addEventListener("click", resetAllFilters);
  document.getElementById("filterResetBtn").addEventListener("click", resetAllFilters);

  // ---- Init ----
  paintToggleGroups();
  refreshCategoryCount();
  renderPriceSlider();
  renderFilterChips();
}

// Generic modal open/close, Escape handling, and Import/Export modal wiring are handled
// globally by ui-interactions.js and import-export.js — this page no longer needs its own
// copies (having both caused the modal to open without the "is-open" state, which broke
// Escape-to-close and left duplicate drag/drop listeners attached).

// ---- Generic Action confirm modal -------------------------------------------
(function () {
  const modal = document.getElementById("actionModal");
  if (!modal) return;

  const CONFIG = {
    duplicate: { title: "Duplicate product?", message: "A copy of this product will be created as a draft.", icon: "icon-copy", bg: "var(--color-primary-100)", color: "var(--color-primary-700)", confirmBg: "var(--color-primary-600)", confirmLabel: "Duplicate" },
    archive: { title: "Archive product?", message: "Archived products are hidden from your storefront but not deleted.", icon: "icon-archive", bg: "var(--color-warning-100)", color: "var(--color-warning-700)", confirmBg: "var(--color-warning-600)", confirmLabel: "Archive" },
    publish: { title: "Publish product?", message: "This product will become visible on your live storefront.", icon: "icon-badge-check", bg: "var(--color-success-100)", color: "var(--color-success-700)", confirmBg: "var(--color-success-600)", confirmLabel: "Publish" },
    delete: { title: "Delete product?", message: "This action cannot be undone. The product will be permanently removed.", icon: "icon-trash-2", bg: "var(--color-danger-100)", color: "var(--color-danger-700)", confirmBg: "var(--color-danger-600)", confirmLabel: "Delete" },
    category: { title: "Assign category", message: "Choose a category to apply to the selected products.", icon: "icon-tag", bg: "var(--color-primary-100)", color: "var(--color-primary-700)", confirmBg: "var(--color-primary-600)", confirmLabel: "Apply" },
  };

  window.openActionModal = function (type, isBulk) {
    const cfg = CONFIG[type];
    if (!cfg) return;
    const iconWrap = document.getElementById("actionModalIcon");
    iconWrap.style.background = cfg.bg;
    iconWrap.style.color = cfg.color;
    iconWrap.querySelector("i").className = `${cfg.icon} text-[18px]`;
    document.getElementById("actionModalTitle").textContent = isBulk ? cfg.title.replace("product", "products") : cfg.title;
    document.getElementById("actionModalMessage").textContent = isBulk
      ? `This will apply to ${document.querySelectorAll(".row-select:checked").length} selected product(s).`
      : cfg.message;
    const confirmBtn = document.getElementById("actionModalConfirmBtn");
    confirmBtn.textContent = cfg.confirmLabel;
    confirmBtn.style.background = cfg.confirmBg;
    confirmBtn.style.color = "#fff";
    document.getElementById("actionModalCategorySelect").classList.toggle("hidden", type !== "category");
    window.openModal("actionModal");
  };

  window.confirmActionModal = function () {
    window.closeModal("actionModal");
  };
})();

// ---- Share modal --------------------------------------------------------------
window.openShareModal = function () {
  window.openModal("shareModal");
};
window.copyShareLink = function () {
  const input = document.getElementById("shareLinkInput");
  input.select();
  navigator.clipboard && navigator.clipboard.writeText(input.value).catch(() => {});
  const btn = document.getElementById("shareCopyBtn");
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="icon-check text-[12px]"></i>Copied';
  setTimeout(() => { btn.innerHTML = original; }, 1500);
};

// ---- Activity modal -------------------------------------------------------------
window.openActivityModal = function () {
  window.openModal("activityModal");
};

// ---- List action + activity triggers (data-list-action / data-open-activity-modal) --------
document.addEventListener("click", (e) => {
  const listActionTrigger = e.target.closest("[data-list-action]");
  if (listActionTrigger) {
    window.openActionModal(listActionTrigger.dataset.listAction, listActionTrigger.hasAttribute("data-list-action-bulk"));
    return;
  }
  const activityTrigger = e.target.closest("[data-open-activity-modal]");
  if (activityTrigger) {
    window.openActivityModal();
  }
});
})();


// ---- list-toolkit.js -----------------------------------------------------------
(function () {
// ============================================================================
// list-toolkit.js — ONE shared, data-attribute-driven script for every list
// page (toolbar filters, advanced-filter offcanvas, manage-columns, bulk
// actions, generic confirm/share modals). No page should ship its own copy
// of this logic — just markup driven by the classes/ids documented below.
// ============================================================================

// ---- Selectable option cards (any group with class="js-option-group") ----
// Buttons inside carry class="js-option-btn" plus data-active-class /
// data-inactive-class (and optionally the same on a child <i> icon).
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".js-option-btn");
  if (!btn) return;
  const group = btn.closest(".js-option-group");
  if (!group) return;
  group.querySelectorAll(".js-option-btn").forEach((b) => {
    const isActive = b === btn;
    b.className = isActive ? b.dataset.activeClass : b.dataset.inactiveClass;
    const icon = b.querySelector("[data-active-class][data-inactive-class]");
    if (icon) icon.className = isActive ? icon.dataset.activeClass : icon.dataset.inactiveClass;
  });
});

// ---- Date range picker (any input with class="js-date-range") ------------
document.querySelectorAll(".js-date-range").forEach((el) => {
  if (typeof flatpickr === "undefined") return;
  const start = el.dataset.start || "2026-07-01";
  const end = el.dataset.end || "2026-07-20";
  const jsDateRangeFp = flatpickr(el, {
    mode: "range",
    showMonths: window.drpMonthsForViewport ? window.drpMonthsForViewport() : (window.innerWidth < 640 ? 1 : 2),
    dateFormat: "M j",
    defaultDate: [start, end],
    onReady: (selectedDates, dateStr, instance) => {
      instance.input.value = dateStr.replace(" to ", " – ");
    },
    onChange: (selectedDates, dateStr, instance) => {
      if (selectedDates.length === 2) instance.input.value = dateStr.replace(" to ", " – ");
    },
  });
  window.drpRegisterInstance?.(jsDateRangeFp);
});

// ---- Filter drawer (generic, data-attribute driven) ----------------------
document.addEventListener("click", (e) => {
  const openTrigger = e.target.closest("[data-drawer-open]");
  if (openTrigger) {
    const panel = document.getElementById(openTrigger.dataset.drawerOpen);
    const backdrop = document.querySelector(".drawer-backdrop");
    if (panel) { panel.classList.remove("hidden"); requestAnimationFrame(() => panel.classList.add("is-open")); }
    if (backdrop) backdrop.classList.remove("hidden");
    return;
  }
  const closeTrigger = e.target.closest("[data-drawer-close]");
  if (closeTrigger) {
    const panel = document.getElementById(closeTrigger.dataset.drawerClose) || closeTrigger.closest(".drawer-panel");
    closeDrawer(panel);
  }
});

function closeDrawer(panel) {
  if (!panel) return;
  panel.classList.remove("is-open");
  const backdrop = document.querySelector(".drawer-backdrop");
  window.setTimeout(() => {
    panel.classList.add("hidden");
    if (backdrop) backdrop.classList.add("hidden");
  }, 250);
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.querySelectorAll(".drawer-panel.is-open").forEach(closeDrawer);
});

// ---- Bulk selection (generic: #selectAll + .row-select + #bulkBar/#bulkCount) --
const selectAll = document.getElementById("selectAll");
const rowCheckboxes = () => Array.from(document.querySelectorAll(".row-select"));
const bulkBar = document.getElementById("bulkBar");
const bulkCount = document.getElementById("bulkCount");

function refreshBulkBar() {
  const checked = rowCheckboxes().filter((c) => c.checked);
  if (!bulkBar || !bulkCount) return;
  bulkBar.classList.toggle("hidden", checked.length === 0);
  bulkCount.textContent = checked.length;
  if (selectAll) selectAll.checked = checked.length > 0 && checked.length === rowCheckboxes().length;
}

if (selectAll) {
  selectAll.addEventListener("change", () => {
    rowCheckboxes().forEach((c) => { c.checked = selectAll.checked; });
    refreshBulkBar();
  });
}

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("row-select")) refreshBulkBar();
});

// ---- Advanced Filters drawer: chips, checkboxes, tags, selects, sliders --
(function () {
  const filterDrawerEl = document.getElementById("filterDrawer");
  if (!filterDrawerEl) return;

  // products-list.html/products-grid.html have their own dedicated handler block above
  // (price slider + rating/tag groups + brand select); skip here to avoid double-binding
  // click listeners to the same .rating-btn/.tag-btn elements.
  if (document.getElementById("ratingGroup") && document.getElementById("tagGroup") && document.getElementById("brandFilterSelect")) {
    return;
  }

  const chipsList = document.getElementById("filterChipsList");
  const chipsEmpty = document.getElementById("filterChipsEmpty");
  const activeBadge = document.getElementById("filterActiveBadge");
  const applyBtn = document.getElementById("filterApplyBtn");

  function styleToggleBtn(btn, active, activeBg) {
    btn.classList.toggle("is-active", active);
    if (active) {
      btn.style.background = activeBg;
      btn.style.color = "#fff";
    } else {
      btn.style.background = "var(--surface-sunken)";
      btn.style.color = "var(--text-secondary)";
    }
  }

  function paintToggleGroups() {
    filterDrawerEl.querySelectorAll(".rating-btn").forEach((btn) => styleToggleBtn(btn, btn.classList.contains("is-active"), "var(--color-warning-500)"));
    filterDrawerEl.querySelectorAll(".tag-btn").forEach((btn) => styleToggleBtn(btn, btn.classList.contains("is-active"), "var(--color-primary-600)"));
  }
  paintToggleGroups();

  // ---- Range sliders (any .range-slider block) ----
  const sliders = Array.from(filterDrawerEl.querySelectorAll(".range-slider")).map((el) => {
    const bounds = { min: Number(el.dataset.min || 0), max: Number(el.dataset.max || 1000) };
    const prefix = el.dataset.prefix || "";
    return {
      el,
      bounds,
      prefix,
      track: el.querySelector(".range-track"),
      fill: el.querySelector(".range-fill"),
      handleMin: el.querySelector(".range-handle-min"),
      handleMax: el.querySelector(".range-handle-max"),
      minInput: el.querySelector(".range-min-input"),
      maxInput: el.querySelector(".range-max-input"),
      label: el.querySelector(".range-label"),
    };
  });

  function valueToPercent(bounds, v) {
    return ((v - bounds.min) / (bounds.max - bounds.min)) * 100;
  }
  function percentToValue(bounds, p) {
    return Math.round(bounds.min + (p / 100) * (bounds.max - bounds.min));
  }
  function renderSlider(s) {
    if (!s.minInput || !s.maxInput) return;
    const min = Number(s.minInput.value);
    const max = Number(s.maxInput.value);
    const minPct = valueToPercent(s.bounds, min);
    const maxPct = valueToPercent(s.bounds, max);
    if (s.handleMin) s.handleMin.style.left = `${minPct}%`;
    if (s.handleMax) s.handleMax.style.left = `${maxPct}%`;
    if (s.fill) { s.fill.style.left = `${minPct}%`; s.fill.style.right = `${100 - maxPct}%`; }
    if (s.label) s.label.textContent = `${s.prefix}${min} – ${s.prefix}${max}`;
  }
  function setSliderFromInputs(s) {
    let min = Math.max(s.bounds.min, Math.min(Number(s.minInput.value) || 0, s.bounds.max));
    let max = Math.max(s.bounds.min, Math.min(Number(s.maxInput.value) || s.bounds.max, s.bounds.max));
    if (min > max) { const t = min; min = max; max = t; }
    s.minInput.value = min;
    s.maxInput.value = max;
    renderSlider(s);
    renderFilterChips();
  }
  function dragHandle(s, handle, isMin) {
    if (!handle) return;
    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      handle.classList.add("cursor-grabbing");

      function onMove(ev) {
        const rect = s.track.getBoundingClientRect();
        let pct = ((ev.clientX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        let value = percentToValue(s.bounds, pct);
        if (isMin) {
          value = Math.min(value, Number(s.maxInput.value));
          s.minInput.value = value;
        } else {
          value = Math.max(value, Number(s.minInput.value));
          s.maxInput.value = value;
        }
        renderSlider(s);
      }
      function onUp() {
        handle.classList.remove("cursor-grabbing");
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        renderFilterChips();
      }
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    });
  }
  sliders.forEach((s) => {
    if (s.minInput) s.minInput.addEventListener("input", () => setSliderFromInputs(s));
    if (s.maxInput) s.maxInput.addEventListener("input", () => setSliderFromInputs(s));
    dragHandle(s, s.handleMin, true);
    dragHandle(s, s.handleMax, false);
  });

  // ---- Category-style live counters (any [data-count-target] wired to a group of checkboxes) ----
  function refreshLiveCounts() {
    filterDrawerEl.querySelectorAll("[data-count-target]").forEach((counter) => {
      const group = counter.dataset.countTarget;
      const n = filterDrawerEl.querySelectorAll(`.filter-check[data-group="${group}"]:checked`).length;
      counter.textContent = `${n} selected`;
    });
  }

  // ---- Rating (single-select, click again to clear) ----
  filterDrawerEl.querySelectorAll(".rating-btn, .tag-btn").forEach((btn) => {
    const group = btn.closest(".rating-btn") ? filterDrawerEl.querySelectorAll(".rating-btn") : null;
  });
  filterDrawerEl.addEventListener("click", (e) => {
    const ratingBtn = e.target.closest(".rating-btn");
    if (ratingBtn) {
      const groupEl = ratingBtn.parentElement;
      const wasActive = ratingBtn.classList.contains("is-active");
      groupEl.querySelectorAll(".rating-btn").forEach((b) => b.classList.remove("is-active"));
      if (!wasActive) ratingBtn.classList.add("is-active");
      paintToggleGroups();
      renderFilterChips();
      return;
    }
    const tagBtn = e.target.closest(".tag-btn");
    if (tagBtn) {
      tagBtn.classList.toggle("is-active");
      paintToggleGroups();
      renderFilterChips();
    }
  });

  // ---- Status / Category checkboxes ----
  filterDrawerEl.querySelectorAll(".filter-check").forEach((chk) => {
    chk.addEventListener("change", () => { refreshLiveCounts(); renderFilterChips(); });
  });

  // ---- Selects that should surface a chip when not at their default value ----
  filterDrawerEl.querySelectorAll(".filter-select").forEach((sel) => {
    if (!sel.dataset.default) sel.dataset.default = sel.options[0] ? sel.options[0].text : "";
    sel.addEventListener("change", renderFilterChips);
  });

  // ---- Chip rendering ----
  function renderFilterChips() {
    if (!chipsList) return;
    const chips = [];

    filterDrawerEl.querySelectorAll(".filter-check:checked").forEach((chk) => {
      chips.push({ label: chk.dataset.label || chk.value, onRemove: () => { chk.checked = false; refreshLiveCounts(); renderFilterChips(); } });
    });

    filterDrawerEl.querySelectorAll(".rating-btn.is-active").forEach((btn) => {
      chips.push({ label: `${btn.dataset.value} Rating`, onRemove: () => { btn.classList.remove("is-active"); paintToggleGroups(); renderFilterChips(); } });
    });

    filterDrawerEl.querySelectorAll(".tag-btn.is-active").forEach((btn) => {
      chips.push({ label: btn.dataset.value, onRemove: () => { btn.classList.remove("is-active"); paintToggleGroups(); renderFilterChips(); } });
    });

    filterDrawerEl.querySelectorAll(".filter-select").forEach((sel) => {
      if (sel.value !== sel.dataset.default) {
        chips.push({ label: sel.value, onRemove: () => { sel.value = sel.dataset.default; renderFilterChips(); } });
      }
    });

    sliders.forEach((s) => {
      if (!s.minInput || !s.maxInput) return;
      const min = Number(s.minInput.value);
      const max = Number(s.maxInput.value);
      if (min !== s.bounds.min || max !== s.bounds.max) {
        chips.push({
          label: `${s.prefix}${min} – ${s.prefix}${max}`,
          onRemove: () => { s.minInput.value = s.bounds.min; s.maxInput.value = s.bounds.max; renderSlider(s); renderFilterChips(); },
        });
      }
    });

    chipsList.innerHTML = "";
    chips.forEach((chip) => {
      const el = document.createElement("span");
      el.className = "inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-semibold";
      el.style.background = "var(--surface-card)";
      el.style.border = "1px solid var(--border-subtle)";
      el.textContent = chip.label;
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "grid place-items-center size-4 rounded-full hover:bg-[var(--surface-sunken)]";
      removeBtn.innerHTML = '<i class="icon-x text-[9px]"></i>';
      removeBtn.addEventListener("click", chip.onRemove);
      el.appendChild(removeBtn);
      chipsList.appendChild(el);
    });

    if (chipsEmpty) chipsEmpty.classList.toggle("hidden", chips.length > 0);
    if (activeBadge) activeBadge.textContent = `${chips.length} active`;

    if (applyBtn && applyBtn.dataset.total) {
      const total = Number(applyBtn.dataset.total);
      const perChip = Number(applyBtn.dataset.perChip || Math.round(total * 0.1));
      const shown = Math.max(Math.round(total * 0.03), total - chips.length * perChip);
      applyBtn.textContent = `Show ${shown.toLocaleString()} Results`;
    }
  }

  // ---- Clear all / Reset ----
  function resetAllFilters() {
    filterDrawerEl.querySelectorAll(".filter-check").forEach((chk) => { chk.checked = false; });
    filterDrawerEl.querySelectorAll(".rating-btn, .tag-btn").forEach((b) => b.classList.remove("is-active"));
    filterDrawerEl.querySelectorAll(".filter-select").forEach((sel) => { sel.value = sel.dataset.default; });
    sliders.forEach((s) => { if (s.minInput && s.maxInput) { s.minInput.value = s.bounds.min; s.maxInput.value = s.bounds.max; renderSlider(s); } });
    paintToggleGroups();
    refreshLiveCounts();
    renderFilterChips();
  }

  const clearAllBtn = document.getElementById("filterClearAllBtn");
  const resetBtn = document.getElementById("filterResetBtn");
  if (clearAllBtn) clearAllBtn.addEventListener("click", resetAllFilters);
  if (resetBtn) resetBtn.addEventListener("click", resetAllFilters);

  // ---- Init ----
  paintToggleGroups();
  refreshLiveCounts();
  sliders.forEach(renderSlider);
  renderFilterChips();
})();

// ---- Generic Action confirm modal (any trigger: data-action-modal + dataset, onclick="openActionModal(this)") --
// Guarded: a couple of legacy pages (e.g. products-list.js) still define their own
// string-keyed openActionModal(type, isBulk); don't clobber those.
if (!window.openActionModal) window.openActionModal = function (trigger, isBulk) {
  const modal = document.getElementById("actionModal");
  if (!modal || !trigger) return;
  const d = trigger.dataset;
  const iconWrap = document.getElementById("actionModalIcon");
  iconWrap.style.background = d.bg || "var(--color-danger-100)";
  iconWrap.style.color = d.color || "var(--color-danger-700)";
  iconWrap.querySelector("i").className = `${d.icon || "icon-alert-triangle"} text-[18px]`;
  document.getElementById("actionModalTitle").textContent = isBulk && d.titleBulk ? d.titleBulk : d.title || "Confirm";
  document.getElementById("actionModalMessage").textContent = isBulk
    ? `This will apply to ${document.querySelectorAll(".row-select:checked").length} selected item(s).`
    : d.message || "";
  const confirmBtn = document.getElementById("actionModalConfirmBtn");
  confirmBtn.textContent = d.confirmLabel || "Confirm";
  confirmBtn.style.background = d.confirmBg || "var(--color-danger-600)";
  confirmBtn.style.color = "#fff";
  const categorySelect = document.getElementById("actionModalCategorySelect");
  if (categorySelect) categorySelect.classList.toggle("hidden", !d.showSelect);
  window.openModal("actionModal");
};

if (!window.confirmActionModal) window.confirmActionModal = function () {
  window.closeModal("actionModal");
};

// ---- Share modal ------------------------------------------------------------
if (!window.openShareModal) window.openShareModal = function (link) {
  const input = document.getElementById("shareLinkInput");
  if (input && link) input.value = link;
  window.openModal("shareModal");
};
if (!window.copyShareLink) window.copyShareLink = function () {
  const input = document.getElementById("shareLinkInput");
  if (!input) return;
  input.select();
  navigator.clipboard && navigator.clipboard.writeText(input.value).catch(() => {});
  const btn = document.getElementById("shareCopyBtn");
  if (!btn) return;
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="icon-check text-[12px]"></i>Copied';
  setTimeout(() => { btn.innerHTML = original; }, 1500);
};

// ---- Activity modal (generic passthrough) -----------------------------------
if (!window.openActivityModal) window.openActivityModal = function () {
  window.openModal("activityModal");
};

// ---- Slide-over drawer (generic, id + <id>Backdrop convention) -----------
document.addEventListener("click", (e) => {
  const openTrigger = e.target.closest("[data-slide-drawer-open]");
  if (openTrigger) {
    const id = openTrigger.dataset.slideDrawerOpen;
    const panel = document.getElementById(id);
    const backdrop = document.getElementById(id + "Backdrop");
    if (panel) panel.classList.remove("translate-x-full");
    if (backdrop) backdrop.classList.remove("hidden");
    return;
  }
  const closeTrigger = e.target.closest("[data-slide-drawer-close]");
  if (closeTrigger) {
    const id = closeTrigger.dataset.slideDrawerClose;
    const panel = document.getElementById(id);
    const backdrop = document.getElementById(id + "Backdrop");
    if (panel) panel.classList.add("translate-x-full");
    if (backdrop) backdrop.classList.add("hidden");
  }
});
})();


// ---- dragula.js ----------------------------------------------------------------
(function () {
if (typeof dragula === "undefined") return;
  if (!document.querySelector('[data-plugin="dragula"]')) return;

  class Dragula {
    initDragula() {
      document.querySelectorAll('[data-plugin="dragula"]').forEach(function (t) {
        var a = t.getAttribute("data-containers"), n = [],
          e = (a ? (a = JSON.parse(a)).forEach(function (t) { n.push(document.getElementById(t)); }) : n = [t], t.getAttribute("data-handleclass"));
        e ? dragula(n, { moves: function (t, a, n) { return n.classList.contains(e); } }) : dragula(n);
      });
    }
    init() {
      this.initDragula();
    }
  }
  document.addEventListener("DOMContentLoaded", function (t) {
    (new Dragula()).init();
  });
})();


// ---- lightbox.js ---------------------------------------------------------------
(function () {
if (typeof GLightbox === "undefined") return;
  if (!document.querySelector(".image-popup, .image-popup-desc, .image-popup-video-map")) return;

  const lightbox = GLightbox({ selector: ".image-popup", title: false });
  const lightboxDesc = GLightbox({ selector: ".image-popup-desc" });
  const lightboxvideo = GLightbox({ selector: ".image-popup-video-map", title: false });
})();


// ---- flight-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById("wizardStep1") || !document.getElementById("flightNumber")) return;

  function addCrewRow() {
    const wrap = document.getElementById("crewRows");
    const row = document.createElement("div");
    row.className = "crew-row flex items-center gap-2.5 p-3 rounded-lg u-background-surface-sunken";
    row.innerHTML = `
      <input type="text" placeholder="Crew member name" class="crew-name flex-1 py-2 px-2.5 text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle_bor">
      <input type="text" placeholder="Role" class="crew-role flex-1 py-2 px-2.5 text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle_bor">
      <button type="button" class="header-icon-btn !size-8 u-color-color-danger-600 crew-row-remove"><i class="icon-circle-minus text-[14px]"></i></button>
    `;
    wrap.appendChild(row);
  }

  function renderReview() {
    document.getElementById("reviewFlightInfo").innerHTML = `
      <div><p class="u-color-text-tertiary">Flight Number</p><p class="font-semibold">${document.getElementById("flightNumber").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Airline</p><p class="font-semibold">${document.getElementById("flightAirline").value}</p></div>
      <div><p class="u-color-text-tertiary">Departure Airport</p><p class="font-semibold">${document.getElementById("flightDeparture").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Arrival Airport</p><p class="font-semibold">${document.getElementById("flightArrival").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Departure Date/Time</p><p class="font-semibold">${document.getElementById("flightDepartureTime").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Aircraft</p><p class="font-semibold">${document.getElementById("flightAircraft").value}</p></div>
    `;

    const rows = Array.from(document.querySelectorAll(".crew-row")).map((row) => {
      const name = row.querySelector(".crew-name")?.value.trim() || "Unnamed crew";
      const role = row.querySelector(".crew-role")?.value.trim() || "&mdash;";
      return `<div class="flex items-center justify-between p-2.5 rounded-lg u-background-surface-sunken"><span>${name}</span><span class="font-semibold">${role}</span></div>`;
    });
    document.getElementById("reviewCrew").innerHTML = rows.join("") || `<p class="u-color-text-tertiary">No crew added.</p>`;

    document.getElementById("reviewFarePricing").innerHTML = `
      <div><p class="u-color-text-tertiary">Economy Fare</p><p class="font-semibold">${document.getElementById("fareEconomy").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Premium Economy Fare</p><p class="font-semibold">${document.getElementById("farePremium").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Business Fare</p><p class="font-semibold">${document.getElementById("fareBusiness").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Fuel Surcharge</p><p class="font-semibold">${document.getElementById("fareSurcharge").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Airport Taxes</p><p class="font-semibold">${document.getElementById("fareTaxes").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Service Fee</p><p class="font-semibold">${document.getElementById("fareServiceFee").value.trim() || "&mdash;"}</p></div>
    `;
  }

  window.initWizard({
    steps: 3,
    finalLabel: "Create Flight",
    onStepChange: (step) => { if (step === 3) renderReview(); },
    onComplete: () => { window.location.href = "flights-list"; },
  });

  document.getElementById("addCrewRowBtn")?.addEventListener("click", addCrewRow);
  document.getElementById("crewRows")?.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".crew-row-remove");
    if (removeBtn) removeBtn.closest(".crew-row").remove();
  });
});
})();


// ---- booking-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById("wizardStep1") || !document.getElementById("bookingGuestName")) return;

  function renderReview() {
    document.getElementById("reviewBookingInfo").innerHTML = `
      <div><p class="text-tertiary">Guest Name</p><p class="font-semibold">${document.getElementById("bookingGuestName").value.trim() || "&mdash;"}</p></div>
      <div><p class="text-tertiary">Service Type</p><p class="font-semibold">${document.getElementById("bookingServiceType").value}</p></div>
      <div><p class="text-tertiary">Reference</p><p class="font-semibold">${document.getElementById("bookingReference").value.trim() || "&mdash;"}</p></div>
      <div><p class="text-tertiary">Amount</p><p class="font-semibold">${document.getElementById("bookingAmount").value.trim() || "$0.00"}</p></div>
    `;
    document.getElementById("reviewBookingPayment").innerHTML = `
      <div><p class="text-tertiary">Payment Method</p><p class="font-semibold">${document.getElementById("bookingPaymentMethod").value}</p></div>
      <div><p class="text-tertiary">Billing Name</p><p class="font-semibold">${document.getElementById("bookingBillingName").value.trim() || "&mdash;"}</p></div>
    `;
  }

  window.initWizard({
    steps: 3,
    finalLabel: "Confirm Booking",
    onStepChange: (step) => { if (step === 3) renderReview(); },
    onComplete: () => { window.location.href = "bookings-list"; },
  });
});
})();


// ---- itinerary-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById("wizardStep1") || !document.getElementById("itineraryName")) return;

  function addActivityRow() {
    const wrap = document.getElementById("activityRows");
    const row = document.createElement("div");
    row.className = "activity-row flex items-center gap-2.5 p-3 rounded-lg u-background-surface-sunken";
    row.innerHTML = `
      <i class="icon-grip-vertical text-[13px] u-color-text-tertiary"></i>
      <input type="text" placeholder="Activity name" class="activity-name flex-1 bg-transparent text-[12.5px] outline-none">
      <input type="text" placeholder="--:--" class="activity-time py-1.5 px-2 rounded-md text-[12px] outline-none u-background-surface-base_border-1px-solid-border-subtle w-20">
      <button type="button" class="header-icon-btn !size-7 activity-row-remove"><i class="icon-x text-[12px]"></i></button>
    `;
    wrap.appendChild(row);
  }

  function renderReview() {
    document.getElementById("reviewItineraryBasics").innerHTML = `
      <div><p class="u-color-text-tertiary">Itinerary Name</p><p class="font-semibold">${document.getElementById("itineraryName").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Linked Trip</p><p class="font-semibold">${document.getElementById("itineraryTrip").value}</p></div>
      <div><p class="u-color-text-tertiary">Traveler</p><p class="font-semibold">${document.getElementById("itineraryTraveler").value}</p></div>
      <div><p class="u-color-text-tertiary">Dates</p><p class="font-semibold">${document.getElementById("itineraryStartDate").value.trim() || "&mdash;"} &ndash; ${document.getElementById("itineraryEndDate").value.trim() || "&mdash;"}</p></div>
    `;

    const rows = Array.from(document.querySelectorAll(".activity-row")).map((row) => {
      const name = row.querySelector(".activity-name")?.value.trim() || "Untitled activity";
      const time = row.querySelector(".activity-time")?.value.trim() || "&mdash;";
      return `<div class="flex items-center justify-between p-2.5 rounded-lg u-background-surface-sunken"><span>${name}</span><span class="font-semibold">${time}</span></div>`;
    });
    document.getElementById("reviewItineraryActivities").innerHTML = rows.join("") || `<p class="u-color-text-tertiary">No activities added.</p>`;
  }

  window.initWizard({
    steps: 3,
    finalLabel: "Create Itinerary",
    onStepChange: (step) => { if (step === 3) renderReview(); },
    onComplete: () => { window.location.href = "itineraries-list"; },
  });

  document.getElementById("addActivityRowBtn")?.addEventListener("click", addActivityRow);
  document.getElementById("activityRows")?.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".activity-row-remove");
    if (removeBtn) removeBtn.closest(".activity-row").remove();
  });
});
})();


// ---- payroll-run-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById("wizardStep1") || !document.getElementById("payrollPeriod")) return;

  function renderReview() {
    document.getElementById("reviewPayrollCycle").innerHTML = `
      <div><p class="u-color-text-tertiary">Pay Period</p><p class="font-semibold">${document.getElementById("payrollPeriod").value}</p></div>
      <div><p class="u-color-text-tertiary">Pay Date</p><p class="font-semibold">${document.getElementById("payrollPayDate").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Departments Included</p><p class="font-semibold">${document.getElementById("payrollDepartments").value}</p></div>
    `;
  }

  window.initWizard({
    steps: 3,
    finalLabel: "Run Payroll",
    onStepChange: (step) => { if (step === 3) renderReview(); },
    onComplete: () => { window.location.href = "payroll-list"; },
  });
});
})();


// ---- trip-add.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById("wizardStep1") || !document.getElementById("tripName")) return;

  function addTravelerRow() {
    const wrap = document.getElementById("travelerRows");
    const row = document.createElement("div");
    row.className = "traveler-row flex items-center gap-2.5 p-3 rounded-lg u-background-surface-sunken";
    row.innerHTML = `
      <input type="text" placeholder="Traveler name or email" class="traveler-name flex-1 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">
      <button type="button" class="header-icon-btn !size-8 u-color-color-danger-600 traveler-row-remove"><i class="icon-circle-minus text-[14px]"></i></button>
    `;
    wrap.appendChild(row);
  }

  function renderReview() {
    document.getElementById("reviewTripInfo").innerHTML = `
      <div><p class="u-color-text-tertiary">Trip Name</p><p class="font-semibold">${document.getElementById("tripName").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Destination</p><p class="font-semibold">${document.getElementById("tripDestination").value.trim() || "&mdash;"}</p></div>
      <div><p class="u-color-text-tertiary">Trip Type</p><p class="font-semibold">${document.getElementById("tripType").value}</p></div>
      <div><p class="u-color-text-tertiary">Dates</p><p class="font-semibold">${document.getElementById("tripStartDate").value.trim() || "&mdash;"} &ndash; ${document.getElementById("tripEndDate").value.trim() || "&mdash;"}</p></div>
    `;

    const rows = Array.from(document.querySelectorAll(".traveler-row")).map((row) => {
      const name = row.querySelector(".traveler-name")?.value.trim() || "Unnamed traveler";
      return `<div class="p-2.5 rounded-lg u-background-surface-sunken">${name}</div>`;
    });
    document.getElementById("reviewTripTravelers").innerHTML = rows.join("") || `<p class="u-color-text-tertiary">No travelers added.</p>`;
  }

  window.initWizard({
    steps: 3,
    finalLabel: "Create Trip",
    onStepChange: (step) => { if (step === 3) renderReview(); },
    onComplete: () => { window.location.href = "trips-list"; },
  });

  document.getElementById("addTravelerRowBtn")?.addEventListener("click", addTravelerRow);
  document.getElementById("travelerRows")?.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".traveler-row-remove");
    if (removeBtn) removeBtn.closest(".traveler-row").remove();
  });
});
})();


// ---- lms-activity-feed.js --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.getElementById("activityFilterTabs");
  if (!tabs) return;

  function applyFilter(filter) {
    let visibleCount = 0;

    document.querySelectorAll(".activity-item").forEach((item) => {
      const show = filter === "all" || item.dataset.activityType === filter;
      item.classList.toggle("hidden", !show);
      if (show) visibleCount++;
    });

    document.querySelectorAll(".activity-group").forEach((group) => {
      const hasVisible = !!group.querySelector(".activity-item:not(.hidden)");
      group.classList.toggle("hidden", !hasVisible);
    });

    document.getElementById("activityEmptyState")?.classList.toggle("hidden", visibleCount !== 0);
  }

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".activity-filter-tab");
    if (!btn) return;

    tabs.querySelectorAll(".activity-filter-tab").forEach((t) => {
      t.classList.remove("is-active", "font-semibold", "u-background-color-primary-50_color-color-primary-600");
      t.classList.add("font-medium");
    });
    btn.classList.add("is-active", "font-semibold", "u-background-color-primary-50_color-color-primary-600");
    btn.classList.remove("font-medium");

    applyFilter(btn.dataset.tabFilter);
  });
});
})();


// ---- budget-edit.js (line items) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById("budgetEditLineItems");
  if (!list) return;

  function addRow() {
    const row = document.createElement("div");
    row.className = "flex items-center gap-2.5 p-3 rounded-lg bg-sunken";
    row.innerHTML = '<input type="text" placeholder="Line item name" class="flex-1 py-2 px-2.5 rounded-lg text-[12.5px] outline-none bg-raised-bordered">'
      + '<input type="text" placeholder="$0.00" class="w-32 py-2 px-2.5 rounded-lg text-[12.5px] outline-none bg-raised-bordered">'
      + '<button type="button" class="header-icon-btn !size-8 text-danger-600" data-row-remove><i class="icon-circle-minus text-[14px]"></i></button>';
    list.appendChild(row);
  }

  document.getElementById("addBudgetEditLineItemBtn")?.addEventListener("click", addRow);
  window.wireRowRemove("budgetEditLineItems", ".bg-sunken", null, { minRows: 1 });
});
})();


// ---- goal-add.js (milestones) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById("goalMilestoneRows");
  if (!list) return;

  function addRow() {
    const row = document.createElement("div");
    row.className = "flex items-center gap-2.5 p-3 rounded-lg u-background-surface-sunken";
    row.innerHTML = '<input type="text" placeholder="Milestone label" class="flex-1 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">'
      + '<input type="text" placeholder="Value" class="w-28 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">'
      + '<button type="button" class="header-icon-btn !size-8 u-color-color-danger-600" data-row-remove><i class="icon-circle-minus text-[14px]"></i></button>';
    list.appendChild(row);
  }

  document.getElementById("addGoalMilestoneBtn")?.addEventListener("click", addRow);
  window.wireRowRemove("goalMilestoneRows", ".u-background-surface-sunken", null, { minRows: 1 });
});
})();


// ---- hospital-invoice-add.js (line items) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById("hospitalInvoiceLineItems");
  if (!list) return;

  function addRow() {
    const row = document.createElement("div");
    row.className = "grid grid-cols-12 gap-2.5 items-center p-3 rounded-lg u-background-surface-sunken";
    row.innerHTML = '<input type="text" placeholder="Description" class="col-span-6 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">'
      + '<input type="text" placeholder="Qty" class="col-span-2 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">'
      + '<input type="text" placeholder="Unit Price" class="col-span-3 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">'
      + '<button type="button" class="col-span-1 header-icon-btn !size-8 justify-self-end u-color-color-danger-600" data-row-remove><i class="icon-circle-minus text-[14px]"></i></button>';
    list.appendChild(row);
  }

  document.getElementById("addHospitalInvoiceItemBtn")?.addEventListener("click", addRow);
  window.wireRowRemove("hospitalInvoiceLineItems", ".u-background-surface-sunken", null, { minRows: 1 });
});
})();


// ---- shipping-zone-add.js (rates) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById("shippingRateRows");
  if (!list) return;

  function addRow() {
    const row = document.createElement("div");
    row.className = "flex items-center gap-2.5 p-3 rounded-lg u-background-surface-sunken";
    row.innerHTML = '<input type="text" placeholder="Rate name e.g. Standard" class="flex-1 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">'
      + '<input type="text" placeholder="Price" class="w-24 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">'
      + '<input type="text" placeholder="ETA days" class="w-24 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">'
      + '<button type="button" class="header-icon-btn !size-8 u-color-color-danger-600" data-row-remove><i class="icon-circle-minus text-[14px]"></i></button>';
    list.appendChild(row);
  }

  document.getElementById("addShippingRateBtn")?.addEventListener("click", addRow);
  window.wireRowRemove("shippingRateRows", ".u-background-surface-sunken", null, { minRows: 1 });
});
})();


// ---- tasks-add.js (subtasks) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const list = document.getElementById("subtaskRows");
  if (!list) return;

  function addRow() {
    const row = document.createElement("div");
    row.className = "flex items-center gap-2.5 p-3 rounded-lg u-background-surface-sunken";
    row.innerHTML = '<input type="checkbox" class="size-4 rounded u-accent-color-color-primary-600">'
      + '<input type="text" placeholder="Subtask description" class="flex-1 py-2 px-2.5 rounded-lg text-[12.5px] outline-none u-background-surface-raised_border-1px-solid-border-subtle">'
      + '<button type="button" class="header-icon-btn !size-8 u-color-color-danger-600" data-row-remove><i class="icon-circle-minus text-[14px]"></i></button>';
    list.appendChild(row);
  }

  document.getElementById("addSubtaskBtn")?.addEventListener("click", addRow);
  window.wireRowRemove("subtaskRows", ".u-background-surface-sunken", null, { minRows: 1 });
});
})();


// ---- employees-list.js (filter drawer reset) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const resetBtn = document.getElementById("empFilterResetBtn");
  if (!resetBtn) return;

  resetBtn.addEventListener("click", () => {
    const drawer = document.getElementById("filterDrawer");
    if (!drawer) return;
    drawer.querySelectorAll("select").forEach((sel) => { sel.selectedIndex = 0; });
    drawer.querySelectorAll('input[type="text"]').forEach((input) => {
      input.value = "";
      if (input._flatpickr) input._flatpickr.clear();
    });
  });
});
})();


// ---- hrm-dashboard.js (New Hires tab switch) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll(".new-hires-tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.newHiresTab;

      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("bg-[var(--surface-raised)]", active);
        t.classList.toggle("text-[var(--text-primary)]", active);
        t.classList.toggle("shadow-[var(--shadow-xs,_0_1px_2px_rgb(0_0_0_/_0.06))]", active);
        t.classList.toggle("u-color-text-tertiary", !active);
      });

      document.querySelectorAll("[data-new-hires-panel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.newHiresPanel !== target);
      });
    });
  });
});
})();


// ---- voice-call.js (New Call modal) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const startBtn = document.getElementById("startCallBtn");
  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    const contactSelect = document.getElementById("newCallContact");
    const numberInput = document.getElementById("newCallNumber");
    const number = numberInput.value.trim();
    const name = number ? number : contactSelect.options[contactSelect.selectedIndex].text;

    window.closeModal("newCallModal");
    numberInput.value = "";
    window.showSuccess("Calling…", `Starting a call with ${name}.`);
  });
});
})();


// ---- shipments.js (tracking modal actions) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const trackBtn = document.getElementById("trackPackageBtn");
  if (!trackBtn) return;

  const printBtn = document.getElementById("printLabelBtn");
  const getTracking = () => document.getElementById("trackingModalTitle").textContent;

  trackBtn.addEventListener("click", () => {
    window.closeModal("trackingModal");
    window.showSuccess("Tracking updated", `Latest tracking events for ${getTracking()} have been loaded.`);
  });

  printBtn.addEventListener("click", () => {
    window.closeModal("trackingModal");
    window.showSuccess("Label sent to printer", `Shipping label for ${getTracking()} is printing.`);
  });
});
})();


// ---- model-api-keys.js (generate key modal) --------------------------------------------------------------
(function () {
document.addEventListener('DOMContentLoaded', function () {
  const generateBtn = document.getElementById("generateKeyBtn");
  if (!generateBtn) return;

  generateBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("newKeyName");
    const name = nameInput.value.trim() || "New API Key";

    window.closeModal("generateKeyModal");
    nameInput.value = "";
    window.showSuccess("Key generated", `"${name}" has been created. Copy it now — it won't be shown again.`);
  });
});
})();
