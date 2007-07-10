<?php
	session_start();
	$_SESSION["resume_name"] = "";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 6.5 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfuploadr6_0013/swfupload.js"></script>
	<script type="text/javascript" src="js_13/handlers.js"></script>
	<script type="text/javascript">
		var swf_upload_control;

        window.onload = function () {
            swf_upload_control = new SWFUpload({
				// Backend settings
				upload_target_url: "../formsdemo/upload.php",	// Relative to the SWF file
				file_post_name: "resume_file",

				// Flash file settings
				file_size_limit : "10240",	// 10 MB
				file_types : "*.*",	// or you could use something like: "*.doc;*.wpd;*.pdf",
				file_types_description : "All Files",
				file_upload_limit : "1",
				//file_queue_limit : "1", // this isn't needed because the upload_limit will automatically place a queue limit
				begin_upload_on_queue : false,
				use_server_data_event : true,
				validate_files: false,

				// Event handler settings
				file_queued_handler : fileQueued,
				file_validation_handler : fileValidation,
				file_progress_handler : fileProgress,
				file_cancelled_handler : uploadCancelled,
				file_complete_handler : fileComplete,
				queue_complete_handler : queueComplete,
				error_handler : uploadError,

				// Flash Settings
				flash_url : "../swfuploadr6_0013/swfupload.swf",	// Relative to this file

				// UI settings
                ui_function: myShowUI,
				ui_container_id : "flashUI",
				degraded_container_id : "degradedUI",

				// Debug settings
				debug: true
			});

            // This is a setting that my Handlers will use. It's not part of SWFUpload
            // But I can add it to the SWFUpload object and then use it where I need to
            swf_upload_control.addSetting("progress_target", "fsUploadProgress")

        }

        function myShowUI() {
            document.getElementById("btnSubmit").onclick = doSubmit;
            this.showUI();  // Let SWFUpload finish loading the UI.

        }

        // Called by the submit button to start the upload
		function doSubmit() {
			try {
				swf_upload_control.startUpload();
			} catch (ex) {

            }
            return false;
	    }

		 // Called by the queue complete handler to submit the form
	    function uploadDone() {
			try {
				document.forms[0].submit();
			} catch (ex) {
				alert("Error submitting form");
			}
	    }
	</script>

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 6.2) Classic Form Demo</a></div>

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
								<!-- The UI only gets displayed if SWFUpload loads properly -->
								<div>
									<input type="text" id="txtFileName" disabled="true" style="border: solid 1px; background-color: #FFFFFF;" /><input id="btnBrowse" type="button" value="Browse..." onclick="fileBrowse.apply(swf_upload_control)" /> (10 MB max)
								</div>
								<div class="flash" id="fsUploadProgress">
									<!-- This is where the file progress gets shown.  SWFUpload doesn't update the UI directly.
										The Handlers (in handlers.js) process the upload events and make the UI updates -->
								</div>
								<input type="hidden" name="hidFileID" id="hidFileID" value="" /><!-- This is where the file ID is stored after SWFUpload uploads the file and gets the ID back from upload.php -->
							</div>
							<div id="degradedUI">
								<!-- This is the standard UI.  This UI is shown by default but when SWFUpload loads it will be
								hidden and the "flashUI" will be shown -->
								<input type="file" name="resume_degraded" id="resume_degraded" /> (10 MB max)<br/>
							</div>
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
				<input type="submit" value="Submit Application" id="btnSubmit" />
			</fieldset>
		</div>
	</form>
</body>
</html>