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

    // 3. Recipient Email
    $recipient = "contact@mds-picardie.fr";

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

    // 7. Send Email
    if (mail($recipient, $subject, $email_content, $headers)) {
        // Redirect to a specific success page or contact page with success param
        // For simplicity, we redirect back to contact.html with a query param?success=1
        header("Location: contact.html?success=1");
        exit;
    } else {
        echo "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.";
    }

} else {
    // Not a POST request
    echo "Accès interdit.";
}
?>
