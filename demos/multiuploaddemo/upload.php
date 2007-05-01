<?
	$session_id = $_GET["PHPSESSID"];
	if ($session_id) {
		session_id($session_id);
	}
	session_start();

	//$upload_path = str_replace("\\", "/", realpath(dirname($_SERVER['SCRIPT_FILENAME']))) . "/uploads/";
	//$upload_path = "uploads/";
	
	// Handle the upload
	//if (!move_uploaded_file($_FILES["Filedata"]["tmp_name"], $upload_path . $_FILES["Filedata"]["name"])) {
	//	header("HTTP/1.0 500 Internal Server Error");
	//}
	
	// Delete the file.  We don't want it.
	//@unlink($upload_path . $_FILES["Filedata"]["name"]);
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