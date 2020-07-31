<?php

	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	if (!isset($_SESSION['user']))
		exit();

	$db = @ mysqli_connect('mysql', 'root', 'pm', 'pm');

	$stmt = $db -> prepare("
		UPDATE user
		SET last_workspace=?
		WHERE id=?
	");

	$stmt -> bind_param('ii', $_POST['id'], $_SESSION['user']);
	$stmt -> execute();
?>