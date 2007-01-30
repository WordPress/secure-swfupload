var upload1_target = "fsUploadProgress";
function uploadStart(fileObj) {
	try {
		// You might include code here that prevents the form from being submitted while the upload is in
		// progress.  Then you'll want to put code in the Queue Complete handler to "unblock" the form
		var progress = new FileProgress(fileObj, upload1_target);
		progress.SetStatus("Ready for Upload...");
		progress.ToggleCancel(true, upload);
		
		document.getElementById("btnCancel1").disabled = false;
	} catch (e) { /*Console.Writeln("Upload started");*/ }
		
}

function uploadProgress(fileObj, bytesLoaded) {

	try {
		var percent = Math.ceil((bytesLoaded / fileObj.size) * 100)

		var progress = new FileProgress(fileObj, upload1_target);
		progress.SetProgress(percent);
		progress.SetStatus("Uploading...");
	} catch (e) { /*Console.Writeln("Upload Progress: " + fileObj.name + " " + percent);*/ }
}

function uploadComplete(fileObj) {
	try {
		

		var progress = new FileProgress(fileObj, upload1_target);
		progress.SetComplete();
		progress.SetStatus("Complete.");
		progress.ToggleCancel(false);

	} catch (e) { /*Console.Writeln("Upload Complete: " + fileObj.name);*/ }
}

function uploadQueueComplete(fileObj) {
	try {
		document.getElementById("btnCancel1").disabled = true;
	} catch (e) { /* Console.Writeln("Queue Done"); */ }
}

function uploadDialogCancel() {
/*	try {
		Console.Writeln("Pressed Cancel");
	} catch (e) { Console.Writeln("Error displaying file cancel information"); }
*/
}

function uploadCancel(fileObj) {
	try {
		var progress = new FileProgress(fileObj, upload1_target);
		progress.SetCancelled();
		progress.SetStatus("Cancelled");
		progress.ToggleCancel(false);
	}
	catch (e) {}
}

function uploadError(error_code, fileObj, message) {
	try {
		var progress = new FileProgress(fileObj, upload1_target);
		progress.SetError();
		progress.ToggleCancel(false);

		switch(error_code) {
			case -10:	// HTTP error
				progress.SetStatus("Upload Error");
				//Console.Writeln("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
				break;
			case -20:	// No backend file specified
				progress.SetStatus("Configuration Error");
				//Console.Writeln("Error Code: No backend file, File name: " + file.name + ", Message: " + message);
				break;
			case -30:	// IOError
				// You might want to put code here that uses Javascript to fall back to a regular HTML upload.
				// When the SWFUpload has an IOError it seems to take a page refresh to get it to try again.
				progress.SetStatus("Server (IO) Error");
				
				//Console.Writeln("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
				break;
			case -40:	// Security error
				progress.SetStatus("Security Error");
				Console.Writeln("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
				break;
			case -50:	// Filesize too big
				progress.SetStatus("File is too big.");
				//Console.Writeln("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			case -60:	// File upload limit reached
				progress.SetStatus("Upload limit exceeded.");
				//Console.Writeln("Error Code: Upload limit exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
				break;
			default:
				progress.SetStatus("Unhandled Error");
				// EEK!
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