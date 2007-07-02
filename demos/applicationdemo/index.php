<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?php
	session_start();
	$_SESSION["file_info"] = array();
?>
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 6 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfuploadr6_0011/swfupload.js"></script>
	<script type="text/javascript" src="js/handlers.js"></script>
	<script type="text/javascript">
		var swfu;
		window.onload = function () {
			swfu = new SWFUpload({
				// Backend Settings
				upload_target_url: "../applicationdemo/upload.php",	// Relative to the SWF file
				post_params: {"PHPSESSID": "<?php echo session_id(); ?>"},

				// File Upload Settings
				file_size_limit : "2048",	// 2MB
				file_types : "*.jpg",
				file_types_description : "JPG Images",
				file_upload_limit : "0",
				begin_upload_on_queue : true,
				validate_files : false,

				// Event Handler Settings
				file_queued_handler : fileQueued,
				file_progress_handler : fileProgress,
				file_cancelled_handler : fileCancelled,
				file_complete_handler : fileComplete,
				queue_complete_handler : queueComplete,
				//queue_stopped_handler : queueStopped,
				//dialog_cancelled_handler : fileDialogCancelled,
				error_handler : uploadError,

				// Flash Settings
				flash_url : "../swfuploadr6_0011/swfupload.swf",	// Relative to this file
				flash_container_id : "theflashgohere",

				// UI Settings
				ui_container_id : "swfu_container",
				degraded_container_id : "degraded_container",

				// Debug Settings
				debug: false
			});
			swfu.addSetting("upload_target", "divFileProgressContainer");
		}
	</script>

</head>
<body>
	<div id="title" class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 5) Application Demo</a></div>
	<div id="swfu_container" style="display: none; margin: 0px 10px;">
		<div>
			<form>
				<button id="btnBrowse" type="button" style="padding: 5px;" onclick="swfu.browse(); this.blur();"><img src="images/page_white_add.png" style="padding-right: 3px; vertical-align: bottom;">Select Images <span style="font-size: 7pt;">(2 MB Max)</span></button>
			</form>
		</div>
		<div id="divFileProgressContainer" style="height: 75px;"></div>
		<div id="thumbnails">
			<?php
			if (isset($_SESSION["file_info"])) {
				foreach ($_SESSION["file_info"] as $image_id => $value) {
					echo '<img src="thumbnail.php?id='.$image_id.'" style="margin: 4px;" />';
				}
			} ?>
		</div>
	</div>
	<div id="degraded_container">
		SWFUpload has not loaded.  It may take a few moments.  SWFUpload requires JavaScript and Flash Player 8 or later.
	</div>
	<div id="theflashgohere"></div>
</body>
</html>