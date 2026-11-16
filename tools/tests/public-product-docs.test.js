'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
let passed = 0;
function check(name, fn) { fn(); passed++; console.log('PASS '+name); }
check('application, npm lock and package manifest agree on 1.0.0', () => {
 const app=JSON.parse(read('package.json')),lock=JSON.parse(read('package-lock.json')),manifest=JSON.parse(read('tools/package-manifest.json'));
 assert.equal(app.version,'1.0.0');assert.equal(lock.version,app.version);assert.equal(lock.packages[''].version,app.version);assert.equal(manifest.version,app.version);
});
check('product introduction describes advertising OA and reconciliation', () => {
 const text=read('README.md');for(const word of ['K⁺-SESSION 1.0','广告公司','OA','财务核对','数据统计'])assert.ok(text.includes(word),word);
 assert.ok(JSON.parse(read('package.json')).description.includes('广告公司'));
});
check('introduction covers the implemented functional areas', () => {
 const text=read('README.md');for(const word of ['项目申请','付款申请','欠款','发票','奖金','月结','甲方','供应商','权限','邮件','导出','备份'])assert.ok(text.includes(word),word);
});
check('current Markdown omits concrete deployment and customer identities', () => {
 const files=[];function walk(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.md'))files.push(p);}}
 for(const e of fs.readdirSync(root,{withFileTypes:true}))if(e.isFile()&&e.name.endsWith('.md'))files.push(e.name);
 walk('docs');files.push('tools/installer/README-install.md');
 const forbidden=/(?:客户|公司|员工)(?:名称|简称|标识|姓名|账号)\s*[:：]\s*[^\s，。；;]{2,}|(?:部署|运行)(?:在|于)\s*(?:公司|客户)[^\s，。；;]{2,}/;
 for(const p of files)assert.ok(!forbidden.test(read(p)),p+' concrete identity or deployment');
 assert.match('客户名称：示例甲方',forbidden);
 assert.match('员工姓名：示例人员',forbidden);
 assert.match('部署于客户示例环境',forbidden);
 assert.doesNotMatch('旧 Git 历史由所有者在私有仓库保留',forbidden);
});
check('documentation contains no specific private endpoint', () => {
 const privateEndpoint=/\b(?:10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|192\.168(?:\.\d{1,3}){2})\b|(?:\b[A-Za-z]:\\Users\\|\/(?:Users|home)\/)[^\\/\s<>]+/i;
 for(const p of ['README.md','PROJECT.md','tools/installer/README-install.md'])assert.ok(!privateEndpoint.test(read(p)),p+' private endpoint');
 for(const sample of ['10.0.0.1','172.16.0.1','192.168.0.1','C:\\Users\\sample\\file','/home/sample/file'])assert.match(sample,privateEndpoint);
 assert.doesNotMatch('127.0.0.1',privateEndpoint);
});
check('new installs and accounting scope are explicit', () => {
 const text=read('README.md');assert.match(text,/零业务数据/);assert.match(text,/Admin/);assert.match(text,/银行/);assert.match(text,/不预置/);
});
check('future fixes, features and breaking versions are distinguished', () => {
 const text=read('docs/versioning.md');for(const v of ['1.0.0','1.0.1','1.1.0','2.0.0'])assert.ok(text.includes(v));assert.match(text,/备份/);assert.match(text,/不覆盖/);
 assert.match(read('CHANGELOG.md'),/1\.0\.0/);
});
check('installation guide preserves explicit port selection and local isolation', () => {
 const text=read('tools/installer/README-install.md');assert.match(text,/127\.0\.0\.1/);assert.match(text,/--port/);assert.match(text,/独立/);assert.match(text,/instance/);
});
console.log('Public product documentation and version: '+passed+' passed.');
