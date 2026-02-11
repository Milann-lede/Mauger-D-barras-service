/**
 * SCRIPT PRINCIPAL DU SITE
 * ------------------------
 * Ce fichier contient toute la logique JavaScript du site web.
 * Il gère les interactions utilisateur comme le menu mobile, les accordéons,
 * le défilement fluide et le diaporama avant/après.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. NAVIGATION MOBILE
     * --------------------
     * Gère l'ouverture et la fermeture du menu sur les petits écrans
     * via le bouton "burger".
     */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            // Ajoute ou enlève la classe 'active' pour afficher/masquer le menu
            navLinks.classList.toggle('active');
        });
    }

    /**
     * 2. ACCORDÉON FAQ
     * ----------------
     * Gère l'affichage des réponses dans la section FAQ.
     */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Bascule la classe 'active' sur l'élément cliqué
            item.classList.toggle('active');
        });
    });

    /**
     * 3. DÉFILEMENT FLUIDE (SMOOTH SCROLL)
     * ------------------------------------
     * Permet un défilement doux lors du clic sur les liens d'ancrage (ex: #contact).
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // Ignore si le lien est juste "#"
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Défilement fluide vers l'élément cible
                targetElement.scrollIntoView({ behavior: 'smooth' });

                // Ferme le menu mobile s'il est ouvert (UX)
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    /**
     * 4. GESTION DES MESSAGES DE SUCCÈS (LEGACY)
     * -------------------------------------------
     * La gestion principale est maintenant dans custom-form.js (AJAX).
     * Ce bloc est conservé comme fallback au cas où ?success=1 est dans l'URL
     * mais custom-form.js n'est pas chargé (pages sans formulaire).
     */

    /**
     * 5. PRÉ-REMPLISSAGE DU FORMULAIRE (VILLE)
     * ----------------------------------------
     * Si l'URL contient ?ville=XYZ, on remplit automatiquement le champ ville.
     */
    const urlParams = new URLSearchParams(window.location.search);
    const villeParam = urlParams.get('ville');
    if (villeParam) {
        const villeInput = document.querySelector('input[name="ville"]');
        if (villeInput) villeInput.value = villeParam;
    }

    /**
     * 6. DIAPORAMA AVANT/APRÈS (STAGGERED)
     * ------------------------------------
     * Logique pour le diaporama "superposé" sur la page Particuliers.
     * Alterne entre deux images avec un effet de transition.
     */
    const staggeredContainer = document.getElementById('staggered-slideshow');
    if (staggeredContainer) {
        const slides = staggeredContainer.querySelectorAll('.staggered-slide');
        let currentSlide = 0;

        // Change de slide toutes les 4 secondes
        setInterval(() => {
            // A. Sortie de la slide actuelle (vers la gauche)
            slides[currentSlide].style.transform = 'translateX(-100%)';
            slides[currentSlide].classList.remove('active');

            // B. Calcul de la prochaine slide
            const nextSlide = (currentSlide + 1) % slides.length;

            /**
             * C. Entrée de la prochaine slide
             * On prépare la transition pour qu'elle arrive de la droite vers le centre.
             * Note : Dans le CSS, la slide inactive devrait être positionnée à droite par défaut (translateX(100%))
             * ou gérée via les classes, mais ici on force le mouvement.
             */
            slides[nextSlide].style.transition = 'transform 0.8s ease-in-out';
            slides[nextSlide].style.transform = 'translateX(0)';
            slides[nextSlide].classList.add('active');

            // D. Mise à jour des index
            let prevSlide = currentSlide;
            currentSlide = nextSlide;

            // E. Reset de l'ancienne slide après la transition
            // On attend que la transition (0.8s) soit finie pour remettre l'ancienne slide à droite
            // sans animation, afin qu'elle soit prête pour le prochain cycle.
            setTimeout(() => {
                slides[prevSlide].style.transition = 'none'; // Désactive l'animation pour le reset instantané
                slides[prevSlide].style.transform = 'translateX(150%)';
            }, 800);

        }, 4000);
    }
});

/**
 * FONCTIONS GLOBALES
 * ------------------
 */


