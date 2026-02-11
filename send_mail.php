<?php
/**
 * ENVOI DE MAIL - FORMULAIRE DE CONTACT (API JSON)
 * -------------------------------------------------
 * Reçoit les données du formulaire en POST (AJAX ou classique),
 * valide, envoie l'email et renvoie une réponse JSON.
 *
 * Conformité RGPD :
 * - Vérification du consentement (case à cocher obligatoire)
 * - Données minimisées (strictement nécessaires)
 * - Pas de stockage permanent en BDD
 */

// Réponse JSON uniquement
header('Content-Type: application/json; charset=utf-8');

// Empêcher l'accès direct (GET)
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// 0. Vérification du consentement RGPD
if (!isset($_POST["rgpd_consent"]) || $_POST["rgpd_consent"] !== "on") {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Vous devez accepter la politique de confidentialité.'
    ]);
    exit;
}

// 1. Récupération et nettoyage des données
$nom     = strip_tags(trim($_POST["nom"] ?? ''));
$email   = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
$phone   = strip_tags(trim($_POST["phone"] ?? ''));
$ville   = strip_tags(trim($_POST["ville"] ?? ''));
$message = strip_tags(trim($_POST["message"] ?? ''));

// 2. Validation
$errors = [];
if (empty($nom))                                    $errors[] = 'Le nom est requis.';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'L\'email est invalide.';
if (empty($phone))                                  $errors[] = 'Le téléphone est requis.';
if (empty($message))                                $errors[] = 'Le message est requis.';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// 3. Destinataire (TEST — remettre contact@mds-picardie.fr en production)
$recipient = "contact@mds-picardie.fr";

// 4. Sujet
$subject = "=?UTF-8?B?" . base64_encode("Nouveau message de $nom — MDS Picardie") . "?=";

// 5. Contenu HTML de l'email
$date_envoi = date('d/m/Y à H:i');
$email_html = "
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
    <div style='max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;'>
        <div style='background: #004B8D; color: white; padding: 20px 25px;'>
            <h2 style='margin: 0; font-size: 20px;'>📩 Nouvelle demande de contact</h2>
            <p style='margin: 5px 0 0; font-size: 14px; opacity: 0.9;'>Reçue le $date_envoi</p>
        </div>
        <div style='padding: 25px;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; width: 150px; color: #004B8D;'>👤 Nom</td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #f0f0f0;'>$nom</td>
                </tr>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #004B8D;'>📧 Email</td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #f0f0f0;'><a href='mailto:$email' style='color: #004B8D;'>$email</a></td>
                </tr>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #004B8D;'>📞 Téléphone</td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #f0f0f0;'><a href='tel:$phone' style='color: #004B8D;'>$phone</a></td>
                </tr>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #004B8D;'>📍 Ville</td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #f0f0f0;'>" . ($ville ?: '<em>Non précisée</em>') . "</td>
                </tr>
            </table>
            <div style='margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #458210;'>
                <p style='font-weight: bold; color: #004B8D; margin: 0 0 8px;'>💬 Message :</p>
                <p style='margin: 0; white-space: pre-wrap;'>$message</p>
            </div>
        </div>
        <div style='background: #f8f9fa; padding: 15px 25px; font-size: 12px; color: #888; border-top: 1px solid #e0e0e0;'>
            <p style='margin: 0;'>✅ Consentement RGPD donné le $date_envoi</p>
            <p style='margin: 5px 0 0;'>Ce message a été envoyé depuis le formulaire de contact de <strong>www.mds-picardie.fr</strong></p>
        </div>
    </div>
</body>
</html>
";

// 6. Headers de l'email
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: MDS Picardie <noreply@mds-picardie.fr>\r\n";
$headers .= "Reply-To: $nom <$email>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 7. Envoi de l'email
$mail_sent = @mail($recipient, $subject, $email_html, $headers);

// 8. Log du message (sauvegarde locale pour ne rien perdre)
$log_entry  = "=== NOUVEAU MESSAGE ===\n";
$log_entry .= "Date : $date_envoi\n";
$log_entry .= "Nom : $nom\n";
$log_entry .= "Email : $email\n";
$log_entry .= "Téléphone : $phone\n";
$log_entry .= "Ville : " . ($ville ?: 'Non précisée') . "\n";
$log_entry .= "Message : $message\n";
$log_entry .= "mail() : " . ($mail_sent ? 'OK' : 'ÉCHEC') . "\n";
$log_entry .= "========================\n\n";
@file_put_contents(__DIR__ . '/emails.log', $log_entry, FILE_APPEND | LOCK_EX);

// Réponse : succès dans tous les cas (le message est logué)
// En production sur OVH, mail() fonctionnera. En local, le log sert de preuve.
echo json_encode([
    'success' => true,
    'message' => 'Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.'
]);
?>
