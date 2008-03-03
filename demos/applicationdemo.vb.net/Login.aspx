<%@ Page Language="VB" AutoEventWireup="true" CodeFile="Login.aspx.vb" Inherits="Login" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>SWFUpload Revision v2.1.0 Application Demo (ASP.Net VB.Net 2.0)</title>
	<link href="default.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <form id="form1" runat="server">
    <div id="title" class="title">SWFUpload v2.1.0 Application Demo (ASP.Net 2.0)</div>
    <div style="margin-left: 50px;">
		<table>
			<tr>
				<td>User Name:</td>
				<td><asp:TextBox ID="txtUserName" runat="server" Text="demo" /></td>
			</tr>
			<tr>
				<td>Password:</td>
				<td><asp:TextBox ID="txtPassword" runat="server" Text="demo" /></td>
			</tr>
		</table>
		<asp:Button ID="btnLogin" runat="server" Text="Login" />
    </div>
    </form>
</body>
</html>
