'use strict';
document.querySelector('#options').onclick=()=>chrome.runtime.openOptionsPage();
chrome.runtime.sendMessage({type:'quotaStatus'}).then(q=>{document.querySelector('#quota').textContent=q.error|| (q.unlocked?'本地测试许可已启用':`今日免费剩余 ${q.remaining} 次`);}).catch(()=>{document.querySelector('#quota').textContent='暂时无法读取额度。';});
