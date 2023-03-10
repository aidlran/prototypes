<?php
	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	if (!isset($_SESSION['user']))
		header("Location:/login");
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8"/>
		<title>App</title>

<?php
	if (!$db = @ mysqli_connect('mysql', 'root', 'pm', 'pm'))
		exit("
				</head>
				<body>
					<strong>Database offline.</strong>
				</body>
			</html>
		"); // Database connection error

	$stmt = $db -> prepare("SELECT name FROM user WHERE id=?");
	$stmt -> bind_param('i', $_SESSION['user']);
	$stmt -> execute();
	$active_user_name = htmlentities($stmt -> get_result() -> fetch_row()[0]);
?>

    	<link rel="stylesheet" href="../css/app.css"/>
		<script src="js/onLoad.js" type="text/javascript" async></script>
	</head>
	<body>
		<noscript><strong>JavaScript is disabled.</strong></noscript>
		<div id="dashboard">
			<div id="dashboard-main">
				<div id="header" class="header">
					<div id="header-l" class="header">
						<div id="sidebar-btn" class="header-item icon" title="Show sidebar">
							<?php echo file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/svg/menu.svg");?>
						</div>
					</div>
					<div id="header-r" class="header">
						<div id="inbox-btn" class="header-item icon" title="Inbox">
							<?php echo file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/svg/inbox.svg");?>
						</div>
						<div id="active-account-container" class="header-item" title="<?php echo $active_user_name;?>">
							<div id="active-account-avatar">
								<?php echo substr($active_user_name, 0, 1);?>
							</div>
							<div id="active-account-name">
								<?php echo strtok($active_user_name, ' ');?>
							</div>
						</div>
					</div>
				</div>
				<div id="content">
				</div>
			</div>
			<div id="sidebar">
				<div id="sidebar-header">
					<div id="sidebar-hide-btn" class="header-item icon" title="Hide sidebar">
						<?php echo file_get_contents($_SERVER["DOCUMENT_ROOT"] . "/svg/menu.svg");?>
					</div>
				</div>
				<div id="sidebar-ws-list">
				</div>
				<div id="new-ws-btn">
					<span>+</span>
					<span>New workspace</span>
				</div>
			</div>
		</div>
	</body>
</html>