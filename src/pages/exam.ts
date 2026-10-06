import { renderNavbar, renderFooter } from '../modules/navbar';
import { initExamPage } from '../modules/exam';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  initExamPage();
});
