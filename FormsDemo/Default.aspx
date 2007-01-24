<%@ Page Language="C#" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 3 Demo</title>

	<link href="../Default.aspx.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../mmSWFUploadR3.js"></script>
	<script type="text/javascript" src="Default.aspx.Handlers.js"></script>
	<script type="text/javascript">
		var upload;
		var da_onload = window.onload;
		window.onload = function() {
			if (typeof(da_onload) == "function") {
				da_onload();
			}
				upload = new mmSWFUpload({
					upload_backend: "upload.aspx",
					flash_path : "../upload.swf",
					allowed_filesize : "30720",	// 30 MB
					allowed_filetypes : "*.*",

					upload_ready_callback : 'upload.flashReady',
					upload_start_callback : 'uploadStart',
					upload_progress_callback : 'uploadProgress',
					upload_complete_callback : 'uploadComplete',
					upload_error_callback : 'uploadError',
					upload_cancel_callback : 'uploadCancel',
					upload_queue_complete_callback : 'uploadDone',
					begin_uploads_immediately : false,
					
					flash_target : "flashContainer",
					ui_target : "flashUI",
					degraded_target : "degradedUI"
				});
	
	     }
	     
	     function doSubmit() {
			upload.startUpload();
	     }
	     function uploadDone() {
			document.forms[0].submit();
	     }
	</script>

</head>
<body>
	<div class="title">SWFUpload (Revision 3) Classic Form Demo</div>
	
	<form id="form1" action="Thanks.aspx" enctype="multipart/form-data" >
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
								<div>
									<input type="text" /><input type="button" value="Browse..." onclick="upload.callSWF()" />
								</div>
								<div class="flash" id="fsUploadProgress">
								</div>
							</div>
							<div id="degradedUI">
								<input type="file" name="resume" /><br/>
							</div>
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
				<input type="button" value="Submit Application" onclick="doSubmit()" />
			</fieldset>

		</div>
	</form>

	<div id="flashContainer"></div>

</body>
</html>