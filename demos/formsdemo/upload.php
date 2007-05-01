<?php
	if (!isset($_GET["PHPSESSID"])) {
		header("HTTP/1.0 500 Server Error");
		exit(0);
	}
	session_id($_GET["PHPSESSID"]);
	session_start();
	
	if (isset($_FILES["Filedata"]) && isset($_FILES["Filedata"]["name"])) {
		$_SESSION["resume_name"] = $_FILES["Filedata"]["name"];
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 5 Demo</title>
</head>
<body>
	<p>Upload Page</p>
</body>
</html>