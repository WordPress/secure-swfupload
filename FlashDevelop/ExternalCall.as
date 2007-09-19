package {
	import flash.net.FileReference;
	import flash.external.ExternalInterface;
	import flash.utils.Timer;
	import flash.events.TimerEvent;

	internal class ExternalCall
	{
		
		/*public function ExternalCall()
		{

		}
		*/
		public static function Simple(callback:String):void {
			var timer:Timer = new Timer(0, 1);
			timer.addEventListener(TimerEvent.TIMER, function():void { ExternalInterface.call(callback); });
			timer.start();
		}
		public static function FileQueued(callback:String, file_object:Object):void {
			var timer:Timer = new Timer(0, 1);
			timer.addEventListener(TimerEvent.TIMER, function():void { ExternalInterface.call(callback, file_object); });
			timer.start();
		}
		public static function FileQueueError(callback:String, error_code:Number, file_object:Object, message:String):void {
			var timer:Timer = new Timer(0, 1);
			timer.addEventListener(TimerEvent.TIMER, function():void { ExternalInterface.call(callback, error_code, file_object, message); });
			timer.start();
		}
		public static function FileDialogComplete(callback:String, num_files_selected:Number):void {
			var timer:Timer = new Timer(0, 1);
			timer.addEventListener(TimerEvent.TIMER, function():void { ExternalInterface.call(callback, num_files_selected); });
			timer.start();
		}
		public static function UploadProgress(callback:String, file_object:Object, bytes_loaded:uint, bytes_total:uint):void {
			var timer:Timer = new Timer(0, 1);
			timer.addEventListener(TimerEvent.TIMER, function():void { ExternalInterface.call(callback, file_object, bytes_loaded, bytes_total); });
			timer.start();
		}
		public static function UploadComplete(callback:String, file_object:Object, server_data:String):void {
			var timer:Timer = new Timer(0, 1);
			timer.addEventListener(TimerEvent.TIMER, function():void { ExternalInterface.call(callback, file_object, server_data); });
			timer.start();
		}
		public static function UploadError(callback:String, error_code:Number, file_object:Object, message:String):void {
			var timer:Timer = new Timer(0, 1);
			timer.addEventListener(TimerEvent.TIMER, function():void { ExternalInterface.call(callback, error_code, file_object, message); });
			timer.start();
		}
		public static function FileComplete(callback:String, file_object:Object):void {
			var timer:Timer = new Timer(0, 1);
			timer.addEventListener(TimerEvent.TIMER, function():void { ExternalInterface.call(callback, file_object); });
			timer.start();
		}
		public static function Debug(callback:String, message:String):void {
			var timer:Timer = new Timer(0, 1);
			timer.addEventListener(TimerEvent.TIMER, function():void { ExternalInterface.call(callback, message); });
			timer.start();
		}
		
	}
}