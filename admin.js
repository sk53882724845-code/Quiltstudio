// Keep this URL public; never put the admin password in this file.
const API_URL = "https://script.google.com/macros/s/AKfycbyo6rd2jgkmaN95fsVpHAWl7Q_9WrOaXcirrzoFnCSMWPzOkm917qG-tTacBrbQIhCS/exec";
const loginForm = document.getElementById("adminLogin"), statusEl = document.getElementById("adminStatus");
const requestsSection = document.getElementById("requestsSection"), requestsList = document.getElementById("requestsList");
let adminPassword = "";
async function api(payload) {
  const response = await fetch(API_URL, {method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
  return response.json();
}
function showRequests(items) {
  requestsList.replaceChildren();
  if (!items.length) { const p=document.createElement("p");p.className="empty-state";p.textContent="No website requests yet.";requestsList.appendChild(p);return; }
  items.forEach(item => {
    const article=document.createElement("article");article.className="request-item";
    const h=document.createElement("h3");h.textContent=`${item.name || "Unnamed"} — ${item.package || "No package"}`;
    const meta=document.createElement("div");meta.className="request-meta";
    [`Age: ${item.age || "—"}`,`Email: ${item.email || "—"}`,`Submitted: ${item.createdAt || "—"}`,`Status: ${item.status || "New"}`].forEach(text=>{const row=document.createElement("div");row.textContent=text;meta.appendChild(row);});
    article.append(h,meta);requestsList.appendChild(article);
  });
}
async function loadRequests() {
  statusEl.classList.remove("error");statusEl.textContent="Loading requests…";
  try { const result=await api({action:"list",password:adminPassword});if(!result.ok)throw new Error();showRequests(result.requests);requestsSection.hidden=false;statusEl.textContent=`Signed in. ${result.requests.length} request(s) found.`; }
  catch (_) { requestsSection.hidden=true;statusEl.textContent="Could not sign in or connect. Check the password, Apps Script URL and deployment.";statusEl.classList.add("error"); }
}
loginForm.addEventListener("submit",async e=>{e.preventDefault();if(API_URL.includes("PASTE_YOUR")){statusEl.textContent="Setup needed: add the Apps Script Web App URL in admin.js.";statusEl.classList.add("error");return;}adminPassword=document.getElementById("adminPassword").value;await loadRequests();if(!requestsSection.hidden)document.getElementById("adminPassword").value="";});
document.getElementById("refreshRequests").addEventListener("click",loadRequests);
