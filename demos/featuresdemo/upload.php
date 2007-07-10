<?php
	session_start();
	// I would handle the upload here if I wanted to do anything with it.
	
?>
<p>Upload Page</p>

<p>Here is the list of cookies that the agent sent:</p>
<ul>
	<?php
		foreach ($_COOKIE as $name => $value) {
			echo "<li>";
			echo htmlspecialchars($name) . "=" . htmlspecialchars($value);
			echo "</li>\n";
		}
	?>
</ul>
<p>Here is the list of query values:</p>
<ul>
	<?php
		foreach ($_GET as $name => $value) {
			echo "<li>";
			echo htmlspecialchars($name) . "=" . htmlspecialchars($value);
			echo "</li>\n";
		}
	?>
</ul>
<p>Here is the list of post values:</p>
<ul>
	<?php
		foreach ($_POST as $name => $value) {
			echo "<li>";
			echo htmlspecialchars($name) . "=" . htmlspecialchars($value);
			echo "</li>\n";
		}
	?>
</ul>
<p>Here is the list of the files uploaded:</p>
<ul>
	<?php
		foreach ($_FILES as $name => $value) {
			echo "<li>";
			echo htmlspecialchars($name) . "=" . htmlspecialchars($value["name"]);
			echo "</li>\n";
		}
	?>
</ul>

<p>Here is the current session id:</p>
<p><?php echo htmlspecialchars(session_id()); ?></p>
<p>Compare this to the session id displayed near the top of the Features Demo page. The Flash Player plug-in does not send the correct cookies in some browsers.</p>
