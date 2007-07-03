<?php
session_start();

$used_degraded = false;

// Check for a degraded file upload
if ($_SESSION["resume_name"] == "" && isset($_FILES["resume_degraded"])) {
    $_SESSION["resume_name"] = $_FILES["resume_degraded"]["name"];
    $used_degraded = true;
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 6 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 6) Classic Form Demo</a></div>

<?php
if (!isset($_SESSION["resume_name"]) || $_SESSION["resume_name"] == "") {
?>
	<div class="content">Your resume was not received.</div>
<?php
} else { ?>

	<div class="content">
		<table>
			<tr>
				<td>Last Name:
				</td>
				<td><?php echo htmlspecialchars($_POST["lastname"]); ?>
				</td>
			</tr>
			<tr>
				<td>First Name:
				</td>
				<td><?php echo htmlspecialchars($_POST["firstname"]); ?>
				</td>
			</tr>
			<tr>
				<td>Education Name:
				</td>
				<td><?php echo htmlspecialchars($_POST["education"]); ?>
				</td>
			</tr>
			<tr>
				<td>Resume:
				</td>
				<td><?php echo $_SESSION["resume_name"]; ?>
				</td>
			</tr>
			<tr>
				<td>References:
				</td>
				<td><?php echo htmlspecialchars($_POST["references"]); ?>
				</td>
			</tr>
		</table>
	</div>
    <?php if ($used_degraded) { ?>
    <div class="content">You used the degraded form.</div>
    <?php } ?>
    <hr width="90%" />
	<div class="content">
		Thank you for your submission.
	</div>
<?php } ?>
	<div class="content"><a href="index.php">Submit another Application</a></div>
	<div class="content">
		Thanks for trying this demo.  Your files are discarded for the purposes of this demo.
	</div>

</body>
</html>