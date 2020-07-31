<?php
	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	if (isset($_SESSION['user']))
		header("Location:/app");

	// Process form
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {

		// Trims/sanitises username & display-name
		if (isset($_POST['username']))
			// Doesn't trim the processed value - if that validated user would think they have a space in their username and get locked out
			$username = trim($_POST['username'] = strtolower($_POST['username']));
		if (isset($_POST['display-name']))
			$_POST['display-name'] = $display = trim($_POST['display-name']);

		// Check if the database connection works
		if ($db = @ mysqli_connect('mysql', 'root', 'pm', 'pm')) {

			// Check all fields were filled out
			$set_vars = 0;
			$required = ['username',
						 'display-name',
						 'password',
						 'confirm-password'];
			foreach ($required as &$field) {
				if (isset($_POST[$field])) {
					if (strlen($_POST[$field]) <= 0)
						$field = false;
					else
						$set_vars++;
				}
			}

			// If all fields were filled out
			if ($set_vars == count($required)) {

				$failed = false;

				// Verify username
				$stmt = $db -> prepare("SELECT name FROM user WHERE username=?");
				$stmt -> bind_param('s', $_POST['username']);
				if (!$stmt -> execute()) {
					$failed = true;
					$main_err = "Something went wrong.";
				}
				elseif (strlen($_POST['username']) > 40) {
					$failed = true;
					$username_err = "Username cannot be longer than 40 characters.";
				}
				elseif (!ctype_alnum($_POST['username'])) {
					$failed = true;
					$username_err = "Username can only contain alphanumeric characters.";
				}
				else {
					$stmt -> store_result();
					if ($stmt -> num_rows > 0) {
						$failed = true;
						$username_err = "This username is unavailable.";
					}
				}

				// Verify display name
				if (strlen($_POST['display-name']) > 40) {
					$failed = true;
					$display_err = "Display name cannot be longer than 40 characters.";
				}

				// Verify password
				if ($_POST['password'] != $_POST['confirm-password']) {
					$failed = true;
					$password_err = true;
					$confirm_err = "Passwords do not match";
				} elseif (strlen($_POST['password']) < 8) {
					$failed = true;
					$password_err = true;
					$confirm_err = "Password must be at least 8 characters long.";
				}
				elseif (strlen($_POST['password']) > 72) {
					$failed = true;
					$password_err = true;
					$confirm_err = "Password cannot be longer than 72 characters.";
				}

				// Register
				if (!$failed) {
					$hash = password_hash($_POST['password'], PASSWORD_BCRYPT, ['cost' => 10]);
					$stmt = $db -> prepare("INSERT INTO user(username, password, name) VALUES (?, ?, ?)");
					$stmt -> bind_param('sss', $_POST['username'], $hash, $_POST['display-name']);
					if (!$stmt -> execute())
						$main_err = "Something went wrong.";
					elseif ($db -> affected_rows != 1)
						$main_err = "Something went wrong.";
					else
						header("Location:/login");
				}

			} else { // If some fields were missing
				$main_err = "Please complete all fields.";

				if (!$required[0])
					$username_err = true;

				if (!$required[1])
					$display_err = true;

				$password_err = true;
				$confirm_err = true;
			}
			$db -> close();
		} else {
			$main_err = "Server is currently unavailable.";
			if (isset($_POST['password']))
				$password = $_POST['password'];
			if (isset($_POST['confirm-password']))
				$confirm = $_POST['confirm-password'];
		}
	}
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8"/>
		<title>Register</title>
    	<link rel="stylesheet" href="../css/login.css"/>
	</head>
	<body>
		<noscript>
			<div id="noscript">JavaScript is disabled. Enable JavaScript in your browser/extension settings for a better experience.</div>
		</noscript>
		<form class="box" name="register" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
			<h1>Create an account</h1>
			<div class="row">
				<label for="username">Username</label>
				<input <?php if (isset($username_err)) echo "class=\"error\" ";?>name="username" type="text" placeholder="Username" <?php if (isset($username)) echo 'value="' . htmlspecialchars($username) . '"';?>/>
				<img class="info" src="../svg/info.svg" title="Your unique username will be used to log in. Maximum 40 characters. Alphanumeric only.">
			</div>
			<?php
				if (isset($username_err) && is_string($username_err))
					echo "<div class=\"error\">$username_err</div>";
			?>
			<div class="row">
				<label for="display-name">Display name</label>
				<input <?php if (isset($display_err)) echo "class=\"error\" ";?>name="display-name" type="text" placeholder="Display name" <?php if (isset($display)) echo 'value="' . htmlspecialchars($display) . '"';?>/>
				<img class="info" src="../svg/info.svg" title="Your display name will be visible in various places of the app. You'll be able to change this later. Maximum 40 characters.">
			</div>
			<?php
				if (isset($display_err) && is_string($display_err))
					echo "<div class=\"error\">$display_err</div>";
			?>
			<div class="row">
				<label for="password">Password</label>
				<input <?php if (isset($password_err)) echo "class=\"error\" ";?>name="password" type="password" placeholder="Password" <?php if (isset($password)) echo 'value="' . htmlspecialchars($password) . '"';?>/>
				<img class="info" src="../svg/info.svg" title="Your password must contain 8-72 characters.">
			</div>
			<div class="row">
				<label for="confirm-password">Confirm password</label>
				<input <?php if (isset($confirm_err)) echo "class=\"error\" ";?>name="confirm-password" type="password" placeholder="Confirm password" <?php if (isset($confirm)) echo 'value="' . htmlspecialchars($confirm) . '"';?>/>
			</div>
			<?php
				if (isset($confirm_err) && is_string($confirm_err))
					echo "<div class=\"error\">$confirm_err</div>";
			?>
			<?php if (isset($main_err)) echo "<div id=\"main-error\" class=\"error\">$main_err</div>";?>
			<input type="submit" value="Submit"/>
		</form>
		<div class="box">
			<p>Existing users: <a href="../login/">log in</a></p>
		</div>
	</body>
</html>