/* Demo Note:  This demo uses a FileProgress class that handles the UI for displaying the file name and percent complete.
The FileProgress class is not part of SWFUpload.
*/


/* **********************
   Event Handlers
   These are my custom event handlers to make my
   web application behave the way I went when SWFUpload
   completes different tasks.  These aren't part of the SWFUpload
   package.  They are part of my application.  Without these none
   of the actions SWFUpload makes will show up in my application.
   ********************** */
function fileQueued(file) {
	try {
		this.customSettings.tdFilesQueued.innerHTML = this.getStats().files_queued;
	} catch (ex) {
		this.debug(ex);
	}

}

function fileDialogComplete() {
	this.startUpload();
}

function uploadStart(file) {
	try {
		this.customSettings.tdCurrentSpeed.innerHTML = file.currentSpeed;
		this.customSettings.tdAverageSpeed.innerHTML = file.averageSpeed;
		this.customSettings.tdMovingAverageSpeed.innerHTML = file.movingAverageSpeed;
		this.customSettings.tdTimeRemaining.innerHTML = file.timeRemaining;
		this.customSettings.tdTimeElapsed.innerHTML = file.timeElapsed;
		this.customSettings.tdPercentUploaded.innerHTML = file.percentUploaded;
		this.customSettings.tdSizeUploaded.innerHTML = file.sizeUploaded;
	}
	catch (ex) {
		this.debug(ex);
	}
	
}

function uploadProgress(file, bytesLoaded, bytesTotal) {
	try {
		this.customSettings.tdCurrentSpeed.innerHTML = file.currentSpeed;
		this.customSettings.tdAverageSpeed.innerHTML = file.averageSpeed;
		this.customSettings.tdMovingAverageSpeed.innerHTML = file.movingAverageSpeed;
		this.customSettings.tdTimeRemaining.innerHTML = file.timeRemaining;
		this.customSettings.tdTimeElapsed.innerHTML = file.timeElapsed;
		this.customSettings.tdPercentUploaded.innerHTML = file.percentUploaded;
		this.customSettings.tdSizeUploaded.innerHTML = file.sizeUploaded;
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadSuccess(file, serverData) {
	try {
		this.customSettings.tdCurrentSpeed.innerHTML = file.currentSpeed;
		this.customSettings.tdAverageSpeed.innerHTML = file.averageSpeed;
		this.customSettings.tdMovingAverageSpeed.innerHTML = file.movingAverageSpeed;
		this.customSettings.tdTimeRemaining.innerHTML = file.timeRemaining;
		this.customSettings.tdTimeElapsed.innerHTML = file.timeElapsed;
		this.customSettings.tdPercentUploaded.innerHTML = file.percentUploaded;
		this.customSettings.tdSizeUploaded.innerHTML = file.sizeUploaded;
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadComplete(file) {
	this.customSettings.tdFilesQueued.innerHTML = this.getStats().files_queued;
	this.customSettings.tdFilesUploaded.innerHTML = this.getStats().successful_uploads;
	this.customSettings.tdErrors.innerHTML = this.getStats().upload_errors;
}
