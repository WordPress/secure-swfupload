package {
	import flash.net.FileReference;

	internal class FileItem
	{
		private static var file_id_sequence:Number = 0;		// tracks the file id sequence

		private var postObject:Object;
		public var file_reference:FileReference;
		public var id:String;
		
		public function FileItem(file_reference:FileReference, control_id:String)
		{
			this.postObject = {};
			this.file_reference = file_reference;
			this.id = control_id + "_" + (FileItem.file_id_sequence++);		
			
		}
		
		public function AddPostParam(name:String, value:String):void {
			this.postObject[name] = value;
		}
		
		public function RemovePostParam(name:String):void {
			delete this.postObject[name];
		}
		
		public function GetPostObject():Object {
			return this.postObject;
		}
		
		// Create the simply file object that is passed to the browser
		public function ToJavaScriptObject():Object {
			var file_object:Object = { id: this.id, name: this.file_reference.name, size: this.file_reference.size, type: this.file_reference.type, creationdate: this.file_reference.creationDate };
			file_object.post = this.GetPostObject();			
		
			return file_object;
		}
		
		public function toString():String {
			return "FileItem - ID: " + this.id;
		}
	}
}