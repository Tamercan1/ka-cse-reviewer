import{r as S,a as w,g as a,c as E,l as n,s as b,S as r}from"./navbar-vf5-mW3n.js";function h(){let t=n(r.BEST_SCORES,null);t||(t={Numerical:0,Verbal:0,Analytical:0,Clerical:0,"General Information":0},k(t))}function k(t){try{localStorage.setItem(r.BEST_SCORES,JSON.stringify(t))}catch(o){console.error(o)}}function v(){const t=n(r.STREAK,0);b("home-streak",t.toString());const o=n(r.MASTERED_WORDS,[]);b("home-vocab-mastered",o.length.toString());const y=n(r.BEST_SCORES,{Numerical:0,Verbal:0,Analytical:0,Clerical:0,"General Information":0});let g=0,m=0;for(const[d,e]of Object.entries(y)){const c=d,s=a(`prog-${c}`),u=a(`score-${c}`);s&&u&&(s.style.width=`${e}%`,u.textContent=`${e}%`,e>=80?s.className="bg-emerald-500 h-2 rounded-full transition-all duration-500":e>=50?s.className="bg-blue-500 h-2 rounded-full transition-all duration-500":e>0?s.className="bg-amber-400 h-2 rounded-full transition-all duration-500":s.className="bg-slate-200 h-2 rounded-full transition-all duration-500"),g+=e,m++}const f=m>0?Math.round(g/m):0;b("home-readiness",`${f}%`);const l=a("readiness-badge"),i=a("readiness-text");l&&i&&(f>=80?(l.className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider",i.textContent="Exam Ready"):f>=50?(l.className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider",i.textContent="On Track"):(l.className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider",i.textContent="Needs Review"));const p=n(r.EXAM_HISTORY,[]),x=a("activity-list");if(x)if(p.length===0)x.innerHTML=`
        <div class="text-center py-6">
            <div class="w-10 h-10 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p class="text-slate-400 text-sm font-medium">No recent activity. Take a mock exam to see your history.</p>
        </div>
      `;else{let d="";p.slice(0,3).forEach(e=>{const c=new Date(e.date).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),s=e.passed?"bg-emerald-50 text-emerald-600 border-emerald-100":"bg-rose-50 text-rose-500 border-rose-100",u=e.passed?"Passed":"Failed";d+=`
          <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all">
              <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center border font-bold text-xs ${s}">
                      ${e.percentage}%
                  </div>
                  <div>
                      <h4 class="text-sm font-bold text-slate-800">Mock Exam</h4>
                      <p class="text-xs text-slate-500 mt-0.5">${c}</p>
                  </div>
              </div>
              <span class="text-xs font-bold uppercase tracking-wider ${e.passed?"text-emerald-600":"text-rose-500"}">
                  ${u}
              </span>
          </div>
        `}),x.innerHTML=d}}document.addEventListener("DOMContentLoaded",()=>{S(),w(),h(),v();const t=a("reset-data-btn");t&&t.addEventListener("click",()=>{confirm("Are you sure you want to reset all your progress? This cannot be undone.")&&(E(),h(),v(),alert("Progress has been reset."),window.location.reload())})});
