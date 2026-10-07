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
    // 1. Update Vocabulary Progress
    const mastered = load(STORAGE_KEYS.MASTERED_WORDS, []);
    setText('stat-vocab-progress', `${mastered.length} Mastered`);
    // 2. Update Exam High Score
    const history = load(STORAGE_KEYS.EXAM_HISTORY, []);
    if (history.length > 0) {
        const highScoreEntry = history.reduce((max, current) => current.percentage > max.percentage ? current : max, history[0]);
        setText('stat-high-score', `${highScoreEntry.percentage}% (${highScoreEntry.score} / ${highScoreEntry.total})`);
    }
    else {
        setText('stat-high-score', `0% (0 / 0)`);
    }
    // 3. Update Best Practice Score
    const scores = load(STORAGE_KEYS.BEST_SCORES, {
        Numerical: 0,
        Verbal: 0,
        Analytical: 0,
        Clerical: 0,
        'General Information': 0,
    });
    let best = 0;
    for (const value of Object.values(scores)) {
        if (value > best)
            best = value;
    }
    setText('stat-best-score', `${best}%`);
    // 4. Render Activity History (Mock Exams)
    const activityList = getElement('recent-activity-list');
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
    const resetBtn = getElement('reset-progress-btn');
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
