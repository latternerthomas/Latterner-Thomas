document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       THÈME JOUR / NUIT
       (la classe du body est déjà appliquée par le petit script
        en haut du <body>, ici on synchronise l'icône et le clic)
       ========================================================= */
    const themeToggle = document.getElementById("theme-toggle");
    const icon = themeToggle.querySelector("i");
    const body = document.body;

    function syncThemeIcon() {
        if (body.classList.contains("light-mode")) {
            icon.classList.replace("fa-sun", "fa-moon");
            themeToggle.classList.replace("text-warning", "text-dark");
        } else {
            icon.classList.replace("fa-moon", "fa-sun");
            themeToggle.classList.replace("text-dark", "text-warning");
        }
    }

    syncThemeIcon();

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        try {
            localStorage.setItem("theme", body.classList.contains("light-mode") ? "light" : "dark");
        } catch (e) { /* stockage indisponible : le thème ne sera pas mémorisé */ }
        syncThemeIcon();
    });


    /* =========================================================
       BOUTON RETOUR EN HAUT
       ========================================================= */
    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 300);
    }, { passive: true });


    /* =========================================================
       APPARITION AU SCROLL
       ========================================================= */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));


    /* =========================================================
       CARTES CLIQUABLES AU CLAVIER (Entrée / Espace)
       ========================================================= */
    document.querySelectorAll('[data-bs-toggle="modal"][role="button"]').forEach(card => {
        card.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                card.click();
            }
        });
    });


    /* =========================================================
       FERMETURE DU MENU MOBILE AU CLIC
       ========================================================= */
    const navbarCollapse = document.getElementById("navbarNav");
    document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
        link.addEventListener("click", () => {
            if (navbarCollapse.classList.contains("show")) {
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
            }
        });
    });


    /* =========================================================
       COPIER L'EMAIL
       ========================================================= */
    const emailLink = document.getElementById("email-link");
    const feedback = document.getElementById("copy-feedback");

    emailLink.addEventListener("click", e => {
        e.preventDefault();
        const email = document.getElementById("email-text").textContent.trim();

        navigator.clipboard.writeText(email).then(() => {
            feedback.style.display = "inline";
            setTimeout(() => { feedback.style.display = "none"; }, 2000);
        }).catch(err => {
            console.error("Erreur lors de la copie : ", err);
        });
    });


    /* =========================================================
       FORMULAIRE : VALIDATION EN DIRECT + ENVOI SANS QUITTER LA PAGE
       ========================================================= */
    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {
        const fields = contactForm.querySelectorAll('input:not([name="_gotcha"]), textarea');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        fields.forEach(field => {
            field.addEventListener("input", function () {
                const ok = this.type === "email"
                    ? emailRegex.test(this.value)
                    : this.value.trim().length > 2;
                this.classList.toggle("is-valid", ok);
                this.classList.toggle("is-invalid", !ok);
            });
        });

        contactForm.addEventListener("submit", async e => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const original = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours...';

            try {
                const res = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: { Accept: "application/json" }
                });
                if (!res.ok) throw new Error("Échec de l'envoi");

                contactForm.reset();
                fields.forEach(f => f.classList.remove("is-valid", "is-invalid"));
                btn.innerHTML = '<i class="fas fa-check me-2"></i>Message envoyé, merci !';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                }, 4000);
            } catch (err) {
                btn.innerHTML = '<i class="fas fa-triangle-exclamation me-2"></i>Erreur, réessayez';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                }, 3000);
            }
        });
    }
});
