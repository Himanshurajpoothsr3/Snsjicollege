/* ============================================================
   S.N.S. Janta Intermediate College – Premium Script
   ============================================================ */

// ── Tailwind Config ──────────────────────────────────────────
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#059669",
                "background-light": "#f8fafc",
                "background-dark":  "#0f172a",
                "surface-light":    "#ffffff",
                "surface-dark":     "#1e293b",
                "text-light":       "#334155",
                "text-dark":        "#e2e8f0",
                "text-muted-light": "#64748b",
                "text-muted-dark":  "#94a3b8",
            },
            fontFamily: {
                display: ["Playfair Display", "serif"],
                sans:    ["Inter", "sans-serif"],
            },
            borderRadius: { DEFAULT: "0.5rem" },
        },
    },
};

// ── Theme: apply saved preference immediately ─────────────────
(function () {
    const saved = localStorage.theme;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
})();

// ── Theme Toggle ──────────────────────────────────────────────
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.theme = isDark ? "dark" : "light";

    // update icon in top-bar button if present
    const icon = document.querySelector("#theme-toggle-btn .material-icons");
    if (icon) icon.textContent = isDark ? "light_mode" : "dark_mode";
}

// ── Page Loader ───────────────────────────────────────────────
// Hide loader after 1 second max — don't wait for slow external resources
(function () {
    function hideLoader() {
        const loader = document.getElementById("page-loader");
        if (loader && !loader.classList.contains("hidden")) {
            loader.classList.add("hidden");
        }
    }
    // Hide 1 second after DOM is ready (gives progress bar animation time to finish)
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(hideLoader, 1000));
    } else {
        // DOM already ready (script deferred), hide after 1s
        setTimeout(hideLoader, 1000);
    }
    // Hard cap: no matter what, hide after 2.5s
    setTimeout(hideLoader, 2500);
})();

// ── Scroll-spy: sticky header glass effect ────────────────────
const header = document.querySelector("header");
const topBar  = document.getElementById("top-bar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
    const y = window.scrollY;

    // Glassmorphism on scroll
    if (header) {
        header.classList.toggle("scrolled", y > 60);
    }

    // Hide top-bar on scroll down, show on scroll up
    if (topBar) {
        topBar.style.transform = (y > lastScroll && y > 80)
            ? "translateY(-100%)"
            : "translateY(0)";
    }
    lastScroll = y;

    // Back-to-top
    const btn = document.getElementById("back-to-top");
    if (btn) btn.classList.toggle("visible", y > 400);

    // Active nav highlight
    updateActiveNav();
}, { passive: true });

// ── Active nav based on section in view ──────────────────────
function updateActiveNav() {
    const sections = document.querySelectorAll("section[id], footer[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#']");
    const scrollY  = window.scrollY + 140;

    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
            navLinks.forEach(a => {
                a.classList.remove("text-primary", "border-b-2", "border-primary");
                if (a.getAttribute("href") === "#" + sec.id ||
                    (sec.id === "contact" && a.getAttribute("href") === "#contact")) {
                    a.classList.add("text-primary");
                }
            });
        }
    });
}

// ── Mobile Menu ───────────────────────────────────────────────
const menuBtn     = document.getElementById("mobile-menu-btn");
const mobileNav   = document.getElementById("mobile-nav");

if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
        const open = mobileNav.classList.toggle("open");
        menuBtn.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", open);
    });

    // Close on link click
    mobileNav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
            mobileNav.classList.remove("open");
            menuBtn.classList.remove("open");
        });
    });
}

// ── Back-to-top ───────────────────────────────────────────────
document.getElementById("back-to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ── Scroll Reveal ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll("[data-reveal], [data-stagger]").forEach(el => {
    revealObserver.observe(el);
});

// ── Animated Counters ─────────────────────────────────────────
function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1800;
    const step = 16;
    const increments = Math.ceil(duration / step);
    let count = 0;

    const interval = setInterval(() => {
        count++;
        const progress = count / increments;
        const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        const current = Math.round(easedProgress * target);
        el.textContent = current.toLocaleString() + suffix;

        if (count >= increments) {
            el.textContent = target.toLocaleString() + suffix;
            clearInterval(interval);
        }
    }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll("[data-target]").forEach(el => {
                animateCounter(el);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsSection = document.getElementById("stats-section");
if (statsSection) counterObserver.observe(statsSection);

// ── Canvas Particles ──────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const COUNT = 55;
    const particles = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.5 + 0.15,
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(16,185,129,${0.18 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw dots
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16,185,129,${p.alpha})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;
        });

        requestAnimationFrame(draw);
    }
    draw();
})();

// ── Typewriter hero title ─────────────────────────────────────
(function typewriter() {
    const el = document.querySelector(".hero-title");
    if (!el) return;
    const full = el.getAttribute("data-text") || "";
    if (!full) return;

    el.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
        el.textContent += full[i];
        i++;
        if (i >= full.length) clearInterval(interval);
    }, 45);
})();

// ── Gallery Lightbox ──────────────────────────────────────────
const lightbox     = document.getElementById("lightbox");
const lightboxImg  = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");

document.querySelectorAll(".gallery-item img").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
    });
});

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });


// ── Scroll-down indicator ─────────────────────────────────────
document.querySelector(".scroll-indicator")?.addEventListener("click", () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
});


/* ============================================================
   ADMIN SYSTEM
   ============================================================ */

// ── Credentials (hardcoded – frontend-only auth) ───────────────
const ADMIN_ID   = "snsjicollege";
const ADMIN_PASS = "jairajputana";

// ── Default gallery data ───────────────────────────────────────
const DEFAULT_GALLERY = [
    { src: "campus.png",   caption: "Playground",       sub: "Sports & Recreation" },
    { src: "building.png", caption: "Buildings",        sub: "Infrastructure"      },
    { src: "class.jpg",    caption: "Classroom",        sub: "Learning Spaces"     },
    { src: "students.jpg", caption: "Student Activities", sub: "Vibrant Community"  },
];

// ── Default announcements ─────────────────────────────────────
const DEFAULT_ANNOUNCES = [
    { cat:"Admissions", date:"March 2026", title:"Admission Open for Session 2026–2027",
      desc:"Application forms for Intermediate Science and Arts streams are now available at the college office and online.",
      link:"https://forms.gle/tCiRH7wxnu88WCMu5", linkText:"Apply Online" },
    { cat:"Exam", date:"April 2026", title:"Mid-Term Examination Schedule",
      desc:"The mid-term exams for Class 11th and 12th will commence next month. Download the schedule from the college office.",
      link:"#", linkText:"Download PDF" },
    { cat:"Event", date:"May 2026", title:"Annual Sports Meet 2026",
      desc:"Registration for the annual sports meet is open. Events include cricket, football, kabaddi, and track athletics.",
      link:"#", linkText:"Register Now" },
];

// ── State ─────────────────────────────────────────────────────
let galleryData = JSON.parse(localStorage.getItem("sns_gallery") || "null") || DEFAULT_GALLERY;
let annData     = JSON.parse(localStorage.getItem("sns_announces") || "null") || DEFAULT_ANNOUNCES;

// Save helpers
function saveGallery()   { localStorage.setItem("sns_gallery",    JSON.stringify(galleryData));  }
function saveAnnounces() { localStorage.setItem("sns_announces",  JSON.stringify(annData));      }

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, isError = false) {
    let t = document.getElementById("admin-toast-el");
    if (!t) {
        t = document.createElement("div");
        t.id = "admin-toast-el";
        t.className = "admin-toast";
        document.body.appendChild(t);
    }
    t.innerHTML = `<span class="material-icons" style="font-size:18px">${isError ? "error" : "check_circle"}</span> ${msg}`;
    t.style.background = isError ? "#ef4444" : "#059669";
    t.classList.add("show");
    clearTimeout(t._to);
    t._to = setTimeout(() => t.classList.remove("show"), 2800);
}

// ── Login modal ───────────────────────────────────────────────
function openAdminLogin() {
    document.getElementById("admin-login-modal").classList.add("open");
    document.getElementById("admin-id").focus();
    document.getElementById("admin-login-error").textContent = "";
}
function closeAdminLogin() {
    document.getElementById("admin-login-modal").classList.remove("open");
    document.getElementById("admin-login-form").reset();
    document.getElementById("admin-login-error").textContent = "";
}
function toggleAdminPass() {
    const inp  = document.getElementById("admin-pass");
    const icon = document.getElementById("admin-eye-icon");
    if (inp.type === "password") { inp.type = "text";     icon.textContent = "visibility_off"; }
    else                         { inp.type = "password"; icon.textContent = "visibility";     }
}
function handleAdminLogin(e) {
    e.preventDefault();
    const id   = document.getElementById("admin-id").value.trim();
    const pass = document.getElementById("admin-pass").value;
    const err  = document.getElementById("admin-login-error");
    if (id === ADMIN_ID && pass === ADMIN_PASS) {
        closeAdminLogin();
        openAdminPanel();
    } else {
        err.textContent = "❌ Invalid ID or password. Try again.";
        document.getElementById("admin-pass").value = "";
    }
}

// Close login modal on overlay click
document.getElementById("admin-login-modal")?.addEventListener("click", e => {
    if (e.target === document.getElementById("admin-login-modal")) closeAdminLogin();
});

// ── Admin Panel ───────────────────────────────────────────────
function openAdminPanel() {
    renderAdminGallery();
    renderAdminAnnounces();
    document.getElementById("admin-panel-modal").classList.add("open");
}
function adminLogout() {
    document.getElementById("admin-panel-modal").classList.remove("open");
    showToast("Logged out successfully.");
}
document.getElementById("admin-panel-modal")?.addEventListener("click", e => {
    if (e.target === document.getElementById("admin-panel-modal")) adminLogout();
});

// ── Tab switching ─────────────────────────────────────────────
function switchAdminTab(tab) {
    document.getElementById("admin-tab-gallery").style.display  = tab === "gallery"  ? "" : "none";
    document.getElementById("admin-tab-announce").style.display = tab === "announce" ? "" : "none";
    document.getElementById("tab-gallery").classList.toggle("active",  tab === "gallery");
    document.getElementById("tab-announce").classList.toggle("active", tab === "announce");
}

/* ============================================================
   GALLERY MANAGEMENT
   ============================================================ */
function renderAdminGallery() {
    const grid = document.getElementById("admin-gallery-list");
    if (!grid) return;
    grid.innerHTML = "";
    galleryData.forEach((item, i) => {
        const card = document.createElement("div");
        card.className = "admin-gallery-card";
        card.innerHTML = `
            <img src="${item.src}" alt="${item.caption}" onerror="this.src='https://placehold.co/300x180/1e293b/464d5a?text=No+Image'" />
            <div class="admin-gallery-card-info">
                <span class="admin-gallery-card-caption">${item.caption}</span>
            </div>
            <div class="admin-gallery-card-actions">
                <button class="admin-card-btn edit" onclick="editGalleryImage(${i})">
                    <span class="material-icons">edit</span> Edit
                </button>
                <button class="admin-card-btn delete" onclick="deleteGalleryImage(${i})">
                    <span class="material-icons">delete</span>
                </button>
            </div>`;
        grid.appendChild(card);
    });
}

function addGalleryImage() {
    document.getElementById("img-edit-title").textContent = "Add Gallery Image";
    document.getElementById("img-edit-url").value       = "";
    document.getElementById("img-edit-file").value      = "";
    document.getElementById("img-edit-caption").value   = "";
    document.getElementById("img-edit-subcaption").value= "";
    document.getElementById("img-edit-index").value     = "-1";
    document.getElementById("admin-img-edit-modal").classList.add("open");
}

function editGalleryImage(i) {
    const item = galleryData[i];
    document.getElementById("img-edit-title").textContent = "Edit Gallery Image";
    document.getElementById("img-edit-url").value        = item.src.startsWith("data:") || item.src.startsWith("http") ? item.src : "";
    document.getElementById("img-edit-file").value       = "";
    document.getElementById("img-edit-caption").value    = item.caption || "";
    document.getElementById("img-edit-subcaption").value = item.sub     || "";
    document.getElementById("img-edit-index").value      = i;
    document.getElementById("admin-img-edit-modal").classList.add("open");
}

function closeImgEdit() {
    document.getElementById("admin-img-edit-modal").classList.remove("open");
}

function saveImgEdit() {
    const idx     = parseInt(document.getElementById("img-edit-index").value, 10);
    const urlVal  = document.getElementById("img-edit-url").value.trim();
    const fileEl  = document.getElementById("img-edit-file");
    const caption = document.getElementById("img-edit-caption").value.trim() || "Image";
    const sub     = document.getElementById("img-edit-subcaption").value.trim();

    function applyImage(src) {
        const entry = { src, caption, sub };
        if (idx === -1) {
            galleryData.push(entry);
        } else {
            galleryData[idx] = entry;
        }
        saveGallery();
        renderAdminGallery();
        renderLiveGallery();
        closeImgEdit();
        showToast(idx === -1 ? "Image added!" : "Image updated!");
    }

    if (fileEl.files && fileEl.files[0]) {
        const reader = new FileReader();
        reader.onload = e => applyImage(e.target.result);
        reader.readAsDataURL(fileEl.files[0]);
    } else if (urlVal) {
        applyImage(urlVal);
    } else if (idx !== -1) {
        // No change to src
        applyImage(galleryData[idx].src);
    } else {
        showToast("Please provide an image URL or upload a file.", true);
    }
}

function deleteGalleryImage(i) {
    if (!confirm("Delete this image from the gallery?")) return;
    galleryData.splice(i, 1);
    saveGallery();
    renderAdminGallery();
    renderLiveGallery();
    showToast("Image deleted.");
}

document.getElementById("admin-img-edit-modal")?.addEventListener("click", e => {
    if (e.target === document.getElementById("admin-img-edit-modal")) closeImgEdit();
});

/* ============================================================
   ANNOUNCEMENTS MANAGEMENT
   ============================================================ */
function renderAdminAnnounces() {
    const list = document.getElementById("admin-announce-list");
    if (!list) return;
    list.innerHTML = "";
    annData.forEach((item, i) => {
        const card = document.createElement("div");
        card.className = "admin-ann-card";
        card.innerHTML = `
            <div class="admin-ann-card-body">
                <span class="admin-ann-card-cat">${item.cat}</span>
                <p class="admin-ann-card-title">${item.title}</p>
                <span class="admin-ann-card-date">${item.date}</span>
            </div>
            <div class="admin-ann-card-actions">
                <button class="admin-card-btn edit" onclick="editAnnouncement(${i})">
                    <span class="material-icons">edit</span>
                </button>
                <button class="admin-card-btn delete" onclick="deleteAnnouncement(${i})">
                    <span class="material-icons">delete</span>
                </button>
            </div>`;
        list.appendChild(card);
    });
}

function addAnnouncement() {
    document.getElementById("ann-edit-title").textContent = "Add Announcement";
    ["ann-edit-cat","ann-edit-date","ann-edit-heading","ann-edit-desc","ann-edit-link","ann-edit-linktext"]
        .forEach(id => { document.getElementById(id).value = ""; });
    document.getElementById("ann-edit-index").value = "-1";
    document.getElementById("admin-ann-edit-modal").classList.add("open");
}

function editAnnouncement(i) {
    const item = annData[i];
    document.getElementById("ann-edit-title").textContent = "Edit Announcement";
    document.getElementById("ann-edit-cat").value      = item.cat      || "";
    document.getElementById("ann-edit-date").value     = item.date     || "";
    document.getElementById("ann-edit-heading").value  = item.title    || "";
    document.getElementById("ann-edit-desc").value     = item.desc     || "";
    document.getElementById("ann-edit-link").value     = item.link     || "";
    document.getElementById("ann-edit-linktext").value = item.linkText || "";
    document.getElementById("ann-edit-index").value    = i;
    document.getElementById("admin-ann-edit-modal").classList.add("open");
}

function closeAnnEdit() {
    document.getElementById("admin-ann-edit-modal").classList.remove("open");
}

function saveAnnEdit() {
    const idx  = parseInt(document.getElementById("ann-edit-index").value, 10);
    const entry = {
        cat:      document.getElementById("ann-edit-cat").value.trim()      || "General",
        date:     document.getElementById("ann-edit-date").value.trim()     || "",
        title:    document.getElementById("ann-edit-heading").value.trim()  || "Untitled",
        desc:     document.getElementById("ann-edit-desc").value.trim()     || "",
        link:     document.getElementById("ann-edit-link").value.trim()     || "#",
        linkText: document.getElementById("ann-edit-linktext").value.trim() || "Read More",
    };
    if (idx === -1) { annData.push(entry); }
    else            { annData[idx] = entry; }
    saveAnnounces();
    renderAdminAnnounces();
    renderLiveAnnouncements();
    closeAnnEdit();
    showToast(idx === -1 ? "Announcement added!" : "Announcement updated!");
}

function deleteAnnouncement(i) {
    if (!confirm("Delete this announcement?")) return;
    annData.splice(i, 1);
    saveAnnounces();
    renderAdminAnnounces();
    renderLiveAnnouncements();
    showToast("Announcement deleted.");
}

document.getElementById("admin-ann-edit-modal")?.addEventListener("click", e => {
    if (e.target === document.getElementById("admin-ann-edit-modal")) closeAnnEdit();
});

/* ============================================================
   LIVE PAGE RENDERING – Gallery & Announcements
   ============================================================ */

// ── Live Gallery render (replaces the gallery section grid) ───
function renderLiveGallery() {
    const grid = document.querySelector("#gallery .grid");  // the gallery grid
    if (!grid) return;
    grid.innerHTML = "";

    const spans = ["lg:col-span-2 lg:row-span-2", "", "", "lg:col-span-2"];

    galleryData.forEach((item, i) => {
        const span = spans[i] || "";
        const div = document.createElement("div");
        div.className = `gallery-item ${span}`;
        div.innerHTML = `
            <img alt="${item.caption}" class="w-full h-full object-cover" src="${item.src}" loading="lazy"
                 onerror="this.src='https://placehold.co/600x400/1e293b/464d5a?text=No+Image'" />
            <div class="gallery-overlay">
                <div>
                    <span class="text-white font-bold text-xl block">${item.caption}</span>
                    <span class="text-emerald-300 text-sm">${item.sub || ""}</span>
                </div>
            </div>`;
        // Lightbox
        div.querySelector("img").style.cursor = "zoom-in";
        div.querySelector("img").addEventListener("click", () => {
            const lb    = document.getElementById("lightbox");
            const lbImg = document.getElementById("lightbox-img");
            if (!lb || !lbImg) return;
            lbImg.src = item.src;
            lbImg.alt = item.caption;
            lb.classList.add("open");
            document.body.style.overflow = "hidden";
        });
        grid.appendChild(div);
    });
}

// ── Live Announcements render ──────────────────────────────────
const CAT_COLORS = {
    admissions: "emerald",
    exam:       "orange",
    event:      "blue",
    notice:     "purple",
    result:     "teal",
};
function catColor(cat) {
    return CAT_COLORS[(cat || "").toLowerCase()] || "emerald";
}

function renderLiveAnnouncements() {
    const container = document.querySelector(".announcement-card")?.parentElement;
    if (!container) return;
    container.innerHTML = "";

    annData.forEach(item => {
        const color = catColor(item.cat);
        const article = document.createElement("article");
        article.className = "announcement-card bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700";
        article.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-bold text-${color}-600 dark:text-${color}-400 bg-${color}-100 dark:bg-${color}-900/30 px-3 py-1 rounded-full">
                    ${item.cat}
                </span>
                <span class="text-xs text-slate-400 dark:text-slate-500">${item.date}</span>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">${item.title}</h3>
            <p class="text-text-muted-light dark:text-text-muted-dark text-sm mb-5 leading-relaxed">${item.desc}</p>
            ${item.link ? `<a class="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline group"
                href="${item.link}" ${item.link.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
                ${item.linkText} <span class="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>` : ""}`;
        container.appendChild(article);
    });
}

// ── Init: render live sections from stored data on page load ───
renderLiveGallery();
renderLiveAnnouncements();