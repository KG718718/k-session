'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');let count=0;
const privateAddress=/\b(?:10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|192\.168(?:\.\d{1,3}){2}|127(?:\.\d{1,3}){3}|localhost)\b/i;
const identityAssignment=/(?<![-\w])(?:company(?:Short)?Name|systemName|(?:default|current)?(?:Employee|User)Name)\s*[:=]\s*["'`][^"'`\s][^"'`]*["'`]/i;
const prefilledIdentityInput=/<input\b(?=[^>]*\b(?:id|name)=["'][^"']*(?:company|system|employee|user|supplier)[^"']*["'])(?=[^>]*\bvalue=["'](?!["'$])[^"']+["'])[^>]*>/i;
function assertPublicDefaults(text,file){
 assert.ok(!privateAddress.test(text),file+' private address');
 assert.ok(!identityAssignment.test(text),file+' hardcoded identity');
 const markup=text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 assert.ok(!prefilledIdentityInput.test(markup),file+' prefilled identity input');
 assert.ok(!/0\.06|35%/i.test(text),file+' business defaults');
}
for(const file of ['admin.html','approval.html','debt.html','invoice.html']){
 const text=fs.readFileSync(path.join(root,file),'utf8');
 assertPublicDefaults(text,file);count++;
 assert.doesNotMatch(text,/<script[^>]+src=["']https?:/i,file+' remote runtime');count++;
 for(const match of text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))if(match[1].trim()){new vm.Script(match[1],{filename:file});count++;}
}
const admin=fs.readFileSync(path.join(root,'admin.html'),'utf8');
assert.match(admin,/renderConfig\(group\)/);assert.match(admin,/invoice-replacement/);assert.match(admin,/rulesDigest:\s*row\.rulesDigest/);count+=3;
for(const sample of ['http://10.0.0.1/','http://172.16.0.1/','http://192.168.1.1/','http://localhost/','const systemName="Example";','<input id="companyName" value="Example">']){
 assert.throws(()=>assertPublicDefaults(sample,'memory'),assert.AssertionError);count++;
}
assertPublicDefaults('<input id="companyName" value="">','memory');count++;
console.log('Public page static tests: '+count+' passed.');
