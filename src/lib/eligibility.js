(function(root) {
'use strict';
// Compact MVP map, not a geopolitical or immigration authority.
const countries = {
 US:['USA','United States','United States of America','美国'], CA:['Canada','加拿大'],
 GB:['UK','United Kingdom','Britain','英国'], CN:['China','中国'],
 AT:['Austria','奥地利'],BE:['Belgium','比利时'],BG:['Bulgaria','保加利亚'],HR:['Croatia','克罗地亚'],CY:['Cyprus','塞浦路斯'],CZ:['Czechia','Czech Republic','捷克'],DK:['Denmark','丹麦'],EE:['Estonia','爱沙尼亚'],FI:['Finland','芬兰'],FR:['France','法国'],DE:['Germany','德国'],GR:['Greece','希腊'],HU:['Hungary','匈牙利'],IE:['Ireland','爱尔兰'],IT:['Italy','意大利'],LV:['Latvia','拉脱维亚'],LT:['Lithuania','立陶宛'],LU:['Luxembourg','卢森堡'],MT:['Malta','马耳他'],NL:['Netherlands','荷兰'],PL:['Poland','波兰'],PT:['Portugal','葡萄牙'],RO:['Romania','罗马尼亚'],SK:['Slovakia','斯洛伐克'],SI:['Slovenia','斯洛文尼亚'],ES:['Spain','西班牙'],SE:['Sweden','瑞典'],
 NO:['Norway','挪威'],CH:['Switzerland','瑞士'],UA:['Ukraine','乌克兰'],RS:['Serbia','塞尔维亚'],IS:['Iceland','冰岛'],
 IN:['India','印度'],JP:['Japan','日本'],KR:['South Korea','韩国'],SG:['Singapore','新加坡'],AU:['Australia','澳大利亚'],NZ:['New Zealand','新西兰'],ID:['Indonesia','印度尼西亚'],MY:['Malaysia','马来西亚'],PH:['Philippines','菲律宾'],TH:['Thailand','泰国'],VN:['Vietnam','越南'],PK:['Pakistan','巴基斯坦'],BD:['Bangladesh','孟加拉国'],
 BR:['Brazil','巴西'],MX:['Mexico','墨西哥'],AR:['Argentina','阿根廷'],CL:['Chile','智利'],CO:['Colombia','哥伦比亚'],PE:['Peru','秘鲁'],UY:['Uruguay','乌拉圭'],CR:['Costa Rica','哥斯达黎加'],
 ZA:['South Africa','南非'],NG:['Nigeria','尼日利亚'],KE:['Kenya','肯尼亚'],EG:['Egypt','埃及'],MA:['Morocco','摩洛哥'],IL:['Israel','以色列'],AE:['UAE','United Arab Emirates','阿联酋'],SA:['Saudi Arabia','沙特阿拉伯'],TR:['Turkey','Türkiye','土耳其']
};
const eu='AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE'.split(' ');
const europe=[...eu,...'GB NO CH UA RS IS'.split(' ')];
const latam='BR MX AR CL CO PE UY CR'.split(' ');
const regions={EU:eu,Europe:europe,EMEA:[...europe,...'ZA NG KE EG MA IL AE SA TR'.split(' ')],APAC:'CN IN JP KR SG AU NZ ID MY PH TH VN PK BD'.split(' '),LATAM:latam,Americas:['US','CA',...latam]};
const aliases=Object.entries(countries).flatMap(([code,names])=>[code,...names].map(name=>[name.toLowerCase(),code]));
function normalizeCountry(value) { return typeof value==='string' ? aliases.find(([name])=>name===value.trim().toLowerCase())?.[1] || null : null; }
function contains(text, word) { return new RegExp('(?:^|[^a-z])'+word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:$|[^a-z])','i').test(text); }
function analyze(text, home) {
 const country=normalizeCountry(home);
 const result={status:'unknown',label:'无法判定',evidence:'',timezone:''};
 if(typeof text!=='string') return result;
 result.timezone=(text.match(/[^\n.!?]*(?:UTC|GMT|time\s?zone|时区|[EP]ST|[EP]DT)[^\n.!?]*/i)||[''])[0].trim().slice(0,300);
 if(!country) return result;
 const restrictions=[]; const global=[];
 for(const line of text.split(/[\n.!?;]+/).map(s=>s.trim()).filter(Boolean)) {
  if(/\b(?:not|except|excluding|outside|no)\b|不含|除外/i.test(line)) { if(/remote|based|eligible|worldwide|anywhere/i.test(line)) restrictions.push({unknown:true,line}); continue; }
  const worldwide=/\b(?:worldwide|anywhere|global remote)\b|全球|不限地区/i.test(line);
  if(worldwide) global.push(line);
  if(!/\bremote\b|\b(?:must|only|required|need to)\b.*\b(?:based|reside|located|living)\b|\b(?:based|located|reside)\s+in\b|仅限|必须居住/i.test(line)) continue;
  const members=new Set(); let found=false;
  for(const [name, codes] of Object.entries(regions)) if(contains(line,name)) {found=true;codes.forEach(c=>members.add(c));}
  for(const [name,code] of aliases) if(contains(line,name)) {found=true;members.add(code);}
  if(found) restrictions.push({line,match:members.has(country)});
 }
 if(restrictions.length) {
  result.evidence=restrictions.map(x=>x.line).join('；').slice(0,600);
  if(!restrictions.some(x=>x.unknown) && restrictions.every(x=>x.match===restrictions[0].match)) result.status=restrictions[0].match?'match':'mismatch';
 } else if(global.length) {result.status='match';result.evidence=global.join('；').slice(0,600);}
 result.label={match:'可投递',mismatch:'限地区（不含你所在地区）',unknown:'无法判定'}[result.status];
 return result;
}
const api={countries,regions,normalizeCountry,analyze};
Object.assign(root.RemoteFrom ||= {},api);
if(typeof module!=='undefined' && module.exports) module.exports=api;
})(globalThis);
