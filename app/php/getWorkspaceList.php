<?php

	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	if (!isset($_SESSION['user']))
		exit("0");

	if (!$db = @ mysqli_connect('mysql', 'root', 'pm', 'pm'))
		exit("0"); // Database connection error

	$array = array();

	$stmt = $db -> prepare("
		SELECT id, name
		FROM workspace
		WHERE creator_user_id=?
		ORDER BY name ASC
	");

	$stmt -> bind_param('i', $_SESSION['user']);
	$stmt -> execute();
	$result = $stmt -> get_result();

	while($row = $result -> fetch_row())
		array_push($array, $row);

	exit(json_encode($array));
?>