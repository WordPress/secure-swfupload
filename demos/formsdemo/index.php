<?php
	session_start();
	$_SESSION["resume_name"] = "";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 4 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfupload/swfuploadr5.js"></script>
	<script type="text/javascript" src="js/handlers.js"></script>
	<script type="text/javascript">
		var swf_upload_control;
		window.onload = function() {
			swf_upload_control = new SWFUpload({
				// Backend settings
				upload_target_url: "../formsdemo/upload.php",	// Relative to the SWF file
				upload_cookies: "PHPSESSID",

				// Flash file settings
				file_size_limit : "10240",	// 10 MB
				file_types : "*.*",	// or you could use something like: "*.doc;*.wpd;*.pdf",
				file_types_description : "All Files",
				file_upload_limit : "1",
				begin_upload_on_queue : false,

				// Event handler settings
				file_queued_handler : uploadStart,
				file_progress_handler : uploadProgress,
				file_cancelled_handler : uploadCancel,
				file_complete_handler : uploadComplete,
				queue_complete_handler : uploadQueueComplete,
				error_handler : uploadError,
				
				// Flash Settings
				flash_container_element : "flashContainer",
				flash_url : "../swfupload/swfuploadr5.swf",	// Relative to this file

				// UI settings
				ui_container_element : "flashUI",
				degraded_container_element : "degradedUI",
				
				// Debug settings
				debug: false
			});
			
			// This is a setting that my Handlers will use. It's not part of SWFUpload
			// But I can add it to the SWFUpload object and then use it where I need to
			swf_upload_control.AddSetting("progress_target", "fsUploadProgress")
	
	     }
	     
	     function doSubmit() {
			try {
				swf_upload_control.StartUpload();
			} catch (ex) {}
	     }
	     function uploadDone() {
			try {
				document.forms[0].submit();
			} catch (ex) {}
	     }
	</script>

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 4) Classic Form Demo</a></div>
	
	<form id="form1" action="thanks.php" enctype="multipart/form-data" method="post">
		<div class="content">
			<fieldset >
				<legend>Submit your Application</legend>
				<table style="vertical-align:top;">
					<tr>
						<td>
							Last Name:
						</td>
						<td>
							<input name="lastname" type="text" style="width: 200px" />
						</td>
					</tr>
					<tr>
						<td>
							First Name:
						</td>
						<td>
							<input name="firstname" type="text" style="width: 200px" />
						</td>
					</tr>
					<tr>
						<td>
							Education:
						</td>
						<td>
							<textarea name="education" cols="0" rows="0" style="width: 400px; height: 100px;"></textarea>
						</td>
					</tr>
					<tr>
						<td>
							Resume:
						</td>
						<td>
							
							<div id="flashUI" style="display: none;">
								<!-- This is the UI that I built. It only gets displayed if SWFUpload loads properly -->
								<div>
									<input type="text" /><input type="button" value="Browse..." onclick="swf_upload_control.Browse()" /> (10 MB max)
								</div>
								<div class="flash" id="fsUploadProgress">
									<!-- This is where the file progress gets shown.  SWFUpload doesn't handle this automatically.
										Its my Handlers (in handlers.js) that process the upload events and handle the UI updates -->
								</div>
							</div>
							<div id="degradedUI">
								<!-- This is the standard UI.  This UI is shown by default but when SWFUpload loads it will be
								hidden and the "flashUI" will be shown -->
								<input type="file" name="resume" /> (10 MB max)<br/>
							</div>
							<div id="flashContainer"><!-- This is where the flash embed/object tag will go once SWFUpload has loaded --></div>
						</td>
					</tr>
					<tr>
						<td>
							References:
						</td>
						<td>
							<textarea name="references" cols="0" rows="0" style="width: 400px; height: 100px;"></textarea>
						</td>
					</tr>
				</table>
				<br />
				<input type="submit" value="Submit Application" onclick="doSubmit(); return false;" />
				<input type="button" value="Cancel All" onclick="swf_upload_control.CancelQueue();" />
			</fieldset>
		</div>
	</form>
</body>
</html>