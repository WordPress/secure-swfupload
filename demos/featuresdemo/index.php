<?php
	session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload Revision 6 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<link href="css/featuresdemo.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfuploadr6_0013/swfupload.js"></script>
	<script type="text/javascript" src="js_13/featuresdemo.js"></script>
	<script type="text/javascript" src="js_13/handlers.js"></script>
	<script type="text/javascript">
		var suo;
		window.onload = function() {
			// Check to see if SWFUpload is available
			if (typeof(SWFUpload) === "undefined") return;

			// Instantiate a SWFUpload Instance
			suo = new SWFUpload({
				// Backend Settings
				upload_target_url: "../featuresdemo/upload.php?id=bob",	// Relative to the SWF file
				post_params: { "post_name1": "post_value1", "post_name2": "post_value2" },
				file_post_name: "Filedata",

				// File Upload Settings
				file_size_limit : "102400",	// 100MB
				file_types : "*.*",
				file_types_description : "All Files",
				file_upload_limit : "10",
				begin_upload_on_queue : false,
				validate_files : true,
				use_server_data_event : true,

				// Event Handler Settings
				file_queued_handler : fileQueued,
				file_validation_handler : fileValidation,
				file_progress_handler : fileProgress,
				file_cancelled_handler : fileCancelled,
				file_complete_handler : fileComplete,
				queue_complete_handler : queueComplete,
				queue_stopped_handler : queueStopped,
				dialog_cancelled_handler : fileDialogCancelled,
				error_handler : uploadError,

				// Flash Settings
				flash_url : "../swfuploadr6_0013/swfupload.swf",	// Relative to this file

				// UI Settings
				ui_function : FeaturesDemo.showUI,
				ui_container_id : "divSWFUpload",
				degraded_container_id : "divDegraded",

				// Debug Settings
				debug: true
			});

	     }
	</script>

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload (Revision 6) Features Demo</a></div>
	<form>
		<div class="content">
			<div id="divSWFUpload" style="display: none;">
				The Features Demo allows you to experiment with all the features and settings that SWFUpload R5 offers.<br />
				<br />
				Some settings are not allowed to be changed because it is either not technically possible or because it would break the demo. The
				unchangeable settings are: flash_url, upload_target_url, ui_function, ui_container_id, and degraded_container_id.  Changes to
				these text boxes will be ignored.<br />
				<br />
				Your PHP Session ID: <?php echo session_id(); ?>
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
										<button id="btnBrowse" type="button" class="action">Select Files...</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnStartQueueUpload" type="button" class="action">Start Queue</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnStartSelectedFile" type="button" class="action">Start Selected File</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnStopUpload" type="button" class="action">Stop Upload</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnCancelSelectedFile" type="button" class="action">Cancel Selected File</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnCancelQueue" type="button" class="action">Cancel Queue</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
								<div>
									<label for="txtAddFileParamName">File Post Param</label>
									<div style="margin-left: 5px;">
										<input id="txtAddFileParamName" type="text" class="textbox" style="width: 100px;" />
										<input id="txtAddFileParamValue" type="text" class="textbox" style="width: 100px;" />
										<button id="btnAddFileParam" type="button"></button>
									</div>
									<div style="margin-left: 5px;">
										<input id="txtRemoveFileParamName" type="text" class="textbox" style="width: 100px;" />
										<button id="btnRemoveFileParam" type="button"></button>
									</div>
								</div>
							</fieldset>
						</td>
						<td style="width: 316px;">
							<fieldset>
								<legend>Dynamic Settings</legend>
								<label>post_params</label>
								<div>
									<select id="selParams" size="5"></select>
									<button id="btnRemoveParam" type="button"></button>
								</div>
								<div>
									<input id="txtAddParamName" type="text" class="textbox" />
									<input id="txtAddParamValue" type="text" class="textbox" />
									<button id="btnAddParam" type="button"></button>
								</div>
								<div id="divDynamicSettingForm">
									<div>
										<label for="txtUploadTarget">upload_target_url:</label>
										<input id="txtUploadTarget" type="text" class="textbox" />
									</div>
									<div>
										<label for="txtFilePostName">file_post_name</label>
										<input id="txtFilePostName" type="text" class="textbox" />
									</div>
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
									<div class="checkbox">
										<input id="cbBeginUploadOnQueue" type="checkbox" />
										<label for="cbBeginUploadOnQueue">begin_upload_on_queue</label>
									</div>
									<div class="checkbox">
										<input id="cbUseServerDataEvent" type="checkbox" />
										<label for="cbUseServerDataEvent">use_server_data_event</label>
									</div>
									<div class="checkbox">
										<input id="cbFileValidation" type="checkbox" />
										<label for="cbFileValidation">file_validation</label>
									</div>
									<div class="checkbox">
										<input id="cbDebug" type="checkbox" />
										<label for="cbDebug">debug</label>
									</div>
								</div>
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnUpdateDynamicSettings" type="button">Update Dynamic Settings</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
							</fieldset>
						</td>
						<td style="width: 316px;">
							<fieldset id="fsStaticSettings">
								<legend>Static Settings</legend>
								<div>
									<label for="txtFlashURL">flash_url</label>
									<input id="txtFlashURL" type="text" class="textbox" />
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
								<div>
									<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
										<button id="btnReloadSWFUpload" type="button">Reload SWFUpload</button>
									</td><td class="btn-right"></td></tr></table>
								</div>
							</fieldset>
							<fieldset>
								<legend>Instance Information</legend>
								<div>
									<label for="txtFlashHTML">Flash HTML</label>
									<textarea id="txtFlashHTML" wrap="soft" style="height: 150px;"></textarea>
								</div>
								<div>
									<label for="txtControlID">control_id</label>
									<input id="txtControlID" type="text" class="textbox" />
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
							<fieldset>
								<legend>Server Data</legend>
								<div id="divServerData"></div>
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