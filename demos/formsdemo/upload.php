<?php
    // Handle the file and return the file identifier to the SWF
	if (isset($_FILES["resume_file"]) && isset($_FILES["resume_file"]["name"])) {
		echo $_FILES["resume_file"]["name"];
	} else {
		echo ' ';
	}
?>