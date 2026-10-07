/**
 * Safe DOM helpers.
 *
 * These reduce the need for scattered non-null assertions throughout the codebase.
 * Use getElement() when the element's presence is expected but not guaranteed,
 * and assertElement() when you are certain it must exist.
 */
/**
 * Get a typed element by ID. Returns null if not found.
 * Prefer this over document.getElementById() when the element may not exist.
 */
export function getElement(id) {
    return document.getElementById(id);
}
/**
 * Get a typed element by ID. Throws if not found.
 * Use only when the element is statically guaranteed to exist in the HTML.
 */
export function assertElement(id) {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Required DOM element #${id} not found`);
    }
    return el;
}
/**
 * Set text content of an element by ID, safely ignoring missing elements.
 */
export function setText(id, text) {
    const el = getElement(id);
    if (el)
        el.textContent = text;
}
/**
 * Set innerHTML of an element by ID, safely ignoring missing elements.
 */
export function setHTML(id, html) {
    const el = getElement(id);
    if (el)
        el.innerHTML = html;
}
/**
 * Add or remove a CSS class from an element by ID, safely ignoring missing elements.
 */
export function toggleClass(id, className, force) {
    const el = getElement(id);
    if (el)
        el.classList.toggle(className, force);
}
