export const rewards=[
 {id:'pie',name:'Cream pie',cost:1,description:'One very personal delivery.',path:'M7 22h34l-4 10H11Z M10 21c0-8 7-13 14-13s14 5 14 13 M14 18c4-5 16-5 20 0 M17 8l2-3m9 3 2-3'},
 {id:'water',name:'Cold water',cost:1,description:'A little perspective. Ice cold.',path:'M12 8h24l-4 29H16Z M14 17h20 M22 3v2m6 35c-5 5-5 8 0 8s5-3 0-8'},
 {id:'bucket',name:'The whole bucket',cost:2,description:'Five classes. Absolutely deserved.',path:'M9 15h30l-4 25H13Z M9 15C9-3 39-3 39 15 M13 22h22 M20 43v3m9-3v3'}
];
export function rewardAvailability(id,credits,count){const reward=rewards.find(r=>r.id===id);return Boolean(reward&&credits>=reward.cost&&(id!=='bucket'||count>=5));}
export function lockerMarkup(credits,count){
 const complete=Math.min(5,Math.max(0,count));
 return `<span class="eyebrow">REVENGE LOCKER</span><div class="locker-heading"><h2>He had it coming.</h2><div class="credit-balance"><b>${credits}</b><span>credits</span></div></div>
 <p class="locker-intro">Choose your payback. Every finished class earns another credit.</p>
 <div class="challenge-card"><div><b>Five classes. One bad day for him.</b><span>${complete}/5 complete</span></div><div class="class-stamps" aria-label="${complete} of 5 classes completed">${Array.from({length:5},(_,i)=>`<span class="${i<complete?'earned':''}">${i<complete?'✓':String(i+1).padStart(2,'0')}</span>`).join('')}</div><small>${complete===5?'Bucket unlocked · weekly bonus earned':`${5-complete} more ${5-complete===1?'class':'classes'} to unlock the bucket and earn 2 bonus credits.`}</small></div>
 <div class="reward-grid" role="group" aria-label="Choose a reward">${rewards.map(r=>{const locked=r.id==='bucket'&&complete<5;return `<button class="reward-card" data-reward="${r.id}" aria-pressed="false" ${locked?'disabled':''}><svg viewBox="0 0 48 50" aria-hidden="true"><path d="${r.path}"/></svg><span class="reward-name">${r.name}</span><small>${locked?'Finish 5 classes':r.description}</small><span class="reward-cost">${locked?'LOCKED':`${r.cost} ${r.cost===1?'credit':'credits'}`}</span></button>`;}).join('')}</div>
 <div class="locker-footer"><p id="reward-detail" role="status">${credits?'Pick something. He can wait.':'No credits left. Finish a class to earn one.'}</p><button class="primary" id="use-reward" disabled>Choose your revenge</button><button class="quiet-button" id="locker-return">Back to classroom</button></div>`;
}
