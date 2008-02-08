<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload v2.1.0 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<link type="text/css" rel="stylesheet" href="link/swfupload.v102.theme.css" />

	<script type="text/javascript" src="../swfupload/swfupload.js"></script>
	<script type="text/javascript" src="link/swfupload.v102.js"></script>
	<script type="text/javascript" src="link/swfupload.v102.callbacks.js"></script>
	
	<script type="text/javascript">
	
		var swfu;
	
		window.onload = function() {
		
			// Max settings
			swfu = new SWFUpload({
				upload_script : "../v102demo/upload.php",
				target : "SWFUploadTarget",
				flash_path : "../swfupload/swfupload_f8.swf",
				allowed_filesize : 30720,	// 30 MB
				allowed_filetypes : "*.*",
				allowed_filetypes_description : "All files...",
				browse_link_innerhtml : "Browse",
				upload_link_innerhtml : "Upload queue",
				browse_link_class : "swfuploadbtn browsebtn",
				upload_link_class : "swfuploadbtn uploadbtn",
				upload_file_queued_callback : fileQueued,
				upload_file_start_callback : uploadFileStart,
				upload_progress_callback : uploadProgress,
				upload_file_complete_callback : uploadFileComplete,
				upload_file_cancel_callback : uploadFileCancelled,
				upload_queue_complete_callback : uploadQueueComplete,
				upload_file_error_callback : uploadError,
				upload_file_cancel_callback : uploadFileCancelled,
				auto_upload : false,
				debug : false
			});
			
		}
		
	</script>

	
</head>
	<body>
		<div class="title"><a class="likeParent" href="../index.php">SWFUpload v2.1.0 - v1.0.2 Plugin Demo</a></div>
		<div class="content">
			<div>This demo shows how to use the SWFUpload v1.0.2 Plugin.  This demo is a recreation of the swfupload.mammon.se demo (now defunct) with only small modifications to the CSS file.</div>
			
			<h3>Demo</h3>
			<p>Replace contents of a div with links for uploading and browsing, degrades gracefully if flash/javascript isn't accessible</p>
			<div id="SWFUploadTarget">
				<form action="upload.php" method="post" enctype="multipart/form-data">
					<input type="file" name="Filedata" id="Filedata" />
					<input type="submit" value="upload test" />
				</form>
			</div>
			<h4 id="queueinfo">Queue is empty</h4>
			<div id="SWFUploadFileListingFiles"></div>
			<br class="clr" />
			<a class="swfuploadbtn" id="cancelqueuebtn" href="javascript:cancelQueue();">Cancel queue</a>
		</div>
	</body>
</html>