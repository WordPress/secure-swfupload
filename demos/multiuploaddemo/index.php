<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?php
	session_start();

	if (count($_FILES)) {
        // Handle degraded form uploads here.  Degraded form uploads are POSTed to index.php.  SWFUpload uploads
		// are POSTed to upload.php
	}

?>
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 7.0 beta 3 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfupload/swfupload.js"></script>
	<script type="text/javascript" src="js/handlers.js"></script>
	<script type="text/javascript">
		var upload1, upload2;

		window.onload = function() {
			upload1 = new SWFUpload({
				// Backend Settings
				upload_url: "../multiuploaddemo/upload.php",	// Relative to the SWF file (or you can use absolute paths)
				post_params: {"PHPSESSID" : "<?php echo session_id(); ?>"},

				// File Upload Settings
				file_size_limit : "102400",	// 100MB
				file_types : "*.*",
				file_types_description : "All Files",
				file_upload_limit : "10",
				file_queue_limit : "0",

				// Event Handler Settings (all my handlers are in the Handler.js file)
				file_dialog_start_handler : fileDialogStart,
				file_queued_handler : fileQueued,
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				upload_start_handler : uploadStart,
				upload_progress_handler : uploadProgress,
				upload_error_handler : uploadError,
				upload_complete_handler : uploadComplete,
				file_complete_handler : fileComplete,

				// Flash Settings
				flash_url : "../swfupload/swfupload.swf",	// Relative to this file (or you can use absolute paths)

				// UI Settings
				ui_container_id : "flashUI1",
				degraded_container_id : "degradedUI1",

				// Debug Settings
				debug: false
			});
			upload1.customSettings.progressTarget = "fsUploadProgress1";	// Add an additional setting that will later be used by the handler.
			upload1.customSettings.cancelButtonId = "btnCancel1";			// Add an additional setting that will later be used by the handler.

			upload2 = new SWFUpload({
				// Backend Settings
				upload_url: "../multiuploaddemo/upload.php",	// Relative to the SWF file (or you can use absolute paths)
				post_params: {"PHPSESSID" : "<?php echo session_id(); ?>"},

				// File Upload Settings
				file_size_limit : "200",	// 200 kb
				file_types : "*.jpg;*.gif;*.png",
				file_types_description : "Image Files",
				file_upload_limit : "10",
				file_queue_limit : "2",

				// Event Handler Settings (all my handlers are in the Handler.js file)
				file_dialog_start_handler : fileDialogStart,
				file_queued_handler : fileQueued,
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				upload_start_handler : uploadStart,
				upload_progress_handler : uploadProgress,
				upload_error_handler : uploadError,
				upload_complete_handler : uploadComplete,
				file_complete_handler : fileComplete,

				// Flash Settings
				flash_url : "../swfupload/swfupload.swf",	// Relative to this file (or you can use absolute paths)

				// UI Settings
				ui_container_id : "flashUI2",
				degraded_container_id : "degradedUI2",

				// Debug Settings
				debug: false
			});
			upload2.customSettings.progressTarget = "fsUploadProgress2";	// Add an additional setting that will later be used by the handler.
			upload2.customSettings.cancelButtonId = "btnCancel2";			// Add an additional setting that will later be used by the handler.

	     }
	</script>

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 7.0 beta 3) Multi-Upload Demo</a></div>
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
								<input type="button" value="Upload file (Max 100 MB)" onclick="upload1.selectFiles()" style="font-size: 8pt;" />
								<input id="btnCancel1" type="button" value="Cancel Uploads" onclick="cancelQueue(upload1);" disabled="disabled" style="font-size: 8pt;" /><br />
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
								<input type="button" value="Upload file (Max 200KB)" onclick="upload2.selectFiles()" style="font-size: 8pt;" />
								<input id="btnCancel2" type="button" value="Cancel Uploads" onclick="cancelQueue(upload2);" disabled="disabled" style="font-size: 8pt;" /><br />
							</div>
						</div>
						<div id="degradedUI2">
							<fieldset>
								<legend>Small File Upload Site</legend>
								<input type="file" name="anyfile2" /> (Any file, Max 200KB)<br/>
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