class Delegate
{
   static function Create(obj:Object, func:Function):Function
   {
      return function() { return func.apply(obj, arguments); };
   }
 
}