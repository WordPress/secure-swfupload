<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
<title>SWFUpload Demos - Classic Form Demo</title>
<link href="../css/default.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="../swfupload/swfupload.js"></script>
<script type="text/javascript" src="js/swfupload.graceful_degradation.js"></script>
<script type="text/javascript" src="js/fileprogress.js"></script>
<script type="text/javascript" src="js/handlers.js"></script>
<script type="text/javascript">
		var swfu;

		window.onload = function () {
			swfu = new SWFUpload({
				// Backend settings
				upload_url: "../formsdemo/upload.php",	// Relative to the SWF file, you can use an absolute URL as well.
				file_post_name: "resume_file",

				// Flash file settings
				file_size_limit : "10240",	// 10 MB
				file_types : "*.*",	// or you could use something like: "*.doc;*.wpd;*.pdf",
				file_types_description : "All Files",
				file_upload_limit : "0", // Even though I only want one file I want the user to be able to try again if an upload fails
				file_queue_limit : "1", // this isn't needed because the upload_limit will automatically place a queue limit

				// Event handler settings
				swfupload_loaded_handler : swfUploadLoaded,
				
				//file_dialog_start_handler : fileDialogStart,		// I don't need to override this handler
				file_queued_handler : fileQueued,
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				
				//upload_start_handler : uploadStart,	// I could do some client/JavaScript validation here, but I don't need to.
				upload_progress_handler : uploadProgress,
				upload_error_handler : uploadError,
				upload_success_handler : uploadSuccess,
				upload_complete_handler : uploadComplete,

				// Flash Settings
				flash_url : "../swfupload/swfupload_f9.swf",	// Relative to this file

				// UI settings
				swfupload_element_id : "flashUI",		// setting for the graceful degradation plugin
				degraded_element_id : "degradedUI",

				custom_settings : {
					progress_target : "fsUploadProgress",
					upload_successful : false
				},
				
				// Debug settings
				debug: false
			});

		};
	</script>
</head>
<body>
<div id="header">
	<h1 id="logo"><a href="../">SWFUpload</a></h1>
	<div id="version">v2.1.0</div>
</div>

<div id="content">

	<h2>Classic Form Demo</h2>
	<form id="form1" action="thanks.php" enctype="multipart/form-data" method="post">
		<p>This demo shows how SWFUpload might be combined with an HTML form.  It also demonstrates graceful degradation (using the graceful degradation plugin).
			This demo also demonstrates the use of the server_data parameter.  This demo requires Flash Player 9+</p>
		<fieldset >
		<legend>Submit your Application</legend>
		<table style="vertical-align:top;">
			<tr>
				<td><label for="lastname">Last Name:</label>				</td>
				<td><input name="lastname" id="lastname" type="text" style="width: 200px" />				</td>
			</tr>
			<tr>
				<td><label for="firstname">First Name:</label>				</td>
				<td><input name="firstname" id="firstname" type="text" style="width: 200px" />				</td>
			</tr>
			<tr>
				<td><label for="education">Education:</label>				</td>
				<td><textarea name="education"  id="education" cols="0" rows="0" style="width: 400px; height: 100px;"></textarea>				</td>
			</tr>
			<tr>
				<td><label for="txtFileName">Resume:</label>				</td>
				<td><div id="flashUI" style="display: none;">
						<!-- The UI only gets displayed if SWFUpload loads properly -->
						<div>
							<input type="text" id="txtFileName" disabled="true" style="border: solid 1px; background-color: #FFFFFF;" />
							<input id="btnBrowse" type="button" value="Browse..." onclick="fileBrowse.apply(swfu)" />
							(10 MB max) </div>
						<div class="flash" id="fsUploadProgress">
							<!-- This is where the file progress gets shown.  SWFUpload doesn't update the UI directly.
										The Handlers (in handlers.js) process the upload events and make the UI updates -->
						</div>
						<input type="hidden" name="hidFileID" id="hidFileID" value="" />
						<!-- This is where the file ID is stored after SWFUpload uploads the file and gets the ID back from upload.php -->
					</div>
					<div id="degradedUI">
						<!-- This is the standard UI.  This UI is shown by default but when SWFUpload loads it will be
								hidden and the "flashUI" will be shown -->
						<input type="file" name="resume_degraded" id="resume_degraded" />
						(10 MB max)<br/>
					</div></td>
			</tr>
			<tr>
				<td><label for="references">References:</label>				</td>
				<td><textarea name="references" id="references" cols="0" rows="0" style="width: 400px; height: 100px;"></textarea>				</td>
			</tr>
		</table>
		<br />
		<input type="submit" value="Submit Application" id="btnSubmit" />
		</fieldset>
	</form>
</div>
</body>
</html>
