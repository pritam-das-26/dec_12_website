(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav
  const burger = $("#hamburger");
  const mobileNav = $("#mobileNav");
  if(burger && mobileNav){
    burger.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Active link
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$("[data-nav]").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if(href === current) a.classList.add("active");
  });

  // Theme toggle
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const stored = localStorage.getItem("theme");
  if(stored === "light" || stored === "dark") root.dataset.theme = stored;

  function themeIcon(){
    if(!themeBtn) return;
    const isLight = root.dataset.theme === "light";
    themeBtn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    themeBtn.innerHTML = isLight ? "🌙" : "☀️";
  }
  themeIcon();

  if(themeBtn){
    themeBtn.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
      themeIcon();
      toast(`Theme: ${next}`);
    });
  }

  // Accordion
  $$(".accordion [data-acc]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-acc");
      const panel = document.getElementById(id);
      if(!panel) return;
      const isOpen = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      const chev = btn.querySelector(".chev");
      if(chev) chev.textContent = isOpen ? "–" : "+";
    });
  });

  // Contact helpers
  const copyBtn = $("#copyEmail");
  if(copyBtn){
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.getAttribute("data-email");
      try{
        await navigator.clipboard.writeText(email);
        toast("Email copied to clipboard");
      }catch(e){
        toast("Could not copy (browser blocked). You can copy it manually.");
      }
    });
  }

  const contactForm = $("#contactForm");
  if(contactForm){
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#name")?.value.trim();
      const msg = $("#message")?.value.trim();
      if(!name || name.length < 2){
        toast("Please enter your name.");
        return;
      }
      if(!msg || msg.length < 10){
        toast("Please write a message (10+ characters).");
        return;
      }
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(msg + "\n\n— Sent from the portfolio website");
      const to = contactForm.getAttribute("data-to");
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  // Toast
  const toastEl = $("#toast");
  let toastTimer = null;
  function toast(text){
    if(!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }
  window.toast = toast;
})();
