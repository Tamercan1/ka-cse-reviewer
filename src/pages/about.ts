import { renderNavbar, renderFooter } from '../modules/navbar';
import { EXTERNAL_LINKS } from '../config';

document.addEventListener('DOMContentLoaded', () => {
    // Render layout
    renderNavbar();
    renderFooter();

    // Hydrate dynamic links
    const portfolioLink = document.getElementById('creator-portfolio-link') as HTMLAnchorElement | null;
    if (portfolioLink) {
        portfolioLink.href = EXTERNAL_LINKS.PORTFOLIO;
    }

    const githubLink = document.getElementById('creator-github-link') as HTMLAnchorElement | null;
    if (githubLink) {
        githubLink.href = EXTERNAL_LINKS.GITHUB;
    }
});
