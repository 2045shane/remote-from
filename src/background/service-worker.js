importScripts('../lib/license.js', '../lib/quota.js');
const quota = RemoteFrom.createQuotaStore(chrome.storage.local);
chrome.runtime.onMessage.addListener((message, sender, reply) => {
 if (!['quotaStatus','consumeQuota','openOptions'].includes(message?.type)) return;
 if(message.type==='openOptions') { chrome.runtime.openOptionsPage(); reply({ok:true}); return; }
 if(message.type==='consumeQuota' && !RemoteFrom.isSupportedUrl(sender.url)) {reply({error:'不支持的页面'});return;}
 (message.type==='consumeQuota' ? quota.consume() : quota.status()).then(reply,()=>reply({error:'无法读取本地配额'}));
 return true;
});
