<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>SWFUpload Revision v2.0 Application Demo (ASP.Net 2.0)</title>
	<link href="default.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="swfupload.js"></script>
	<script type="text/javascript" src="js/handlers.js"></script>
	<script type="text/javascript">
		var swfu;
		window.onload = function () {
			swfu = new SWFUpload({
				// Backend Settings
				upload_url: "upload.aspx",	// Relative to the SWF file
                post_params : {
                    "ASPSESSID" : "<%=Session.SessionID %>"
                },

				// File Upload Settings
				file_size_limit : "2048",	// 2MB
				file_types : "*.jpg",
				file_types_description : "JPG Images",
				file_upload_limit : "0",    // Zero means unlimited

				// Event Handler Settings - these functions as defined in Handlers.js
				//  The handlers are not part of SWFUpload but are part of my website and control how
				//  my website reacts to the SWFUpload events.
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				upload_progress_handler : uploadProgress,
				upload_error_handler : uploadError,
				upload_success_handler : uploadSuccess,
				upload_complete_handler : uploadComplete,

				// Flash Settings
				flash_url : "swfupload_f9.swf",	// Relative to this file

				custom_settings : {
					upload_target : "divFileProgressContainer"
				},

				// Debug Settings
				debug: false
			});
		}
	</script>
</head>
<body>
    <form id="form1" runat="server">
	    <div id="title" class="title">SWFUpload v2.0 Application Demo (ASP.Net 2.0)</div>
	    <div id="swfu_container" style="margin: 0px 10px;">
		    <div>
				<button id="btnBrowse" type="button" style="padding: 5px;" onclick="swfu.selectFiles(); this.blur();"><img src="images/page_white_add.png" style="padding-right: 3px; vertical-align: bottom;" alt="Add Icon" />Select Images <span style="font-size: 7pt;">(2 MB Max)</span></button>
		    </div>
		    <div id="divFileProgressContainer" style="height: 75px;"></div>
		    <div id="thumbnails"></div>
	    </div>
    </form>
</body>
</html>
