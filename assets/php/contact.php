<?php

include('easymail.php');

$name = $_POST['name'];
$mail = $_POST['mail'];
$message = $_POST['message'];

if (empty($name) || empty($mail) || empty($message)) {
	return 0;
}

$subject = "Nachricht von $name ($mail) auf www.bakirimmobilien.de";
echo sendMail('info@bakirimmobilien.de', $message, $subject, $mail, 'Bakir Immobilien', $name);

?>