<?php
// send_mail.php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Get Form Data
    $nom = strip_tags(trim($_POST["nom"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $ville = strip_tags(trim($_POST["ville"]));
    $message = trim($_POST["message"]);

    // 2. Validation
    if (empty($nom) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Redirect back with error (you might want a better error handling in real prod)
        echo "Erreur: Veuillez remplir tous les champs correctement.";
        exit;
    }

    // 3. Recipient Email (TEST MODE)
    // $recipient = "contact@mds-picardie.fr";
    $recipient = "milann.lede@icloud.com";

    // 4. Email Subject
    $subject = "Nouveau message de $nom via MDS Picardie";

    // 5. Email Content
    $email_content = "Nom: $nom\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Téléphone: $phone\n";
    $email_content .= "Ville d'intervention: $ville\n\n";
    $email_content .= "Message:\n$message\n";

    // 6. Email Headers
    $headers = "From: $nom <$email>";

    // 7. Send Log (FOR LOCAL DEBUGGING)
    // Save email details to a file since mail() often fails on localhost without config
    $log_entry = "--- NEW EMAIL ---\n";
    $log_entry .= "Date: " . date('Y-m-d H:i:s') . "\n";
    $log_entry .= "To: $recipient\n";
    $log_entry .= "Subject: $subject\n";
    $log_entry .= "Content:\n$email_content\n";
    $log_entry .= "Headers: $headers\n";
    $log_entry .= "-----------------\n\n";
    file_put_contents('emails.log', $log_entry, FILE_APPEND);

    // 8. Send Email (Might fail on localhost without SMTP)
    // We attempt to send, but even if it fails, we redirect to success for testing
    mail($recipient, $subject, $email_content, $headers);
    
    // Always redirect to success for local testing
    header("Location: contact.html?success=1");
    exit;

    /* REVERT TO THIS FOR PRODUCTION:
    if (mail($recipient, $subject, $email_content, $headers)) {
        header("Location: contact.html?success=1");
        exit;
    } else {
        echo "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.";
    }
    */

} else {
    // Not a POST request
    echo "Accès interdit.";
}
?>
