package {
	/*
	* Todo:  Remove the QueueComplete callback.  It doesn't make sense when allowing out of order uploads
	*    or when errors occur.  We still need something so let's add a function that returns the number of
	*    files that remain in the queue.  This number is incremented immediately before fileQueued is called
	*    and decremented immediately before fileDequeued is called.
	* 
	*    Actually a GetStatistic method might be more useful.  It could include Total selected files, Total queued,
	*    totals for each error type, total errors, total upload errors, total successful uploads, current queue count
	*
	* */

	import flash.display.Sprite;
	import flash.net.FileReferenceList;
	import flash.net.FileReference;
	import flash.net.FileFilter;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.URLVariables;
	import flash.events.*;
	import flash.external.ExternalInterface;
	import FileItem;

	public class SWFUpload extends Sprite {
		public static function main():void
		{
			var SWFUpload:SWFUpload = new SWFUpload();
		}


		private var fileBrowser:FileReferenceList = new FileReferenceList();

		private var file_queue:Array = new Array();		// holds a list of all items that are to be uploaded.
		private var current_file_item:FileItem = null;	// the item that is currently being uploaded.
		private var single_upload:Boolean = false;		// Indicates whether a single file is being upload or the entire queue
		private var completed_uploads:Number = 0;		// Tracks the uploads that have been completed (no errors, not cancelled, not too big)
		private var queued_uploads:Number = 0;			// Tracks the FileItems that are waiting to be uploaded.
		private var valid_file_extensions:Array = new Array();// Holds the parsed valid extensions.
		
		// Callbacks
		private var flashReady_Callback:String;
		private var dialogCancelled_Callback:String;
		private var fileQueued_Callback:String;
		private var fileValidation_Callback:String;
		private var fileProgress_Callback:String;
		private var fileCancelled_Callback:String;
		private var fileComplete_Callback:String;
		private var postFileComplete_Callback:String;
		private var queueComplete_Callback:String;
		private var queueStopped_Callback:String;
		private var error_Callback:String;
		private var debug_Callback:String;

		// Values passed in from the HTML
		private var controlID:String;
		private var uploadTargetURL:String;
		private var filePostName:String;
		private var uploadPostObject:Object;
		private var fileTypes:String;
		private var fileTypesDescription:String;
		private var fileSizeLimit:Number;
		private var fileUploadLimit:Number = 0;
		private var fileQueueLimit:Number = 0;
		private var beginUploadOnQueue:Boolean;
		private var validateFiles:Boolean;
		private var debugEnabled:Boolean;

		// Error code "constants"
		private var ERROR_CODE_HTTP_ERROR:Number 				= -10;
		private var ERROR_CODE_MISSING_UPLOAD_TARGET:Number 	= -20;
		private var ERROR_CODE_IO_ERROR:Number 					= -30;
		private var ERROR_CODE_SECURITY_ERROR:Number 			= -40;
		private var ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:Number 	= -50;
		private var ERROR_CODE_ZERO_BYTE_FILE:Number 			= -60;
		private var ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:Number		= -70;
		private var ERROR_CODE_UPLOAD_FAILED:Number 			= -80;
		private var ERROR_CODE_QUEUE_LIMIT_EXCEEDED:Number 		= -90;
		private var ERROR_CODE_SPECIFIED_FILE_NOT_FOUND:Number 	= -100;
		private var ERROR_CODE_INVALID_FILETYPE:Number          = -110;

		public function SWFUpload() {
			flash.system.Security.allowDomain("*");	// Allow uploading to any domain

			// Setup file FileReferenceList events
			this.fileBrowser.addEventListener(Event.SELECT, this.Select_Handler);
			this.fileBrowser.addEventListener(Event.CANCEL,  this.DialogCancelled_Handler);

			// Get the control ID
			this.controlID = root.loaderInfo.parameters.controlID;

			// **Configure the callbacks**
			// The JavaScript tracks all the instances of SWFUpload on a page.  We can access the instance
			// associated with this SWF file using the controlID.  Each callback is accessible by making
			// a call directly to it on our instance.  There is no error handling for undefined callback functions.
			// A developer would have to deliberately remove the default functions,set the variable to null, or remove
			// it from the init function.
			this.flashReady_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].flashReady";
			this.dialogCancelled_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].dialogCancelled";
			this.fileQueued_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].fileQueued";
			this.fileValidation_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].fileValidation";
			this.fileProgress_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].fileProgress";
			this.fileCancelled_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].fileCancelled";
			this.fileComplete_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].fileComplete";
			this.fileDequeued_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].fileDequeued";
			this.postFileComplete_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].postFileComplete";
			this.queueComplete_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].queueComplete";
			this.queueStopped_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].queueStopped";
			this.error_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].error";
			this.debug_Callback = "SWFUpload.instances[\"" + this.controlID + "\"].debug";

			// Get the Flash Vars
			this.uploadTargetURL = root.loaderInfo.parameters.uploadTargetURL;
			this.filePostName = root.loaderInfo.parameters.filePostName;
			this.fileTypes = root.loaderInfo.parameters.fileTypes;
			this.fileTypesDescription = root.loaderInfo.parameters.fileTypesDescription + " (" + this.fileTypes + ")";
			this.loadPostParams(root.loaderInfo.parameters.params);

			
			if (!this.filePostName) {
				this.filePostName = "Filedata";
			}
			if (!this.fileTypes) {
				this.fileTypes = "*.*";
			}
			if (!this.fileTypesDescription) {
				this.fileTypesDescription = "All Files";
			}
			
			this.LoadFileExensions(this.fileTypes);
			
			try {
				this.validateFiles = root.loaderInfo.parameters.validateFiles == "true" ? true : false;
			} catch (ex:Object) {
				this.validateFiles = false;
			}
			
			try {
				this.beginUploadOnQueue = root.loaderInfo.parameters.beginUploadOnQueue == "true" ? true : false;
			} catch (ex:Object) {
				this.beginUploadOnQueue = false;
			}

			try {
				this.debugEnabled = root.loaderInfo.parameters.debugEnabled == "true" ? true : false;
			} catch (ex:Object) {
				this.debugEnabled = false;
			}

			try {
				this.fileSizeLimit = Number(root.loaderInfo.parameters.fileSizeLimit);
				if (this.fileSizeLimit < 0) this.fileSizeLimit = 0;
			} catch (ex:Object) {
				this.fileSizeLimit = 0;
			}

			try {
				this.fileUploadLimit = Number(root.loaderInfo.parameters.fileUploadLimit);
				if (this.fileUploadLimit < 0) this.fileUploadLimit = 0;
			} catch (ex:Object) {
				this.fileUploadLimit = 0;
			}

			try {
				this.fileQueueLimit = Number(root.loaderInfo.parameters.fileQueueLimit);
				if (this.fileQueueLimit < 0) this.fileQueueLimit = 0;
			} catch (ex:Object) {
				this.fileQueueLimit = 0;
			}

			// There is no sense in allowing more files to be queued than is allowed to be uploaded
			if (this.fileQueueLimit > this.fileUploadLimit) this.fileQueueLimit = this.fileUploadLimit;

			try {
				ExternalInterface.addCallback("Browse", this.SelectFiles);
				ExternalInterface.addCallback("StartUpload", this.StartUpload);
				ExternalInterface.addCallback("StopUpload", this.StopUpload);
				ExternalInterface.addCallback("CancelUpload", this.CancelUpload);
				ExternalInterface.addCallback("CancelQueue", this.CancelQueue);
				ExternalInterface.addCallback("AddFileParam", this.AddFileParam);
				ExternalInterface.addCallback("RemoveFileParam", this.RemoveFileParam);

				ExternalInterface.addCallback("SetUploadTargetURL", this.SetUploadTargetURL);
				ExternalInterface.addCallback("SetPostParams", this.SetPostParams);
				ExternalInterface.addCallback("SetFileTypes", this.SetFileTypes);
				ExternalInterface.addCallback("SetFileSizeLimit", this.SetFileSizeLimit);
				ExternalInterface.addCallback("SetFileUploadLimit", this.SetFileUploadLimit);
				ExternalInterface.addCallback("SetFileQueueLimit", this.SetFileQueueLimit);
				ExternalInterface.addCallback("SetBeginUploadOnQueue", this.SetBeginUploadOnQueue);
				ExternalInterface.addCallback("SetValidateFiles", this.SetValidateFiles);
				ExternalInterface.addCallback("SetFilePostName", this.SetFilePostName);
				ExternalInterface.addCallback("SetDebugEnabled", this.SetDebugEnabled);
			} catch (ex:Error) {
				this.Debug("Callbacks where not set.");
			}

			this.Debug("SWFUpload Init Complete");
			this.PrintDebugInfo();

			// Do some feature detection
			if (flash.net.FileReferenceList && flash.net.FileReference && flash.net.URLRequest && flash.external.ExternalInterface && flash.external.ExternalInterface.available) {
				ExternalInterface.call(this.flashReady_Callback);
			} else {
				this.Debug("Feature Detection Failed");				
			}

		}

		/* *****************************************
		* FileReference Event Handlers
		* *************************************** */
		private function DialogCancelled_Handler(event:Event):void {
			this.Debug("Event: DialogCancel: File Dialog window cancelled.");

			ExternalInterface.call(this.dialogCancelled_Callback);
		}

		private function FileProgress_Handler(event:ProgressEvent):void {
			this.Debug("Event: Progress: File ID: " + this.current_file_item.id + ". Bytes: " + event.bytesLoaded + ". Total: " + event.bytesTotal);

			ExternalInterface.call(this.fileProgress_Callback, this.current_file_item.ToJavaScriptObject(), event.bytesLoaded, event.bytesTotal);
		}

		private function ServerData_Handler(event:DataEvent):void {
			this.Debug("Event: UploadCompleteData: File ID: " + this.current_file_item.id + " Data: " + event.data);
			
			this.completed_uploads++;

			ExternalInterface.call(this.fileComplete_Callback, this.current_file_item.ToJavaScriptObject(), event.data);

			this.UploadComplete();
			
		}

		private function HTTPError_Handler(event:HTTPStatusEvent):void {
			this.Debug("Event: HTTPStatus: File ID: " + this.current_file_item.id + ". HTTP Status: " + event.status + ".");

			ExternalInterface.call(this.error_Callback, this.ERROR_CODE_HTTP_ERROR, this.current_file_item.ToJavaScriptObject(), event.status);

			this.UploadComplete();
		}
		
		// Note: Flash Player does not support Uploads that require authentication. Attempting this will trigger an IO Error
		private function IOError_Handler(event:IOErrorEvent):void {
			if(!this.uploadTargetURL.length) {
				this.Debug("Event: IOError: File ID: " + this.current_file_item.id + ". Upload Backend string is empty.");
				ExternalInterface.call(this.error_Callback, this.ERROR_CODE_MISSING_UPLOAD_TARGET, this.current_file_item.ToJavaScriptObject(), event.text);
			} else {
				this.Debug("Event: IOError: File ID: " + this.current_file_item.id + ". IO Error.");
					ExternalInterface.call(this.error_Callback, this.ERROR_CODE_IO_ERROR, this.current_file_item.ToJavaScriptObject(), event.text);
			}

			this.UploadComplete();
		}

		private function SecurityError_Handler(event:SecurityErrorEvent):void {
			this.Debug("Event: SecurityError: File Number: " + this.current_file_item.id + ". Error:" + event.text);
			ExternalInterface.call(this.error_Callback, this.ERROR_CODE_SECURITY_ERROR, this.current_file_item.ToJavaScriptObject(), event.text);

			this.UploadComplete();
		}

		private function Select_Handler(event:Event):void {
			this.Debug("Event: Files Selected from Dialog. Processing file list");
			var file_reference_list:Array = this.fileBrowser.fileList;

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
					var is_valid_filetype:Boolean = this.CheckFileType(file_item);
					if(size_result == 0 && is_valid_filetype) {
						this.Debug("onSelect: File within size limit and of valid type. Adding to queue and making callback.");
						this.file_queue.push(file_item);
						this.queued_uploads++;
						ExternalInterface.call(this.fileQueued_Callback, file_item.ToJavaScriptObject());

					} 
					else if (!is_valid_filetype) {
						this.Debug("onSelect: File not of a valid type. Making error callback.");
						ExternalInterface.call(this.error_Callback, this.ERROR_CODE_INVALID_FILETYPE, file_item.ToJavaScriptObject(), "File is not an allowed file type.");
					}
					else if (size_result > 0) {
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
		private function SelectFiles():void {
			var allowed_file_types:String = "*.*";
			var allowed_file_types_description:String = "All Files";
			if (this.fileTypes.length > 0) allowed_file_types = this.fileTypes;
			if (this.fileTypesDescription.length > 0)  allowed_file_types_description = this.fileTypesDescription;

			this.fileBrowser.browse([new FileFilter(allowed_file_types_description, allowed_file_types)]);

			this.Debug("UploadFile: Browsing files. " + allowed_file_types);
		}


		// Starts uploading.  If a file_id is given then only that file is uploaded, otherwise the entire queue is uploaded.
		// If the file_id is not found no upload begins and an error is called back
		private function StartUpload(file_id:String = ""):void {
			if (this.current_file_item == null) {
				this.Debug("StartUpload(): Starting Upload. " + (file_id ?  "File ID:" + file_id : "Next file in queue"));
				this.StartFile(file_id);
			} else {
				this.Debug("StartUpload(): Upload run already in progress");
			}
		}

		// Cancel the current upload and stops.  Doesn't advance the upload pointer. Starting again will re-upload the current file.
		private function StopUpload():void {
			if (this.current_file_item != null) {
				// Cancel the upload and re-queue the FileItem
				this.current_file_item.file_reference.cancel();

				// Remove the event handlers
				this.current_file_item.file_reference.removeEventListener(ProgressEvent.PROGRESS, this.FileProgress_Handler);
				this.current_file_item.file_reference.removeEventListener(IOErrorEvent.IO_ERROR, this.IOError_Handler);
				this.current_file_item.file_reference.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, this.SecurityError_Handler);
				this.current_file_item.file_reference.removeEventListener(HTTPStatusEvent.HTTP_STATUS, this.HTTPError_Handler);
				this.current_file_item.file_reference.removeEventListener(DataEvent.UPLOAD_COMPLETE_DATA, this.ServerData_Handler);

				this.file_queue.unshift(this.current_file_item);
				var js_object:Object = this.current_file_item.ToJavaScriptObject();
				this.current_file_item = null;

				ExternalInterface.call(this.queueStopped_Callback, js_object);
				this.Debug("StopUpload(): upload stopped.");
			} else {
				this.Debug("StopUpload(): Upload run not in progress");
			}
		}

		// Cancels the upload specified by file_id
		private function CancelUpload(file_id:String):void {
			if (file_id) {
				if (this.current_file_item != null && this.current_file_item.id == file_id) {
					this.current_file_item.file_reference.cancel();
					ExternalInterface.call(this.fileCancelled_Callback, this.current_file_item.ToJavaScriptObject());

					this.Debug("CancelUpload(): Cancelling current upload");
					this.UploadComplete(); // <-- this advanced the upload to the next file, the next file will start uploading
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
						file_item = null;
						this.Debug("CancelUpload(): Cancelling queued upload");
					}
				}
			}

		}

		private function CancelQueue():void {
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
					file_item = null;
				}
			}

			// If we were uploading a file complete it's process
			if (this.current_file_item != null) {
				this.UploadComplete();
			}
		}

		private function AddFileParam(file_id:String, name:String, value:String):Boolean {
			var file_index:Number = this.FindIndexInFileQueue(file_id);
			if (file_index >= 0) {
				var file_item:FileItem = FileItem(this.file_queue[file_index]);
				
				file_item.AddParam(name, value);
				return true;
			} else {
				return false;
			}
		}
		private function RemoveFileParam(file_id:String, name:String):Boolean {
			var file_index:Number = this.FindIndexInFileQueue(file_id);
			if (file_index >= 0) {
				var file_item:FileItem = FileItem(this.file_queue[file_index]);
				file_item.RemoveParam(name);
				return true;
			} else {
				return false;
			}
		}
		
		private function SetUploadTargetURL(url:String):void {
			if (typeof(url) !== "undefined" && url !== "") {
				this.uploadTargetURL = url;
			}
		}
		
		private function SetPostParams(post_object:Object):void {
			if (typeof(post_object) !== "undefined" && post_object !== null) {
				this.uploadPostObject = post_object;
			}
		}
		
		private function SetFileTypes(types:String, description:String):void {
			this.fileTypes = types;
			this.fileTypesDescription = description;
			
			this.LoadFileExensions(this.fileTypes);
		}

		private function SetFileSizeLimit(bytes:Number):void {
			if (bytes < 0) bytes = 0;
			this.fileSizeLimit = bytes;
		}
		
		private function SetFileUploadLimit(file_upload_limit:Number):void {
			if (file_upload_limit < 0) file_upload_limit = 0;
			this.fileUploadLimit = file_upload_limit;
		}
		
		private function SetFileQueueLimit(file_queue_limit:Number):void {
			if (file_queue_limit < 0) file_queue_limit = 0;
			this.fileQueueLimit = file_queue_limit;
		}
		
		private function SetBeginUploadOnQueue(begin_upload_on_queue:Boolean):void {
			this.beginUploadOnQueue = begin_upload_on_queue;
		}
		
		private function SetValidateFiles(validate_files:Boolean):void {
			this.validateFiles = validate_files;
		}
		
		private function SetFilePostName(file_post_name:String):void {
			if (file_post_name != "") {
				this.filePostName = file_post_name;
			}
		}
		
		private function SetDebugEnabled(debug_enabled:Boolean):void {
			this.debugEnabled = debug_enabled;
		}
		
		/* *************************************************************
			File processing and handling functions
		*************************************************************** */
		//
		private function StartFile(file_id:String = ""):void {
			// Only upload a file uploads are being processed.
			//   startFile could be called by a file cancellation even when we aren't currently uploading
			if (this.current_file_item != null) {
				this.Debug("StartFile(): Upload already in progress. Exiting.");
				return;
			}

			this.Debug("StartFile: " + (file_id ? "File ID " + file_id : "Next file in queue"));

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
					else if (this.completed_uploads >= this.fileUploadLimit && this.fileUploadLimit != 0) {
						this.Debug("StartFile(): Upload limit reached. Making callback and skipping file. File ID: " + this.current_file_item.id);
						ExternalInterface.call(this.error_Callback, this.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED, this.current_file_item.ToJavaScriptObject(), "The upload limit has been reached.");

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


			// Start the upload if we found an item to upload
			if (this.current_file_item != null) {
				// Build the URLRequest
				var request:URLRequest = this.BuildRequest();
				
				// Begin the upload
				this.Debug("startFile(): File Reference found.  Starting upload to " + request.url + ". File ID: " + this.current_file_item.id);
				try {

					
					// Validate the file
					if (!this.validateFiles) {
						// Set the event handlers
						this.current_file_item.file_reference.addEventListener(ProgressEvent.PROGRESS, this.FileProgress_Handler);
						this.current_file_item.file_reference.addEventListener(IOErrorEvent.IO_ERROR, this.IOError_Handler);
						this.current_file_item.file_reference.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.SecurityError_Handler);
						this.current_file_item.file_reference.addEventListener(HTTPStatusEvent.HTTP_STATUS, this.HTTPError_Handler);
						
						this.current_file_item.file_reference.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, this.ServerData_Handler);
						/*// Set the appropriate server data/file complete event handler
						if (this.useServerDataEvent) {
							this.current_file_item.file_reference.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, this.ServerData_Handler);
						} else {
							this.current_file_item.file_reference.addEventListener(Event.COMPLETE, this.FileComplete_Handler);
						}*/
						
						// Upload the file
						this.current_file_item.file_reference.upload(request, this.filePostName, false);
					} else {
						if (ExternalInterface.call(this.fileValidation_Callback, this.current_file_item.ToJavaScriptObject())) {
							this.Debug("startFile(): File Validated.");
							
							// Set the event handlers
							this.current_file_item.file_reference.addEventListener(ProgressEvent.PROGRESS, this.FileProgress_Handler);
							this.current_file_item.file_reference.addEventListener(IOErrorEvent.IO_ERROR, this.IOError_Handler);
							this.current_file_item.file_reference.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.SecurityError_Handler);
							this.current_file_item.file_reference.addEventListener(HTTPStatusEvent.HTTP_STATUS, this.HTTPError_Handler);

							this.current_file_item.file_reference.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, this.ServerData_Handler);
							/*// Set the appropriate server data/file complete event handler
							if (this.useServerDataEvent) {
								this.current_file_item.file_reference.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, this.ServerData_Handler);
							} else {
								this.current_file_item.file_reference.addEventListener(Event.COMPLETE, this.FileComplete_Handler);
							}*/
							
							// Upload the file
							this.current_file_item.file_reference.upload(request, this.filePostName, false);
						} else {
							this.Debug("startFile(): Did not validate.");
							this.StopUpload();
						}
					}
				}
				catch (ex:Error) {
					this.Debug("startFile(): Upload Failed.");
					ExternalInterface.call(this.error_Callback, this.ERROR_CODE_UPLOAD_FAILED, this.current_file_item.ToJavaScriptObject(), ex.message);
					this.current_file_item = null;
					// NOTE: instead of just failing and making an error callback maybe we should call call UploadComplete
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
		private function UploadComplete():void {
			this.Debug("UploadComplete(): Upload complete. Removing File Reference and starting the next upload.");

			// Remove the pointer, the space in the array still exists
			var jsFileObj:Object = this.current_file_item.ToJavaScriptObject();
			this.current_file_item = null;
			this.queued_uploads--;

			ExternalInterface.call(this.postFileComplete_Callback, jsFileObj);
			
			// Start the next file upload
			if (!this.single_upload) {
				this.StartFile();
			}
		}


		/* *************************************************************
			Utility Functions
		*************************************************************** */
		// Check the size of the file against the allowed file size. If it is less the return TRUE. If it is too large return FALSE
		private function CheckFileSize(file_item:FileItem):Number {
			if (file_item.file_reference.size == 0) {
				return -1;
			} else if (this.fileSizeLimit != 0 && file_item.file_reference.size > (this.fileSizeLimit * 1000)) {
				return 1;
			} else {
				return 0;
			}
		}
		
		private function CheckFileType(file_item:FileItem):Boolean {
			// If no extensions are defined then a *.* was passed and the check is unnecessary
			if (this.valid_file_extensions.length == 0) {
				return true;				
			}
			
			var fileRef:FileReference = file_item.file_reference;
			var last_dot_index:Number = fileRef.name.lastIndexOf(".");
			var extension:String = "";
			if (last_dot_index >= 0) {
				extension = fileRef.name.substr(last_dot_index + 1).toLowerCase();
			}
			
			var is_valid_filetype:Boolean = false;
			for (var i:Number=0; i < this.valid_file_extensions.length; i++) {
				if (String(this.valid_file_extensions[i]) == extension) {
					is_valid_filetype = true;
					break;
				}
			}
			
			return is_valid_filetype;
		}

		private function BuildRequest():URLRequest {
			// Build the Post values
			var key:String;
			var post:URLVariables = new URLVariables();
			for (key in this.uploadPostObject) {
				this.Debug("Global Post Item: " + key + "=" + this.uploadPostObject[key]);				
				if (this.uploadPostObject.hasOwnProperty(key)) {
					post[key] = this.uploadPostObject[key];
				}
			}
			var file_post:Object = this.current_file_item.GetPostObject();
			for (key in file_post) {
				this.Debug("File Post Item: " + key + "=" + this.uploadPostObject[key]);				
				if (file_post.hasOwnProperty(key)) {
					post[key] = file_post[key];
				}
			}
			
			// Create the request object
			var request:URLRequest = new URLRequest();
			request.method = URLRequestMethod.POST;
			request.url = this.uploadTargetURL;
			request.data = post;
			
			return request;
		}
		
		private function Debug(msg:String):void {
			if (this.debugEnabled) {
				var lines:Array = msg.split("\n");
				for (var i:Number=0; i < lines.length; i++) {
					lines[i] = "SWF DEBUG: " + lines[i];
				}
				ExternalInterface.call(this.debug_Callback, lines.join("\n"));
			}
		}

		private function PrintDebugInfo():void {
			var debug_info:String = "\n----- SWF DEBUG OUTPUT ----\n";
			debug_info += "ControlID:              " + this.controlID + "\n";
			debug_info += "Upload Target URL:      " + this.uploadTargetURL + "\n";
			debug_info += "Begin Upload on Queue:  " + this.beginUploadOnQueue + "\n";
			debug_info += "Validate Files:         " + this.validateFiles + "\n";
			debug_info += "File Types String:      " + this.fileTypes + "\n";
			debug_info += "Parsed File Types:      " + this.valid_file_extensions.toString() + "\n";
			debug_info += "File Types Description: " + this.fileTypesDescription + "\n";
			debug_info += "File Size Limit:        " + this.fileSizeLimit + "\n";
			debug_info += "File Upload Limit:      " + this.fileUploadLimit + "\n";
			debug_info += "File Queue Limit:       " + this.fileQueueLimit + "\n";
			debug_info += "Post Params:\n";
			for (var key:String in this.uploadPostObject) {
				debug_info += "                        " + key + "=" + this.uploadPostObject[key] + "\n";
			}
			debug_info += "----- END SWF DEBUG OUTPUT ----\n";

			this.Debug(debug_info);
		}

		private function FindIndexInFileQueue(file_id:String):Number {
			for (var i:Number = 0; i<this.file_queue.length; i++) {
				var item:FileItem = this.file_queue[i];
				if (item != null && item.id == file_id) return i;
			}

			return -1;
		}
		
		// Parse the file extensions in to an array so we can validate them agains
		// the files selected later.
		private function LoadFileExensions(filetypes:String):void {
			var extensions:Array = filetypes.split(";");
			this.valid_file_extensions = new Array();

			for (var i:Number=0; i < extensions.length; i++) {
				var extension:String = String(extensions[i]);
				var dot_index:Number = extension.lastIndexOf(".");
				
				if (dot_index >= 0) {
					extension = extension.substr(dot_index + 1).toLowerCase();
				} else {
					extension = extension.toLowerCase();
				}
				
				// If one of the extensions is * then we allow all files
				if (extension == "*") {
					this.valid_file_extensions = new Array();
					break;
				}
				
				this.valid_file_extensions.push(extension);
			}
		}
		
		private function loadPostParams(param_string:String):void {
			var post_object:Object = {};

			if (param_string != null) {
				var name_value_pairs:Array = param_string.split("&");
				
				for (var i:Number = 0; i < name_value_pairs.length; i++) {
					var name_value:String = String(name_value_pairs[i]);
					var index_of_equals:Number = name_value.indexOf("=");
					if (index_of_equals > 0) {
						post_object[decodeURIComponent(name_value.substring(0, index_of_equals))] = decodeURIComponent(name_value.substr(index_of_equals + 1));
					}
				}
			}
			this.uploadPostObject = post_object;
		}

	}
}