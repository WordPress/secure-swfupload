<?php
	if (isset($_POST["PHPSESSID"])) {
		session_id($_POST["PHPSESSID"]);
	}
	session_start();

	if (!isset($_FILES["Filedata"]) || !is_uploaded_file($_FILES["Filedata"]["tmp_name"]) || $_FILES["Filedata"]["error"] != 0) {
		header("HTTP/1.1 500 File Upload Error");
		if (isset($_FILES["Filedata"])) {
			echo $_FILES["Filedata"]["error"];
		}
		exit(0);
	}
	
	//$rnd_bit = rand(0, 99);

	//$upload_path = str_replace("\\", "/", realpath(dirname($_SERVER['SCRIPT_FILENAME']))) . "/uploads/";
	//$upload_path = "uploads/";
	
	// Handle the upload
	//if (!move_uploaded_file($_FILES["Filedata"]["tmp_name"], $upload_path . $_FILES["Filedata"]["name"])) {
	//	header("HTTP/1.1 500 Internal Server Error");
	//	exit(0);
	//}
	
	// Delete the file.  We don't want it.
	//@unlink($upload_path . $_FILES["Filedata"]["name"]);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 7.0 beta 2 Demo</title>
</head>
<body>
	<p>Upload Page</p>
</body>
</html>