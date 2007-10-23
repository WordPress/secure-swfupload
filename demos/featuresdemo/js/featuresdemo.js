// Called instead of the SWFUpload _showUI method
var FeaturesDemo = {
	start: function(swf_upload_instance) {
		FeaturesDemo.SU = swf_upload_instance;

		FeaturesDemo.cacheFields();
		FeaturesDemo.loadAll();

		FeaturesDemo.btnBrowse.onclick = function() { try { FeaturesDemo.selectFiles(); } catch (ex) {} return false; };
		FeaturesDemo.btnBrowseSingle.onclick = function() { try { FeaturesDemo.selectFile(); } catch (ex) {} return false; };
		FeaturesDemo.btnStartQueueUpload.onclick = function() { try { FeaturesDemo.startQueueUpload(); } catch (ex) {} return false; };
		FeaturesDemo.btnStartSelectedFile.onclick = function() { try { FeaturesDemo.startSelectedFile(); } catch (ex) {} return false; };
		FeaturesDemo.btnStopUpload.onclick = function() { try { FeaturesDemo.stopUpload(); } catch (ex) {} return false; };
		FeaturesDemo.btnCancelSelectedFile.onclick = function() { try { FeaturesDemo.cancelSelectedFile(); } catch (ex) {} return false; };
		FeaturesDemo.btnCancelQueue.onclick = function() { try { FeaturesDemo.cancelQueue(); } catch (ex) {} return false; };
		FeaturesDemo.btnAddFileParam.onclick = function() { try { FeaturesDemo.addFileParam(); } catch (ex) {} return false; };
		FeaturesDemo.btnRemoveFileParam.onclick = function() { try { FeaturesDemo.removeFileParam(); } catch (ex) {} return false; };
		FeaturesDemo.btnAddParam.onclick = function() { try { FeaturesDemo.addParam(); } catch (ex) {} return false; };
		FeaturesDemo.btnRemoveParam.onclick = function() { try { FeaturesDemo.removeParam(); } catch (ex) {} return false; };
		FeaturesDemo.btnUpdateDynamicSettings.onclick = function() { try { FeaturesDemo.updateDynamicSettings(); } catch (ex) {} return false; };
		FeaturesDemo.btnReloadSWFUpload.onclick = function() { try { FeaturesDemo.reloadSWFUpload(); } catch (ex) {} return false; };

		document.getElementById("divSWFUpload").style.display = "block";
		document.getElementById("divDegraded").style.display = "none";
	},
	cacheFields: function() {
		if (FeaturesDemo.is_cached) return;
		
		FeaturesDemo.btnBrowse = document.getElementById("btnBrowse");
		FeaturesDemo.btnBrowseSingle = document.getElementById("btnBrowseSingle");
		FeaturesDemo.selQueue = document.getElementById("selQueue");
		FeaturesDemo.btnStartQueueUpload = document.getElementById("btnStartQueueUpload");
		FeaturesDemo.btnStartSelectedFile = document.getElementById("btnStartSelectedFile");
		FeaturesDemo.btnStopUpload = document.getElementById("btnStopUpload");
		FeaturesDemo.btnCancelSelectedFile = document.getElementById("btnCancelSelectedFile");
		FeaturesDemo.btnCancelQueue = document.getElementById("btnCancelQueue");
		FeaturesDemo.txtAddFileParamName = document.getElementById("txtAddFileParamName");
		FeaturesDemo.txtAddFileParamValue = document.getElementById("txtAddFileParamValue");
		FeaturesDemo.btnAddFileParam = document.getElementById("btnAddFileParam");
		FeaturesDemo.txtRemoveFileParamName = document.getElementById("txtRemoveFileParamName");
		FeaturesDemo.btnRemoveFileParam = document.getElementById("btnRemoveFileParam");
		FeaturesDemo.selParams = document.getElementById("selParams");
		FeaturesDemo.btnRemoveParam = document.getElementById("btnRemoveParam");
		FeaturesDemo.txtAddParamName = document.getElementById("txtAddParamName");
		FeaturesDemo.txtAddParamValue = document.getElementById("txtAddParamValue");
		FeaturesDemo.btnAddParam = document.getElementById("btnAddParam");
		FeaturesDemo.txtUploadTarget = document.getElementById("txtUploadTarget");
		FeaturesDemo.btnUpdateDynamicSettings = document.getElementById("btnUpdateDynamicSettings");
		FeaturesDemo.txtFlashHTML = document.getElementById("txtFlashHTML");
		FeaturesDemo.txtMovieName = document.getElementById("txtMovieName");
		FeaturesDemo.txtFilePostName = document.getElementById("txtFilePostName");
		FeaturesDemo.txtFileTypes = document.getElementById("txtFileTypes");
		FeaturesDemo.txtFileTypesDescription = document.getElementById("txtFileTypesDescription");
		FeaturesDemo.txtFileSizeLimit = document.getElementById("txtFileSizeLimit");
		FeaturesDemo.txtFileUploadLimit = document.getElementById("txtFileUploadLimit");
		FeaturesDemo.txtFileQueueLimit = document.getElementById("txtFileQueueLimit");
		FeaturesDemo.txtFlashURL = document.getElementById("txtFlashURL");
		FeaturesDemo.txtFlashWidth = document.getElementById("txtFlashWidth");
		FeaturesDemo.txtFlashHeight = document.getElementById("txtFlashHeight");
		FeaturesDemo.txtFlashColor = document.getElementById("txtFlashColor");
		FeaturesDemo.txtUIFunction = document.getElementById("txtUIFunction");
		FeaturesDemo.txtUIContainerID = document.getElementById("txtUIContainerID");
		FeaturesDemo.txtDegradedContainerID = document.getElementById("txtDegradedContainerID");
		FeaturesDemo.cbDebug = document.getElementById("cbDebug");
		FeaturesDemo.btnReloadSWFUpload = document.getElementById("btnReloadSWFUpload");
		FeaturesDemo.selEventsQueue = document.getElementById("selEventsQueue");
		FeaturesDemo.selEventsFile = document.getElementById("selEventsFile");
		FeaturesDemo.SWFUpload_Console = document.getElementById("SWFUpload_Console");
		FeaturesDemo.divServerData = document.getElementById("divServerData");

		FeaturesDemo.is_cached = true;
	},
	clearAll: function() {
		FeaturesDemo.selQueue.options.length = 0;
		FeaturesDemo.txtAddFileParamName.value = "";
		FeaturesDemo.txtAddFileParamValue.value = "";
		FeaturesDemo.txtRemoveFileParamName.value = "";
		FeaturesDemo.selParams.options.length = 0;
		FeaturesDemo.txtAddParamName.value = "";
		FeaturesDemo.txtAddParamValue.value = "";
		FeaturesDemo.txtUploadTarget.value = "";
		FeaturesDemo.txtFlashHTML.value = "";
		FeaturesDemo.txtMovieName.value = "";
		FeaturesDemo.txtFilePostName.value = "";
		FeaturesDemo.txtFileTypes.value = "";
		FeaturesDemo.txtFileTypesDescription.value = "";
		FeaturesDemo.txtFileSizeLimit.value = "";
		FeaturesDemo.txtFileUploadLimit.value = "";
		FeaturesDemo.txtFileQueueLimit.value = "";
		FeaturesDemo.txtFlashURL.value = "";
		FeaturesDemo.txtFlashWidth.value = "";
		FeaturesDemo.txtFlashHeight.value = "";
		FeaturesDemo.txtFlashColor.value = "";
		FeaturesDemo.txtUIFunction.value = "";
		FeaturesDemo.txtUIContainerID.value = "";
		FeaturesDemo.txtDegradedContainerID.value = "";
		FeaturesDemo.cbDebug.checked = false;
		FeaturesDemo.selEventsQueue.options.length = 0;
		FeaturesDemo.selEventsFile.options.length = 0;
		FeaturesDemo.SWFUpload_Console.value = "";
		FeaturesDemo.divServerData.innerHTML = "";
	},
	loadAll: function() {
		var param_obj = FeaturesDemo.SU.getSetting("post_params");
		var counter = 0;
		for (var key in param_obj) {
			FeaturesDemo.selParams.options[counter++] = new Option(key, param_obj[key]);
		}

		param_obj = FeaturesDemo.SU.getSetting("query_params");
		var counter = 0;
		for (var key in param_obj) {
			FeaturesDemo.selQueryParams.options[counter++] = new Option(key, param_obj[key]);
		}

		FeaturesDemo.txtUploadTarget.value = FeaturesDemo.SU.getSetting("upload_url");
		FeaturesDemo.txtFlashHTML.value = FeaturesDemo.SU.getFlashHTML();
		FeaturesDemo.txtMovieName.value = FeaturesDemo.SU.movieName;
		FeaturesDemo.txtFilePostName.value = FeaturesDemo.SU.getSetting("file_post_name");
		FeaturesDemo.txtFileTypes.value = FeaturesDemo.SU.getSetting("file_types");
		FeaturesDemo.txtFileTypesDescription.value = FeaturesDemo.SU.getSetting("file_types_description");
		FeaturesDemo.txtFileSizeLimit.value = FeaturesDemo.SU.getSetting("file_size_limit");
		FeaturesDemo.txtFileUploadLimit.value = FeaturesDemo.SU.getSetting("file_upload_limit");
		FeaturesDemo.txtFileQueueLimit.value = FeaturesDemo.SU.getSetting("file_queue_limit");
		FeaturesDemo.txtFlashURL.value = FeaturesDemo.SU.getSetting("flash_url");
		FeaturesDemo.txtFlashWidth.value = FeaturesDemo.SU.getSetting("flash_width");
		FeaturesDemo.txtFlashHeight.value = FeaturesDemo.SU.getSetting("flash_height");
		FeaturesDemo.txtFlashColor.value = FeaturesDemo.SU.getSetting("flash_color");
		FeaturesDemo.txtUIFunction.value = FeaturesDemo.SU.getSetting("ui_function");
		FeaturesDemo.txtUIContainerID.value = FeaturesDemo.SU.getSetting("ui_container_id");
		FeaturesDemo.txtDegradedContainerID.value = FeaturesDemo.SU.getSetting("degraded_container_id");
		FeaturesDemo.cbDebug.checked = FeaturesDemo.SU.getSetting("debug_enabled");
	},

	selectFiles: function() {
		FeaturesDemo.SU.selectFiles();
	},
	selectFile: function() {
		FeaturesDemo.SU.selectFile();
	},
	startQueueUpload: function() {
		FeaturesDemo.upload_all = true;
		FeaturesDemo.SU.startUpload();
	},
	startSelectedFile: function() {
		if (FeaturesDemo.selQueue.options.length == 0) {
			alert("You must queue a file first");
			return;
		}
		if (FeaturesDemo.selQueue.selectedIndex == -1) {
			alert("Please select a file from the queue.");
			return;
		}

		var file_id = FeaturesDemo.selQueue.value;
		FeaturesDemo.SU.startUpload(file_id);
	},
	stopUpload: function() {
		FeaturesDemo.upload_all = false;
		FeaturesDemo.SU.stopUpload();
	},
	cancelSelectedFile: function() {
		if (FeaturesDemo.selQueue.options.length == 0) {
			alert("You must queue a file first");
			return;
		}
		if (FeaturesDemo.selQueue.selectedIndex == -1) {
			alert("Please select a file from the queue.");
			return;
		}

		var file_id = FeaturesDemo.selQueue.value;
		FeaturesDemo.SU.cancelUpload(file_id);
	},
	cancelQueue: function() {
		var files_left = FeaturesDemo.SU.getStats().files_queued;

		while (files_left > 0) {
			FeaturesDemo.SU.cancelUpload();
			files_left = FeaturesDemo.SU.getStats().files_queued;
		} 
	},
	addFileParam: function() {
		if (FeaturesDemo.selQueue.selectedIndex == -1) {
			alert("Please select a file from the queue.");
			return;
		}
		var file_id = FeaturesDemo.selQueue.value;
		var name = FeaturesDemo.txtAddFileParamName.value;
		var value = FeaturesDemo.txtAddFileParamValue.value;

		if (name === "") {
			alert("Please enter a Param name.");
			return;
		}

		if (FeaturesDemo.SU.addFileParam(file_id, name, value)) {
			FeaturesDemo.txtAddFileParamName.value = "";
			FeaturesDemo.txtAddFileParamValue.value = "";
			alert("Param added.");
		} else {
			alert("Param not added.");
		}
	},
	removeFileParam: function() {
		if (FeaturesDemo.selQueue.selectedIndex === -1) {
			alert("Please select a file from the queue.");
			return;
		}
		var file_id = FeaturesDemo.selQueue.value;
		var name = FeaturesDemo.txtRemoveFileParamName.value;

		if (name == "") {
			alert("Please enter a Param name.");
			return;
		}

		if (FeaturesDemo.SU.removeFileParam(file_id, name)) {
			FeaturesDemo.txtRemoveFileParamName.value = "";
			alert("Param removed.");
		} else {
			alert("Param not removed.");
		}
	},
	addParam: function () {
		var name = FeaturesDemo.txtAddParamName.value;
		var value = FeaturesDemo.txtAddParamValue.value;

		if (name == "") {
			alert("Please enter a Param name.");
			return;
		}

		FeaturesDemo.selParams.options[FeaturesDemo.selParams.options.length] = new Option(name, value);
		FeaturesDemo.txtAddParamName.value = "";
		FeaturesDemo.txtAddParamValue.value = "";
	},
	removeParam: function() {
		if (FeaturesDemo.selParams.selectedIndex == -1) {
			alert("Please select a Param.");
			return;
		}

		FeaturesDemo.selParams.options[FeaturesDemo.selParams.selectedIndex] = null;
	},
	updateDynamicSettings: function() {
		// Build the param object
		var params = FeaturesDemo.getParamsObject();
		FeaturesDemo.SU.setPostParams(params);
		FeaturesDemo.SU.setFileTypes(FeaturesDemo.txtFileTypes.value, FeaturesDemo.txtFileTypesDescription.value);
		FeaturesDemo.SU.setFileSizeLimit(FeaturesDemo.txtFileSizeLimit.value);
		FeaturesDemo.SU.setFileUploadLimit(FeaturesDemo.txtFileUploadLimit.value);
		FeaturesDemo.SU.setFileQueueLimit(FeaturesDemo.txtFileQueueLimit.value);
		FeaturesDemo.SU.setFilePostName(FeaturesDemo.txtFilePostName.value);
		FeaturesDemo.SU.setDebugEnabled(FeaturesDemo.cbDebug.checked);

		// We ignore any changes to the upload_url
		FeaturesDemo.txtUploadTarget.value = FeaturesDemo.SU.getSetting("upload_url");

		alert("Dynamic Settings updated.");
	},
	getParamsObject: function() {
		var params = new Object();
		for (var i=0; i<FeaturesDemo.selParams.options.length; i++) {
			var name = FeaturesDemo.selParams.options[i].text;
			var value = FeaturesDemo.selParams.options[i].value;
			params[name] = value;
		}
		return params;
	},
	reloadSWFUpload: function() {
		try {
		FeaturesDemo.SU.stopUpload();
		FeaturesDemo.SU.movieElement.parentNode.removeChild(FeaturesDemo.SU.movieElement);
		FeaturesDemo.SU.movieElement = null;

		var settings = {
			upload_url: FeaturesDemo.SU.getSetting("upload_url"),
			post_params: FeaturesDemo.getParamsObject(),
			file_size_limit : FeaturesDemo.txtFileSizeLimit.value,
			file_post_name : FeaturesDemo.txtFilePostName.value,
			file_types : FeaturesDemo.txtFileTypes.value,
			file_types_description : FeaturesDemo.txtFileTypesDescription.value,
			file_upload_limit : FeaturesDemo.txtFileUploadLimit.value,
			file_queue_limit : FeaturesDemo.txtFileQueueLimit.value,
			swfupload_loaded_handler : FeaturesDemoHandlers.swfUploadLoaded,
			file_queued_handler : FeaturesDemoHandlers.fileQueued,
			file_queue_error_handler : FeaturesDemoHandlers.fileQueueError,
			upload_progress_handler : FeaturesDemoHandlers.uploadProgress,
			upload_error_handler : FeaturesDemoHandlers.uploadError,
			upload_complete_handler : FeaturesDemoHandlers.uploadComplete,
			file_complete_handler : FeaturesDemoHandlers.fileComplete,
			debug_handler : FeaturesDemoHandlers.debug,
			flash_url : FeaturesDemo.SU.getSetting("flash_url"),
			flash_width : FeaturesDemo.txtFlashWidth.value,
			flash_height : FeaturesDemo.txtFlashHeight.value,
			flash_color : FeaturesDemo.txtFlashColor.value,
			ui_container_id : FeaturesDemo.SU.getSetting("ui_container_id"),
			degraded_container_id : FeaturesDemo.SU.getSetting("degraded_container_id"),
			debug: FeaturesDemo.cbDebug.checked
		}

		FeaturesDemo.clearAll();

		FeaturesDemo.SU = new SWFUpload(settings);

		} catch (ex) { alert(ex); }
	}
}
