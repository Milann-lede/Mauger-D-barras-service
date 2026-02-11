/**
 * SCRIPT DU FORMULAIRE DE CONTACT
 * --------------------------------
 * Gère :
 * - L'envoi AJAX du formulaire (sans rechargement de page)
 * - L'affichage du message de succès / erreur
 * - Le bouton de chargement animé
 * - L'auto-resize du textarea
 * - La validation côté client
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. AUTO-RESIZE TEXTAREA
       ========================================= */
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const autoResize = (el) => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        };
        messageTextarea.addEventListener('input', function () { autoResize(this); });
        setTimeout(() => autoResize(messageTextarea), 100);
    }

    /* =========================================
       2. ENVOI DU FORMULAIRE EN AJAX
       ========================================= */
    const form = document.getElementById('contact-form');
    if (!form) return;

    const formWrapper   = document.getElementById('contact-form-wrapper');
    const successMsg    = document.getElementById('success-message');
    const errorMsg      = document.getElementById('error-message');
    const errorText     = document.getElementById('error-text');
    const btnText       = document.getElementById('btn-text');
    const btnLoading    = document.getElementById('btn-loading');
    const submitBtn     = document.getElementById('submit-btn');
    const sendAnother   = document.getElementById('send-another');
    const retrySend     = document.getElementById('retry-send');

    /**
     * Affiche un écran de résultat (succès ou erreur) avec animation.
     */
    function showResult(type) {
        // Masquer le formulaire avec une transition douce
        formWrapper.style.opacity = '0';
        formWrapper.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            formWrapper.style.display = 'none';
            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';

            const target = (type === 'success') ? successMsg : errorMsg;
            target.style.display = 'block';
            target.style.opacity = '0';
            target.style.transform = 'translateY(20px)';

            // Petit délai pour que le display:block soit pris en compte
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    target.style.opacity = '1';
                    target.style.transform = 'translateY(0)';
                });
            });

            // Scroll vers le message
            const card = document.getElementById('contact-card');
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Lancer les confettis pour le succès
            if (type === 'success') {
                launchConfetti();
            }
        }, 300);
    }

    /**
     * Réaffiche le formulaire.
     */
    function showForm() {
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';
        formWrapper.style.display = 'block';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                formWrapper.style.opacity = '1';
                formWrapper.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Mini confettis — effet festif léger.
     */
    function launchConfetti() {
        const colors = ['#458210', '#004B8D', '#FFD100', '#e74c3c', '#2ecc71', '#9b59b6'];
        const card = document.getElementById('contact-card');
        if (!card) return;
        card.style.position = 'relative';
        card.style.overflow = 'hidden';

        for (let i = 0; i < 40; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                position: absolute;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: ${6 + Math.random() * 6}px;
                height: ${6 + Math.random() * 6}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                opacity: 0.9;
                z-index: 10;
                pointer-events: none;
                animation: confetti-fall ${1.5 + Math.random() * 2}s ease-out forwards;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            card.appendChild(confetti);

            // Supprimer après animation
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    /**
     * Gestion de la soumission du formulaire.
     */
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validation HTML5
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // État de chargement
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        try {
            const formData = new FormData(form);
            const response = await fetch('send_mail.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showResult('success');
                form.reset(); // Vider le formulaire
            } else {
                errorText.textContent = data.message || 'Une erreur est survenue.';
                showResult('error');
            }
        } catch (err) {
            console.error('Erreur réseau:', err);
            errorText.textContent = 'Impossible de contacter le serveur. Vérifiez votre connexion internet ou appelez-nous au 03 44 92 68 84.';
            showResult('error');
        } finally {
            // Réinitialiser le bouton
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });

    /* =========================================
       3. BOUTONS "ENVOYER UN AUTRE" / "RÉESSAYER"
       ========================================= */
    if (sendAnother) {
        sendAnother.addEventListener('click', showForm);
    }
    if (retrySend) {
        retrySend.addEventListener('click', showForm);
    }

    /* =========================================
       4. SUPPORT DU PARAMÈTRE ?success=1 (legacy)
       ========================================= */
    if (window.location.search.includes('success=1')) {
        showResult('success');
        // Nettoyer l'URL
        if (window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});
