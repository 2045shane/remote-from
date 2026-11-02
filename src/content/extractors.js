(function(root) {
'use strict';
function extractJob(doc, hostname) {
 const selectors=hostname==='www.linkedin.com' ? ['.jobs-search__job-details--container','.job-view-layout','.jobs-details','.jobs-description','.show-more-less-html__markup'] : ['#jobsearch-ViewjobPaneWrapper','.jobsearch-JobComponent','#jobDescriptionText'];
 for(const selector of selectors) {
  const node=doc.querySelector(selector);
  if(node?.innerText?.trim()) return node.innerText.trim().slice(0,60000);
 }
 return '';
}
const api={extractJob}; Object.assign(root.RemoteFrom ||= {},api);
if(typeof module!=='undefined' && module.exports) module.exports=api;
})(globalThis);
