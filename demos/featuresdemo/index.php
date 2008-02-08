<?php
	session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>SWFUpload v2.1.0 Demo</title>

	<link href="../css/default.css" rel="stylesheet" type="text/css" />
	<link href="css/featuresdemo.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../swfupload/swfupload.js"></script>
	<script type="text/javascript" src="js/featuresdemo.js"></script>
	<script type="text/javascript" src="js/handlers.js"></script>
	<script type="text/javascript">
		var suo;
		window.onload = function() {
			// Check to see if SWFUpload is available
			if (typeof(SWFUpload) === "undefined") return;

			// Instantiate a SWFUpload Instance
			suo = new SWFUpload({
				// Backend Settings
				upload_url: "../featuresdemo/upload.php?get_name=get_value",	// I can pass query strings here if I want
				post_params: { "post_name1": "post_value1", "post_name2": "post_value2" }, 	// Here are some POST values to send. These can be changed dynamically
				file_post_name: "Filedata",	// This is the "name" of the file item that the server-side script will receive. Setting this doesn't work in the Linux Flash Player

				// File Upload Settings
				file_size_limit : "102400",	// 100MB
				file_types : "*.*",
				file_types_description : "All Files",
				file_upload_limit : "10",

				// Event Handler Settings
				swfupload_loaded_handler : FeaturesDemoHandlers.swfUploadLoaded,
				file_dialog_start_handler : FeaturesDemoHandlers.fileDialogStart,
				file_queued_handler : FeaturesDemoHandlers.fileQueued,
				file_queue_error_handler : FeaturesDemoHandlers.fileQueueError,
				file_dialog_complete_handler : FeaturesDemoHandlers.fileDialogComplete,
				upload_start_handler : FeaturesDemoHandlers.uploadStart,
				upload_progress_handler : FeaturesDemoHandlers.uploadProgress,
				upload_error_handler : FeaturesDemoHandlers.uploadError,
				upload_success_handler : FeaturesDemoHandlers.uploadSuccess,
				
				upload_complete_handler : FeaturesDemoHandlers.uploadComplete,
				debug_handler : FeaturesDemoHandlers.debug,
				
				// Flash Settings
				flash_url : "../swfupload/swfupload_f9.swf",	// Relative to this file

				// Debug Settings
				debug: true		// For the purposes of this demo I wan't debug info shown
			});

	     };
	</script>

</head>
<body>
	<div class="title"><a class="likeParent" href="../index.php">SWFUpload v2.1.0 Features Demo</a></div>
	<form>
		<div class="content">
			The Features Demo allows you to experiment with all the features and settings that SWFUpload v2.0 offers.<br />
			<br />
			You can change all the settings except &apos;upload_url&apos;.<br />
			<br />
			You can change between the SWFUpload v2.0 for Flash Player 8 and SWFUpload v2.0 for Flash Player 9 by changing the flash_url setting (replace the 9 with an 8).<br />
			<br />
			<strong>Your PHP Session ID is <?php echo session_id(); ?>.</strong>  This is provided so you can see the Flash Player Cookie
			bug in action.  Compare this Session ID to the Session ID and Cookies displayed in the Server Data section
			after an upload is complete.<br />
			<br />
			SWFUpload has <span id="spanLoadStatus" style="font-weight: bold;">not loaded</span><br />
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
									<button id="btnBrowseSingle" type="button" class="action">Select Single File...</button>
								</td><td class="btn-right"></td></tr></table>
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
						</fieldset>
					</td>
					<td style="width: 316px;">
						<fieldset>
							<legend>Post Params</legend>
							<div>
								<label for="txtAddFileParamName"><strong>File Post Param</strong> (Select a file first)</label>
								<div style="margin-left: 10px; margin-bottom: 10px;">
									<table>
										<tr>
											<td></td>
											<td><strong>Name</strong></td>
											<td><strong>Value</strong></td>
											<td></td>
										</tr>
										<tr>
											<td style="vertical-align: middle; text-align: right;">Add:</td>
											<td>
												<input id="txtAddFileParamName" type="text" class="textbox" style="width: 100px;" />
											</td>
											<td>
												<input id="txtAddFileParamValue" type="text" class="textbox" style="width: 100px;" />
											</td>
											<td>
												<button id="btnAddFileParam" type="button"></button>
											</td>
										</tr>
										<tr>
											<td style="vertical-align: middle;">Remove:</td>
											<td><input id="txtRemoveFileParamName" type="text" class="textbox" style="width: 100px;" /></td>
											<td><button id="btnRemoveFileParam" type="button"></button></td>
											<td></td>
										</tr>
									</table>
								</div>
							</div>
							
							<label for="txtAddParamName" style="font-weight: bolder;">Global Post Params</label>
							<div style="margin-left: 15px;">
								<div>
									<select id="selParams" size="5"></select>
									<button id="btnRemoveParam" type="button"></button>
								</div>
								<table>
									<tr>
										<td></td>
										<td><strong>Name</strong></td>
										<td><strong>Value</strong></td>
										<td></td>
									</tr>
									<tr>
										<td style="vertical-align: middle;">Add:</td>
										<td>
											<input id="txtAddParamName" type="text" class="textbox" />
										</td>
										<td>
											<input id="txtAddParamValue" type="text" class="textbox" />
										</td>
										<td><button id="btnAddParam" type="button"></button></td>
									</tr>
								</table>
							</div>
						</fieldset>
						<fieldset>
							<legend>Instance Information</legend>
							<div>
								<label for="txtMovieName">movieName</label>
								<input id="txtMovieName" type="text" class="textbox" />
							</div>
							<div>
								<label for="txtFlashHTML">Flash HTML</label>
								<textarea id="txtFlashHTML" wrap="soft" style="height: 100px;"></textarea>
							</div>
						</fieldset>
					</td>
					<td style="width: 316px;">
						<fieldset>
							<legend>Dynamic Settings</legend>
							<div id="divDynamicSettingForm">
								<div>
									<label for="txtUploadTarget">upload_url:</label>
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
									<input id="cbDebug" type="checkbox" />
									<label for="cbDebug">debug</label>
								</div>
							</div>
							<div>
								<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
									<button id="btnUpdateDynamicSettings" type="button">Update Dynamic Settings</button>
								</td><td class="btn-right"></td></tr></table>
							</div>
						</fieldset>						<fieldset id="fsStaticSettings">
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
								<table class="btn"><tr><td class="btn-left"></td><td class="btn-center">
									<button id="btnReloadSWFUpload" type="button">Reload SWFUpload</button>
								</td><td class="btn-right"></td></tr></table>
							</div>
						</fieldset>
					</td>
				</tr>
				<tr>
					<td colspan="3">
						<fieldset>
							<legend>Events</legend>
							<table style="width: 100%;">
								<tr>
									<td style="width: 50%">
										<div>
											<label for="selEventsQueue">Queue</label>
											<select id="selEventsQueue" size="10" style="width: 100%;"></select>
										</div>
									</td>
									<td style="width: 50%">
										<div>
											<label for="selEventsFile">File</label>
											<select id="selEventsFile" size="10" style="width: 100%;"></select>
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
	</form>
</body>
</html>