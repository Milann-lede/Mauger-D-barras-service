/**
 * SCRIPT PERSONNALISÉ POUR LES FORMULAIRES
 * ----------------------------------------
 * Ce script gère les interactions spécifiques aux formulaires,
 * comme l'auto-agrandissement des zones de texte.
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * AUTO-RESIZE TEXTAREA
     * --------------------
     * Ajuste automatiquement la hauteur du champ "Message" 
     * en fonction du contenu saisi par l'utilisateur.
     */
    const messageTextarea = document.getElementById('message');

    if (messageTextarea) {
        // Fonction pour ajuster la hauteur
        const autoResize = (element) => {
            element.style.height = 'auto'; // Réinitialise pour calculer la bonne hauteur (rétrécissement)
            element.style.height = element.scrollHeight + 'px'; // Applique la hauteur du contenu
        };

        // Écouteur sur l'événement 'input' (chaque frappe)
        messageTextarea.addEventListener('input', function () {
            autoResize(this);
        });

        // Initialisation (au cas où il y a du texte par défaut)
        // Petit délai pour s'assurer que le CSS est chargé
        setTimeout(() => autoResize(messageTextarea), 100);
    }
});
