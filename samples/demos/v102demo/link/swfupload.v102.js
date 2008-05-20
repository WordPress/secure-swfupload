/*
	SWFUpload v1.0.2 Plug-in for SWFUpload v2.1.0
	---------------------------------------------
	This plug in creates API compatibility with SWFUpload v1.0.2.  It
	also mimics SWFUpload v1.0.2 behaviors as far as possible.
	---------------------------------------------
	
	The purpose of this plugin is to allow you to replace
	SWFUpload v1.0.2 in an existing website.  Allowing you
	to get the benefits of the latest bug fixes with
	little or no additional effort.
	
	If you are developing a new website please use the standard
	SWFupload v2.1.0 as support for this plugin is limited.


	**Warning: This plugin should not be combined with any other SWFupload plugin**
*/

var SWFUpload;
if (typeof(SWFUpload) === "function") {
	SWFUpload.v102 = {};
	
	SWFUpload.prototype.baseInitSettings = SWFUpload.prototype.initSettings;
	SWFUpload.prototype.initSettings = function () {
		var provideDefault = function (value, defaultValue) {
			return (value == undefined) ? defaultValue : value;
		};
		
		var newSettings = {};
		var v102Settings = this.settings;
		var customSettings = this.settings.custom_settings || {};

		// Store v1.0.2 settings
		customSettings.v102 = {};
		customSettings.v102.target 					= provideDefault(v102Settings.target, "");
		customSettings.v102.create_ui 				= provideDefault(v102Settings.create_ui, false);
		customSettings.v102.browse_link_class 		= provideDefault(v102Settings.browse_link_class, "SWFBrowseLink");
		customSettings.v102.upload_link_class 		= provideDefault(v102Settings.upload_link_class, "SWFUploadLink");
		customSettings.v102.browse_link_innerhtml 	= provideDefault(v102Settings.browse_link_innerhtml, "<span>Browse...</span>");
		customSettings.v102.upload_link_innerhtml 	= provideDefault(v102Settings.upload_link_innerhtml, "<span>Upload</span>");
		customSettings.v102.auto_upload 			= !!provideDefault(v102Settings.auto_upload, false);
		
		// Store v1.0.2 events
		customSettings.v102.upload_file_queued_callback 	= provideDefault(v102Settings.upload_file_queued_callback, null);
		customSettings.v102.upload_file_start_callback 	= provideDefault(v102Settings.upload_file_start_callback, null);
		customSettings.v102.upload_file_complete_callback 	= provideDefault(v102Settings.upload_file_complete_callback, null);
		customSettings.v102.upload_queue_complete_callback = provideDefault(v102Settings.upload_queue_complete_callback, null);
		customSettings.v102.upload_progress_callback 		= provideDefault(v102Settings.upload_progress_callback, null);
		customSettings.v102.upload_dialog_cancel_callback 	= provideDefault(v102Settings.upload_dialog_cancel_callback, null);
		customSettings.v102.upload_file_error_callback 	= provideDefault(v102Settings.upload_file_error_callback, null);
		customSettings.v102.upload_file_cancel_callback 	= provideDefault(v102Settings.upload_file_cancel_callback, null);
		customSettings.v102.upload_queue_cancel_callback 	= provideDefault(v102Settings.upload_queue_cancel_callback, null);
		customSettings.v102.queue_cancelled_flag			= false;

		// Upload backend settings
		newSettings.upload_url 		= provideDefault(v102Settings.upload_script, "");
		newSettings.file_post_name 	= "Filedata";
		newSettings.post_params 	= {};

		// File Settings
		newSettings.file_types 				= provideDefault(v102Settings.allowed_filetypes, "*.*");
		newSettings.file_types_description 	= provideDefault(v102Settings.allowed_filetypes_description, "All Files");
		newSettings.file_size_limit 		= provideDefault(v102Settings.allowed_filesize, "1024");
		newSettings.file_upload_limit 		= 0;
		newSettings.file_queue_limit 		= 0;

		// Flash Settings
		newSettings.flash_url 	= provideDefault(v102Settings.flash_path, "swfupload_f8.swf");
		newSettings.flash_color = provideDefault(v102Settings.flash_color, "#000000");

		// Debug Settings
		newSettings.debug_enabled = this.settings.debug = provideDefault(v102Settings.debug,  false);


		// Event Handlers
		newSettings.swfupload_loaded_handler 		= SWFUpload.v102.swfUploadLoaded;
		newSettings.file_dialog_start_handler 		= null;
		newSettings.file_queued_handler 			= SWFUpload.v102.fileQueued;
		newSettings.file_queue_error_handler 		= SWFUpload.v102.uploadError;
		newSettings.file_dialog_complete_handler 	= SWFUpload.v102.fileDialogComplete;
		
		newSettings.upload_start_handler		= SWFUpload.v102.uploadStart;
		newSettings.return_upload_start_handler = this.returnUploadStart;
		newSettings.upload_progress_handler		= SWFUpload.v102.uploadProgress;
		newSettings.upload_error_handler		= SWFUpload.v102.uploadError;
		newSettings.upload_success_handler		= SWFUpload.v102.uploadSuccess;
		newSettings.upload_complete_handler		= SWFUpload.v102.uploadComplete;

		newSettings.debug_handler				= SWFUpload.v102.debug;
		
		newSettings.custom_settings = customSettings;
		this.settings = newSettings;
		
		this.baseInitSettings();	// Cause SWFUpload to initialize itself
		
		// Hook up the v1.0.2 methods
		this.browse = SWFUpload.v102.browse;
		this.upload = SWFUpload.v102.upload;
		this.cancelFile = SWFUpload.v102.cancelFile;
		this.cancelQueue = SWFUpload.v102.cancelQueue;
		this.debugSettings = SWFUpload.v102.debugSettings;
	};

	// Emulate the v1.0.2 events
	SWFUpload.v102.swfUploadLoaded = function () {
		try {
			var target_id = this.customSettings.v102.target;
			if (target_id !== "" && target_id !== "fileinputs") {
				var self = this;
				var target = document.getElementById(target_id);
				
				if (target !== null) {
					// Create the link for uploading
					var browselink = document.createElement("a");
					browselink.className = this.customSettings.v102.browse_link_class;
					browselink.id = this.movieName + "BrowseBtn";
					browselink.href = "javascript:void(0);";
					browselink.onclick = function () {
						self.browse();
						return false;
					};
					browselink.innerHTML = this.customSettings.v102.browse_link_innerhtml;
				
					target.innerHTML = "";
					target.appendChild(browselink);
						
					// Add upload btn if auto upload not used
					if (this.customSettings.v102.auto_upload === false) {

						// Create the link for uploading
						var uploadlink = document.createElement("a");
						uploadlink.className = this.customSettings.v102.upload_link_class;
						uploadlink.id = this.movieName + "UploadBtn";
						uploadlink.href = "#";
						uploadlink.onclick = function () {
							self.upload();
							return false;
						};
						uploadlink.innerHTML = this.customSettings.v102.upload_link_innerhtml;
						target.appendChild(uploadlink);
					}
				}
			}
		}
		catch (ex) {
			this.debug("Exception in swfUploadLoaded");
			this.debug(ex);
		}
	};

	SWFUpload.v102.fileQueued = function (file) {
		var stats = this.getStats();
		var total_files = stats.successful_uploads + stats.upload_errors + stats.files_queued;

		var v102fileQueued = this.customSettings.v102.upload_file_queued_callback;
		if (typeof(v102fileQueued) === "function")  {
			v102fileQueued.call(this, file, total_files);
		}
	};
	
	SWFUpload.v102.fileDialogComplete = function (num_files_selected, num_files_queued) {
		if (this.customSettings.v102.auto_upload === true) {
			this.startUpload();
		}
	};
	
	SWFUpload.v102.uploadStart = function (file) {
		var callback = this.customSettings.v102.upload_file_start_callback;
		var stats = this.getStats();
		var current_file_number = stats.successful_uploads + stats.upload_errors + 1;
		var total_files = stats.successful_uploads + stats.upload_errors + stats.files_queued;
		if (typeof(callback) === "function") {
			callback.call(this, file, current_file_number, total_files);
		}
		
		return true;
	};
	
	SWFUpload.v102.uploadProgress = function (file, bytes_complete, bytes_total) {
		var callback = this.customSettings.v102.upload_progress_callback;
		if (typeof(callback) === "function") {
			callback.call(this, file, bytes_complete, bytes_total);
		}
	};
	
	SWFUpload.v102.uploadSuccess = function (file, server_data) {
		var callback = this.customSettings.v102.upload_file_complete_callback;
		if (typeof(callback) === "function") {
			callback.call(this, file, server_data);
		}
	};
	
	SWFUpload.v102.uploadComplete = function (file) {
		var stats = this.getStats();
		
		if (stats.files_queued > 0 && !this.customSettings.v102.queue_cancelled_flag) {
			// Automatically start the next upload (if the queue wasn't cancelled)
			this.startUpload();
		} else if (stats.files_queued === 0 && !this.customSettings.v102.queue_cancelled_flag) {
			// Call Queue Complete if there are no more files queued and the queue wasn't cancelled
			var callback = this.customSettings.v102.upload_queue_complete_callback;
			if (typeof(callback) === "function") {
				callback.call(this, file);
			}
		} else {
			// Don't do anything. Remove the queue cancelled flag (if the queue was cancelled it will be set again)
			this.customSettings.v102.queue_cancelled_flag = false;
		}
	};
	
	
	SWFUpload.v102.uploadError = function (file, error_code, msg) {
		var translated_error_code = SWFUpload.v102.translateErrorCode(error_code);
		if (error_code === SWFUpload.UPLOAD_ERROR.FILE_CANCELLED) {
			var stats = this.getStats();
			var total_files = stats.successful_uploads + stats.upload_errors + stats.files_queued;
			var callback = this.customSettings.v102.upload_file_cancel_callback;
			if (typeof(callback) === "function") {
				callback.call(this, file, total_files);
			}
		} else {
			var error_callback = this.customSettings.v102.upload_file_error_callback;
			if (error_callback === null || typeof(error_callback) !== "function") {
				SWFUpload.v102.defaultHandleErrors.call(this, translated_error_code, file, msg);
			} else {
				error_callback.call(this, translated_error_code, file, msg);
			}
		}
	};
	
	SWFUpload.v102.translateErrorCode = function (error_code) {
		var translated_error_code = 0;
		switch (error_code) {
		case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
			translated_error_code = -40;
			break;
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			translated_error_code = -50;
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			translated_error_code = -30;
			break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			translated_error_code = -30;
			break;
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			translated_error_code = -10;
			break;
		case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
			translated_error_code = -20;
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			translated_error_code = -30;
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			translated_error_code = -40;
			break;
		case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
			translated_error_code = -30;
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			translated_error_code = -30;
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			translated_error_code = -30;
			break;
		}
		
		return translated_error_code;
	};
	
	// Default error handling.
	SWFUpload.v102.defaultHandleErrors = function (errcode, file, msg) {
		
		switch (errcode) {
		case -10:	// HTTP error
			alert("Error Code: HTTP Error, File name: " + file.name + ", Message: " + msg);
			break;
		
		case -20:	// No upload script specified
			alert("Error Code: No upload script, File name: " + file.name + ", Message: " + msg);
			break;
		
		case -30:	// IOError
			alert("Error Code: IO Error, File name: " + file.name + ", Message: " + msg);
			break;
		
		case -40:	// Security error
			alert("Error Code: Security Error, File name: " + file.name + ", Message: " + msg);
			break;

		case -50:	// Filesize too big
			alert("Error Code: Filesize exceeds limit, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
			break;
		default:
			alert("Error Code: " + errcode + ". File name: " + file.name + ", Message: " + msg);
		}
		
	};
	
	SWFUpload.v102.debug = function (message) {
		if (this.settings.debug_enabled) {
			if (window.console) {
				window.console.log(message);
			} else {
				alert(message);
			}
		}
	};
	
	
	// Emulate the v1.0.2 function calls
	SWFUpload.v102.browse = function () {
		this.selectFiles();
	};
	SWFUpload.v102.upload = function () {
		this.startUpload();
	};
	SWFUpload.v102.cancelFile = function (file_id) {
		this.cancelUpload(file_id);
	};
	SWFUpload.v102.cancelQueue = function () {
		var stats = this.getStats();
		while (stats.files_queued > 0) {
			this.customSettings.v102.queue_cancelled_flag = true;
			this.cancelUpload();
			stats = this.getStats();
		}
		
		if (status.in_progress === 0) {
			this.customSettings.v102.queue_cancelled_flag = false;
		}
	};
}