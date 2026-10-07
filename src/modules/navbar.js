import { getElement } from '../utils/dom';
export function isRootDirectory() {
    return window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
}
export function renderNavbar() {
    const placeholder = getElement('navbar-placeholder');
    if (!placeholder)
        return;
    const isRoot = isRootDirectory();
    const basePath = isRoot ? '' : '../';
    const pagesPath = isRoot ? 'pages/' : '';
    // Get active page name from path
    const path = window.location.pathname;
    let activePage = 'home';
    if (path.includes('practice.html'))
        activePage = 'practice';
    else if (path.includes('exam.html'))
        activePage = 'exam';
    else if (path.includes('vocabulary.html') || path.includes('vocab-quiz.html'))
        activePage = 'vocabulary';
    else if (path.includes('dashboard.html'))
        activePage = 'dashboard';
    const navbarHTML = `
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50 select-none">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <!-- Logo / Brand -->
                    <a href="${basePath}index.html" class="flex items-center space-x-2 sm:space-x-3 text-blue-600 font-extrabold text-xl sm:text-2xl tracking-tight">
                        <img src="${basePath}img/logo.png" alt="CSE Reviewer Logo" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-sm object-cover border border-slate-100">
                        <span class="hover:text-blue-700 transition-colors">Ka-CSE Reviewer</span>
                    </a>
                    
                    <!-- Navigation Links -->
                    <div class="hidden md:flex space-x-8 ml-10 h-full">
                        <a href="${basePath}index.html" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-full ${activePage === 'home' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}" data-page="home">Home</a>
                        <a href="${pagesPath}practice.html" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-full ${activePage === 'practice' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}" data-page="practice">Practice Quiz</a>
                        <a href="${pagesPath}exam.html" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-full ${activePage === 'exam' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}" data-page="exam">Exam Simulation</a>
                        <a href="${pagesPath}vocabulary.html" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-full ${activePage === 'vocabulary' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}" data-page="vocabulary">Vocabulary Digest</a>
                        <a href="${pagesPath}dashboard.html" class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-full ${activePage === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}" data-page="dashboard">Results</a>
                    </div>
                </div>
                
                <!-- Mobile Menu Trigger -->
                <div class="flex items-center space-x-2 sm:space-x-4">
                    <button id="mobile-menu-toggle" class="md:hidden p-1.5 text-slate-600 hover:text-slate-800 focus:outline-none cursor-pointer">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Mobile Dropdown Menu -->
        <div id="mobile-menu" class="hidden md:hidden border-b border-slate-200 bg-slate-50 px-4 pt-2 pb-4 space-y-1">
            <a href="${basePath}index.html" class="block px-3 py-2 rounded-md text-base font-medium ${activePage === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}" data-page="home">Home</a>
            <a href="${pagesPath}practice.html" class="block px-3 py-2 rounded-md text-base font-medium ${activePage === 'practice' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}" data-page="practice">Practice Quiz</a>
            <a href="${pagesPath}exam.html" class="block px-3 py-2 rounded-md text-base font-medium ${activePage === 'exam' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}" data-page="exam">Exam Simulation</a>
            <a href="${pagesPath}vocabulary.html" class="block px-3 py-2 rounded-md text-base font-medium ${activePage === 'vocabulary' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}" data-page="vocabulary">Vocabulary Digest</a>
            <a href="${pagesPath}dashboard.html" class="block px-3 py-2 rounded-md text-base font-medium ${activePage === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}" data-page="dashboard">Results</a>
        </div>
    </nav>
  `;
    placeholder.className = "sticky top-0 z-50";
    placeholder.innerHTML = navbarHTML;
    const mobileBtn = getElement('mobile-menu-toggle');
    const mobileMenu = getElement('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}
export function renderFooter() {
    const placeholder = getElement('footer-placeholder');
    if (!placeholder)
        return;
    const footerHTML = `
    <footer class="bg-white border-t border-slate-200 mt-auto py-8 select-none">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:justify-between md:items-center">
            <p class="text-sm text-slate-500">&copy; 2026 CSE Reviewer.</p>
            <p class="text-sm text-slate-500">An independent reviewer for Civil Service Examination preparation.</p>
            <p class="text-sm text-slate-400">Made by: Tamercan Wawa</p>
            <div class="flex justify-center space-x-6 mt-4 md:mt-0">
                <span class="text-xs text-slate-400">Light Mode Active</span>
            </div>
        </div>
    </footer>
  `;
    placeholder.innerHTML = footerHTML;
}
