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
	<link href="css/featuresdemo.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfupload/swfuploadr5.js"></script>
	<script type="text/javascript" src="js/featuresdemo.js"></script>
	<script type="text/javascript" src="js/handlers.js"></script>
	<script type="text/javascript">
		var suo;
		var su_onload = window.onload;
		window.onload = function() {
			// Make sure the old window onload gets run
			if (typeof(su_onload) == "function") {
				su_onload();
			}

			// Check to see if SWFUpload is available
			if (typeof(SWFUpload) == "undefined") return;


			// Instantiate a SWFUpload Instance
			suo = new SWFUpload({
				// Backend Settings
				upload_target_url: "../featuresdemo/upload.php",	// Relative to the SWF file
				upload_cookies: ["PHPSESSID"],
				upload_params: { "Bob": "Dole"},

				// File Upload Settings
				file_size_limit : "102400",	// 100MB
				file_types : "*.*",
				file_types_description : "All Files",
				file_upload_limit : "10",
				begin_upload_on_queue : false,

				// Event Handler Settings
				file_queued_handler : fileQueued,
				file_progress_handler : fileProgress,
				file_cancelled_handler : fileCancelled,
				file_complete_handler : fileComplete,
				queue_complete_handler : queueComplete,
				queue_stopped_handler : queueStopped,
				dialog_cancelled_handler : fileDialogCancelled,
				error_handler : uploadError,

				// Flash Settings
				flash_url : "../swfupload/swfuploadr5.swf",	// Relative to this file

				// UI Settings
				ui_function : FeaturesDemo.ShowUI,
				ui_container_id : "divSWFUpload",
				degraded_container_id : "divDegraded",

				// Debug Settings
				debug: true
			});

	     }
	</script>

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 5) Features Demo</a></div>
	<form>
		<div class="content">
			<div id="divSWFUpload" style="display: none;">
				The Features Demo allows you to experiment with all the features and settings that SWFUpload R5 offers.<br />
				<br />
				Some settings are not allowed to be changed because it is either not technically possible or because it would break the demo. The
				unchangeable settings are: flash_url, upload_target_url, ui_function, ui_container_id, and degraded_container_id.  Changes to
				these text boxes will be ignored.
				<table class="layout">
					<tr>
						<td style="width: 316px;">
							<fieldset>
								<legend>Queue</legend>
								<div>
									<select id="selQueue" size="15" style="width: 270px;"></select>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnBrowse" class="action">Select Files...</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnStartQueueUpload" class="action">Start Queue</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnStartSelectedFile" class="action">Start Selected File</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnStopUpload" class="action">Stop Upload</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnCancelSelectedFile" class="action">Cancel Selected File</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnCancelQueue" class="action">Cancel Queue</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<label for="txtAddFileParamName">File Param</label>
									<div style="margin-left: 5px;">
										<input id="txtAddFileParamName" type="text" class="textbox" style="width: 100px;" />
										<input id="txtAddFileParamValue" type="text" class="textbox" style="width: 100px;" />
										<button id="btnAddFileParam"></button>
									</div>
									<div style="margin-left: 5px;">
										<input id="txtRemoveFileParamName" type="text" class="textbox" style="width: 100px;" />
										<button id="btnRemoveFileParam"></button>
									</div>
								</div>
							</fieldset>
						</td>
						<td style="width: 316px;">
							<fieldset>
								<legend>Dynamic Settings</legend>
								<label>upload_cookies</label>
								<div>
									<select id="selCookies" size="5"></select>
									<button id="btnRemoveCookie"></button>
								</div>
								<div>
									<input id="txtAddCookieName" type="text" class="textbox" />
									<button id="btnAddCookie"></button>
								</div>
								<label>upload_params</label>
								<div>
									<select id="selParams" size="5"></select>
									<button id="btnRemoveParam"></button>
								</div>
								<div>
									<input id="txtAddParamName" type="text" class="textbox" />
									<input id="txtAddParamValue" type="text" class="textbox" />
									<button id="btnAddParam"></button>
								</div>
								<div>
									<label for="txtUploadTarget">upload_target_url:</label>
									<input id="txtUploadTarget" type="text" class="textbox" />
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnUpdateDynamicSettings">Update Dynamic Settings</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
							</fieldset>
							<fieldset>
								<legend>Instance Information</legend>
								<div>
									<label for="txtFlashHTML">Flash HTML</label>
									<textarea id="txtFlashHTML" wrap="soft"></textarea>
								</div>
								<div>
									<label for="txtControlID">control_id</label>
									<input id="txtControlID" type="text" class="textbox" />
								</div>
							</fieldset>
						</td>
						<td style="width: 316px;">
							<fieldset id="fsStaticSettings">
								<legend>Static Settings</legend>
								<div>
									<label for="txtFileTypes">file_types</label>
									<input id="txtFileTypes" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtFileTypesDescription">file_types_description</label>
									<input id="txtFileTypesDescription" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtFileSizeLimit">file_size_limit</label>
									<input id="txtFileSizeLimit" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtFileUploadLimit">file_upload_limit</label>
									<input id="txtFileUploadLimit" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtFileQueueLimit">file_queue_limit</label>
									<input id="txtFileQueueLimit" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtFlashURL">flash_url</label>
									<input id="txtFlashURL" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtFlashContainerID">flash_container_id</label>
									<input id="txtFlashContainerID" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtFlashWidth">flash_width</label>
									<input id="txtFlashWidth" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtFlashHeight">flash_height</label>
									<input id="txtFlashHeight" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtFlashColor">flash_color</label>
									<input id="txtFlashColor" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtUIFunction">ui_function</label>
									<input id="txtUIFunction" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtUIContainerID">ui_container_id</label>
									<input id="txtUIContainerID" type="text" class="textbox" />
								</div>
								<div>
									<label for="txtDegradedContainerID">degraded_container_id</label>
									<input id="txtDegradedContainerID" type="text" class="textbox" />
								</div>
								<div class="checkbox">
									<input id="cbBeginUploadOnQueue" type="checkbox" />
									<label for="cbBeginUploadOnQueue">begin_upload_on_queue</label>
								</div>
								<div class="checkbox">
									<input id="cbDebug" type="checkbox" />
									<label for="cbDebug">debug</label>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnReloadSWFUpload">Reload SWFUpload</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
							</fieldset>
						</td>
					</tr>
					<tr>
						<td colspan="3">
							<fieldset>
								<legend>Events</legend>
								<table>
									<tr>
										<td>
											<div>
												<label for="selEventsQueue">Queue</label>
												<select id="selEventsQueue" size="10"></select>
											</div>
										</td>
										<td>
											<div>
												<label for="selEventsFile">File</label>
												<select id="selEventsFile" size="10"></select>
											</div>
										</td>
										<td>
											<div>
												<label for="selEventsError">Errors</label>
												<select id="selEventsError" size="10"></select>
											</div>
										</td>
									</tr>

								</table>
							</fieldset>
							<fieldset>
								<legend>Debug</legend>
								<div>
									<textarea id="SWFUpload_Console" wrap="off"></textarea>
								</div>
							</fieldset>
						</td>
					</tr>
				</table>
			</div>
			<div id="divDegraded" class="content">
				This demo requires JavaScript and Flash Player 8 or higher.  If your browser meets these requirements and SWFUpload has not loaded please report a bug.
			</div>
		</div>
	</form>
</body>
</html>