import{g as r,l as f,S as i,b as w,r as h,a as D}from"./navbar-vf5-mW3n.js";import{c as L,s as v}from"./toast-C9vbJEJf.js";const a={currentDay:1,vocabData:[],masteredWords:[]};async function k(){a.masteredWords=f(i.MASTERED_WORDS,[]),a.currentDay=f(i.VOCAB_DAY,1);const t=await L();t.length>0?(a.vocabData=t,b()):console.error("Failed to load vocabulary data.")}function $(t,s){const o=s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),e=new RegExp(`\\b(${o}[a-z]*)\\b`,"gi");return t.replace(e,'<strong class="text-blue-600 font-semibold">$1</strong>')}function B(t){const s=a.masteredWords.indexOf(t);s>-1?(a.masteredWords.splice(s,1),v(`"${t}" removed from mastered words.`,"info")):(a.masteredWords.push(t),v(`"${t}" marked as mastered!`,"success")),w(i.MASTERED_WORDS,a.masteredWords),b()}function b(){const t=a.vocabData.find(e=>e.day===a.currentDay);if(!t)return;const s=r("day-indicator");s&&(s.textContent=`Day ${a.currentDay}`);const o=r("vocabulary-list-container");o&&(o.innerHTML="",t.words.forEach(e=>{const n=a.masteredWords.includes(e.word),x=e.synonyms?e.synonyms.map(p=>`
          <span class="inline-block bg-slate-100 text-slate-650 text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200/60 font-semibold select-none">
              ${p}
          </span>`).join(""):"",c=e.antonyms?e.antonyms.map(p=>`<span class="inline-block bg-slate-100 text-slate-650 text-[11px] px-2.5 py-0.5 rounded-full border border-slate-200/60 font-semibold select-none">
              ${p}
          </span>`).join(""):"",l=n?'<svg class="w-4 h-4 text-emerald-600 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>':'<svg class="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',d=document.createElement("div");d.className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border-slate-200",n?d.className+=" border-l-4 border-l-emerald-500":d.className+=" border-l-4 border-l-blue-400",d.innerHTML=`
        <div class="flex justify-between items-start mb-4">
            <div>
                <h4 class="text-xl font-bold text-slate-800 tracking-tight">${e.word}</h4>
                <div class="flex items-center space-x-2 mt-1">
                    <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                        ${e.type??"word"}
                    </span>
                    <span class="text-xs text-slate-400 font-mono">${e.ipa??""}</span>
                </div>
            </div>
            <button id="master-btn-${e.word}" class="group p-2 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold focus:outline-none cursor-pointer ${n?"bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70":"bg-white text-slate-555 border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 hover:text-blue-600"}" title="${n?"Word Mastered":"Mark as Mastered"}">
                ${l}
                <span>${n?"Mastered":"Master"}</span>
            </button>
        </div>
        
        <p class="text-slate-600 text-sm leading-relaxed mb-4">
            <strong class="text-slate-700 text-xs uppercase tracking-wider font-semibold block mb-1">Definition</strong>
            ${e.definition}
        </p>

        <div class="mb-4 space-y-2.5">
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[70px]">Synonyms:</span>
                <div class="flex flex-wrap gap-1.5">${x}</div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[70px]">Antonyms:</span>
                <div class="flex flex-wrap gap-1.5">${c}</div>
            </div>
        </div>
        
        <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Context Sentence</span>
            <p class="text-slate-500 text-xs italic leading-relaxed">
                "${$(e.example,e.word)}"
            </p>
        </div>
    `,o.appendChild(d);const u=d.querySelector(`#master-btn-${e.word}`);u&&u.addEventListener("click",()=>B(e.word))}),w(i.VOCAB_DAY,a.currentDay),M())}function m(){window.scrollTo({top:0,behavior:"smooth"})}function y(){const t=Math.max(...a.vocabData.map(s=>s.day),1);a.currentDay<t&&(a.currentDay++,b(),m())}function g(){a.currentDay>1&&(a.currentDay--,b(),m())}function M(){const t=r("prev-day-btn"),s=r("next-day-btn"),o=r("prev-day-btn-bottom"),e=r("next-day-btn-bottom"),n=a.currentDay===1,x=Math.max(...a.vocabData.map(d=>d.day),1),c=a.currentDay>=x,l={disabledSmall:"px-4 py-2.5 bg-slate-50 text-slate-300 font-semibold rounded-xl border border-slate-100 cursor-not-allowed text-sm flex items-center space-x-1.5",enabledSmall:"px-4 py-2.5 bg-white text-slate-655 font-semibold rounded-xl border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all text-sm flex items-center space-x-1.5 cursor-pointer",disabledLarge:"w-full sm:w-auto px-5 py-3 bg-slate-50 text-slate-300 font-semibold rounded-2xl border border-slate-100 cursor-not-allowed text-sm flex items-center justify-center space-x-1.5 select-none transition-all",enabledLarge:"w-full sm:w-auto px-5 py-3 bg-white text-slate-655 font-semibold rounded-2xl border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all text-sm flex items-center justify-center space-x-1.5 cursor-pointer select-none"};t&&(t.disabled=n,t.className=n?l.disabledSmall:l.enabledSmall),o&&(o.disabled=n,o.className=n?l.disabledLarge:l.enabledLarge),s&&(s.disabled=c,s.className=c?l.disabledSmall:l.enabledSmall),e&&(e.disabled=c,e.className=c?l.disabledLarge:l.enabledLarge)}function E(){k();const t=r("prev-day-btn"),s=r("next-day-btn"),o=r("prev-day-btn-bottom"),e=r("next-day-btn-bottom"),n=r("back-to-top-btn");t&&t.addEventListener("click",g),s&&s.addEventListener("click",y),o&&o.addEventListener("click",g),e&&e.addEventListener("click",y),n&&n.addEventListener("click",m)}document.addEventListener("DOMContentLoaded",()=>{h(),D(),E()});
