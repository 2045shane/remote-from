const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
test('browser globals load without CommonJS',()=>{
 const context=vm.createContext({});
 for(const file of ['eligibility','license','quota']) vm.runInContext(fs.readFileSync(`src/lib/${file}.js`,'utf8'),context);
 assert.equal(context.RemoteFrom.analyze('Remote - EMEA','DE').status,'match');
 assert.equal(typeof context.RemoteFrom.createQuotaStore,'function');
});
const {extractJob}=require('../src/content/extractors');
test('extract selected job DOM only, no page-wide fallback',()=>{
 const doc={querySelector(selector){return selector==='#jobDescriptionText'?{innerText:'Remote (US only)'}:null;}};
 assert.equal(extractJob(doc,'uk.indeed.com'),'Remote (US only)');
 assert.equal(extractJob(doc,'www.linkedin.com'),'');
 assert.equal(extractJob({querySelector(){return null;},body:{innerText:'Anywhere'}},'indeed.com'),'');
});
