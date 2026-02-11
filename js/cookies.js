/**
 * BANDEAU D'INFORMATION COOKIES - CONFORMITÉ RGPD
 * ------------------------------------------------
 * Ce site n'utilise qu'un seul cookie technique (mds_cookie_consent)
 * pour mémoriser que l'utilisateur a pris connaissance de cette information.
 * 
 * Aucun cookie de tracking, d'analytics ou de réseaux sociaux n'est déposé.
 * Les liens vers les réseaux sociaux sont de simples liens <a> sans SDK.
 * 
 * Conformément à la CNIL, les cookies strictement nécessaires ne requièrent
 * pas de consentement, mais l'utilisateur doit être informé de leur existence.
 */

(function () {
    'use strict';

    /* =========================================
       CONFIGURATION
       ========================================= */
    var COOKIE_NAME = 'mds_cookie_consent';
    var COOKIE_DURATION = 395; // 13 mois en jours (recommandation CNIL)

    /* =========================================
       UTILITAIRES COOKIES
       ========================================= */

    /**
     * Crée un cookie avec une durée de vie en jours.
     */
    function setCookie(name, value, days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + date.toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + ';' + expires + ';path=/;SameSite=Lax';
    }

    /**
     * Lit la valeur d'un cookie par son nom.
     */
    function getCookie(name) {
        var nameEQ = name + '=';
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var c = cookies[i].trim();
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length));
            }
        }
        return null;
    }

    /* =========================================
       BANDEAU D'INFORMATION
       ========================================= */

    /**
     * Crée et affiche le bandeau d'information cookies.
     * Puisque le site n'utilise que des cookies techniques,
     * un simple bandeau informatif avec un bouton "Compris" suffit.
     */
    function createBanner() {
        if (document.getElementById('cookie-banner')) return;

        var banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Information sur les cookies');
        banner.innerHTML =
            '<div class="cookie-banner-content">' +
                '<div class="cookie-banner-text">' +
                    '<h3><i class="fas fa-cookie-bite"></i> Information sur les cookies</h3>' +
                    '<p>Ce site utilise uniquement des <strong>cookies techniques</strong> indispensables à son fonctionnement. ' +
                    'Aucun cookie publicitaire, de tracking ou de réseaux sociaux n\'est déposé.</p>' +
                    '<p>Pour en savoir plus, consultez notre <a href="politique-confidentialite.html">politique de confidentialité</a>.</p>' +
                '</div>' +
                '<div class="cookie-banner-actions">' +
                    '<button id="cookie-accept" class="cookie-btn cookie-btn-accept" type="button">' +
                        '<i class="fas fa-check"></i> Compris' +
                    '</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        // Événement
        document.getElementById('cookie-accept').addEventListener('click', function () {
            setCookie(COOKIE_NAME, JSON.stringify({
                accepted: true,
                timestamp: new Date().toISOString()
            }), COOKIE_DURATION);
            hideBanner();
        });

        // Animation d'entrée
        requestAnimationFrame(function () {
            banner.classList.add('cookie-banner-visible');
        });
    }

    /**
     * Cache le bandeau.
     */
    function hideBanner() {
        var banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('cookie-banner-visible');
            setTimeout(function () {
                banner.remove();
            }, 400);
        }
    }

    /* =========================================
       INITIALISATION
       ========================================= */

    function init() {
        var consent = getCookie(COOKIE_NAME);
        if (!consent) {
            createBanner();
        }
    }

    // Lancer l'initialisation quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
