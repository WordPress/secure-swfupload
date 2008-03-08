<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload v2.1.0 Beta SWFObject Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfupload/swfupload.js"></script>
	<script type="text/javascript" src="js/swfupload.swfobject.js"></script>
	<script type="text/javascript" src="js/swfupload.queue.js"></script>
	<script type="text/javascript" src="js/fileprogress.js"></script>
	<script type="text/javascript" src="js/handlers.js"></script>
	<script type="text/javascript">
		var swfu;
		
		SWFUpload.onload = function () {
			var settings = {
				flash_url : "../swfupload/swfupload_f9.swf",
				upload_url: "../simpledemo/upload.php",	// Relative to the SWF file
				post_params: {
					"PHPSESSID" : "NONE",
					"HELLO-WORLD" : "DUDE",
					".what" : "OKAY"
				},
				file_size_limit : "100 MB",
				file_types : "*.*",
				file_types_description : "All Files",
				file_upload_limit : 100,
				file_queue_limit : 0,
				custom_settings : {
					progressTarget : "fsUploadProgress",
					cancelButtonId : "btnCancel"
				},
				debug: false,

				// The event handler functions are defined in handlers.js
				swfupload_loaded_handler : swfUploadLoaded,
				file_queued_handler : fileQueued,
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				upload_start_handler : uploadStart,
				upload_progress_handler : uploadProgress,
				upload_error_handler : uploadError,
				upload_success_handler : uploadSuccess,
				upload_complete_handler : uploadComplete,
				queue_complete_handler : queueComplete,	// Queue plugin event
				
				// SWFObject settings
				minimum_flash_version: "9.0.28",
				swfupload_pre_load_handler : swfUploadPreLoad,
				swfupload_load_failed_handler: swfUploadLoadFailed,
			};

			swfu = new SWFUpload(settings);
		}
		
		</script>

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload v2.1.0 Beta SWFObject Demo</a></div>
	<form id="form1" action="index.php" method="post" enctype="multipart/form-data">
		<div>
			This page demonstrates the SWFObject plugin.  In order to see how the plugin works you need to uninstall your Flash Player (or have a version less that 9.0.28) or disable JavaScript.  The page
			flicker found in the Graceful Degradation plugin is no longer visible.
		</div>
		<div id="divSWFUploadUI" class="content" style="display: none;">
			<fieldset class="flash" id="fsUploadProgress">
				<legend>Upload Queue</legend>
			</fieldset>
			<div id="divStatus">0 Files Uploaded</div>
			<div>
				<input id="btnBrowse" type="button" value="Upload file (Max 100 MB)" style="font-size: 8pt;" />
				<input id="btnCancel" type="button" value="Cancel All Uploads" disabled="disabled" style="font-size: 8pt;" /><br />
			</div>
		</div>
		<div id="divAlternateContent" class="content" style="background-color: #FFFF66; border-top: solid 4px #FF9966; border-bottom: solid 4px #FF9966; margin: 10px 25px; padding: 10px 15px;">
			We're sorry.  SWFUpload could not load. <noscript>You must have JavaScript enabled to enjoy SWFUpload.</noscript> <span id="spanNeedsFlash" style="display: none;">You need to install or upgrade your Flash Player.
			visit the <a href="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash">Adobe website</a> to get the Flash Player.</span>
		</div>
	</form>
</body>
</html>