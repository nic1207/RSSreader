/*
 * jquery.Storage
 * A jQuery plugin to make localStorage easy and managable to use
 *
 * Copyright (c) Brandon Hicks (Tarellel)
 *
 * Version: 1.0.0a (12/6/10)
 * Requires: jQuery 1.4
 *
 *
 */
(function(jQuery) {
  // validate if the visiting browser supports localStorage
  var supported = true;
  var keyMeta = 'rssfeeds_';
  var now_index = 0;
  //var localStorage === window.localStorage
  if (typeof localStorage == 'undefined' || typeof JSON == 'undefined'){
      supported = false;
  }

  // errors produced by localStorage
  this.storageError = function(error){
    switch(error){
      // current browser/device is not supported
      case 'SUPPORTED':
        alert("Your browser does not support localStorage!");
        break;

      // browsers database quota is full
      case 'QUOTA':
        alert("Your storage quota is currently full!");
        console.log("Browser database quote exceeded.");
        break;

      // Any other error that may have occurred
      default:
        alert('An unknown error has occurred!');
        break;
    }
    return true;
  };

  // saves specified item using ("key","value")
  this.saveItem = function(itemKey, itemValue, lifetime){
    if (typeof lifetime == 'undefined'){
       lifetime = 60000;
    }

    if (!supported){
      // set future expiration for cookie
      dt = new Date();
      // 1 = 1day can use days variable
      //dt.setTime(dt.getTime() + (1*24*60*60*1000));
      dt.setTime(dt.getTime() + lifetime);
      expires = "expires= " + dt.toGMTString();

      document.cookie = keyMeta + itemKey.toString() + "=" + itemValue + "; " + expires + "; path=/";
      return true;
    }

    // set specified item
    try{
      var saveobj= new Object();
      saveobj.title = itemKey;
      saveobj.link = itemValue;
      var index = 0;
      if(localStorage.length > 0){
        index = now_index + 1;
      }
                                         
      localStorage.setItem(keyMeta + index.toString(), JSON.stringify(saveobj));
      //localStorage.setItem(keyMeta + itemKey.toString(), JSON.stringify(itemValue));
    } catch (e){
      // if the browsers database is full produce error
      if (e == QUOTA_EXCEEDED_ERR) {
        this.storageError('QUOTA');
        return false;
      }
    }
    return true;
  };

  // load value of a specified database item
  this.loadItem = function(itemindex){
    if(itemindex===null){ return null; }
    if (!supported){
      var cooKey = keyMeta + itemindex.toString() + "=";
      // go through cookies looking for one that matchs the specified key
      var cookArr = document.cookie.split(';');
      for(var i=0, cookCount = cookArr; i < cookCount; i++){
        var current_cookie = cookArr[i];
        while(current_cookie.charAt(0) == ''){
          current_cookie = current_cookie.substring(1, current_cookie.length);
          // if keys match return cookie
          if (current_cookie.indexOf(cooKey) == 0) {
            return current_cookie.substring(cooKey.length, current_cookie.length);
          }
        }
      }
      return null;
    }

    var data = localStorage.getItem(keyMeta + itemindex.toString());
    //console.log(data);
    if (data){
      var obj = JSON.parse(data);
      obj.index = itemindex;
      //console.log(obj);
      return obj;
    }else{
      return false;
    }
  };
  
  //取得數量
  this.getCount = function() {
    if (!supported)return 0;
    var cnt = 0;
    for(var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if(key.indexOf( keyMeta ) == 0) {
        cnt++;
      }
    }
    return cnt;
  };
  
  this.loadAllItem = function() {
    //this.deleteAll();
                                                                                                                                         
    if (!supported)return true;
    var temp = new Array();                    
    for(var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if(key.indexOf( keyMeta ) == 0) {
        var index = parseInt(key.replace(keyMeta, ""), 10);
        if(index > now_index)
          now_index = index;
        //console.log("!!!XXXXXXXXXXXXXXXX now_index=",now_index);
        var value = JSON.parse(localStorage.getItem(key));
        var obj = new Object();
        obj.index = index;
        obj.title = value.title;
        obj.link = value.link;
        temp.push(obj);
      }
    }
    return temp;
  };

  // removes specified item
  this.deleteItem = function (itemindex){
    if (!supported){
      document.cookie = keyMeta + itemindex.toString() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return true;
    }

    localStorage.removeItem(keyMeta + itemindex.toString());
    return true;
  };

  // WARNING!!! this clears entire localStorage Database
  this.deleteAll = function(){
    if (!supported){
      // process each and every cookie through a delete funtion
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++){
        this.deleteItem(cookies[i].split("=")[0]);
      }
      return true;
    }

    localStorage.clear();
    return true;
  };

  // jquery namespace for the function set
  jQuery.Storage = this;
})(jQuery);