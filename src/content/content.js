(() => {
'use strict';
const host=document.createElement('div');
host.id='remote-from-panel'; document.documentElement.append(host);
const shadow=host.attachShadow({mode:'closed'});
shadow.innerHTML=`<style>:host{all:initial;position:fixed;right:18px;bottom:18px;z-index:2147483647;font:14px/1.6 system-ui;color:#172b36}section{width:285px;padding:16px;background:#fff;border:1px solid #b7cbd0;border-radius:14px;box-shadow:0 6px 26px #0002}h2{margin:0;font-size:17px}p{margin:9px 0;white-space:pre-wrap;overflow-wrap:anywhere}button{cursor:pointer;border:0;border-radius:7px;padding:7px 11px;margin-right:7px;background:#126b65;color:white}small{display:block;color:#52676d}blockquote{margin:8px 0;padding-left:9px;border-left:3px solid #126b65;white-space:pre-wrap;max-height:160px;overflow:auto}</style><section aria-label="能否投递"><h2>能否投递 / RemoteFrom</h2><p id="status" role="status">设置所在国家后，点击分析当前职位。</p><blockquote hidden></blockquote><small id="tz"></small><p><button id="analyze">分析职位</button><button id="options">设置</button></p><small>仅按页面地区文本判断，不代表录用或工作许可。</small></section>`;
const status=shadow.querySelector('#status'), evidence=shadow.querySelector('blockquote'), tz=shadow.querySelector('#tz'), button=shadow.querySelector('#analyze');
shadow.querySelector('#options').onclick=()=>chrome.runtime.sendMessage({type:'openOptions'});
let pageUrl=location.href;
function reset(){ status.textContent='页面已变化，请重新分析当前职位。'; evidence.hidden=true;tz.textContent=''; }
// SPA navigation: discard the previous job result when its URL changes.
setInterval(()=>{if(location.href!==pageUrl){pageUrl=location.href;reset();}},1000);
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local' && changes.rfHome) reset();});
button.onclick=async()=>{
 button.disabled=true; evidence.hidden=true; tz.textContent='';
 const url=location.href;
 try {
  const {rfHome}=await chrome.storage.local.get('rfHome');
  if(!RemoteFrom.normalizeCountry(rfHome)){status.textContent='请先在设置中填写支持的所在国家。';return;}
  const text=RemoteFrom.extractJob(document,location.hostname);
  if(!text){status.textContent='无法判定：未找到职位正文，请先打开具体职位。';return;}
  const quota=await chrome.runtime.sendMessage({type:'consumeQuota'});
  if(quota.error) throw new Error(quota.error);
  if(!quota.recorded){status.textContent=RemoteFrom.CTA;return;}
  if(location.href!==url){reset();return;}
  const result=RemoteFrom.analyze(text,rfHome);
  status.textContent=result.label;
  evidence.textContent=result.evidence || '未找到明确地区范围；仅写 Remote 或时区不足以确定。'; evidence.hidden=false;
  tz.textContent=(result.timezone?'时区提示：'+result.timezone+'\n':'')+(quota.unlocked?'本地测试许可已启用':`今日免费剩余 ${quota.remaining} 次`);
 } catch {status.textContent='读取失败，请刷新页面后重试。';}
 finally{button.disabled=false;}
};
})();
