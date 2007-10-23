<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?php
	session_start();
	$_SESSION["file_info"] = array();
?>
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 7.0 beta 2 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfupload/swfupload.js"></script>
	<script type="text/javascript" src="js/handlers.js"></script>
	<script type="text/javascript">
		var swfu;
		window.onload = function () {
			swfu = new SWFUpload({
				// Backend Settings
				upload_url: "../applicationdemo/upload.php",	// Relative to the SWF file
				post_params: {"PHPSESSID": "<?php echo session_id(); ?>"},

				// File Upload Settings
				file_size_limit : "2048",	// 2MB
				file_types : "*.jpg",
				file_types_description : "JPG Images",
				file_upload_limit : "0",

				// Event Handler Settings - these functions as defined in Handlers.js
				//  The handlers are not part of SWFUpload but are part of my website and control how
				//  my website reacts to the SWFUpload events.
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				upload_progress_handler : uploadProgress,
				upload_error_handler : uploadError,
				upload_complete_handler : uploadComplete,
				file_complete_handler : fileComplete,

				// Flash Settings
				flash_url : "../swfupload/swfupload.swf",	// Relative to this file

				// UI Settings
				ui_container_id : "swfu_container",
				degraded_container_id : "degraded_container",

				// Debug Settings
				debug: false
			});
			swfu.customSettings.upload_target = "divFileProgressContainer";
		}
	</script>

</head>
<body>
	<div id="title" class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 7.0 beta 2) Application Demo</a></div>
	<div id="swfu_container" style="display: none; margin: 0px 10px;">
		<div>
			<form>
				<button id="btnBrowse" type="button" style="padding: 5px;" onclick="swfu.selectFiles(); this.blur();"><img src="images/page_white_add.png" style="padding-right: 3px; vertical-align: bottom;">Select Images <span style="font-size: 7pt;">(2 MB Max)</span></button>
			</form>
		</div>
		<div id="divFileProgressContainer" style="height: 75px;"></div>
		<div id="thumbnails"></div>
	</div>
	<div id="degraded_container">
		SWFUpload has not loaded.  It may take a few moments.  SWFUpload requires JavaScript and Flash Player 8 or later.
	</div>
</body>
</html>