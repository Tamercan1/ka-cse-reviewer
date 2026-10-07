import { renderNavbar, renderFooter } from '../modules/navbar';
import { initPracticePage } from '../modules/quiz';
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    initPracticePage();
});
