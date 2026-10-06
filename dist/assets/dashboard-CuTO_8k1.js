import{r as y,a as M,l as $,S as C,g as c}from"./navbar-vf5-mW3n.js";document.addEventListener("DOMContentLoaded",()=>{y(),M();const e=$(C.LAST_EXAM_RESULT,null),d=c("dashboard-content");if(!d)return;if(!e){d.innerHTML=`
      <div class="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm max-w-xl mx-auto py-12">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-sm select-none">
              <svg class="w-8 h-8 text-blue-600 fill-none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.625C7.5 19.375 6.996 19.875 6.375 19.875h-2.25A1.125 1.125 0 013 18.75v-5.625zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.625c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
              </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800 mb-2">No Data Available</h2>
          <p class="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">Take a mock exam to see your performance metrics and detailed review here.</p>
          <a href="exam.html" class="inline-block px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-100 transition-all">
              Start Mock Exam
          </a>
      </div>
    `;return}const m=new Date(e.date).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}),b=Math.floor(e.timeSpent/60),v=e.timeSpent%60,u=`${b}m ${v}s`;let p="";for(const[t,o]of Object.entries(e.categoryStats)){const a=Math.round(o.correct/o.total*100)||0;let s="bg-blue-500";a>=80?s="bg-emerald-500":a<50&&(s="bg-rose-500"),p+=`
      <div class="mb-4 last:mb-0">
          <div class="flex justify-between text-sm mb-1.5 font-semibold">
              <span class="text-slate-700">${t}</span>
              <span class="text-slate-500">${o.correct}/${o.total} <span class="text-slate-300 mx-1">|</span> <span class="${s.replace("bg-","text-")}">${a}%</span></span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="${s} h-2 rounded-full transition-all duration-500" style="width: ${a}%"></div>
          </div>
      </div>
    `}const r=e.questionsLog.filter(t=>!t.isCorrect);let x="";r.forEach((t,o)=>{let a="";t.choices.forEach((s,g)=>{const f=s===t.userAnswer,w=s===t.correctAnswer,k=String.fromCharCode(65+g);let i="text-slate-500";w?i="text-emerald-600 font-bold bg-emerald-50 rounded px-2 py-0.5 border border-emerald-100":f&&(i="text-rose-500 line-through bg-rose-50 rounded px-2 py-0.5 border border-rose-100"),a+=`<div class="text-sm ${i} mb-1 flex items-start space-x-2">
                        <span class="font-bold opacity-60">${k}.</span> 
                        <span>${s}</span>
                      </div>`}),x+=`
      <div class="p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
          <div class="flex items-center space-x-2 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Incorrect</span>
              <span class="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">${t.category}</span>
          </div>
          <p class="text-slate-800 font-semibold mb-3 leading-relaxed">${o+1}. ${t.question}</p>
          <div class="pl-2 border-l-2 border-slate-200 mb-4">
              ${a}
          </div>
          <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 mt-3">
              <div class="flex items-center space-x-2 text-emerald-800 font-bold text-xs mb-1.5 uppercase tracking-wide select-none">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Explanation</span>
              </div>
              <p class="text-emerald-700 text-sm leading-relaxed">${t.explanation}</p>
          </div>
      </div>
    `});const h=e.passed?`<div class="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border border-emerald-200 shadow-sm inline-flex items-center space-x-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>
          <span>Passed</span>
       </div>`:`<div class="bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase border border-rose-200 shadow-sm inline-flex items-center space-x-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          <span>Failed</span>
       </div>`;d.innerHTML=`
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column: Summary Card & Stats -->
          <div class="lg:col-span-1 space-y-6">
              <!-- Score Card -->
              <div class="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm relative overflow-hidden">
                  <div class="absolute top-0 left-0 w-full h-1 ${e.passed?"bg-emerald-500":"bg-rose-500"}"></div>
                  <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Final Score</h3>
                  <div class="text-6xl font-black ${e.passed?"text-emerald-600":"text-rose-600"} mb-2 tracking-tighter">
                      ${e.percentage}<span class="text-3xl">%</span>
                  </div>
                  <p class="text-slate-500 font-medium mb-6">${e.score} out of ${e.total} correct</p>
                  ${h}
                  
                  <div class="mt-8 pt-6 border-t border-slate-100 text-left">
                      <div class="flex justify-between items-center mb-3">
                          <span class="text-sm text-slate-500 font-medium flex items-center space-x-2">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              <span>Date taken</span>
                          </span>
                          <span class="text-sm font-bold text-slate-700">${m}</span>
                      </div>
                      <div class="flex justify-between items-center">
                          <span class="text-sm text-slate-500 font-medium flex items-center space-x-2">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              <span>Time spent</span>
                          </span>
                          <span class="text-sm font-bold text-slate-700">${u}</span>
                      </div>
                  </div>
              </div>

              <!-- Category Breakdown -->
              <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
                      <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"></path></svg>
                      <span>Category Breakdown</span>
                  </h3>
                  ${p}
              </div>
          </div>

          <!-- Right Column: Mistakes Review -->
          <div class="lg:col-span-2">
              <div class="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                  <div class="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                      <div>
                          <h3 class="text-xl font-bold text-slate-800">Review Mistakes</h3>
                          <p class="text-sm text-slate-500 mt-1">You missed ${r.length} question${r.length===1?"":"s"}. Review them below.</p>
                      </div>
                      <button id="toggle-mistakes-btn" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors focus:outline-none">
                          Hide Mistakes
                      </button>
                  </div>
                  
                  <div id="mistakes-list" class="divide-y divide-slate-100">
                      ${r.length===0?`<div class="p-12 text-center text-slate-400 font-medium flex flex-col items-center">
                             <svg class="w-12 h-12 text-emerald-400 mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                               <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path>
                             </svg>
                             <span>Perfect score! No mistakes to review. Outstanding work!</span>
                           </div>`:x}
                  </div>
              </div>
          </div>
      </div>
  `;const l=c("toggle-mistakes-btn"),n=c("mistakes-list");l&&n&&l.addEventListener("click",()=>{n.classList.contains("hidden")?(n.classList.remove("hidden"),l.textContent="Hide Mistakes"):(n.classList.add("hidden"),l.textContent="Show Mistakes")})});
