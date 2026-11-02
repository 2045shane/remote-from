'use strict';
const home=document.querySelector('#home'), license=document.querySelector('#license'), status=document.querySelector('#status');
chrome.storage.local.get(['rfHome','rfLicense']).then(data=>{home.value=data.rfHome||'';license.value=data.rfLicense||'';});
document.querySelector('#settings').onsubmit=async event=>{
 event.preventDefault();const code=RemoteFrom.normalizeCountry(home.value);
 if(!code){status.textContent='暂不支持此国家，请查看下方映射。';return;}
 await chrome.storage.local.set({rfHome:code});home.value=code;status.textContent='国家已保存，请回到职位页重新分析。';
};
document.querySelector('#save-license').onclick=async()=>{
 if(!await RemoteFrom.verifyLicense(license.value)){status.textContent='测试许可无效。';return;}
 await chrome.storage.local.set({rfLicense:license.value.trim()});status.textContent='本地测试许可已启用。';
};
document.querySelector('#demo').onclick=async()=>{license.value=await RemoteFrom.issueLicense();await chrome.storage.local.set({rfLicense:license.value});status.textContent='已启用本地测试许可。';};
document.querySelector('#clear').onclick=async()=>{await chrome.storage.local.remove('rfLicense');license.value='';status.textContent='已恢复每日免费额度规则。';};
const map=document.querySelector('#map');
for(const [name,codes] of Object.entries(RemoteFrom.regions)){const p=document.createElement('p');p.textContent=name+': '+codes.join(', ');map.append(p);}
const p=document.createElement('p');p.textContent='国家：'+Object.entries(RemoteFrom.countries).map(([code,names])=>code+' '+names.join('/')).join('；');map.append(p);
