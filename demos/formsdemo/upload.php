<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?
	session_id($_GET["PHPSESSID"]);
	session_start();
	
	$_SESSION["resume_name"] = $_FILES["Filedata"]["name"];
?>
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 5 Demo</title>
</head>
<body>
	<p>Upload Page</p>
</body>
</html>