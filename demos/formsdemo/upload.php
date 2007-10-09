<?php
	/* Using SWFUpload changes the way some uploads are handled.  Uploads that are tied to a form are submitted
	separately from the form.  If I'm creating a database record for the form or the "attachment" then I need some
	way to tie them back together.
	
	The upload occurs first.  Once complete the form is submitted.  So, I am having the upload generate a file id
	that is passed back to the form.  The file id gets submitted with the form so that script can find the
	upload. 
	
	I avoided using a session since Flash Player does not the session id cookie in non-ie browsers.  If I
	had used sessions I'd have to make sure the session was set up correctly (see the other demoes).
	*/


	if (isset($_FILES["resume_file"]) && is_uploaded_file($_FILES["resume_file"]["tmp_name"]) && $_FILES["resume_file"]["error"] == 0) {
		echo rand(1000000, 9999999);	// Create a pretend file id, this might have come from a database.
	} else {
		echo ' '; // I have to return something or SWFUpload won't file uploadComplete
	}
?>