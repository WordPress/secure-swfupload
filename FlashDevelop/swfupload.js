/**
 * SWFUpload 0.8.3 Revision 7.0 by Jacob Roberts, Sept 2007, linebyline.blogspot.com
 * -------- -------- -------- -------- -------- -------- -------- --------
 * SWFUpload is (c) 2006 Lars Huring and Mammon Media and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * See Changelog.txt for version history
 *
 */

/* *********** */
/* Constructor */
/* *********** */

var SWFUpload = function (init_settings) {
    // Remove background flicker in IE (read this: http://misterpixel.blogspot.com/2006/09/forensic-analysis-of-ie6.html)
    // This doesn't have anything to do with SWFUpload but can help your UI behave better
    try {
        document.execCommand('BackgroundImageCache', false, true);
    } catch (ex) {
        this.debugMessage(ex);
    }


    try {
        this.settings = {};
        this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
        this.movieElement = null;

        // Setup global control tracking
        SWFUpload.instances[this.movieName] = this;

        // Load the settings.  Load the Flash movie.
        this.initSettings(init_settings);
        this.loadFlash();

        if (this.debug_enabled)  {
            this.displayDebugInfo();
        }

    } catch (ex) {
        this.debugMessage(ex);
    }
};

/* *************** */
/* Static thingies */
/* *************** */
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.ERROR_CODE_HTTP_ERROR               = -10;
SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET    = -20;
SWFUpload.ERROR_CODE_IO_ERROR                 = -30;
SWFUpload.ERROR_CODE_SECURITY_ERROR           = -40;
SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT  = -50;
SWFUpload.ERROR_CODE_ZERO_BYTE_FILE           = -60;
SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED    = -70;
SWFUpload.ERROR_CODE_UPLOAD_FAILED            = -80;
SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED     = -90;
SWFUpload.ERROR_CODE_SPECIFIED_FILE_NOT_FOUND = -100;
SWFUpload.ERROR_CODE_INVALID_FILETYPE         = -110;
SWFUpload.ERROR_CODE_FILE_VALIDATION_FAILED   = -120;
SWFUpload.ERROR_CODE_FILE_CANCELLED           = -130;

SWFUpload.FILE_STATUS_QUEUED         = 0;
SWFUpload.FILE_STATUS_IN_PROGRESS    = 1;
SWFUpload.FILE_STATUS_ERROR          = 2;
SWFUpload.FILE_STATUS_COMPLETE       = 3;
SWFUpload.FILE_STATUS_CANCELLED      = 4;


/* ***************** */
/* Instance Thingies */
/* ***************** */
// init is a private method that ensures that all the object settings are set, getting a default value if one was not assigned.

SWFUpload.prototype.initSettings = function (init_settings) {

    // UI setting
    this.addSetting("ui_function",           init_settings.ui_function,           null);
    this.addSetting("ui_container_id",       init_settings.ui_container_id,       "");
    this.addSetting("degraded_container_id", init_settings.degraded_container_id, "");

    // Upload backend settings
    this.addSetting("upload_url",        init_settings.upload_url,        "");
    this.addSetting("file_post_name",    init_settings.file_post_name,    "Filedata");
    this.addSetting("post_params",       init_settings.post_params,       {});

    // File Settings
    this.addSetting("file_types",             init_settings.file_types,             "*.gif;*.jpg;*.png");
    this.addSetting("file_types_description", init_settings.file_types_description, "Common Web Image Formats (gif, jpg, png)");
    this.addSetting("file_size_limit",        init_settings.file_size_limit,        "1024");
    this.addSetting("file_upload_limit",      init_settings.file_upload_limit,      "0");
    this.addSetting("file_queue_limit",       init_settings.file_queue_limit,       "0");

    // Flash Settings
    this.addSetting("flash_url",          init_settings.flash_url,          "swfupload.swf");
    this.addSetting("flash_width",        init_settings.flash_width,        "1px");
    this.addSetting("flash_height",       init_settings.flash_height,       "1px");
    this.addSetting("flash_color",        init_settings.flash_color,        "#FFFFFF");

    // Debug Settings
    this.addSetting("debug_enabled", init_settings.debug,  false);
    this.debug_enabled = this.getSetting("debug_enabled");

    // Event Handlers
    this.flashReady         = this.retrieveSetting(init_settings.flash_ready_handler,          this.flashReady);
    this.fileDialogStart    = this.retrieveSetting(init_settings.file_dialog_start_handler,    this.fileDialogStart);
    this.fileQueued         = this.retrieveSetting(init_settings.file_queued_handler,          this.fileQueued);
    this.fileQueueError     = this.retrieveSetting(init_settings.file_queue_error_handler,     this.fileQueueError);
    this.fileDialogComplete = this.retrieveSetting(init_settings.file_dialog_complete_handler, this.fileDialogComplete);
    
	this.uploadStart    = this.retrieveSetting(init_settings.upload_start_handler,             this.uploadStart);
	this.uploadProgress = this.retrieveSetting(init_settings.upload_progress_handler,          this.uploadProgress);
    this.uploadError    = this.retrieveSetting(init_settings.upload_error_handler,             this.uploadError);
    this.uploadComplete = this.retrieveSetting(init_settings.upload_complete_handler,          this.uploadComplete);
    this.fileComplete   = this.retrieveSetting(init_settings.file_complete_handler,            this.fileComplete);

    this.debug          = this.retrieveSetting(init_settings.debug_handler,            this.debug);
};

// loadFlash is a private method that generates the HTML tag for the Flash
// It then adds the flash to the "target" or to the body and stores a
// reference to the flash element in "movieElement".
SWFUpload.prototype.loadFlash = function () {
    var html, target_element, container;

    // Make sure an element with the ID we are going to use doesn't already exist
    if (document.getElementById(this.movieName) !== null) {
        return false;
    }

    // Get the body tag where we will be adding the flash movie
    try {
		target_element = document.getElementsByTagName("body")[0];
		if (typeof(target_element) === "undefined" || target_element === null) {
			this.debugMessage('Could not find an element to add the Flash too. Failed to find element for "flash_container_id" or the BODY element.');
			return false;
		}
	} catch {
		return false;
	}

    // Append the container and load the flash
    container = document.createElement("div");
    container.style.width = this.getSetting("flash_width");
    container.style.height = this.getSetting("flash_height");

    target_element.appendChild(container);
    container.innerHTML = this.getFlashHTML();  // Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
};

// Generates the embed/object tags needed to embed the flash in to the document
SWFUpload.prototype.getFlashHTML = function () {
    var html = "";

    // Create Mozilla Embed HTML
    if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
        // Build the basic embed html
        html = '<embed type="application/x-shockwave-flash" src="' + this.getSetting("flash_url") + '" width="' + this.getSetting("flash_width") + '" height="' + this.getSetting("flash_height") + '"';
        html += ' id="' + this.movieName + '" name="' + this.movieName + '" ';
        html += 'bgcolor="' + this.getSetting("flash_color") + '" quality="high" menu="false" flashvars="';

        html += this.getFlashVars();

        html += '" />';

        // Create IE Object HTML
    } else {

        // Build the basic Object tag
        html = '<object id="' + this.movieName + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + this.getSetting("flash_width") + '" height="' + this.getSetting("flash_height") + '">';
        html += '<param name="movie" value="' + this.getSetting("flash_url") + '">';

        html += '<param name="bgcolor" value="' + this.getSetting("flash_color") + '" />';
        html += '<param name="quality" value="high" />';
        html += '<param name="menu" value="false" />';

        html += '<param name="flashvars" value="' + this.getFlashVars() + '" />';
        html += '</object>';
    }

    return html;
};

// This private method builds the parameter string that will be passed
// to flash.
SWFUpload.prototype.getFlashVars = function () {
    // Add the cookies to the backend string
    var upload_target_url = this.getSetting("upload_target_url");
    var param_string = this.buildParamString();

    // Build the parameter string
    var html = "";
    html += "movieName=" + encodeURIComponent(this.movieName);
    html += "&uploadURL=" + encodeURIComponent(upload_url);
    html += "&params=" + encodeURIComponent(param_string);
    html += "&filePostName=" + encodeURIComponent(this.getSetting("file_post_name"));
    html += "&fileTypes=" + encodeURIComponent(this.getSetting("file_types"));
    html += "&fileTypesDescription=" + encodeURIComponent(this.getSetting("file_types_description"));
    html += "&fileSizeLimit=" + encodeURIComponent(this.getSetting("file_size_limit"));
    html += "&fileUploadLimit=" + encodeURIComponent(this.getSetting("file_upload_limit"));
    html += "&fileQueueLimit=" + encodeURIComponent(this.getSetting("file_queue_limit"));
    html += "&debugEnabled=" + encodeURIComponent(this.getSetting("debug_enabled"));

    return html;
};

SWFUpload.prototype.getMovieElement = function () {
    if (typeof(this.movieElement) === "undefined" || this.movieElement === null) {
        this.movieElement = document.getElementById(this.movieName);

        // Fix IEs "Flash can't callback when in a form" issue (http://www.extremefx.com.ar/blog/fixing-flash-external-interface-inside-form-on-internet-explorer)
        // Removed because Revision 6 always adds the flash to the body (inside a containing div)
		// If you insist on adding the Flash file inside a Form then in IE you have to make you wait until the DOM is ready
		// and run this code to make the form's ID available from the window object so Flash and JavaScript can communicate.
        //if (typeof(window[this.movieName]) === "undefined" || window[this.moveName] !== this.movieElement) {
        //  window[this.movieName] = this.movieElement;
        //}
    }

    return this.movieElement;
};

SWFUpload.prototype.buildParamString = function () {
    var post_params = this.getSetting("post_params");
    var param_string_pairs = [];
    var i, value, name;

    // Retrieve the user defined parameters
    if (typeof(post_params) === "object") {
        for (name in post_params) {
            if (post_params.hasOwnProperty(name)) {
                if (typeof(post_params[name]) === "string" /*&& upload_params[name] != ""*/) {
                    param_string_pairs.push(encodeURIComponent(name) + "=" + encodeURIComponent(post_params[name]));
                }
            }
        }
    }

    return param_string_pairs.join("&");
};

// This private method "loads" the UI.  If a target was specified then it is assumed that "display: none" was set and
// it does a "display: block" so the UI is shown.  Then if a degraded_target is specified it hides it by setting "display: none"
// If you want SWFUpload to do something else then provide a "ui_function" setting and that will be called instead.
SWFUpload.prototype.showUI = function () {
    var ui_container_id, ui_target, degraded_container_id, degraded_target;
    try {
        ui_container_id = this.getSetting("ui_container_id");

        if (ui_container_id !== "") {
            ui_target = document.getElementById(ui_container_id);
            if (ui_target !== null) {
                ui_target.style.display = "block";

                // Now that the UI has been taken care of hide the degraded UI
                degraded_container_id = this.getSetting("degraded_container_id");
                if (degraded_container_id !== "") {
                    degraded_target = document.getElementById(degraded_container_id);
                    if (degraded_target !== null) {
                        degraded_target.style.display = "none";
                    }
                }
            }
        }

    } catch (ex) {
        this.debugMessage(ex);
    }
};

// Saves a setting.  If the value given is undefined or null then the default_value is used.
SWFUpload.prototype.addSetting = function (name, value, default_value) {
    if (typeof(value) === "undefined" || value === null) {
        this.settings[name] = default_value;
    } else {
        this.settings[name] = value;
    }

    return this.settings[name];
};

// Gets a setting.  Returns null if it wasn't found.
SWFUpload.prototype.getSetting = function (name) {
    if (typeof(this.settings[name]) === "undefined") {
        return "";
    } else {
        return this.settings[name];
    }
};

// Gets a setting, if the setting is undefined then return the default value
// This does not affect or use the interal setting object.
SWFUpload.prototype.retrieveSetting = function (value, default_value) {
    if (typeof(value) === "undefined" || value === null) {
        return default_value;
    } else {
        return value;
    }
};


// This method is used when debugging is enabled.
// It loops through all the settings and displays
// them in the debug Console.
SWFUpload.prototype.displayDebugInfo = function () {
    var key, debug_message = "";

    debug_message += "----- DEBUG OUTPUT ----\nID: " + this.getMovieElement().id + "\n";

    debug_message += this.outputObject(this.settings);

    debug_message += "----- DEBUG OUTPUT END ----\n";
    debug_message += "\n";

    this.debugMessage(debug_message);
};
SWFUpload.prototype.outputObject = function (object, prefix) {
    var output = "", key;

    if (typeof(prefix) !== "string") {
        prefix = "";
    }
    if (typeof(object) !== "object") {
        return "";
    }

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            if (typeof(object[key]) === "object") {
                output += (prefix + key + ": { \n" + this.outputObject(object[key], "\t" + prefix) + prefix + "}" + "\n");
            } else {
                output += (prefix + key + ": " + object[key] + "\n");
            }
        }
    }

    return output;
};

/* *****************************
    -- Flash control methods --
    Your UI should use these
    to operate SWFUpload
   ***************************** */

SWFUpload.prototype.selectFile = function () {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SelectFile) === "function") {
        try {
            movie_element.SelectFile();
        }
        catch (ex) {
            this.debugMessage("Could not call SelectFile: " + ex);
        }
    } else {
        this.debugMessage("Could not find Flash element");
    }

};

SWFUpload.prototype.selectFiles = function () {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SelectFiles) === "function") {
        try {
            movie_element.SelectFiles();
        }
        catch (ex) {
            this.debugMessage("Could not call SelectFile: " + ex);
        }
    } else {
        this.debugMessage("Could not find Flash element");
    }

};


/* Start the upload.  If a file_id is specified that file is uploaded. Otherwise the first
 * file in the queue is uploaded.  If no files are in the queue then nothing happens */
SWFUpload.prototype.startUpload = function (file_id) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.StartUpload) === "function") {
        try {
            movie_element.StartUpload(file_id);
        }
        catch (ex) {
            this.debugMessage("Could not call StartUpload: " + ex);
        }
    } else {
        this.debugMessage("Could not find Flash element");
    }

};

/* Cancels a the file upload.  You must specify a file_id */
SWFUpload.prototype.cancelUpload = function (file_id) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.CancelUpload) === "function") {
        try {
            movie_element.CancelUpload(file_id);
        }
        catch (ex) {
            this.debugMessage("Could not call CancelUpload");
        }
    } else {
        this.debugMessage("Could not find Flash element");
    }

};

// Stops the current upload.  The file is re-queued.  If nothing is currently uploading then nothing happens.
SWFUpload.prototype.stopUpload = function () {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.StopUpload) === "function") {
        try {
            movie_element.StopUpload();
        }
        catch (ex) {
            this.debugMessage("Could not call StopUpload");
        }
    } else {
        this.debugMessage("Could not find Flash element");
    }

};


SWFUpload.prototype.addFileParam = function (file_id, name, value) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.AddFileParam) === "function") {
        try {
            return movie_element.AddFileParam(file_id, name, value);
        }
        catch (ex) {
            this.debugMessage("Could not call AddFileParam");
        }
    } else {
        this.debugMessage("Could not find Flash element");
    }
};

SWFUpload.prototype.removeFileParam = function (file_id, name) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.RemoveFileParam) === "function") {
        try {
            return movie_element.RemoveFileParam(file_id, name);
        }
        catch (ex) {
            this.debugMessage("Could not call AddFileParam");
        }
    } else {
        this.debugMessage("Could not find Flash element");
    }

};

SWFUpload.prototype.setUploadURL = function (url) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SetUploadURL) === "function") {
        try {
            this.addSetting("upload_url", url);
            movie_element.SetUploadURL(this.getSetting("upload_url"));
        }
        catch (ex) {
            this.debugMessage("Could not call SetUploadURL");
        }
    } else {
        this.debugMessage("Could not find Flash element in setUploadURL");
    }
};

SWFUpload.prototype.setPostParams = function (param_object) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SetPostParams) === "function") {
        try {
            this.addSetting("post_params", param_object);
            movie_element.SetPostParams(this.getSetting("post_params"));
        }
        catch (ex) {
            this.debugMessage("Could not call SetPostParams");
        }
    } else {
        this.debugMessage("Could not find Flash element in SetPostParams");
    }
};

SWFUpload.prototype.setFileTypes = function (types, description) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SetFileTypes) === "function") {
        try {
            this.addSetting("file_types", types);
            this.addSetting("file_types_description", description);
            movie_element.SetFileTypes(this.getSetting("file_types"), this.getSetting("file_types_description"));
        }
        catch (ex) {
            this.debugMessage("Could not call SetFileTypes");
        }
    } else {
        this.debugMessage("Could not find Flash element in SetFileTypes");
    }
};

SWFUpload.prototype.setFileSizeLimit = function (file_size_limit) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SetFileSizeLimit) === "function") {
        try {
            this.addSetting("file_size_limit", file_size_limit);
            movie_element.SetFileSizeLimit(this.getSetting("file_size_limit"));
        }
        catch (ex) {
            this.debugMessage("Could not call SetFileSizeLimit");
        }
    } else {
        this.debugMessage("Could not find Flash element in SetFileSizeLimit");
    }
};

SWFUpload.prototype.setFileUploadLimit = function (file_upload_limit) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SetFileUploadLimit) === "function") {
        try {
            this.addSetting("file_upload_limit", file_upload_limit);
            movie_element.SetFileUploadLimit(this.getSetting("file_upload_limit"));
        }
        catch (ex) {
            this.debugMessage("Could not call SetFileUploadLimit");
        }
    } else {
        this.debugMessage("Could not find Flash element in SetFileUploadLimit");
    }
};

SWFUpload.prototype.setFileQueueLimit = function (file_queue_limit) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SetFileQueueLimit) === "function") {
        try {
            this.addSetting("file_queue_limit", file_queue_limit);
            movie_element.SetFileQueueLimit(this.getSetting("file_queue_limit"));
        }
        catch (ex) {
            this.debugMessage("Could not call SetFileQueueLimit");
        }
    } else {
        this.debugMessage("Could not find Flash element in SetFileQueueLimit");
    }
};

SWFUpload.prototype.setFilePostName = function (file_post_name) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SetFilePostName) === "function") {
        try {
            this.addSetting("file_post_name", file_post_name);
            movie_element.SetFilePostName(this.getSetting("file_post_name"));
        }
        catch (ex) {
            this.debugMessage("Could not call SetFilePostName");
        }
    } else {
        this.debugMessage("Could not find Flash element in SetFilePostName");
    }
};

SWFUpload.prototype.setDebugEnabled = function (debug_enabled) {
    var movie_element = this.getMovieElement();
    if (movie_element !== null && typeof(movie_element.SetDebugEnabled) === "function") {
        try {
            this.addSetting("debug_enabled", debug_enabled);
            this.debug_enabled = this.getSetting("debug_enabled");
            movie_element.SetDebugEnabled(this.getSetting("debug_enabled"));
        }
        catch (ex) {
            this.debugMessage("Could not call SetDebugEnabled");
        }
    } else {
        this.debugMessage("Could not find Flash element in SetDebugEnabled");
    }
};



/* *******************************
    Default Event Handlers
******************************* */
// This is the callback method that the Flash movie will call when it has been loaded and is ready to go.
// Calling this or showUI "manually" bypass the Flash Detection built in to SWFUpload.
// FlashReady should not generally be overwritten. Use a ui_function setting if you want to control the UI loading after the flash has loaded.
SWFUpload.prototype.flashReady = function () {
    var ui_function;
    try {
        this.debugMessage("Flash called back and is ready.");

        ui_function = this.getSetting("ui_function");
        if (typeof(ui_function) === "function") {
            ui_function.apply(this);
        } else {
            this.showUI();
        }
    } catch (ex) {
        this.debugMessage(ex);
    }
};


SWFUpload.prototype.fileDialogStart = function () {
	/* This is a chance to do something before the browse window opens */
};


SWFUpload.prototype.fileQueued = function (file) {
    /* Called when a file is successfully added to the queue. */
};


SWFUpload.prototype.fileQueueError = function (error_code, file, message) {
	/* Handle errors that occur when an attempt to queue a file fails */
}

SWFUpload.prototype.fileDialogComplete = function (files_selected) {
	/* Called after the file dialog has closed and the selected files have been queued.
		You could call startUpload here if you want the queued files to begin uploading immediately.
	*/
}

SWFUpload.prototype.uploadStart = function (file) {
	/* Gets called when a file upload is about to be started.  Return true to continue the upload. Return false to stop the upload. 
		If you return false then the uploadError callback is called and then fileComplete (like normal).
		
		This is a good place to do any file validation you need.
	*/
	return true;
}

// Called during upload as the file progresses
SWFUpload.prototype.fileProgress = function (file, bytes_complete) {
    this.debugMessage("File Progress: " + file.id + ", Bytes: " + bytes_complete);
};

// Called after a file is cancelled
SWFUpload.prototype.fileCancelled = function (file) {
    this.debugMessage("File Cancelled: " + file.id);
};

// Called when a file upload has completed
SWFUpload.prototype.fileComplete = function (file, server_data) {
    this.debugMessage("File Complete: " + file.id);
    if (typeof(server_data) !== "undefined") {
        this.debugMessage("Upload Response Data: " + server_data);
    }
};

// Called after the upload is complete but before the next upload begins.
SWFUpload.prototype.fileDequeued = function (file) {
    this.debugMessage("File Dequeued: " + file.id);
};

// Called when at least 1 file has been uploaded and there are no files remaining in the queue.
SWFUpload.prototype.queueComplete = function (file_upload_count) {
    this.debugMessage("Queue Complete. Files Uploaded:" + file_upload_count);
};

// Called when the upload is stopped.
SWFUpload.prototype.queueStopped = function (file) {
    this.debugMessage("Queue Stopped. File Stopped:" + file.id);
};

// Called by SWFUpload JavaScript and Flash flash functions when debug is enabled
SWFUpload.prototype.debug = function (message) {
    this.debugMessage(message);
};

// Called when an error occurs. Use errcode to determine which error occurred.
SWFUpload.prototype.error = function (errcode, file, msg) {
    try {
        switch (errcode) {
        case SWFUpload.ERROR_CODE_HTTP_ERROR:
            this.debugMessage("Error Code: HTTP Error, File name: " + file.name + ", Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
            this.debugMessage("Error Code: No backend file, File name: " + file.name + ", Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_IO_ERROR:
            this.debugMessage("Error Code: IO Error, File name: " + file.name + ", Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_SECURITY_ERROR:
            this.debugMessage("Error Code: Security Error, File name: " + file.name + ", Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
            this.debugMessage("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
            this.debugMessage("Error Code: Zero Byte File, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
            this.debugMessage("Error Code: Upload limit reached, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED:
            this.debugMessage("Error Code: Upload limit reached, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
            this.debugMessage("Error Code: Upload Initialization exception, File name: " + file.name + ", File size: " + file.size + ", Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_SPECIFIED_FILE_NOT_FOUND:
            this.debugMessage("Error Code: File ID specified for upload was not found, Message: " + msg);
            break;
        case SWFUpload.ERROR_CODE_INVALID_FILETYPE:
            this.debugMessage("Error Code: File extension is not allowed, Message: " + msg);
            break;
        default:
            this.debugMessage("Error Code: Unhandled error occured. Errorcode: " + errcode);
        }
    } catch (ex) {
        this.debugMessage(ex);
    }
};

/* **********************************
    Debug Console
    The debug console is a self contained, in page location
    for debug message to be sent.  The Debug Console adds
    itself to the body if necessary.

    The console is automatically scrolled as messages appear.
   ********************************** */
SWFUpload.prototype.debugMessage = function (message) {
    var exception_message, exception_values;

    if (this.debug_enabled) {
        if (typeof(message) === "object" && typeof(message.name) === "string" && typeof(message.message) === "string") {
            exception_message = "";
            exception_values = [];
            for (var key in message) {
                exception_values.push(key + ": " + message[key]);
            }
            exception_message = exception_values.join("\n");
            exception_values = exception_message.split("\n");
            exception_message = "EXCEPTION: " + exception_values.join("\nEXCEPTION: ");
            SWFUpload.Console.writeLine(exception_message);
        } else {
            SWFUpload.Console.writeLine(message);
        }
    }
};

SWFUpload.Console = {};
SWFUpload.Console.writeLine = function (message) {
    var console, documentForm;

    try {
        console = document.getElementById("SWFUpload_Console");

        if (!console) {
            documentForm = document.createElement("form");
            document.getElementsByTagName("body")[0].appendChild(documentForm);

            console = document.createElement("textarea");
            console.id = "SWFUpload_Console";
            console.style.fontFamily = "monospace";
            console.setAttribute("wrap", "off");
            console.wrap = "off";
            console.style.overflow = "auto";
            console.style.width = "700px";
            console.style.height = "350px";
            console.style.margin = "5px";
            documentForm.appendChild(console);
        }

        console.value += message + "\n";

        console.scrollTop = console.scrollHeight - console.clientHeight;
    } catch (ex) {
        alert("Exception: " + ex.name + " Message: " + ex.message);
    }
};
