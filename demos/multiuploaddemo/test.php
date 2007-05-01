<?php
	session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 5 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />

</head>
<body>
	<div class="title"><a class="inherit" href="../index.php">SWFUpload (Revision 5) Multi-Upload Demo</a></div>
	<form id="form1" action="upload.php?PHPSESSID=<?=session_id()?>" method="post" enctype="multipart/form-data">
		<div class="content">
			<div id="degradedUI1">
				<fieldset>
					<legend>Large File Upload Site</legend>
					<input type="file" name="Filedata" /> (Any file, Max 1 GB)<br/>
				</fieldset>
				<div>
					<input type="submit" value="Submit Files" />
				</div>
			</div>
		</div>
	</form>
</body>
</html>