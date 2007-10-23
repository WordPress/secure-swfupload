var FeaturesDemoHandlers = {
	swfUploadLoaded: function() {
		FeaturesDemo.start(this);  // This refers to the SWFObject because SWFUpload calls this with .apply(this).
	},
	fileDialogStart : function () {
		try {
			FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("File Dialog Start", "");
		} catch (ex) {
			this.debug(ex);
		}
	},

	fileQueued : function (fileObj) {
		try {
			var queue_string = fileObj.id + ":  0%:" + fileObj.name;
			FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.options.length] = new Option(queue_string, fileObj.id);
			FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("File Queued: " + fileObj.id, "");
		} catch (ex) { this.debug(ex); }
	},

	fileQueueError : function (fileObj, error_code, message) {
		try {
			var error_name = "";
			switch(error_code) {
				case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
					error_name = "QUEUE LIMIT EXCEEDED";
				break;
				case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
					error_name = "FILE EXCEEDS SIZE LIMIT";
				break;
				case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
					error_name = "ZERO BYTE FILE";
				break;
				case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
					error_name = "INVALID FILE TYPE";
				break;
				default:
					error_name = "UNKNOWN";
				break;
			}

			var error_string = error_name + ":File ID: " + (typeof(fileObj) == "object" && fileObj != null ? fileObj.id : "na") + ":" + message;
			FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("File Queue Error: " + error_string, "");

		} catch (ex) { this.debug(ex);}
	},
	
	fileDialogComplete : function (num_files_queued) {
		try {
			FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("File Dialog Complete: " + num_files_queued, "");
		} catch (ex) {
			this.debug(ex);
		}
	},
	
	uploadStart : function (fileObj) {
		try {
			FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("File Start: " + fileObj.id, "");
		} catch (ex) { this.debug(ex); }

		return true;
	},

	uploadProgress: function (fileObj, bytesLoaded) {

		try {
			var percent = Math.ceil((bytesLoaded / fileObj.size) * 100)
			if (percent < 10) percent = "  " + percent;
			else if (percent < 100) percent = " " + percent;

			FeaturesDemo.selQueue.value = fileObj.id;
			var queue_string = fileObj.id + ":" + percent + "%:" + fileObj.name;
			FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.selectedIndex].text = queue_string;


			FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("Upload Progress: " + bytesLoaded, "");
		} catch (ex) { this.debug(ex); }
	},

	uploadComplete: function (fileObj, server_data) {
		try {
			var queue_string = fileObj.id + ":Done:" + fileObj.name;
			FeaturesDemo.selQueue.value = fileObj.id;
			FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.selectedIndex].text = queue_string;

			FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("Upload Complete: " + fileObj.id, "");

			FeaturesDemo.divServerData.innerHTML = server_data;
		} catch (ex) { this.debug(ex); }
	},

	uploadError : function (fileObj, error_code, message) {
		try {
			var error_name = "";
			switch(error_code) {
				case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
					error_name = "HTTP ERROR";
				break;
				case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
					error_name = "MISSING UPLOAD URL";
				break;
				case SWFUpload.UPLOAD_ERROR.IO_ERROR:
					error_name = "IO ERROR";
				break;
				case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
					error_name = "SECURITY ERROR";
				break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
					error_name = "UPLOAD LIMIT EXCEEDED";
				break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
					error_name = "UPLOAD FAILED";
				break;
				case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
					error_name = "SPECIFIED FILE ID NOT FOUND";
				break;
				case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
					error_name = "FILE VALIDATION FAILED";
				break;
				case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
					error_name = "FILE CANCELLED";
					
					FeaturesDemo.selQueue.value = fileObj.id;
					FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.selectedIndex].text = fileObj.id + ":----:" + fileObj.name;;

					FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("File Cancelled " + fileObj.id, "");
				break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
					error_name = "FILE STOPPED";
					
					FeaturesDemo.selQueue.value = fileObj.id;
					FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.selectedIndex].text = fileObj.id + ":  0%:" + fileObj.name;;

					FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("File Stopped " + fileObj.id, "");
				break;
				default:
					error_name = "UNKNOWN";
				break;
			}

			var error_string = error_name + ":File ID: " + (typeof(fileObj) == "object" && fileObj != null ? fileObj.id : "na") + ":" + message;
			FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option(error_string, "");

		} catch (ex) { this.debug(ex);}
	},
	
	fileComplete : function(fileObj) {
		try {
			FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("File Complete: " + fileObj.id, "");

			// See if the setting for uploading the entire queue is enabled and do it.
			if (FeaturesDemo.upload_all && this.getStats().files_queued > 0) {
				FeaturesDemo.SU.startUpload();
			} else {
				FeaturesDemo.upload_all = false;
			}
		} catch (ex) {
			this.debug(ex);
		}
	},
	
	// This custom debug method sends all debug messages to the Firebug console.  If debug is enabled it then sends the debug messages
	// to the built in debug console.  Only JavaScript message are sent to the Firebug console when debug is disabled (SWFUpload won't send the messages
	// when debug is disabled).
	debug : function(message) {
		try {
			if (window.console && typeof(window.console.error) === "function" && typeof(window.console.log) === "function") {
				if (typeof(message) === "object" && typeof(message.name) === "string" && typeof(message.message) === "string") {
					window.console.error(message);
				} else {
					window.console.log(message);
				}
			}
		} catch (ex) {}
		
		try {
			if (this.debug_enabled) {
				this.debugMessage(message);
			}
		} catch (ex) { }
	}
};
