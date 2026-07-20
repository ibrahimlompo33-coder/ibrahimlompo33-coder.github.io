/**
 * Application Core - Portfolio LOMPO Ibrahim
 */
document.addEventListener("DOMContentLoaded", () => {
    initMobileRail();
    initScrollSpy();
    initLayerAccordion();
    initScrollReveal();
    initFormValidation();
});

/**
 * Panneau de couches : bascule mobile (le rail devient une barre + tiroir)
 */
function initMobileRail() {
    const toggle = document.querySelector(".rail-toggle");
    const list = document.querySelector(".layers-list");
    if (!toggle || !list) return;

    toggle.addEventListener("click", () => {
        const isOpen = list.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    list.querySelectorAll("button[data-target]").forEach((btn) => {
        btn.addEventListener("click", () => {
            list.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

/**
 * Navigation "couches" : défilement fluide + surbrillance de la section active
 */
function initScrollSpy() {
    const navButtons = Array.from(document.querySelectorAll(".layers-list button[data-target]"));
    if (navButtons.length === 0) return;

    const sections = navButtons
        .map((btn) => document.getElementById(btn.dataset.target))
        .filter(Boolean);

    navButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = document.getElementById(btn.dataset.target);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const setActive = (id) => {
        navButtons.forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.target === id);
        });
    };

    if (!("IntersectionObserver" in window)) {
        setActive(sections[0]?.id);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActive(visible.target.id);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    setActive(sections[0]?.id);
}

/**
 * Accordéon des compétences ("couches" dépliables, une seule ouverte à la fois)
 */
function initLayerAccordion() {
    const items = document.querySelectorAll(".layer-item");
    if (items.length === 0) return;

    items.forEach((item) => {
        const trigger = item.querySelector(".layer-trigger");
        if (!trigger) return;

        trigger.addEventListener("click", () => {
            const willOpen = !item.classList.contains("open");

            items.forEach((other) => {
                other.classList.remove("open");
                const otherTrigger = other.querySelector(".layer-trigger");
                if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
            });

            if (willOpen) {
                item.classList.add("open");
                trigger.setAttribute("aria-expanded", "true");
            }
        });
    });
}

/**
 * Révélation progressive des blocs au défilement (respecte prefers-reduced-motion
 * via la règle CSS globale qui neutralise les transitions dans ce cas).
 */
function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (items.length === 0) return;

    if (!("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add("is-visible"), index * 60);
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach((el) => observer.observe(el));
}

/**
 * Initialisation du module de contrôle du formulaire de contact
 */
function initFormValidation() {
    const contactForm = document.getElementById("contact-form");
    const feedbackBox = document.getElementById("form-feedback");

    if (!contactForm || !feedbackBox) return;

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Blocage de la soumission synchrone native

        const name = document.getElementById("user-name").value.trim();
        const email = document.getElementById("user-email").value.trim();
        const message = document.getElementById("user-message").value.trim();

        feedbackBox.className = "feedback-message hidden";
        feedbackBox.textContent = "";

        if (name === "" || email === "" || message === "") {
            renderFeedback("Erreur : Tous les champs obligatoires (*) doivent être complétés.", "error", feedbackBox);
            return;
        }

        if (!isValidEmail(email)) {
            renderFeedback("Erreur : Le format de l'adresse e-mail n'est pas valide.", "error", feedbackBox);
            return;
        }

        envoyerFormulaire(contactForm, feedbackBox);
    });
}

/**
 * Transmission réelle du formulaire via Formspree (service tiers statique,
 * compatible avec un hébergement 100% statique comme GitHub Pages).
 *
 * TODO avant publication : remplacer VOTRE_ID_FORMSPREE ci-dessous et dans
 * index.html (attribut action du formulaire) par l'identifiant obtenu sur
 * https://formspree.io (Dashboard -> New Form -> copier l'URL fournie).
 */
function envoyerFormulaire(contactForm, feedbackBox) {
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/VOTRE_ID_FORMSPREE";
    const submitButton = contactForm.querySelector(".btn-submit");
    const libelleOriginal = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";

    fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Réponse non valide du service d'envoi");
            renderFeedback("Succès ! Votre message a été envoyé.", "success", feedbackBox);
            contactForm.reset();
        })
        .catch(() => {
            renderFeedback(
                "Erreur : l'envoi a échoué. Vous pouvez me contacter directement par e-mail en attendant.",
                "error",
                feedbackBox
            );
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = libelleOriginal;
        });
}

/**
 * Validation du format de l'adresse email par expression régulière standardisée
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

/**
 * Injection et gestion de l'état d'affichage des retours utilisateurs
 * @param {string} text - Message descriptif
 * @param {string} statusClass - Statut ('success' ou 'error')
 * @param {HTMLElement} targetElement - Bloc d'affichage cible
 */
function renderFeedback(text, statusClass, targetElement) {
    targetElement.textContent = text;
    targetElement.classList.remove("hidden");
    targetElement.classList.add(statusClass);
    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
}
