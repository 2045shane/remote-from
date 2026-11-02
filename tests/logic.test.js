const test = require('node:test');
const assert = require('node:assert/strict');
const {normalizeCountry, analyze} = require('../src/lib/eligibility');
const {issueLicense, verifyLicense} = require('../src/lib/license');
const {createQuotaStore} = require('../src/lib/quota');
test('country normalization', () => {
 for (const [input, code] of [['CN','CN'],['中国','CN'],['China','CN'],['UK','GB'],['英国','GB'],['United Kingdom','GB'],[' de ','DE'],['Germany','DE'],['zz',null]]) assert.equal(normalizeCountry(input),code);
});
test('eligibility: explicit countries, regions and worldwide', () => {
 for (const [text, home, status] of [
 ['Remote (US only)','US','match'],['Remote (US only)','CN','mismatch'],
 ['Remote - EMEA','DE','match'],['Remote - EU','DE','match'],['Remote - EU','GB','mismatch'],
 ['Must be based in UK','GB','match'],['Must be based in UK','CA','mismatch'],
 ['Remote - APAC','CN','match'],['Remote - LATAM','BR','match'],['Remote - Americas','CA','match'],
 ['Remote - Europe','GB','match'],['Anywhere','CN','match'],['Worldwide','CN','match'],
 ['Remote','CN','unknown'],['Work UTC+8 hours','CN','unknown'],['We serve US customers','CN','unknown'],
 ['Remote (US only)','nonsense','unknown'],['Worldwide\nMust be based in UK','CN','mismatch'],
 ['Not eligible in US','US','unknown'],['Remote - Atlantis','US','unknown'],
 ['Remote - EU\nRemote - APAC','DE','unknown']]) {
 const result=analyze(text,home); assert.equal(result.status,status,text); if(status!=='unknown') assert.ok(result.evidence.includes(text.split('\n').at(-1)) || text.includes(result.evidence));
 }
});
test('local quota serialized, reset, license stub', async () => {
 const data={}; const storage={async get(){return {...data};},async set(v){Object.assign(data,v);}};
 let now=new Date(2026,10,1); const q=createQuotaStore(storage,()=>now);
 assert.deepEqual((await Promise.all([q.consume(),q.consume(),q.consume(),q.consume()])).map(x=>x.recorded),[true,true,true,false]);
 now=new Date(2026,10,2); assert.equal((await q.status()).remaining,3);
 const token=await issueLicense(); assert.equal(await verifyLicense(token),true); assert.equal(await verifyLicense('bad'),false);
 data.rfLicense=token; for(let i=0;i<5;i++) assert.equal((await q.consume()).recorded,true);
});
