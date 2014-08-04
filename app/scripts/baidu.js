//首先输入轻应用的ak
 clouda.lightInit({
      ak:"9ZBrTBViAjqGidGBZQjoGxgw",
      module:["device"]
  });

 var getDeviceId = function(){
     clouda.device.device.getImei({
             onfail : function(err){
                     // nothing
             },
             onsuccess : function(data){
                     window._imeiDeviceId = data;
             }
     });
 };
 getDeviceId();