<?php
	// Get the session id passed in the post. This works around the Flash Player cookie bug.
	$php_session_id = isset($_POST["PHPSESSID"]) ? $_POST["PHPSESSID"] : false;

	if ($php_session_id === false) {
		header("HTTP/1.0 500 Internal Server Error");
		echo "Could not find session id";
		exit(0);
	}

	session_id($php_session_id);
	session_start();
	// END Flash Player cookie bug work-around
	
	if (isset($_FILES["resume_file"]) && isset($_FILES["resume_file"]["name"])) {
		$_SESSION["resume_name"] = $_FILES["resume_file"]["name"];
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 6 Demo</title>
</head>
<body>
	<p>Upload Page</p>
</body>
</html>