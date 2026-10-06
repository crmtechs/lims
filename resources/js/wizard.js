// Generic multi-step form wizard.
// Markup contract:
//   <div data-wizard>
//     <button data-wizard-step="1">...</button>  (repeat per step, clickable once unlocked)
//     <div data-wizard-panel="1">...</div>        (repeat per step)
//     <button data-wizard-back>Back</button>
//     <button data-wizard-next>Next</button>
//     <button data-wizard-submit>Submit</button>
//   </div>
document.querySelectorAll('[data-wizard]').forEach((wizard) => {
    const steps = Array.from(wizard.querySelectorAll('[data-wizard-step]'));
    const panels = Array.from(wizard.querySelectorAll('[data-wizard-panel]'));
    // Back/Next/Submit controls often live outside the wizard container (e.g. a
    // sticky page footer), so fall back to a document-wide lookup when not nested inside.
    const backBtn = wizard.querySelector('[data-wizard-back]') || document.querySelector('[data-wizard-back]');
    const nextBtn = wizard.querySelector('[data-wizard-next]') || document.querySelector('[data-wizard-next]');
    const submitBtn = wizard.querySelector('[data-wizard-submit]') || document.querySelector('[data-wizard-submit]');
    const total = panels.length;
    let current = 1;
    let maxUnlocked = 1;

    function render() {
        panels.forEach((panel) => {
            const n = Number(panel.dataset.wizardPanel);
            panel.classList.toggle('hidden', n !== current);
        });

        steps.forEach((step) => {
            const n = Number(step.dataset.wizardStep);
            const circle = step.querySelector('[data-wizard-circle]');
            const label = step.querySelector('[data-wizard-label]');
            const isDone = n < current;
            const isActive = n === current;

            step.disabled = n > maxUnlocked;
            step.classList.toggle('is-active', isActive);
            step.classList.toggle('is-done', isDone);

            if (circle) {
                circle.classList.toggle('u-background-color-primary-600_color-fff', isActive || isDone);
                circle.classList.toggle('u-background-surface-sunken_color-text-tertiary', !isActive && !isDone);
                circle.innerHTML = isDone ? '<i class="icon-check text-[12px]"></i>' : n;
            }
            if (label) {
                label.classList.toggle('font-semibold', isActive);
                label.classList.toggle('u-color-text-tertiary', !isActive && !isDone);
            }

            const line = step.nextElementSibling;
            if (line && line.hasAttribute('data-wizard-line')) {
                line.classList.toggle('u-background-color-primary-500', n < current);
                line.classList.toggle('u-background-border-default', n >= current);
            }
        });

        if (backBtn) backBtn.classList.toggle('hidden', current === 1);
        if (nextBtn) nextBtn.classList.toggle('hidden', current === total);
        if (submitBtn) submitBtn.classList.toggle('hidden', current !== total);

        wizard.dispatchEvent(new CustomEvent('wizard:step', { detail: { step: current } }));
    }

    steps.forEach((step) => {
        step.addEventListener('click', () => {
            const n = Number(step.dataset.wizardStep);
            if (n > maxUnlocked) return;
            current = n;
            render();
        });
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            current = Math.min(total, current + 1);
            maxUnlocked = Math.max(maxUnlocked, current);
            render();
            wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            current = Math.max(1, current - 1);
            render();
            wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    render();
});
