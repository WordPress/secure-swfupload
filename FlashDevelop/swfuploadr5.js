

/**
 * SWFUpload 0.8.3 Revision 5.2 by Jacob Roberts, April 2007, linebyline.blogspot.com
 * --------- Revision 5.2 -----------
 * = A little more code cleaning and variable renaming
 * + Changed from an array queue to a FIFO queue. This eliminates the "current_index" and
 *    should reduce some memory usage.
 * + Added out of order file uploading.  Call StartUpload(/file_id/).
 * + Added custom query_string parameters in addition to the cookies
 * + Added the ability to modify the URL, cookies, params and send to flash
 * + Added per file query_string params
 * + Added files queued limit.  Sometimes you may want the user to only queue one file at a time (or something)
 * + Fixed limits so a zero(0) value means unlimited.
 * --------- Revision 5 -------------
 * = More code cleaning.  Ported SWF to FlashDevelop. (Since my Flash Studio trial expired)
 *    The port to FlashDevelop is a big deal.  It significantly changes the code structure
 *    and could introduce bugs.  Also there have been reported issues with the FlashDevelop
 *    version from swfupload.mammon.se: Doesn't start when reloading in IE.  Doesn't start
 *    in Firefox if the SWF file is visible because of a page scroll.
 *    + I fixed the Firefox issue by removing the wmode attribute from the embed object.
 *    + I cannot reproduce the IE issue on my local machine (although I can reproduce it
 *       at swfupload.mammon.se)
 * + Event Handlers are now attached to the SWFUpload javascript object.  The SWF file
 *    now calls the handlers in the context of the SWFUpload object which means the "this"
 *    object inside the handler refers to the proper SWFUpload instance.
 * + Tested and Fixed upload target cookie attachment
 * = Cleaned up / renamed everything for clarity and consistancy
 * + File queuing is now subject to the upload limit.  If the user attempts to queue more files
 *    than allowed an error is returned and the files are not queued.
 * + Fixed misc bugs and text encodings.
 * + Added more debug info for the SWF file.
 * + SWF file now obeys the debug setting.
 * + Added SetUploadTargetURL function that allows you to "dynamically" change the upload target
 * + Added error code for zero byte file uploads which always return an IO error. The files are now rejected
 *    instead of being uploaded.
 * --------- Revision 4 -------------
 * = Cleaned up code.  Added comments. Reorganized. Added more try..catches. Removed old unused methods.
 * - Removed the 'create_ui' setting.  The UI is now completely up to the developer.
 * + Added upload_backend_cookies setting. Can set a string, or array of cookie names. These values will be
 *    passed as part of the upload_backend url
 *
 * = Changed QueueComplete event to only fire if at least one file has been successfully uploaded.
 * + Added "Stop Upload" feature.
 * = Revised the FLA file to clean things up, better handle errors, etc.
 * = Fixed a bug where cancelling the first upload would cause the remaining uploads to fire before calling
 *    "startUpload". This change is in the FLA.
 *
 * + Fixed a bug in the upload.swf that prevented further file processing after an error is returned.
 * + Added uploadLimit variable.  Only complete uploads are counted. Once the limit is reached the flash
 *      movie will not upload any more files. (The ability to select or queue many files is not affected
 *      by the upload limit)
 * + Added cancelQueue and cancelUpload methods.
 * + Added ID property to the FileObj in the upload.swf
 * + Added Upload and Queue settings
 * + Added methods for generating the flash HTML and inserting it into the DOM.
 * - Removed SWFObject
 * + Updated the upload.swf and added the "flashReady" event.  This will only call back
 *		for Flash 8 and above.  With this we don't need a flash version detect script.
 *		The script initializes the Flash then waits for the Callback to init the UI.
 * + Added seperate ui_target, degraded_target, create_ui settings. This allows fine control
 *  	over what parts of the GUI the script displays and hides
 * 
 * + Changed from a Static Class to an Instance (changed code/class structure)
 * + Added "flash_version" setting.  When set to zero the version check is skipped
 * + Added Debug Console.  The Instance class can't do document.write.
 * = De-obfuscated SWFObject a bit
 * - Removed standalone mode.
 * + Added "ui_target" setting. When non-blank the link is added.
 * + Added "flash_target" setting.  When blank the flash is appended to the <body> tag
 *		= This fixes ASP.Net not allowing the flash to be added to the Form
 * + Added error checking to the callSWF method
 *
 *
 * -------- -------- -------- -------- -------- -------- -------- --------
 * SWFUpload 0.7: Flash upload dialog - http://profandesign.se/swfupload/
 *
 * SWFUpload is (c) 2006 Lars Huring and Mammon Media and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * VERSION HISTORY
 * 0.5 - First release
 *
 * 0.6 - 2006-11-24
 * - Got rid of flash overlay
 * - SWF size reduced to 840b
 * - CSS-only styling of button
 * - Add upload to links etc.
 *
 * 0.7 - 2006-11-27
 * - Added filesize param and check in SWF
 *
 * 0.7.1 - 2006-12-01
 * - Added link_mode param for standalone links
 * if set to "standalone", createElement("a") won't run.
 * - Added link_text param if css isn't needed.
 * - Renamed cssClass to css_class for consistency
 *
 */

/* *********** */
/* Constructor */
/* *********** */
	function SWFUpload(init_settings) {
		// Remove background flicker in IE (read this: http://misterpixel.blogspot.com/2006/09/forensic-analysis-of-ie6.html)
		// try { document.execCommand('BackgroundImageCache', false, true); } catch(e) {}

		try {
			// Generate the control's ID. Setup global control tracking
			this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
			SWFUpload.instances[this.movieName] = this;

			// Load the settings.  Load the Flash movie.
			this._initSettings(init_settings);
			this._loadFlash();
			
			if (this.debug) this.DisplayDebugInfo();

			// Now nothing happens until Flash calls back to our flash_ready handler
		} catch (ex) {
		
		}
	};

/* *************** */
/* Static thingies */
/* *************** */
	SWFUpload.instances = new Object();
	SWFUpload.movieCount = 0;
	SWFUpload.ERROR_CODE_HTTP_ERROR 				= -10;
	SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET		= -20;
	SWFUpload.ERROR_CODE_IO_ERROR 					= -30;
	SWFUpload.ERROR_CODE_SECURITY_ERROR 			= -40;
	SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT 	= -50;
	SWFUpload.ERROR_CODE_ZERO_BYTE_FILE 			= -60;
	SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED		= -70;
	SWFUpload.ERROR_CODE_UPLOAD_FAILED				= -80;
	SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED		= -90;
	SWFUpload.ERROR_CODE_SPECIFIED_FILE_NOT_FOUND	= -100;
	
/* ***************** */
/* Instance Thingies */
/* ***************** */
	// init is a private method that ensures that all the object settings are set, getting a default value if one was not assigned.
	SWFUpload.prototype.InitSettings = function(init_settings) {
		this.settings = new Object();

		this.AddSetting("control_id", this.movieName);

		// UI setting
		this.AddSetting("ui_container_id", init_settings["ui_container_id"], "");
		this.AddSetting("degraded_container_id", init_settings["degraded_container_id"], "");

		// Upload backend settings
		this.AddSetting("upload_target_url", init_settings["upload_target_url"], "");
		this.AddSetting("upload_cookies", init_settings["upload_cookies"], []);
		this.AddSetting("upload_params", init_settings["upload_params"], {});
		
		// Upload settings
		this.AddSetting("begin_upload_on_queue", init_settings["begin_upload_on_queue"], true);
		this.AddSetting("file_types", init_settings["file_types"], "*.gif;*.jpg;*.png");
		this.AddSetting("file_types_description", init_settings["file_types_description"], "Common Web Image Formats (gif, jpg, png)");
		this.AddSetting("file_size_limit", init_settings["file_size_limit"], "1000");
		this.AddSetting("file_upload_limit", init_settings["file_upload_limit"], "0");
		this.AddSetting("file_queue_limit", init_settings["file_queue_limit"], "0");

		// Flash Settings
		this.AddSetting("flash_url", init_settings["flash_url"], "swfupload.swf");
		this.AddSetting("flash_container_element", init_settings["flash_container_element"], "");
		this.AddSetting("flash_width", init_settings["flash_width"], "0px");
		this.AddSetting("flash_height", init_settings["flash_height"], "0px");
		this.AddSetting("flash_color", init_settings["flash_color"], "#000000");
		
		// Debug Settings
		this.AddSetting("debug", init_settings["debug"],  false);
		this.debug = this.GetSetting("debug");
		
		// Event Handlers
		this.FlashReady = this.RetrieveSetting(init_settings["flash_ready_handler"], this.FlashReady);
		this.DialogCancelled = this.RetrieveSetting(init_settings["dialog_cancelled_handler"], this.DialogCancelled);
		this.FileQueued = this.RetrieveSetting(init_settings["file_queued_handler"], this.FileQueued);
		this.FileProgress = this.RetrieveSetting(init_settings["file_progress_handler"], this.FileProgress);
		this.FileCancelled = this.RetrieveSetting(init_settings["file_cancelled_handler"], this.FileCancelled);
		this.FileComplete = this.RetrieveSetting(init_settings["file_complete_handler"], this.FileComplete);
		this.QueueComplete = this.RetrieveSetting(init_settings["queue_complete_handler"], this.QueueComplete);
		this.Error = this.RetrieveSetting(init_settings["error_handler"], this.Error);
		this.Debug = this.RetrieveSetting(init_settings["debug_handler"], this.Debug);
	};

	// loadFlash is a private method that generates the HTML tag for the Flash
	// It then adds the flash to the "target" or to the body and stores a 
	// reference to the flash element in "movieElement".
	SWFUpload.prototype._loadFlash = function() {
		var html = "";
		// Create Mozilla Embed HTML
		if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
			// Build the basic embed html
			html = '<embed type="application/x-shockwave-flash" src="' + this.GetSetting("flash_url") + '" width="' + this.GetSetting("flash_width") + '" height="' + this.GetSetting("flash_height") + '"';
			html += ' id="' + this.movieName + '" name="' + this.movieName + '" ';
			html += 'bgcolor="' + this.GetSetting("flash_color") + '" quality="high" menu="false" flashvars="';
			
			html += this._getFlashVars();
			
			html += '" />';
		
		// Create IE Object HTML
		} else {
		
			// Build the basic Object tag
			html = '<object id="' + this.movieName + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + this.GetSetting("flash_width") + '" height="' + this.GetSetting("flash_height") + '">';
			html += '<param name="movie" value="' + this.GetSetting("flash_url") + '">';
			
			html += '<param name="bgcolor" value="' + this.GetSetting("flash_color") + '" />';
			html += '<param name="quality" value="high" />';
			html += '<param name="menu" value="false" />';
			
			html += '<param name="flashvars" value="'
			
			html += this._getFlashVars();
			
			html += '" /></object>';
		}
		
		
		// Build the DOM nodes to hold the flash;
		var container = document.createElement("div");
		container.style.width = this.GetSetting("flash_width");
		container.style.height = this.GetSetting("flash_height");
		container.style.overflow = "hidden";

		var target_element;
		var flash_container_element = this.GetSetting("flash_container_element");
		if (flash_container_element != "") {
			target_element = document.getElementById(flash_container_element);
		}
		// If the target wasn't found use the "BODY" element
		if (typeof(target_element) == "undefined" || target_element == null) {
			target_element = document.getElementsByTagName("body")[0];
		}
		// If all else fails then give up
		if (typeof(target_element) == "undefined" || target_element == null) {
			if (this.debug) Console.Writeln("Could not find an element to add the Flash too. Failed to find \"flash_container_element\" or the BODY element.");
			return false;
		}
		
		target_element.appendChild(container);

		container.innerHTML = html;
		
		this.movieElement = document.getElementById(this.movieName);	// Save a reference to the flash node so we can make calls to it.
		
		// Fix IEs "Flash can't callback when in a form" issue (http://www.extremefx.com.ar/blog/fixing-flash-external-interface-inside-form-on-internet-explorer)
		if (typeof(window[this.movieName]) == "undefined" || window[this.moveName] != this.movieElement) {
			window[this.movieName] = this.movieElement;
		}		
	};

	// This private method builds the parameter string that will be passed
	// to flash.
	SWFUpload.prototype._getFlashVars = function() {
		// Add the cookies to the backend string
		var upload_target_url = this.GetSetting("upload_target_url");
		var query_string = this._buildQueryString();
		
		// Build the parameter string		
		var html = "";
		html += "controlID=" + encodeURIComponent(this.GetSetting("control_id"));
		html += "&uploadTargetURL=" + encodeURIComponent(upload_target_url);
		html += "&uploadQueryString= + encodeURIComponent(query_string);
		html += "&beginUploadOnQueue=" + encodeURIComponent(this.GetSetting("begin_upload_on_queue"));
		html += "&fileTypes=" + encodeURIComponent(this.GetSetting("file_types"));
		html += "&fileTypesDescription=" + encodeURIComponent(this.GetSetting("file_types_description"));
		html += "&fileSizeLimit=" + encodeURIComponent(this.GetSetting("file_size_limit"));
		html += "&fileUploadLimit=" + encodeURIComponent(this.GetSetting("file_upload_limit"));
		html += "&fileQueueLimit=" + encodeURIComponent(this.GetSetting("file_queue_limit"));
		html += "&debug=" + encodeURIComponent(this.GetSetting("debug"));
		
		return html;
	};
	
	SWFUpload.prototype._buildQueryString = function() {
		var upload_cookies = this.GetSetting("upload_cookies");
		var upload_params = this.GetSettings("upload_params");
		var query_string_pairs = new Array();
		// Retrieve the cookies
		if (typeof(upload_cookies) == "object")
			for (var i=0; i < upload_cookies.length; i++) {
				if (typeof(upload_cookies[i]) == "string" && upload_cookies[i] != "") {
					var value = Cookie.Get(upload_cookies[i]);
					if (value != "") {
						query_string_pairs.push(encodeURIComponent(upload_cookies[i]) + "=" + encodeURIComponent(value));
					}
				}
			}
		}
		// Retrieve the user defined parameters
		if (typeof(upload_params) == "object") {
			for (var name in upload_params) {
				if (typeof(upload_params[name]) == "string" && upload_params[name] != "") {
					var value = upload_params[name]);
						query_string_pairs.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
				}
			}
		}
		
		return query_string_pairs.join("&");
	};
	
	// This private method "loads" the UI.  If a target was specified then it is assumed that "display: none" was set and
	// it does a "display: block" so the UI is shown.  Then if a degraded_target is specified it hides it by setting "display: none"
	SWFUpload.prototype._showUI = function() {
		try {

			var ui_container_id = this.GetSetting("ui_container_id");
			if(ui_container_id != "") {
				var ui_target = document.getElementById(ui_container_id);
				if (ui_target != null) {
					ui_target.style.display = "block";
				}
			}
			
			var degraded_container_id = this.GetSetting("degraded_container_id");
			if(degraded_container_id != "") {
				var degraded_target = document.getElementById(degraded_container_id);
				if (degraded_target != null) {
					degraded_target.style.display = "none";
				}
			}
			
		} catch (e) { }
	};
	
	// Saves a setting.  If the value given is undefined or null then the default_value is used.
	SWFUpload.prototype.AddSetting = function(name, value, default_value) {
		if (typeof(value) == "undefined" || value == null) {
			this.settings[name] = default_value;
		} else {
			this.settings[name] = value;
		}

		return this.settings[name];
	};
	
	// Gets a setting.  Returns null if it wasn't found.
	SWFUpload.prototype.GetSetting = function(name) {
		if (typeof(this.settings[name]) == "undefined") {
			return "";
		} else {
			return this.settings[name];
		}
	};

	// Gets a setting, if the setting is undefined then return the default value
	// This does not affect or use the interal setting object.
	SWFUpload.prototype.RetrieveSetting = function(value, default_value) {
		if (typeof(value) == "undefined" || value == null) {
			return default_value;			
		} else {
			return value;
		}
	};
	
	
	// This method is used when debugging is enabled.
	// It loops through all the settings and displays
	// them in the debug Console.
	SWFUpload.prototype.DisplayDebugInfo = function() {
		var debug_message = "----- DEBUG OUTPUT ----\n";
		
		debug_message += "ID: " + this.movieElement.id + "\n";
		
		// It's bad to use the for..in with an associative array, but oh well
		for (var key in this.settings) {
			debug_message += key + ": " + this.settings[key] + "\n";
		}
		
		debug_message += "----- DEBUG OUTPUT END ----\n";
		debug_message += "\n";
		
		Console.Writeln(debug_message);
	};

	// Sets the UploadTargetURL. To commit the change you must call UpdateUploadStrings.
	SWFUpload.prototype.SetUploadTargetURL = function(url) {
		if (typeof(url) == "string") {
			return this.AddSetting("upload_target_url", url, "");
		} else {
			return false;
		}
	}
	// Sets the upload_cookies array. To commit the change you must call UpdateUploadStrings.
	SWFUpload.prototype.SetUploadCookies = function(cookie_name_array) {
		if (typeof(cookie_name_array) == "array") {
			return this.AddSetting("upload_cookies", cookie_name_array, []);
		} else {
			return false;
		}
	}
	// Sets the upload params object. To commit the change you must call UpdateUploadStrings.
	SWFUpload.prototype.SetUploadParams = function(param_object) {
		if (typeof(param_object) == "object") {
			return this.AddSetting("upload_params", param_object, []);
		} else {
			return false;
		}
	}

	/* *****************************
	    -- Flash control methods --
	    Your UI should use these
	    to operate SWFUpload
	   ***************************** */

	SWFUpload.prototype.Browse = function() {
		if (this.movieElement != null) {
			try {
				this.movieElement.Browse();
			}
			catch (e) {
				if (this.debug) {
					Console.Writeln("Could not call Browse");
				}
			}
		} else { 
			if (this.debug) {
				Console.Writeln("Could not find Flash element");
			}
		}
		
    };
    
    // Begins the uploads (if begin_upload_on_queue is disabled)
    // The file_id is optional.  If specified only that file will be uploaded.  If not specified SWFUpload will
    // begin to process the queue.
    SWFUpload.prototype.StartUpload = function(file_id) {
		if (this.movieElement != null) {
			try {
				this.movieElement.StartUpload(file_id);
			}
			catch (e) {
				if (this.debug) {
					Console.Writeln("Could not call StartUpload");
				}
			}
		} else { 
			if (this.debug) {
				Console.Writeln("Could not find Flash element");
			}
		}

    };
    
    // Cancels the current uploading item.  If no item is uploading then nothing happens.
	SWFUpload.prototype.CancelUpload = function(file_id) {
		if (this.movieElement != null) {
			try {
				this.movieElement.CancelUpload(file_id);
			}
			catch (e) {
				if (this.debug) {
					Console.Writeln("Could not call CancelUpload");
				}
			}
		} else { 
			if (this.debug) {
				Console.Writeln("Could not find Flash element");
			}
		}

    };
    
    // Cancels all the files in the queue.  Including any current uploads.
	SWFUpload.prototype.CancelQueue = function() {
		if (this.movieElement != null) {
			try {
				this.movieElement.CancelQueue();
			}
			catch (e) {
				if (this.debug) {
					Console.Writeln("Could not call CancelQueue");
				}
			}
		} else { 
			if (this.debug) {
				Console.Writeln("Could not find Flash element");
			}
		}

    };

	// Stops the current upload.  The file is re-queued.  If nothing is currently uploading then nothing happens.
	SWFUpload.prototype.StopUpload = function() {
		if (this.movieElement != null) {
			try {
				this.movieElement.StopUpload();
			}
			catch (e) {
				if (this.debug) {
					Console.Writeln("Could not call StopUpload");
				}
			}
		} else { 
			if (this.debug) {
				Console.Writeln("Could not find Flash element");
			}
		}

    };
	
	// Updates the upload url strings in the Flash Movie
	// This must be called in order for calls to SetUploadTargetURL, SetUploadCookies, and SetUploadQueryString to take effect.
	SWFUpload.prototype.UpdateUploadStrings = function() {
		if (this.movieElement != null) {
			try {
				this.movieElement.SetUploadStrings(this.GetSetting("upload_target_url"), this._buildQueryString());
			}
			catch (e) {
				if (this.debug) {
					Console.Writeln("Could not call SetUploadStrings");
				}
			}
		} else { 
			if (this.debug) {
				Console.Writeln("Could not find Flash element");
			}
		}

    };
    
    SWFUpload.prototype.AddFileParam = function(file_id, name, value) {
		if (this.movieElement != null) {
			try {
				return this.movieElement.AddFileParam(file_id, encodeURIComponent(name), encodeURIComponent(value));
			}
			catch (e) {
				if (this.debug) {
					Console.Writeln("Could not call AddFileParam");
				}
			}
		} else { 
			if (this.debug) {
				Console.Writeln("Could not find Flash element");
			}
		}

    }
    SWFUpload.prototype.RemoveFileParam = function(file_id, name) {
		if (this.movieElement != null) {
			try {
				return this.movieElement.RemoveFileParam(file_id, encodeURIComponent(name));
			}
			catch (e) {
				if (this.debug) {
					Console.Writeln("Could not call AddFileParam");
				}
			}
		} else { 
			if (this.debug) {
				Console.Writeln("Could not find Flash element");
			}
		}

    }

/* *******************************
        Default Event Handlers
   ******************************* */
	// This is the callback method that the Flash movie will call when it has been loaded and is ready to go.
	// Calling this or _showUI "manually" bypass the Flash Detection built in to SWFUpload.
	// FlashReady should not generally be overwritten unless you wish to do your own thing (other than _showUI);
	SWFUpload.prototype.FlashReady = function() {
		try {
			if (this.debug) Console.Writeln("Flash called back and is ready.");
			
			this._showUI();
		} catch (ex) {}
	};
	
	// Called when the user cancels the File Browser window.
	SWFUpload.prototype.DialogCancelled = function() {
		if (this.debug) { Console.Writeln("Browse Dialog Cancelled."); }
	};
	
	// Called once for file the user selects
	SWFUpload.prototype.FileQueued = function(file) {
		if (this.debug) { Console.Writeln("File Queued: " + file.id); }
	};
	
	// Called during upload as the file progresses
	SWFUpload.prototype.FileProgress = function(file, bytes_complete) {
		if (this.debug) { Console.Writeln("File Progress: " + file.id + ", Bytes: " + bytes_complete); }
	};
	
	// Called after a file is cancelled
	SWFUpload.prototype.FileCancelled = function(file) {
		if (this.debug) { Console.Writeln("File Cancelled: " + file.id); }
	};
	
	// Called when a file upload has completed
	SWFUpload.prototype.FileComplete = function(file) {
		if (this.debug) { Console.Writeln("File Complete: " + file.id); }
	};
	
	// Called when at least 1 file has been uploaded and there are no files remaining in the queue.
	SWFUpload.prototype.QueueComplete = function(file_upload_count) {
		if (this.debug) { Console.Writeln("Queue Complete. Files Uploaded:" + file_upload_count); }
	};
	
	// Called by SWFUpload JavaScript and Flash flash functions when debug is enabled
	SWFUpload.prototype.Debug = function(message) {
		if (this.debug) { Console.Writeln(message); }
	}
	
	// Called when an error occurs. Use errcode to determine which error occurred.
	SWFUpload.prototype.Error = function(errcode, file, msg) {
		try {
			if (this.debug) {
				switch(errcode) {
					
					case SWFUpload.ERROR_CODE_HTTP_ERROR:
						Console.Writeln("Error Code: HTTP Error, File name: " + file.name + ", Message: " + msg);
						break;
					case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
						Console.Writeln("Error Code: No backend file, File name: " + file.name + ", Message: " + msg);
						break;
					case SWFUpload.ERROR_CODE_IO_ERROR:
						Console.Writeln("Error Code: IO Error, File name: " + file.name + ", Message: " + msg);
						break;
					case SWFUpload.ERROR_CODE_SECURITY_ERROR:
						Console.Writeln("Error Code: Security Error, File name: " + file.name + ", Message: " + msg);
						break;
					case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
						Console.Writeln("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
						break;
					case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
						Console.Writeln("Error Code: Zero Byte File, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
						break;
					case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
						Console.Writeln("Error Code: Upload limit reached, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
						break;
					case SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED:
						Console.Writeln("Error Code: Upload limit reached, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
						break;
					case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
						Console.Writeln("Error Code: Upload Initialization exception, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
					case SWFUpload.ERROR_CODE_SPECIFIED_FILE_NOT_FOUND:
						Console.Writeln("Error Code: File ID specified for upload was not found, Message: " + msg);
					default:
						Console.Writeln("Error Code: Unhandled error occured. Errorcode: " + errcode);
				}
			}
		} catch (ex) {}
	};
	



/* **********************************
	Cookies
   ********************************** */
if (typeof Cookie == "undefined") {
	var Cookie = new Object();
}

// Gets a cookie (http://www.w3schools.com/js/js_cookies.asp)
Cookie.Get = function(c_name)
{
	try {
		if (document.cookie.length > 0 && c_name != "")
		{
			var c_start=document.cookie.indexOf(c_name + "=");
			if (c_start != -1)
			{ 
				c_start = c_start + c_name.length + 1;
				var c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) c_end = document.cookie.length;
				
				return unescape(document.cookie.substring(c_start, c_end));
			} 
		}
	} catch (ex) { }

	return "";
};


/* **********************************
	Debug Console
	The debug console is a self contained, in page location
	for debug message to be sent.  The Debug Console adds
	itself to the body if necessary.
	
	The console is automatically scrolled as messages appear.
   ********************************** */
if (typeof Console == "undefined") {
	var Console = new Object();
}

Console.Writeln = function(value) {
	try {
		var console = document.getElementById("SWFUpload_Console");
		
		if (!console) {
			var documentForm = document.createElement("form");
			document.getElementsByTagName("body")[0].appendChild(documentForm);
			
			console = document.createElement("textarea");
			console.id = "SWFUpload_Console";
			console.style.whiteSpace = "pre";
			console.style.width = "700px";
			console.style.height = "350px";
			documentForm.appendChild(console);
		}
		
		console.value += value + "\n";
		
		console.scrollTop = console.scrollHeight - console.clientHeight;
	} catch (ex) {}
};
