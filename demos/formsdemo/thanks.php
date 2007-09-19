<?php
if (isset($_POST["PHPSESSIONID"])) {
	$session_id = $_POST["PHPSESSIONID"];
} else {
	$session_id = "";
}

session_start($session_id);


// Check for a degraded file upload, this means SWFUpload did not load and the user used the standard HTML upload
$used_degraded = false;
$resume_name = "";
if (is_uploaded_file($_FILES["resume_degraded"]["tmp_name"])) {
    $resume_name = $_FILES["resume_degraded"]["name"];
    $used_degraded = true;
}

// Check for the file id we should have gotten from SWFUpload
if (isset($_POST["hidFileID"]) && $_POST["hidFileID"] != "" ) {
	$resume_name = $_POST["hidFileID"];
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 7.0 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 7.0) Classic Form Demo</a></div>

<?php
if ($resume_name == "") {
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
				<td><?php echo htmlspecialchars($resume_name); ?>
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
    <div class="content">You used the standard HTML form.</div>
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