// Paste the deployed Google Apps Script Web App /exec URL below in this file and admin.js.
const API_URL = "https://script.google.com/macros/s/AKfycbwlRidYpdTsLN4AqmrVtVpsCB9XAMHhNCH8s0RDrBvPxzU_87dsyWmYLPAog7Wp4l44/exec";
const form = document.getElementById("requestForm");
const statusEl = document.getElementById("formStatus");
const startedAt = Date.now();
document.getElementById("year").textContent = new Date().getFullYear();
document.querySelectorAll(".pick").forEach(el => el.addEventListener("click", () => { document.getElementById("package").value = el.dataset.package; }));
form.addEventListener("submit", async event => {
  event.preventDefault(); statusEl.classList.remove("error");
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.website) return;
  if (Date.now() - startedAt < 1800) { statusEl.textContent = "Please wait a moment and try again."; statusEl.classList.add("error"); return; }
  if (API_URL.includes("PASTE_YOUR")) { statusEl.textContent = "Form setup is not complete yet. Follow the steps in README.md."; statusEl.classList.add("error"); return; }
  const btn = form.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Sending…";
  try {
    const response = await fetch(API_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body:JSON.stringify({action:"submit",...data})});
    const result = await response.json(); if (!result.ok) throw new Error(result.error || "Failed");
    form.reset(); statusEl.textContent = "Request sent! Quilt Studio will review it and contact you.";
  } catch (_) { statusEl.textContent = "Could not send right now. Check setup or try again later."; statusEl.classList.add("error"); }
  finally { btn.disabled = false; btn.textContent = "Send request ↗"; }
});
