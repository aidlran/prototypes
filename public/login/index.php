<?php
	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	if (isset($_SESSION['user']))
		header("Location:/app");

	// Process form
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {

		// Trims/sanitises username
		if (isset($_POST['username']))
			$username = $_POST['username'] = trim(strtolower($_POST['username']));

		// Check if the database connection works
		if ($db = @ mysqli_connect('mysql', 'root', 'pm', 'pm')) {

			// Check all fields were filled out
			$set_vars = 0;
			$required = ['username',
						 'password'];
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
				if (strlen($_POST['username']) > 40 || !ctype_alnum($_POST['username'])) {
					$failed = true;
					$username_err = "Invalid username.";
				}

				// Validate credientials
				if (!$failed) {
					$stmt = $db -> prepare("SELECT id, password FROM user WHERE username=?");
					$stmt -> bind_param('s', $_POST['username']);
					if (!$stmt -> execute())
						$main_err = "Something went wrong.";
					else {
						if (($result = $stmt -> get_result()) -> num_rows == 0)
							$main_err = "Incorrect username/password.";
						else {
							$row = $result -> fetch_row();
							if (password_verify($_POST['password'], $row[1])) {
								$_SESSION['user'] = $row[0];
								header("Location:/app");
							}
							else
								$main_err = "Incorrect username/password.";
						}
					}
				}

			} else { // If some fields were missing
				$main_err = "Please complete all fields.";

				if (!$required[0])
					$username_err = true;

				if (!$required[1])
					$password_err = true;
			}
			$db -> close();
		} else {
			$main_err = "Server is currently unavailable.";
			if (isset($_POST['password']))
				$password = $_POST['password'];
		}
	}
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8"/>
		<title>Log in</title>
    	<link rel="stylesheet" href="../css/login.css"/>
	</head>
	<body>
		<noscript>
			<div id="noscript">JavaScript is disabled. Enable JavaScript in your browser/extension settings for a better experience.</div>
		</noscript>
		<form class="box" name="register" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
			<h1>Log in</h1>
			<div class="row">
				<label for="username">Username</label>
				<input <?php if (isset($username_err)) echo "class=\"error\" ";?>name="username" type="text" placeholder="Username" <?php if (isset($username)) echo 'value="' . htmlspecialchars($username) . '"';?>/>
			</div>
			<?php
				if (isset($username_err) && is_string($username_err))
					echo "<div class=\"error\">$username_err</div>";
			?>
			<div class="row">
				<label for="password">Password</label>
				<input <?php if (isset($password_err)) echo "class=\"error\" ";?>name="password" type="password" placeholder="Password" <?php if (isset($password)) echo 'value="' . htmlspecialchars($password) . '"';?>/>
			</div>
			<?php
				if (isset($password_err) && is_string($password_err))
					echo "<div class=\"error\">$password_err</div>";
			?>
			<?php if (isset($main_err)) echo "<div id=\"main-error\" class=\"error\">$main_err</div>";?>
			<input type="submit" value="Log in"/>
		</form>
		<div class="box">
			<p>New users: <a href="../register/">create an account</a></p>
		</div>
	</body>
</html>