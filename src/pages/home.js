import { renderNavbar, renderFooter } from '../modules/navbar';
import { load, clear } from '../services/storage';
import { STORAGE_KEYS } from '../types/storage';
import { getElement, setText } from '../utils/dom';
// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------
function initDefaultData() {
    // Ensure default structure exists for best scores
    let scores = load(STORAGE_KEYS.BEST_SCORES, null);
    if (!scores) {
        scores = {
            Numerical: 0,
            Verbal: 0,
            Analytical: 0,
            Clerical: 0,
            'General Information': 0,
        };
        saveBestScores(scores);
    }
}
function saveBestScores(scores) {
    try {
        localStorage.setItem(STORAGE_KEYS.BEST_SCORES, JSON.stringify(scores));
    }
    catch (e) {
        console.error(e);
    }
}
// ---------------------------------------------------------------------------
// UI Updates
// ---------------------------------------------------------------------------
function updateHomeUI() {
    // 2. Update Mastered Words
    const mastered = load(STORAGE_KEYS.MASTERED_WORDS, []);
    setText('home-vocab-mastered', mastered.length.toString());
    // 3. Update Category Progress (Best Scores)
    const scores = load(STORAGE_KEYS.BEST_SCORES, {
        Numerical: 0,
        Verbal: 0,
        Analytical: 0,
        Clerical: 0,
        'General Information': 0,
    });
    let totalScore = 0;
    let numCategories = 0;
    for (const [key, value] of Object.entries(scores)) {
        const cat = key;
        const bar = getElement(`prog-${cat}`);
        const label = getElement(`score-${cat}`);
        if (bar && label) {
            bar.style.width = `${value}%`;
            label.textContent = `${value}%`;
            // Update color based on score
            if (value >= 80)
                bar.className = 'bg-emerald-500 h-2 rounded-full transition-all duration-500';
            else if (value >= 50)
                bar.className = 'bg-blue-500 h-2 rounded-full transition-all duration-500';
            else if (value > 0)
                bar.className = 'bg-amber-400 h-2 rounded-full transition-all duration-500';
            else
                bar.className = 'bg-slate-200 h-2 rounded-full transition-all duration-500';
        }
        totalScore += value;
        numCategories++;
    }
    // 4. Update Overall Readiness
    const readiness = numCategories > 0 ? Math.round(totalScore / numCategories) : 0;
    setText('home-readiness', `${readiness}%`);
    const readiBadge = getElement('readiness-badge');
    const readiText = getElement('readiness-text');
    if (readiBadge && readiText) {
        if (readiness >= 80) {
            readiBadge.className = 'px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider';
            readiText.textContent = 'Exam Ready';
        }
        else if (readiness >= 50) {
            readiBadge.className = 'px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider';
            readiText.textContent = 'On Track';
        }
        else {
            readiBadge.className = 'px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider';
            readiText.textContent = 'Needs Review';
        }
    }
    // 5. Render Activity History (Mock Exams)
    const history = load(STORAGE_KEYS.EXAM_HISTORY, []);
    const activityList = getElement('activity-list');
    if (activityList) {
        if (history.length === 0) {
            activityList.innerHTML = `
        <div class="text-center py-6">
            <div class="w-10 h-10 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-slate-400 text-sm font-medium">No recent activity. Take a mock exam to see your history.</p>
        </div>
      `;
        }
        else {
            let html = '';
            history.slice(0, 3).forEach((item) => {
                const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                const passClass = item.passed
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-rose-50 text-rose-500 border-rose-100';
                const passText = item.passed ? 'Passed' : 'Failed';
                html += `
          <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all">
              <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs ${passClass}">
                      ${item.percentage}%
                  </div>
                  <div>
                      <h4 class="text-sm font-bold text-slate-800">Mock Exam</h4>
                      <p class="text-xs text-slate-500 mt-0.5">${date}</p>
                  </div>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider ${item.passed ? 'text-emerald-600' : 'text-rose-500'}">
                  ${passText}
              </span>
          </div>
        `;
            });
            activityList.innerHTML = html;
        }
    }
}
// ---------------------------------------------------------------------------
// Event Listeners
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    initDefaultData();
    updateHomeUI();
    const resetBtn = getElement('reset-data-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const confirmReset = confirm("Are you sure you want to reset all your progress? This cannot be undone.");
            if (confirmReset) {
                clear();
                initDefaultData();
                updateHomeUI();
                alert("Progress has been reset.");
                window.location.reload();
            }
        });
    }
});
