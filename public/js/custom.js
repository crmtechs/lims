/**
 * Custom application JavaScript (independent of core theme assets)
 */
(function () {
    function restoreActiveSidebarMenu() {
        const menu = document.getElementById("sidebarMenu");
        if (!menu) return;

        // 1. Check for server-rendered data-active attribute
        let activeLink = menu.querySelector("a[data-active='true']");

        // 2. Fallback to URL path matching if not explicitly tagged
        if (!activeLink) {
            const currentPath = window.location.pathname.replace(/\/+$/, "");
            menu.querySelectorAll("a[href]").forEach((a) => {
                if (activeLink) return;
                const href = a.getAttribute("href");
                if (href && href !== "javascript:void(0);" && !href.startsWith("#")) {
                    try {
                        const url = new URL(href, window.location.origin);
                        const linkPath = url.pathname.replace(/\/+$/, "");
                        if (linkPath && linkPath !== "/" && (currentPath === linkPath || currentPath.startsWith(linkPath + "/"))) {
                            activeLink = a;
                        }
                    } catch (e) {}
                }
            });
        }

        if (activeLink) {
            activeLink.classList.add("is-active");

            let node = activeLink.parentElement;
            while (node && node !== menu) {
                if (node.tagName === "LI" && node.classList.contains("has-submenu")) {
                    node.classList.add("is-open");
                }
                node = node.parentElement;
            }
        }

        // Ensure submenus marked with data-open="true" remain open
        menu.querySelectorAll("li.has-submenu[data-open='true']").forEach((li) => {
            li.classList.add("is-open");
        });
    }

    // Run immediately and across all lifecycle hooks
    restoreActiveSidebarMenu();
    setTimeout(restoreActiveSidebarMenu, 0);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", restoreActiveSidebarMenu);
    }

    /**
     * Universal Dismissable Alerts Handler
     * Enables alert dismissal across any page in the application.
     * Triggers: [data-alert-dismiss], [data-dismiss="alert"], .alert-dismiss-btn, [data-alert-close], #form-error-alert-close
     * Target: Element specified by data-alert-dismiss / data-target, or closest [data-alert], [role="alert"], .alert, or #form-error-alert
     */
    document.addEventListener("click", function (e) {
        const dismissBtn = e.target.closest("[data-alert-dismiss], [data-dismiss='alert'], .alert-dismiss-btn, [data-alert-close], #form-error-alert-close");
        if (!dismissBtn) return;

        // Check for explicit target selector via data-alert-dismiss="#id" or data-target="#id"
        const explicitTarget = dismissBtn.getAttribute("data-alert-dismiss") || dismissBtn.getAttribute("data-target");
        let alertBox = null;

        if (explicitTarget && explicitTarget !== "true" && explicitTarget !== "") {
            try {
                alertBox = document.querySelector(explicitTarget);
            } catch (err) {}
        }

        if (!alertBox) {
            alertBox = dismissBtn.closest("[data-alert], [role='alert'], .alert, #form-error-alert");
        }

        // Fallback: immediate parent element
        if (!alertBox) {
            alertBox = dismissBtn.parentElement;
        }

        if (alertBox) {
            alertBox.classList.add("hidden");
            alertBox.dispatchEvent(new CustomEvent("alert:dismissed", {
                bubbles: true,
                detail: { trigger: dismissBtn }
            }));
        }
    });
})();
