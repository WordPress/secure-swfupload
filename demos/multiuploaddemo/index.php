<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?php
	session_start();
	$upload_path = str_replace("\\", "/", realpath(dirname($_SERVER['SCRIPT_FILENAME']))) . "/uploads/";
	if (count($_FILES)) {
		// Check for form uploads (in case the user uploaded using the degraded form)
		if (!@move_uploaded_file($_FILES["anyfile1"]["tmp_name"], $upload_path . $_FILES["anyfile1"]["name"])) {
		}
		
		if (!@move_uploaded_file($_FILES["anyfile2"]["tmp_name"], $upload_path . $_FILES["anyfile2"]["name"])) {
		}
	}
	
?>
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 5 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfupload/swfuploadr52.js"></script>
	<script type="text/javascript" src="js/handlers.js"></script>
	<script type="text/javascript">
		var upload1;
		var upload2;
		var da_onload = window.onload;
		window.onload = function() {
			if (typeof(da_onload) == "function") {
				da_onload();
			}
			if (typeof(SWFUpload) == "undefined") return;

			upload1 = new SWFUpload({
				// Backend Settings
				upload_target_url: "../multiuploaddemo/upload.php",	// Relative to the SWF file
				upload_cookies: ["PHPSESSID"],
				upload_params: { test_param: "this is it & this is it \" ' http://www.yahoo.com\\" },

				// File Upload Settings
				file_size_limit : "102400",	// 100MB
				file_types : "*.*",
				file_types_description : "All Files",
				file_upload_limit : "10",
				file_queue_limit : 2,
				begin_upload_on_queue : true,

				// Event Handler Settings
				file_queued_handler : uploadStart,
				file_progress_handler : uploadProgress,
				file_cancelled_handler : uploadCancel,
				file_complete_handler : uploadComplete,
				queue_complete_handler : uploadQueueComplete,
				error_handler : uploadError,

				// Flash Settings
				flash_url : "../swfupload/swfuploadr52.swf",	// Relative to this file

				// UI Settings
				ui_container_id : "flashUI1",
				degraded_container_id : "degradedUI1",

				// Debug Settings
				debug: false
			});
			upload1.AddSetting("progress_target", "fsUploadProgress1");	// Add an additional setting that will later be used by the handler.

			upload2 = new SWFUpload({
				// Backend Settings
				upload_target_url: "../multiuploaddemo/upload.php",	// Relative to the SWF file
				upload_cookies: ["PHPSESSID"],
				upload_params: { test_param: "none&bob=john", test_param2: "this is test param 2" },

				// File Upload Settings
				file_size_limit : "100",	// 100 kb
				file_types : "*.jpg;*.gif;*.png",
				file_types_description : "Image Files",
				file_upload_limit : "10",
				begin_upload_on_queue : true,

				// Event Handler Settings
				file_queued_handler : uploadStart,
				file_progress_handler : uploadProgress,
				file_cancelled_handler : uploadCancel,
				file_complete_handler : uploadComplete,
				queue_complete_handler : uploadQueueComplete,
				error_handler : uploadError,

				// Flash Settings
				flash_url : "../swfupload/swfuploadr52.swf",	// Relative to this file

				// UI Settings
				ui_container_id : "flashUI2",
				degraded_container_id : "degradedUI2",

				// Debug Settings
				debug: false
			});
			upload2.AddSetting("progress_target", "fsUploadProgress2");	// Add an additional setting that will later be used by the handler.

	     }
	</script>

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 5) Multi-Upload Demo</a></div>
	<form id="form1" action="index.php" method="post" enctype="multipart/form-data">
		<div class="content">
			<table>
				<tr valign="top">
					<td>
						<div id="flashUI1" style="display: none;">
							<fieldset class="flash" id="fsUploadProgress1">
								<legend>Large File Upload Site</legend>
							</fieldset>
							<div>
								<input type="button" value="Upload file (Max 100 MB)" onclick="upload1.Browse()" style="font-size: 8pt;" />
								<input id="btnCancel1" type="button" value="Cancel Uploads" onclick="upload1.CancelQueue();" disabled="disabled" style="font-size: 8pt;" /><br />
							</div>
						</div>
						<div id="degradedUI1">
							<fieldset>
								<legend>Large File Upload Site</legend>
								<input type="file" name="anyfile1" /> (Any file, Max 100 MB)<br/>
							</fieldset>
							<div>
								<input type="submit" value="Submit Files" />
							</div>
						</div>
					</td>
					<td>
						<div id="flashUI2" style="display: none;">
							<fieldset class="flash" id="fsUploadProgress2">
								<legend>Small File Upload Site</legend>
							</fieldset>
							<div>
								<input type="button" value="Upload file (Max 100KB)" onclick="upload2.Browse()" style="font-size: 8pt;" />
								<input id="btnCancel2" type="button" value="Cancel Uploads" onclick="upload2.CancelQueue();" disabled="disabled" style="font-size: 8pt;" /><br />
							</div>
						</div>
						<div id="degradedUI2">
							<fieldset>
								<legend>Small File Upload Site</legend>
								<input type="file" name="anyfile2" /> (Any file, Max 100KB)<br/>
							</fieldset>
							<div>
								<input type="submit" value="Submit Files" />
							</div>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</form>
</body>
</html>