document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
    });
  }

  const form = document.querySelector("#contactForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent("Pixora Studio project enquiry — " + data.get("service"));
      const body = encodeURIComponent(
        "Name: " + data.get("name") + "\nEmail: " + data.get("email") +
        "\nService: " + data.get("service") + "\n\nProject details:\n" + data.get("details")
      );
      const recipient = "hello@pixorastudio.example"; // Replace with a monitored email before launch.
      document.querySelector("#formStatus").textContent = "Your email app should open with a draft. Review it and replace the placeholder address before sending.";
      window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + body;
    });
  }
});
