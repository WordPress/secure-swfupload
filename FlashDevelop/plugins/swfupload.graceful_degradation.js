/* 
	SWFUpload Graceful Degradation Plug-in

	This plugin allows SWFUpload to display only if it is loaded successfully.  Otherwise a default form is displayed.
	
	This file should be loaded AFTER swfupload.js
	
	Usage:
	
	To use this plugin create to HTML containers. DIVs work well.  One should have the ID of "swfupload_container",
	the other should have the ID of "degraded_container".
	
	The "swfupload_container" should have its CSS "display" property set to "none".
	
	If SWFUpload loads successfully the "swfupload_container" will be displayed ("display" set to "block") and the
	"degraded_container" will be hidden ("display" set to "none").
	
	Using the customSettings object on your SWFUpload instance you can change the "swfupload_container" and "degraded_container" IDs used
	by this plugin:
	
	custom_settings : {
		swfupload_container_id : "mySwfUploadContainerID",
		degraded_container_id : "myDegradedContainerID"
	}
*/

var SWFUpload;
if (typeof(SWFUpload) === "function") {
	SWFUpload.flashReady = function () {
		try {
			this.debug("Flash called back and is ready.");

			if (typeof(this.swfUploadLoaded_handler) === "function") {
				this.gracefulDegradation();
				this.swfUploadLoaded_handler();
			}
		} catch (ex) {
			this.debug(ex);
		}
	};

	SWFUpload.prototype.gracefulDegradation = function () {
		var swfupload_container_id, swfupload_container, degraded_container_id, degraded_container;
		try {
			swfupload_container_id = this.customSettings["swfupload_container_id"];
			degraded_container_id = this.customSettings["degraded_container_id"];
			
			if (typeof(swfupload_container_id) !== "string" || swfupload_container_id === "") {
				swfupload_container_id = "swfupload_container";
			}
			if (typeof(degraded_container_id) !== "string" || degraded_container_id === "") {
				degraded_container_id = "degraded_container";
			}
			
			// Show the UI container
			swfupload_container = document.getElementById(swfupload_container_id);
			if (swfupload_container !== null) {
				swfupload_container.style.display = "block";

				// Now take care of hiding the degraded UI
				degraded_container = document.getElementById(degraded_container_id);
				if (degraded_container !== null) {
					degraded_container.style.display = "none";
				}
			}
		} catch (ex) {
			this.debug(ex);
		}
	};

}
