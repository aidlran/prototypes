<?php // OUTPUT: [ERR_CODE, INSERT_ID]

	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	if (!isset($_SESSION['user']))
		exit("0");

	if (!$db = @ mysqli_connect('mysql', 'root', 'pm', 'pm'))
		exit(json_encode([0, null])); // Database connection error

	$bus_name = $db -> real_escape_string(trim($_POST['s']));

	if(($length = strlen($bus_name)) > 40 || $length <= 0)
		exit(json_encode([100, null])); // Invalid name length

	$stmt = $db -> prepare("
		SELECT id
		FROM workspace
		WHERE creator_user_id=?
		   && name=?
	");
	$stmt -> bind_param('ss', $_SESSION['user'], $bus_name);
	$stmt -> execute();
	$stmt -> store_result();
	if ($stmt -> num_rows > 0)
		exit(json_encode([101, null])); // User has a workspace with this name

	$stmt = $db -> prepare("
		UPDATE workspace
		SET name=?
		WHERE creator_user_id=?
		   && id=?
	");
	$stmt -> bind_param('sii', $bus_name, $_SESSION['user'], $_POST['id']);
	$stmt -> execute();
	if ($stmt -> affected_rows == 1)
		exit(json_encode([1, $db -> insert_id])); // Success

	exit(json_encode([999, null])); // Unknown error
?>