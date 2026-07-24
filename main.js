/// ── NAVBAR SCROLL STATE ──
const header = document.querySelector(".header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ── SCROLL PROGRESS BAR ──
const progressBar = document.querySelector(".progress-bar");
if (progressBar) {
  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }, { passive: true });
}

// ── ACTIVE NAV LINK ──
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach(link => {
  if (link.getAttribute("href") === currentPage) link.classList.add("active");
});

// ── MOBILE MENU ──
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuBtn.querySelector("i").className = isOpen ? "ri-close-line" : "ri-menu-4-line";
  });
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuBtn.querySelector("i").className = "ri-menu-4-line";
    });
  });
}

// ── SCROLL REVEAL (fade-up) ──
const revealTargets = document.querySelectorAll(
  ".hero-content, .hero-image, .stat-card, .service-card, .why-card, .timeline-item, .cta, .page-hero-content"
);
if (revealTargets.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const group = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, Math.min(group, 6) * 80);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => {
    el.style.transition = "opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)";
    revealObserver.observe(el);
  });
}

// ── COUNTER ANIMATION ──
const counters = document.querySelectorAll("[data-count]");
if (counters.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObserver.observe(c));
}

// ── FAQ ACCORDION ──
document.querySelectorAll(".faq-item").forEach(item => {
  const q = item.querySelector(".faq-question");
  if (!q) return;
  q.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    document.querySelectorAll(".faq-item.active").forEach(a => a.classList.remove("active"));
    if (!isActive) item.classList.add("active");
  });
});

// ── PROJECT FILTER ──
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-tile");
if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      projectCards.forEach(card => {
        const show = filter === "all" || card.classList.contains(filter);
        card.style.display = show ? "" : "none";
      });
    });
  });
}

// ── CONTACT FORM (Formspree) ──
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button[type='submit']");
    const originalLabel = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `Sending <i class="ri-loader-4-line"></i>`;

    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        formStatus.style.display = "block";
        formStatus.style.color = "#22c55e";
        formStatus.textContent = "Message sent — I'll reply shortly.";
        contactForm.reset();
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      formStatus.style.display = "block";
      formStatus.style.color = "#ef4444";
      formStatus.textContent = "Something went wrong — please email me directly.";
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalLabel;
      setTimeout(() => { if (formStatus) formStatus.style.display = "none"; }, 5000);
    }
  });
}