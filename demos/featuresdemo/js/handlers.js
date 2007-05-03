
function fileQueued(fileObj) {
	try {
		var queue_string = fileObj.id + ":  0%:" + fileObj.name;
		FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.options.length] = new Option(queue_string, fileObj.id);
		FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("File Queued: " + fileObj.id, "");
		FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("File Queued: " + fileObj.id, "");
	} catch (e) { Console.Writeln("Upload started: " + e); }

}

function fileProgress(fileObj, bytesLoaded) {

	try {
		var percent = Math.ceil((bytesLoaded / fileObj.size) * 100)
		if (percent < 10) percent = "  " + percent;
		else if (percent < 100) percent = " " + percent;

		FeaturesDemo.selQueue.value = fileObj.id;
		var queue_string = fileObj.id + ":" + percent + "%:" + fileObj.name;
		FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.selectedIndex].text = queue_string;


		FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("File Progress: " + bytesLoaded, "");
	} catch (e) { Console.Writeln("Upload Progress: " + fileObj.name + " " + percent + ": " + e); }
}

function fileComplete(fileObj) {
	try {
		var queue_string = fileObj.id + ":Done:" + fileObj.name;
		FeaturesDemo.selQueue.value = fileObj.id;
		FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.selectedIndex].text = queue_string;

		FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("File Complete: " + fileObj.id, "");
		FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("File Complete: " + fileObj.id, "");
	} catch (e) { Console.Writeln("Upload Complete: " + fileObj.name + ": " + e); }
}

function queueComplete() {
	try {
		FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("Queue Complete", "");
	} catch (e) { Console.Writeln("Queue Complete: " + e); }
}

function queueStopped(fileObj) {
	try {
		var queue_string = fileObj.id + ":  0%:" + fileObj.name;

		FeaturesDemo.selQueue.value = fileObj.id;
		FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.selectedIndex].text = queue_string;

		FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("File Stopped: " + fileObj.id, "");
		FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("Queue Stopped", "");
	} catch (e) { Console.Writeln("Queue Stopped: " + e); }
}
function fileDialogCancelled() {
	try {
		FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("File Dialog Cancelled", "");
	} catch (e) { Console.Writeln("Error displaying file cancel information: " + e); }
}

function fileCancelled(fileObj) {
	try {
		FeaturesDemo.selQueue.value = fileObj.id;
		var queue_string = fileObj.id + ":----:" + fileObj.name;
		FeaturesDemo.selQueue.options[FeaturesDemo.selQueue.selectedIndex].text = queue_string;


		FeaturesDemo.selEventsQueue.options[FeaturesDemo.selEventsQueue.options.length] = new Option("File Cancelled " + fileObj.id, "");
		FeaturesDemo.selEventsFile.options[FeaturesDemo.selEventsFile.options.length] = new Option("File Cancelled " + fileObj.id, "");
	}
	catch (e) { Console.Writeln("File Cancelled: " + e); }
}

function uploadError(error_code, fileObj, message) {
	try {
		var error_name = "";
		switch(error_code) {
			case SWFUpload.ERROR_CODE_QUEUE_LIMIT_EXCEEDED:
				error_name = "QUEUE LIMIT EXCEEDED";
			break;
			case SWFUpload.ERROR_CODE_HTTP_ERROR:
				error_name = "HTTP ERROR";
			break;
			case SWFUpload.ERROR_CODE_MISSING_UPLOAD_TARGET:
				error_name = "MISSING UPLOAD TARGET";
			break;
			case SWFUpload.ERROR_CODE_UPLOAD_FAILED:
				error_name = "UPLOAD FAILED";
			break;
			case SWFUpload.ERROR_CODE_IO_ERROR:
				error_name = "IO ERROR";
			break;
			case SWFUpload.ERROR_CODE_SECURITY_ERROR:
				error_name = "SECURITY ERROR";
			break;
			case SWFUpload.ERROR_CODE_FILE_EXCEEDS_SIZE_LIMIT:
				error_name = "FILE EXCEEDS SIZE LIMIT";
			break;
			case SWFUpload.ERROR_CODE_ZERO_BYTE_FILE:
				error_name = "ZERO BYTE FILE";
			break;
			case SWFUpload.ERROR_CODE_UPLOAD_LIMIT_EXCEEDED:
				error_name = "UPLOAD LIMIT EXCEEDED";
			break;
			default:
				error_name = "UNKNOWN";
			break;
		}

		var error_string = error_name + ":File ID: " + (typeof(fileObj) == "object" && fileObj != null ? fileObj.id : "na") + ":" + message;
		FeaturesDemo.selEventsError.options[FeaturesDemo.selEventsError.options.length] = new Option(error_string, "");

	} catch (e) { Console.Writeln("uploadError: " + e);}
}

