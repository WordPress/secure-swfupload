function fileBrowse() {
	var txtFileName = document.getElementById("txtFileName");
	txtFileName.value = "";

	this.cancelQueue();
	this.browse();
}

function fileValidation(fileObj) {
	// Validation is disabled in this demo, but if it were enabled
	// all files would validate because this returns true
	return true;
}

function fileQueued(fileObj) {
	try {
		var txtFileName = document.getElementById("txtFileName");
		txtFileName.value = fileObj.name;
	} catch (e) { /*Console.Writeln("Upload started");*/ }

}

function fileProgress(fileObj, bytesLoaded) {

	try {
		var percent = Math.ceil((bytesLoaded / fileObj.size) * 100)

		var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
		progress.SetProgress(percent);
		progress.SetStatus("Uploading...");
	} catch (e) { /*Console.Writeln("Upload Progress: " + fileObj.name + " " + percent);*/ }
}

function fileComplete(fileObj, server_data) {
	try {


		var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
		progress.SetComplete();
		progress.SetStatus("Complete.");
		progress.ToggleCancel(false);

	} catch (e) { /*Console.Writeln("Upload Complete: " + fileObj.name);*/ }
}

function queueComplete(fileObj) {
	try {
		uploadDone();
	} catch (e) { /* Console.Writeln("Queue Done"); */ }
}

function fileDialogCancel() {
/*	try {
		Console.Writeln("Pressed Cancel");
	} catch (e) { Console.Writeln("Error displaying file cancel information"); }
*/
}

function uploadCancelled(fileObj) {
	try {
		//var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
		//progress.SetCancelled();
		//progress.SetStatus("Cancelled");
		//progress.ToggleCancel(false);
	}
	catch (e) {}
}

function uploadError(error_code, fileObj, message) {
	try {
		// Handle this error separately because we don't want to create a FileProgress element for it.
		switch(error_code) {
			case SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED:
				alert("You have attempted to queue too many files.\n" + (message == 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
				return;
				break;
			case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
				alert("There was a configuration error.  You will not be able to upload a resume at this time.");
				this.debugMessage("Error Code: No backend file, File name: " + file.name + ", Message: " + message);
				return;
				break;
			case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
				alert("The file you selected is too big.");
				this.debugMessage("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				return;
				break;
			case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
				alert("The file you select is empty.  Please select another file.");
				this.debugMessage("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				return;
				break;
			case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
				alert("You may only upload 1 file.");
				this.debugMessage("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				return;
				break;
			case SWFUpload.ERROR_CODE_INVALID_FILETYPE:
				alert("The file you choose is not an allowed file type.");
				this.debugMessage("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				return;
				break;
			default:
				alert("An error occurred in the upload. Try again later.");
				this.debugMessage("Error Code: " + error_code + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				return;
				break;
		}

		var progress = new FileProgress(fileObj, this.getSetting("progress_target"));
		progress.SetError();
		progress.ToggleCancel(false);

		switch(error_code) {
			case SWFUpload.ERROR_CODE_HTTP_ERROR:
				progress.SetStatus("Upload Error");
				this.debugMessage("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
				break;
			case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
				progress.SetStatus("Upload Failed.");
				this.debugMessage("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			case SWFUpload.ERROR_CODE_IO_ERROR:
				progress.SetStatus("Server (IO) Error");
				this.debugMessage("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
				break;
			case SWFUpload.ERROR_CODE_SECURITY_ERROR:
				progress.SetStatus("Security Error");
				this.debugMessage("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
				break;
		}
	} catch (e) {}
}

function FileProgress(fileObj, target_id) {
		this.file_progress_id = fileObj.id;
		//var file_progress_id = (fileObj.name + fileObj.size).replace(/[^a-zA-Z0-9_]/g, "");

		this.fileProgressElement = document.getElementById(this.file_progress_id);
		if (!this.fileProgressElement) {
			this.fileProgressElement = document.createElement("div");
			this.fileProgressElement.className = "progressContainer";
			this.fileProgressElement.id = this.file_progress_id;

			var progressCancel = document.createElement("a");
			progressCancel.className = "progressCancel";
			progressCancel.href = "#";
			progressCancel.style.visibility = "hidden";
			progressCancel.appendChild(document.createTextNode(" "));

			var progressText = document.createElement("div");
			progressText.className = "progressName";
			progressText.appendChild(document.createTextNode(fileObj.name));

			var progressBar = document.createElement("div");
			progressBar.className = "progressBarInProgress";

			var progressStatus = document.createElement("div");
			progressStatus.className = "progressBarStatus";
			progressStatus.innerHTML = "&nbsp;";

			this.fileProgressElement.appendChild(progressCancel);
			this.fileProgressElement.appendChild(progressText);
			this.fileProgressElement.appendChild(progressStatus);
			this.fileProgressElement.appendChild(progressBar);

			document.getElementById(target_id).appendChild(this.fileProgressElement);

		}

}
FileProgress.prototype.SetStart = function() {
		this.fileProgressElement.className = "progressContainer";
		this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
		this.fileProgressElement.childNodes[3].style.width = "";
}

FileProgress.prototype.SetProgress = function(percentage) {
		this.fileProgressElement.className = "progressContainer green";
		this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
		this.fileProgressElement.childNodes[3].style.width = percentage + "%";
}
FileProgress.prototype.SetComplete = function() {
		this.fileProgressElement.className = "progressContainer blue";
		this.fileProgressElement.childNodes[3].className = "progressBarComplete";
		this.fileProgressElement.childNodes[3].style.width = "";


}
FileProgress.prototype.SetError = function() {
		this.fileProgressElement.className = "progressContainer red";
		this.fileProgressElement.childNodes[3].className = "progressBarError";
		this.fileProgressElement.childNodes[3].style.width = "";
}
FileProgress.prototype.SetCancelled = function() {
		this.fileProgressElement.className = "progressContainer";
		this.fileProgressElement.childNodes[3].className = "progressBarError";
		this.fileProgressElement.childNodes[3].style.width = "";
}
FileProgress.prototype.SetStatus = function(status) {
		this.fileProgressElement.childNodes[2].innerHTML = status;
}

FileProgress.prototype.ToggleCancel = function(show, upload_obj) {
		this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
		if (upload_obj) {
			var file_id = this.file_progress_id;
			this.fileProgressElement.childNodes[0].onclick = function() { upload_obj.cancelUpload(file_id); return false; };
		}
}