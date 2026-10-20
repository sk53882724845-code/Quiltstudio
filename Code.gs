/* Quilt Studio backend. Store ADMIN_PASSWORD in Apps Script Script Properties. */
const SHEET_NAME = "Requests";
function setup() {
  const props=PropertiesService.getScriptProperties();
  if(!props.getProperty("ADMIN_PASSWORD")) throw new Error("First add ADMIN_PASSWORD in Project Settings > Script Properties.");
  let id=props.getProperty("SPREADSHEET_ID");
  if(!id){const ss=SpreadsheetApp.create("Quilt Studio Requests");const sheet=ss.getSheets()[0];sheet.setName(SHEET_NAME);sheet.appendRow(["Created At","Name","Age","Package","Email","Status"]);id=ss.getId();props.setProperty("SPREADSHEET_ID",id);}
  return id;
}
function doPost(e){try{const data=JSON.parse((e&&e.postData&&e.postData.contents)||"{}");if(data.action==="submit")return output_(saveRequest_(data));if(data.action==="list")return output_(listRequests_(data.password));return output_({ok:false,error:"Unknown action"});}catch(err){return output_({ok:false,error:"Request failed"});}}
function saveRequest_(d){
  const name=clean_(d.name,80),email=clean_(d.email,160),age=Number(d.age),pkg=clean_(d.package,30);
  if(!name||!email||!email.includes("@")||!Number.isInteger(age)||age<13||age>120)return{ok:false,error:"Please check the submitted fields."};
  if(!["Basic","Professional","Premium"].includes(pkg))return{ok:false,error:"Invalid package."};
  if(clean_(d.website,100))return{ok:true};
  const id=PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");if(!id)return{ok:false,error:"Backend setup incomplete."};
  SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME).appendRow([new Date(),safeCell_(name),age,pkg,safeCell_(email),"New"]);return{ok:true};
}
function listRequests_(password){
  const expected=PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");if(!expected||!password||!constantTimeEqual_(String(password),expected))return{ok:false,error:"Invalid password"};
  const id=PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");if(!id)return{ok:false,error:"Backend setup incomplete."};
  const rows=SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME).getDataRange().getDisplayValues();
  return{ok:true,requests:rows.slice(1).reverse().map(r=>({createdAt:r[0],name:r[1],age:r[2],package:r[3],email:r[4],status:r[5]}))};
}
function clean_(v,max){return String(v==null?"":v).trim().replace(/[<>]/g,"").slice(0,max)}
function safeCell_(v){return /^[=+\-@]/.test(v)?"'"+v:v}
function constantTimeEqual_(a,b){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0}
function output_(v){return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON)}
