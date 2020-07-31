<?php

	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	if (!isset($_SESSION['user']))
		exit("0");

	if (!$db = @ mysqli_connect('mysql', 'root', 'pm', 'pm'))
		exit("0");

	$stmt = $db -> prepare("
		UPDATE user
		SET last_workspace = null
		WHERE id = ?
	");


	$stmt -> bind_param('i', $user_id);
	$stmt -> execute();

	$stmt = $db -> prepare("
		DELETE FROM workspace
		WHERE creator_user_id=?
		   && name=?
	");

	$stmt -> bind_param('is', $_SESSION['user'], $_POST['s']);
	$stmt -> execute();

	if ($stmt -> affected_rows == 1)
		exit("1");

	exit("999"); // Unknown error
?>