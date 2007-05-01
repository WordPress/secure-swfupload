import flash.net.FileReference;

class FileItem
{
	private static var file_id_sequence:Number = 0;		// tracks the file id sequence

	private var paramArray:Array;
	public var file_reference:FileReference;
	public var id:String;
	
	function FileItem(file_reference:FileReference, control_id:String)
	{
		this.paramArray = new Array();
		this.file_reference = file_reference;
		this.id = id + "_" + (FileItem.file_id_sequence++);		
		
	}
	
	function AddParam(name:String, value:String):Void {
		this.paramArray[name] = value;
	}
	
	function RemoveParam(name:String):Void {
		delete this.paramArray[name];
	}
	
	function GetQueryString():String {
		var name_value_pairs:Array = new Array();
		for (var key:String in this.paramArray) {
			name_value_pairs.push(key + "=" + this.paramArray[key]);
		}
		
		return name_value_pairs.join("&");
	}
	
	// Create the simply file object that is passed to the browser
	function ToJavaScriptObject():Object {
		var file_object:Object = { id: this.id, name: this.file_reference.name, size: this.file_reference.size, type: this.file_reference.type, creationdate: this.file_reference.creationDate };
		file_object.data = new Array();
		
		// include the undeleted data items
		for (var key:String in this.paramArray) {
			if (typeof(this.paramArray[key]) != "undefined") {
				file_object.data[key] = this.paramArray[key];
			}
		}
		
		return file_object;
	}
}
