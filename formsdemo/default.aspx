<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 4 Demo</title>

	<link href="default.aspx.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfuploadr4.js"></script>
	<script type="text/javascript" src="default.aspx.handlers.js"></script>
	<script type="text/javascript">
		var swf_upload_control;
		var da_onload = window.onload;
		window.onload = function() {
			if (typeof(da_onload) == "function") {
				da_onload();
			}
				if (typeof(SWFUpload) == "undefined") return;
				
				swf_upload_control = new SWFUpload({
					// Backend settings
					upload_backend: "upload.aspx",	// Relative to the SWF file
					upload_backend_cookies: ["asp.net_sessionid", "asp_auth_ticket"],	// example of passing more than one cookie by using an array.

					// Flash file settings
					allowed_filesize : "300",	// 300 KB
					allowed_filetypes : "*.doc;*.wpd;*.pdf",
					upload_limit : "1",
					begin_uploads_immediately : false,

					// Event handler settings
					upload_ready_callback : 'swf_upload_control.flashReady',	// Note: you need to pass in [variable name].flashReady here
					upload_start_callback : 'uploadStart',			// The following are all global functions defined in "default.aspx.handlers.js"
					upload_progress_callback : 'uploadProgress',
					upload_complete_callback : 'uploadComplete',
					upload_error_callback : 'uploadError',
					upload_cancel_callback : 'uploadCancel',
					upload_queue_complete_callback : 'uploadDone',
					
					// Flash Settings
					flash_target : "flashContainer",
					flash_path : "../swfupload.swf",	// Relative to this file

					// UI settings
					ui_target : "flashUI",
					degraded_target : "degradedUI",
					
					// Debug settings
					debug: false
				});
	
	     }
	     
	     function doSubmit() {
			try {
				swf_upload_control.startUpload();
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
	<div class="title"><a class="likeParent" href="../default.aspx">SWFUpload (Revision 4) Classic Form Demo</a></div>
	
	<form id="form1" action="thanks.aspx" enctype="multipart/form-data" method="post">
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
							<textarea cols="0" rows="0" style="width: 400px; height: 100px;"></textarea>
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
									<input type="text" /><input type="button" value="Browse..." onclick="swf_upload_control.callSWF()" /> (300 KB max)
								</div>
								<div class="flash" id="fsUploadProgress">
									<!-- This is where the file progress gets shown.  SWFUpload doesn't handle this automatically.
										Its my Handlers (in default.aspx.handlers.js) that process the upload events and handle the UI updates -->
								</div>
							</div>
							<div id="degradedUI">
								<!-- This is the standard UI.  This UI is shown by default but when SWFUpload loads it will be
								hidden and the "flashUI" will be shown -->
								<input type="file" name="resume" /> (300 KB max)<br/>
							</div>
							<div id="flashContainer"><!-- This is where the flash embed/object tag will go once SWFUpload has loaded --></div>
						</td>
					</tr>
					<tr>
						<td>
							References:
						</td>
						<td>
							<textarea cols="0" rows="0" style="width: 400px; height: 100px;"></textarea>
						</td>
					</tr>
				</table>
				<br />
				<input type="submit" value="Submit Application" onclick="doSubmit(); return false;" />
				<input type="button" value="Stop Upload" onclick="swf_upload_control.stopUpload();" />
				<input type="button" value="Cancel All" onclick="swf_upload_control.cancelQueue();" />
			</fieldset>
		</div>
	</form>
</body>
</html>