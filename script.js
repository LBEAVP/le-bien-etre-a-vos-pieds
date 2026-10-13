document.addEventListener("DOMContentLoaded", () => {
    // 1. Header dynamique au défilement
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // 2. Menu Burger Mobile
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }

    // 3. Défilement fluide (Smooth Scroll) ajusté à la hauteur du header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (navLinks) navLinks.classList.remove('active');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // 4. Animations d'apparition au défilement (IntersectionObserver)
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

    // 5. Lightbox pour agrandir les photos
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    document.querySelectorAll('.zoomable').forEach(img => {
        img.addEventListener('click', () => {
            if (lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
            }
            if (lightbox) lightbox.classList.add('active');
        });
    });

    const closeLightbox = () => { if (lightbox) lightbox.classList.remove('active'); };
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // 6. Envoi direct du formulaire par e-mail via FormSubmit (AJAX)
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = 'Envoi en cours... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>';
            btn.disabled = true;

            try {
                const formData = new FormData(form);
                const response = await fetch("https://formsubmit.co/ajax/lbeavp@gmail.com", {
                    method: "POST",
                    headers: { 'Accept': 'application/json' },
                    body: formData
                });

                if (response.ok) {
                    btn.innerHTML = 'Demande envoyée avec succès ! <i class="fa-solid fa-check" style="margin-left: 8px;"></i>';
                    form.reset();
                } else {
                    btn.innerHTML = 'Erreur lors de l\'envoi. Réessayez.';
                }
            } catch (error) {
                btn.innerHTML = 'Erreur réseau. Veuillez appeler le 06 33 14 34 85.';
            }

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 4500);
        });
    }

    // 7. Gestion de la bannière RGPD
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptBtn) {
        // Vérifier si l'utilisateur a déjà accepté
        if (!localStorage.getItem('cookiesAccepted')) {
            // Si non, afficher la bannière
            cookieBanner.style.display = 'flex';
        }

        // Gérer le clic sur "Accepter"
        acceptBtn.addEventListener('click', () => {
            // Stocker le consentement (pour une durée de 1 an par ex.)
            localStorage.setItem('cookiesAccepted', 'true');
            // Masquer la bannière avec une animation
            cookieBanner.style.opacity = '0';
            cookieBanner.style.transform = 'translateY(20px)';
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 300); // Temps de la transition CSS
        });
    }
});