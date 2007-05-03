/*
* Development note:  This code needs a security audit.  E.g. If someone sets the control id string as some javascript it
* could make funny things happen with the callbacks.
*
* */


// Allow all domain
import flash.net.FileReferenceList;
import flash.net.FileReference;
import flash.external.ExternalInterface;

class SWFUpload {
	static function main()
	{
		_root.onEnterFrame = function() {
			if (this.getBytesLoaded() / this.getBytesTotal() > 0.99) {
				var SWFUpload:SWFUpload = new SWFUpload();
				_root.onEnterFrame = function() { };
				_root.stop();
			}
		};
	}


	var fileBrowser:FileReferenceList = new FileReferenceList();

	var file_queue:Array = new Array();		// holds a list of all items that are to be uploaded.
	var current_file_item:FileItem = null;	// the item that is currently being uploaded.
	var single_upload:Boolean = false;		// Indicates whether a single file is being upload or the entire queue
	var completed_uploads:Number = 0;		// Tracks the uploads that have been completed (no errors, not cancelled, not too big)
	var queued_uploads:Number = 0;			// Tracks the FileItems that are waiting to be uploaded.

	var file_reference_listener:Object;		// Holds the callbacks used by the FileReference objects

	// Callbacks
	var flashReady_Callback:String;
	var dialogCancelled_Callback:String;
	var fileQueued_Callback:String;
	var fileProgress_Callback:String;
	var fileCancelled_Callback:String;
	var fileComplete_Callback:String;
	var queueComplete_Callback:String;
	var queueStopped_Callback:String;
	var error_Callback:String;
	var debug_Callback:String;

	// Values passed in from the HTML
	var controlID:String;
	var uploadTargetURL:String;
	var uploadQueryString:String;
	var fileTypes:String;
	var fileTypesDescription:String;
	var fileSizeLimit:Number;
	var fileUploadLimit:Number = 0;
	var fileQueueLimit:Number = 0;
	var beginUploadOnQueue:Boolean;
	var debug:Boolean;

	// Error code "constants"
	var ERROR_CODE_HTTP_ERROR:Number 				= -10;
	var ERROR_CODE_MISSING_UPLOAD_TARGET:Number 	= -20;
	var ERROR_CODE_IO_ERROR:Number 					= -30;
	var ERROR_CODE_SECURITY_ERROR:Number 			= -40;
	var ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:Number 	= -50;
	var ERROR_CODE_ZERO_BYTE_FILE:Number 			= -60;
	var ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:Number		= -70;
	var ERROR_CODE_UPLOAD_FAILED:Number 			= -80;
	var ERROR_CODE_QUEUE_LIMIT_EXCEEDED:Number 		= -90;
	var ERROR_CODE_SPECIFIED_FILE_NOT_FOUND:Number 	= -100;

	function SWFUpload() {
		System.security.allowDomain("*");	// Allow any domain to use this SWF to upload files

		// Setup file FileReference Listener. This is attached to all FileReference objects (ie, every file the user uploads)
		this.file_reference_listener = new Object();
		this.file_reference_listener.onCancel = 		Delegate.Create(this, this.DialogCancelled_Handler);
		this.file_reference_listener.onProgress = 		Delegate.Create(this, this.FileProgress_Handler);
		this.file_reference_listener.onComplete = 		Delegate.Create(this, this.FileComplete_Handler);
		this.file_reference_listener.onHTTPError = 		Delegate.Create(this, this.HTTPError_Handler);
		this.file_reference_listener.onIOError = 		Delegate.Create(this, this.IOError_Handler);
		this.file_reference_listener.onSecurityError = 	Delegate.Create(this, this.SecurityError_Handler);
		this.file_reference_listener.onSelect = 		Delegate.Create(this, this.Select_Handler);

		// Add the event listener to the FileBrowser
		this.fileBrowser.addListener(this.file_reference_listener);

		// Get the control ID
		this.controlID = _root.controlID;

		// Configure the callbacks
		this.flashReady_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].FlashReady";
		this.dialogCancelled_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].DialogCancelled";
		this.fileQueued_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].FileQueued";
		this.fileProgress_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].FileProgress";
		this.fileCancelled_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].FileCancelled";
		this.fileComplete_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].FileComplete";
		this.queueComplete_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].QueueComplete";
		this.queueStopped_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].QueueStopped";
		this.error_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].Error";
		this.debug_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].Debug";

		// Get the Flash Vars
		this.uploadTargetURL = _root.uploadTargetURL;
		this.uploadQueryString = _root.uploadQueryString;
		this.fileTypes = _root.fileTypes;
		this.fileTypesDescription = _root.fileTypesDescription + " (" + this.fileTypes + ")";

		try {
			this.beginUploadOnQueue = _root.beginUploadOnQueue == "true" ? true : false;
		} catch (ex:Object) {
			this.beginUploadOnQueue = false;
		}
		try {
			this.debug = _root.debug == "true" ? true : false;
		} catch (ex:Object) {
			this.debug = false;
		}

		try {
			this.fileSizeLimit = Number(_root.fileSizeLimit);
		} catch (ex:Object) {
			this.fileSizeLimit = 0;
		}

		try {
			this.fileUploadLimit = Number(_root.fileUploadLimit);
		} catch (ex:Object) {
			this.fileUploadLimit = 0;
		}

		try {
			this.fileQueueLimit = Number(_root.fileQueueLimit);
		} catch (ex:Object) {
			this.fileQueueLimit = 0;
		}

		// There is no sense in allowing more files to be queued than is allowed to be uploaded
		if (this.fileQueueLimit > this.fileUploadLimit) this.fileQueueLimit = this.fileUploadLimit;

		var callbacks_set:Boolean = true;
		callbacks_set = callbacks_set && ExternalInterface.addCallback("Browse", this, this.SelectFiles);
		callbacks_set = callbacks_set && ExternalInterface.addCallback("StartUpload", this, this.StartUpload);
		callbacks_set = callbacks_set && ExternalInterface.addCallback("StopUpload", this, this.StopUpload);
		callbacks_set = callbacks_set && ExternalInterface.addCallback("CancelUpload", this, this.CancelUpload);
		callbacks_set = callbacks_set && ExternalInterface.addCallback("CancelQueue", this, this.CancelQueue);
		callbacks_set = callbacks_set && ExternalInterface.addCallback("SetUploadStrings", this, this.SetUploadStrings);
		callbacks_set = callbacks_set && ExternalInterface.addCallback("AddFileParam", this, this.AddFileParam);
		callbacks_set = callbacks_set && ExternalInterface.addCallback("RemoveFileParam", this, this.RemoveFileParam);
		if (!callbacks_set)	this.Debug("Callbacks where not set.");

		this.Debug("SWFUpload Init Complete");
		this.PrintDebugInfo();

		/* This bit is the crux of "Flash Feature Detection" and should always be last.  If anything before
		   this point fails (e.g. the flash player does not support it) then an error will occur which prevents
		   this method from calling back to the Javascript.  Errors are not reported back to the browser
		   and so silently fails. Thus, the script will only work if the Flash Player supports the
		   necessary features. */
		ExternalInterface.call(this.flashReady_Callback);

	}

	/* *****************************************
	* FileReference Event Handlers
	* *************************************** */
	function DialogCancelled_Handler():Void {
		this.Debug("onCancel: File Dialog window cancelled.");

		ExternalInterface.call(this.dialogCancelled_Callback);
	}

	function FileProgress_Handler(file:FileReference, bytesLoaded:Number, bytesTotal:Number):Void {
		this.Debug("onProgress: File ID: " + this.current_file_item.id + ". Bytes: " + bytesLoaded + ". Total: " + bytesTotal);

		ExternalInterface.call(this.fileProgress_Callback, this.current_file_item.ToJavaScriptObject(), bytesLoaded, bytesTotal);
	}

	function FileComplete_Handler(file:FileReference):Void {
		this.Debug("onComplete: File ID: " + this.current_file_item.id + ". Upload Complete. Calling uploadComplete.");

		this.completed_uploads++;

		ExternalInterface.call(this.fileComplete_Callback, this.current_file_item.ToJavaScriptObject());

		this.UploadComplete();
	}

	function HTTPError_Handler(file:FileReference, httpError:Number):Void {
		this.Debug("onHTTPError: File ID: " + this.current_file_item.id + ". HTTP Error: " + httpError + ".");

		ExternalInterface.call(this.error_Callback, this.ERROR_CODE_HTTP_ERROR, this.current_file_item.ToJavaScriptObject(), httpError);

		this.UploadComplete();
	}
	function IOError_Handler(file:FileReference):Void {

		if(!this.uploadTargetURL.length) {
			this.Debug("onIOError: File ID: " + this.current_file_item.id + ". Upload Backend string is empty.");
			ExternalInterface.call(this.error_Callback, this.ERROR_CODE_MISSING_UPLOAD_TARGET, this.current_file_item.ToJavaScriptObject(), "No backend file specified");
		} else {
			this.Debug("onIOError: File ID: " + this.current_file_item.id + ". IO Error.");
				ExternalInterface.call(this.error_Callback, this.ERROR_CODE_IO_ERROR, this.current_file_item.ToJavaScriptObject(), "IO Error");
		}

		this.UploadComplete();
	}

	function SecurityError_Handler(file:FileReference, errorString:String):Void {
		this.Debug("onSecurityError: File Number: " + this.current_file_item.id + ". Error:" + errorString);
		ExternalInterface.call(this.error_Callback, this.ERROR_CODE_SECURITY_ERROR, this.current_file_item.ToJavaScriptObject(), "Security Error");

		this.UploadComplete();
	}

	function Select_Handler(fileRefList:FileReferenceList) {
		this.Debug("Files Selected. Processing file list");
		var file_reference_list:Array = fileRefList.fileList;

		// Determine how many files may be queued
		var queue_slots_remaining:Number = this.fileUploadLimit - (this.completed_uploads + this.queued_uploads);
		queue_slots_remaining = (queue_slots_remaining > this.fileQueueLimit && this.fileQueueLimit > 0) ? this.fileQueueLimit : queue_slots_remaining;

		// Check if the number of files selected is greater than the number allowed to queue up.
		if (file_reference_list.length > queue_slots_remaining && (this.fileUploadLimit != 0 || this.fileQueueLimit > 0)) {
			this.Debug("onSelect: Selected Files exceed remaining Queue size.");
			ExternalInterface.call(this.error_Callback, this.ERROR_CODE_QUEUE_LIMIT_EXCEEDED, null, queue_slots_remaining);
		} else {
			// Process each selected file
			for (var i:Number = 0; i < file_reference_list.length; i++) {
				var file_item:FileItem = new FileItem(file_reference_list[i], this.controlID);

				// Check the size, if it's within the limit add it to the upload list.
				var size_result:Number = this.CheckFileSize(file_item);
				if(size_result == 0) {
					this.Debug("onSelect: File within size limit. Adding to queue and making callback.");
					file_item.file_reference.addListener(this.file_reference_listener);
					this.file_queue.push(file_item);
					this.queued_uploads++;
					ExternalInterface.call(this.fileQueued_Callback, file_item.ToJavaScriptObject());

					// If it's too large then still reserve it's space (it needs a file id) and send the external notice
				} else if (size_result > 0) {
					this.Debug("onSelect: File exceeds size limit. Making error callback.");
					ExternalInterface.call(this.error_Callback, this.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT, file_item.ToJavaScriptObject(), "File size exceeds allowed limit.");
				} else if (size_result < 0) {
					this.Debug("onSelect: File is zero bytes. Making error callback.");
					ExternalInterface.call(this.error_Callback, this.ERROR_CODE_ZERO_BYTE_FILE, file_item.ToJavaScriptObject(), "File is zero bytes and cannot be uploaded.");
				}
			}

			// If we are currently uploading files
			if (this.beginUploadOnQueue && this.queued_uploads > 0) {
				this.Debug("onSelect: Uploads set to begin immediately. Calling StartUpload.");
				this.StartUpload();
			}
		}
	}

	/* ****************************************************************
		Externally exposed functions
	****************************************************************** */

	// Opens a file browser dialog.  Once files are selected the "onselect" event is triggered.
	function SelectFiles():Void {
		var allowed_file_types:String = "*.*";
		var allowed_file_types_description:String = "All Files";
		if (this.fileTypes.length > 0) allowed_file_types = this.fileTypes;
		if (this.fileTypesDescription.length > 0)  allowed_file_types_description = this.fileTypesDescription;

		this.fileBrowser.browse([{description: allowed_file_types_description, extension: allowed_file_types}]);

		this.Debug("UploadFile: Browsing files. " + allowed_file_types);
	}


	// Starts uploading.  If a file_id is given then only that file is uploaded, otherwise the entire queue is uploaded.
	// If the file_id is not found no upload begins and an error is called back
	function StartUpload(file_id:String):Void {
		if (this.current_file_item == null) {
			this.Debug("StartUpload(): Starting Upload. File ID: " + file_id);
			this.StartFile(file_id);
		} else {
			this.Debug("StartUpload(): Upload run already in progress");
		}
	}

	// Cancel the current upload and stops.  Doesn't advance the upload pointer. Starting again will re-upload the current file.
	function StopUpload():Void {
		if (this.current_file_item != null) {
			this.Debug("StopUpload(): Stopping Upload run");

			// Cancel the upload and re-queue the FileItem
			this.current_file_item.file_reference.cancel();
			this.file_queue.unshift(this.current_file_item);
			ExternalInterface.call(this.queueStopped_Callback, this.current_file_item.ToJavaScriptObject());

			this.current_file_item = null;
			this.Debug("StopUpload(): upload stopped.");
		} else {
			this.Debug("StopUpload(): Upload run not in progress");
		}
	}

	// Cancels the upload specified by file_id
	function CancelUpload(file_id:String):Void {
		if (file_id) {
			if (this.current_file_item.id == file_id) {
				this.current_file_item.file_reference.cancel();
				ExternalInterface.call(this.fileCancelled_Callback, this.current_file_item.ToJavaScriptObject());

				this.Debug("CancelUpload(): Cancelling current upload");
				this.UploadComplete(); // <-- this advanced the upload to the next file
			} else {
				// Find the file in the queue
				var file_index:Number = this.FindIndexInFileQueue(file_id);
				if (file_index >= 0) {
					// Remove the file from the queue
					var file_item:FileItem = FileItem(this.file_queue[file_index]);
					this.file_queue[file_index] = null;
					this.queued_uploads--;

					// Cancel the file (just for good measure) and make the callback
					file_item.file_reference.cancel();
					ExternalInterface.call(this.fileCancelled_Callback, file_item.ToJavaScriptObject());

					// Get rid of the file object
					delete file_item;
					this.Debug("CancelUpload(): Cancelling queued upload");
				}
			}
		}

	}

	function CancelQueue():Void {
		this.Debug("CancelQueue(): Cancelling remaining queue.");

		// Cancel the current upload
		if (this.current_file_item != null) {
			this.current_file_item.file_reference.cancel();
			ExternalInterface.call(this.fileCancelled_Callback, this.current_file_item.ToJavaScriptObject());
		}

		while (this.file_queue.length > 0) {
			var file_item:FileItem = FileItem(this.file_queue.shift());
			if (file_item != null) {
				file_item.file_reference.cancel();	// Cancel the FileReference just for good measure
				this.queued_uploads--;

				ExternalInterface.call(this.fileCancelled_Callback, file_item.ToJavaScriptObject());
				delete file_item;
			}
		}

		// If we were uploading a file complete it's process
		if (this.current_file_item != null) {
			this.UploadComplete();
		}
	}

	function SetUploadStrings(url:String, query_string:String):Void {
		this.uploadTargetURL = url;
		this.uploadQueryString = query_string;
	}

	function AddFileParam(file_id:String, name:String, value:String):Boolean {
		var file_index:Number = this.FindIndexInFileQueue(file_id);
		if (file_index >= 0) {
			var file_item:FileItem = FileItem(this.file_queue[file_index]);
			file_item.AddParam(name, value);
			return true;
		} else {
			return false;
		}
	}
	function RemoveFileParam(file_id:String, name:String):Boolean {
		var file_index:Number = this.FindIndexInFileQueue(file_id);
		if (file_index >= 0) {
			var file_item:FileItem = FileItem(this.file_queue[file_index]);
			file_item.RemoveParam(name);
			return true;
		} else {
			return false;
		}
	}

	/* *************************************************************
		File processing and handling functions
	*************************************************************** */
	//
	function StartFile(file_id:String):Void {
		// Only upload a file uploads are being processed.
		//   startFile could be called by a file cancellation even when we aren't currently uploading
		if (this.current_file_item != null) {
			this.Debug("StartFile(): Upload already in progress. Exiting.");
			return;
		}

		this.Debug("StartFile: File ID " + file_id);

		// Get the next file to upload
		if (!file_id) {
			this.single_upload = false;
			while (this.file_queue.length > 0 && this.current_file_item == null) {
				// Check that File Reference is valid (if not make sure it's deleted and get the next one on the next loop)
				this.current_file_item = FileItem(this.file_queue.shift());	// Cast back to a FileItem
				if (typeof(this.current_file_item) == "undefined") {
					this.current_file_item = null;
					continue;
				}
				// Check that we haven't exceeded the upload_limit, if so handle the file and go to the next.
				else if (completed_uploads >= this.fileUploadLimit && this.fileUploadLimit != 0) {
					this.Debug("StartFile(): Upload limit reached. Making callback and skipping file. File ID: " + this.current_file_item.id);
					ExternalInterface.call(this.error_Callback, this.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED, this.current_file_item.ToJavaScriptObject(), "The upload limit has been reached.");

					delete this.current_file_item;
					this.current_file_item = null;
					continue;
				}
			}
		} else {
			this.single_upload = true;
			var file_index:Number = this.FindIndexInFileQueue(file_id);
			if (file_index >= 0) {
				this.current_file_item = FileItem(this.file_queue[file_index]);
				this.file_queue[file_index] = null;
			} else {
				this.Debug("StartFile(): File ID not found in queue: " + file_id);
				ExternalInterface.call(this.error_Callback, this.ERROR_CODE_SPECIFIED_FILE_NOT_FOUND, null, "File ID not queued.");
			}
		}


		// Start the upload if we found an item to upload and we haven't passed the upload limit
		if (this.current_file_item != null) {
			// Build the query string
			var file_query_string:String = this.current_file_item.GetQueryString();

			var query_string_array:Array = new Array();
			if (this.uploadQueryString != "") query_string_array.push(this.uploadQueryString);
			if (file_query_string != "") query_string_array.push(file_query_string);
			var query_string:String = query_string_array.join("&");

			// Combine the full URL
			var upload_url:String = this.uploadTargetURL + (query_string != "" ? "?" : "") + query_string;

			// Begin the upload
			this.Debug("startFile(): File Reference found.  Starting upload to " + upload_url + ". File ID: " + this.current_file_item.id);
			if (this.current_file_item.file_reference.upload(upload_url)) {
				this.Debug("startFile(): Upload started.");
			} else {
				this.Debug("startFile(): Upload Failed.");
				ExternalInterface.call(this.error_Callback, this.ERROR_CODE_UPLOAD_FAILED, this.current_file_item.ToJavaScriptObject(), "Upload Failed.");
				delete this.current_file_item;
				this.current_file_item = null;
			}
		}
		// Otherwise we've would have looped through all the FileItems. This means the queue is empty)
		else {
			this.Debug("startFile(): No File Reference found.  All uploads must be complete, cancelled, or errored out.");
			this.Debug("startFile(): Ending upload run. Completed Uploads: " + this.completed_uploads);

			if (this.completed_uploads > 0) {
				this.Debug("startFile(): Queue is complete and at least one file has been uploaded.  Making QueueComplete callback.");
				ExternalInterface.call(this.queueComplete_Callback,  this.completed_uploads);
			}
		}
	}


	// Completes the file upload by deleting it's reference, advancing the pointer, and starting the next upload.
	function UploadComplete() {
		this.Debug("UploadComplete(): Upload complete. Removing File Reference and starting the next upload.");

		// Remove the pointer, the space in the array still exists
		delete this.current_file_item;
		this.current_file_item = null;
		this.queued_uploads--;

		// Start the next file upload
		if (!this.single_upload) {
			this.StartFile();
		}
	}


	/* *************************************************************
		Utility Functions
	*************************************************************** */
	// Check the size of the file against the allowed file size. If it is less the return TRUE. If it is too large return FALSE
	function CheckFileSize(file_item:FileItem):Number {
		if (file_item.file_reference.size == 0) {
			return -1;
		} else if (file_item.file_reference.size > (this.fileSizeLimit * 1000)) {
			return 1;
		} else {
			return 0;
		}
	}

	function Debug(msg:String):Void {
		if (this.debug) {
			var lines:Array = msg.split("\n");
			for (var i:Number=0; i < lines.length; i++) {
				lines[i] = "SWF DEBUG: " + lines[i];
			}
			ExternalInterface.call(this.debug_Callback, lines.join("\n"));
		}
	}

	function PrintDebugInfo():Void {
		var debug_info:String = "\n----- SWF DEBUG OUTPUT ----\n";
		debug_info += "ControlID:              " + this.controlID + "\n";
		debug_info += "Upload Target URL:      " + this.uploadTargetURL + "\n";
		debug_info += "Upload Query String:    " + this.uploadQueryString + "\n";
		debug_info += "Begin Upload on Queue:  " + this.beginUploadOnQueue + "\n";
		debug_info += "File Types:             " + this.fileTypes + "\n";
		debug_info += "File Types Description: " + this.fileTypesDescription + "\n";
		debug_info += "File Size Limit:        " + this.fileSizeLimit + "\n";
		debug_info += "File Upload Limit:      " + this.fileUploadLimit + "\n";
		debug_info += "File Queue Limit:       " + this.fileQueueLimit + "\n";
		debug_info += "----- END SWF DEBUG OUTPUT ----\n";

		this.Debug(debug_info);
	}

	function FindIndexInFileQueue(file_id:String):Number {
		for (var i:Number = 0; i<this.file_queue.length; i++) {
			if (FileItem(this.file_queue[i]).id == file_id) return i;
		}

		return null;
	}

}