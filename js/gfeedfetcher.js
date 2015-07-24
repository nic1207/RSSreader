// -------------------------------------------------------------------
// gAjax RSS Feeds Displayer- By Dynamic Drive, available at: http://www.dynamicdrive.com
// Created: July 17th, 2007
// Updated June 14th, 10': Fixed issue in IE where labels would sometimes be associated with the incorrect feed items
// -------------------------------------------------------------------
google.load("feeds", "1");

var gfeedfetcher_loading_image = "indicator.gif"; //Full URL to "loading" image. No need to config after this line!!

function gfeedfetcher(parentClass,seedType,pageClass) {
  //this.linktarget = ""; //link target of RSS entries
  //this.feedlabels = [];     //array holding lables for each RSS feed
  //this.feedurls = [];
  this.feedobjects = [];
  this.feeds = [];          //array holding combined RSS feeds' entries from Feed API (result.feed.entries)
  this.feedsfetched = 0;   //number of feeds fetched
  this.feedlimit = 5;
  this.showoptions = "";   //Optional components of RSS entry to show (none by default)
  this.sortstring = "date";//sort by "date" by default
  this.Count = 0;
  this.ppm = 0;
  
  this.pageClass = pageClass;
  this.feedcontainers = $(parentClass);
  this.allfeedsloaded = false;
  
  this.itemcontainer1 = "<span class='item Cover' "; //default element wrapping around each RSS entry item
  this.itemcontainer2 = "<span class='item None bb-bookblock' "; //default element wrapping around each RSS entry item
  this.itemcontainer3 = "<span class='item catlog List bb-bookblock' "; //default element wrapping around each RSS entry item
  this.itemcontainer4 = "<span class='item box titleList bb-bookblock' "; //default element wrapping around each RSS entry item
  this.itemcontainer5 = "<span class='item box titleList2 bb-bookblock' "; //default element wrapping around each RSS entry item
  this.seedType = seedType;// 'Cover','List','None'
  this.pageNum = PageManager.NumPerPage;
  //console.log("!!!!!!!!!!!!!!!!!!!!!!",PageManager.NumPerPage);
}

gfeedfetcher.prototype.addFeed=function(label, url, idx) {
  var obj = new Object();
  obj.label = label;
  obj.url = url;
  obj.idx = idx;
  this.feedobjects[this.feedobjects.length] = obj;
  //this.feedlabels[this.feedlabels.length]=label;
  //this.feedurls[this.feedurls.length]=url;
}

gfeedfetcher.prototype.clearAll=function() {
  //console.log("clearAll()");
  //this.feedlabels = [];
  //this.feedurls= [];
  this.feedobjects = [];
  this.Count = 0;
  this.feedsfetched = 0;
  this.allfeedsloaded = false;
}

gfeedfetcher.prototype.filterfeed=function(feedlimit, sortstr) {
  this.feedlimit=feedlimit;
  if (typeof sortstr!="undefined")
    this.sortstring=sortstr;
}

gfeedfetcher.prototype.displayoptions=function(parts){
  this.showoptions=parts; //set RSS entry options to show ("date, datetime, time, snippet, label, description")
}

gfeedfetcher.prototype.setentrycontainer=function(containerstr){  //set element that should wrap around each RSS entry item
  this.itemcontainer="<"+containerstr.toLowerCase()+">";
}

gfeedfetcher.prototype.init=function(ppm){
  //console.trace();
  this.feedsfetched = 0; //reset number of feeds fetched to 0 (in case init() is called more than once)
  this.Count = 0;
  this.ppm = ppm;
  this.feeds = []; //reset feeds[] array to empty (in case init() is called more than once)
  //var i=0;
  if(this.feedcontainers) {
    this.feedcontainers.each(function () {
      //console.log(this);
      //if(i==0)
      this.innerHTML='<span><img src="css/images/'+gfeedfetcher_loading_image+'" /> Loading...</span>';
      //i++;
    });
  }
  var displayer=this;
  //console.log("this.feedobjects=",this.feedobjects);
  for (var i=0; i<this.feedobjects.length; i++) { //loop through the specified RSS feeds' URLs
    var feedpointer = new google.feeds.Feed(this.feedobjects[i].url); //create new instance of Google Ajax Feed API
    //feedpointer.idx = this.feedobjects[i].idx;
    var items_to_show = (this.feedlimit<=this.feedobjects.length)? 1 : Math.floor(this.feedlimit/this.feedobjects.length); //Calculate # of entries to show for each RSS feed
    //console.log("items_to_show=",items_to_show);
    if (this.feedlimit%this.feedobjects.length>0 && this.feedlimit>this.feedobjects.length && i==this.feedobjects.length-1) //If this is the last RSS feed, and feedlimit/feedurls.length yields a remainder
      items_to_show += (this.feedlimit%this.feedobjects.length); //Add that remainder to the number of entries to show for last RSS feed
    //console.log("items_to_show=",items_to_show);
    feedpointer.setNumEntries(items_to_show); //set number of items to display
    feedpointer.load(function(obj) {
      //console.log(obj);
      return function(r) {
        //console.log(this);
        displayer._fetch_data_as_array(r, obj);
      }
    }(this.feedobjects[i])); //call Feed.load() to retrieve and output RSS feed.
  }
}

gfeedfetcher._formatdate=function(datestr, showoptions) {
  var itemdate=new Date(datestr);
  var parseddate=(showoptions.indexOf("datetime")!=-1)? itemdate.toLocaleString() : (showoptions.indexOf("date")!=-1)? itemdate.toLocaleDateString() : (showoptions.indexOf("time")!=-1)? itemdate.toLocaleTimeString() : "";
  return "<span class='datefield'>"+parseddate+"</span>";
}

gfeedfetcher._sortarray=function(arr, sortstr) {
  var sortstr=(sortstr=="label")? "ddlabel" : sortstr; //change "label" string (if entered) to "ddlabel" instead, for internal use
  if (sortstr=="title" || sortstr=="ddlabel") { //sort array by "title" or "ddlabel" property of RSS feed entries[]
    arr.sort(function(a,b) {
      var fielda=a[sortstr].toLowerCase();
      var fieldb=b[sortstr].toLowerCase();
      return (fielda<fieldb)? -1 : (fielda>fieldb)? 1 : 0;
    });
  }else{ //else, sort by "publishedDate" property (using error handling, as "publishedDate" may not be a valid date str if an error has occured while getting feed
    try{
      arr.sort(function(a,b){return new Date(b.publishedDate)-new Date(a.publishedDate)});
    }catch(err){}
  }
}

gfeedfetcher.prototype._fetch_data_as_array=function(result, obj) {	
  //console.log(this.feedurls);
  var thisfeed=(!result.error)? result.feed.entries : ""; //get all feed entries as a JSON array or "" if failed
  if (thisfeed=="") { //if error has occured fetching feed
    //console.log(obj);
    //console.log(result);
    console.log("Some blog posts could not be loaded: ");
  }
  //console.log("thisfeed.length=",thisfeed);
  for (var i=0; i<thisfeed.length; i++) { //For each entry within feed
    result.feed.entries[i].idx = obj.idx;
    result.feed.entries[i].ddlabel = obj.label; //extend it with a "ddlabel" property
  }
  this.feeds=this.feeds.concat(thisfeed); //add entry to array holding all feed entries
  //console.log("obj=",this.feeds);
  //this.feeds.idx = obj.idx;
  this.Count += thisfeed.length;
  this._signaldownloadcomplete(); //signal the retrieval of this feed as complete (and move on to next one if defined)
  //console.log("XXX");
}

gfeedfetcher.prototype._signaldownloadcomplete=function() {
  this.feedsfetched +=1;
  if (this.feedsfetched==this.feedobjects.length) //if all feeds fetched
    this._displayresult(this.feeds); //display results
}

gfeedfetcher.prototype.DisplayDetail=function($el,idx) {
  //for (var i=0; i<feeds.length; i++) {
  if(idx<0)
    return;
  //console.log(this.feeds[idx]);
  $el.html(this.feeds[idx].content);
}
//全部下載完成 顯示結果
gfeedfetcher.prototype._displayresult=function(feeds) {
  //var rssoutput=(this.itemcontainer=="<div>")? "<ul>\n" : "";
  //console.trace();
  //console.log("!!!",feeds);
  //var rssoutput = "";
  var pages = [];
  
  gfeedfetcher._sortarray(feeds, this.sortstring);
  //console.log("feeds.length=",this.Count,feeds);
  //var rssoutput = "";
  for (var i=0; i<feeds.length; i++) {
    var rssoutput = "";
    console.log("idx=",this.feeds[i].idx);
    console.log("i=",i);
    var nowpage = Math.floor((i)/this.pageNum);
    if(pages[nowpage]==null)
      pages[nowpage]="";
    //console.log("nowpage=",nowpage);
    console.log("this.seedtype=",this.seedType);
    if(this.seedType=='Cover')
      rssoutput += this.itemcontainer1;
    else if(this.seedType=='titleList') {
      if(this.ppm>0 && i%this.ppm==0)
        rssoutput += this.itemcontainer4;
      else
        rssoutput += this.itemcontainer5;
      //rssoutput += "id=" + this.feeds[i].idx;
      rssoutput += "id=" +i;
    } else if(this.seedType=='None') {
      if(i===0) 
        rssoutput += this.itemcontainer2;
      else
        rssoutput += this.itemcontainer3;
    } else {
      rssoutput += this.itemcontainer3;
      //console.log("this.seedType=",this.seedType);
      //console.log(StorageFeeds[0]);
      if(StorageFeeds[i]!=null)
        rssoutput += "id=" + this.feeds[i].idx;
    }
    //console.log("WWWW",i,StorageFeeds[i].index);
    rssoutput += ">";
    //else if(this.seedType=='titleList') {
    //  rssoutput += this.itemcontainer2;
    //}
    //console.log(rssoutput);
    //var itemtitle="<a rel=\"nofollow\" href=\"" + feeds[i].link + "\" target=\"" + this.linktarget + "\" class=\"titlefield\">" + feeds[i].title + "</a>";
    var itemtitle = "";
    var itemcontent = "";
    //console.log(feeds[i]);
    //var itemtitle = "" + feeds[i].title + "";
    
    var reg = /<img[^>]+src="http:\/\/([^">]+)/g;
    var results = reg.exec(this.feeds[i].content);
    var itemimg = "";
    //console.log("this.feeds=",this.feeds[i]);
    if(results!=null) {
      var imgsrc = results[1].trim();
      //console.log(imgsrc);
      if(this.seedType=='Cover') {
        //console.log("!!!!");
        itemimg  = "<div class='simg' id=" + this.feeds[i].idx + " style='display: block;";
        itemimg += "background: -webkit-linear-gradient(top,rgba(0,0,0,0.1),rgba(1,1,1,0.9)), url(http://"+imgsrc+") no-repeat center center;";
        itemimg += "background: -moz-linear-gradient(top,rgba(0,0,0,0.1),rgba(1,1,1,0.9)), url(http://"+imgsrc+") no-repeat center center;";
        itemimg += "background-size:cover' alt='"+this.feeds[i].title+"' from='"+this.feeds[i].ddlabel+"'></div>";
      }
        //itemimg = "<div class='bb-item'><img src=http://"+ imgsrc + " width=100% height=100%></div>";
        
      else if(this.seedType=='titleList') {//
        //itemimg = "<div class='bb-item'><div style='background: url(http://"+imgsrc+") no-repeat center center;background-size:contain;font-size: 12px'></div></div>";
        if(this.ppm>0 && i%this.ppm==0)
          itemimg  = "<div class='itemg1' id=" + this.feeds[i].idx + " style='";
        else
          itemimg = "<div class='itemg2' id=" + this.feeds[i].idx + " style='";
        itemimg += "background: -webkit-linear-gradient(top,rgba(1,1,1,0.8),rgba(0,0,0,0),rgba(1,1,1,0.8)), url(http://"+ imgsrc + ") no-repeat center center;";
        itemimg += "background: -moz-linear-gradient(top,rgba(1,1,1,0.8),rgba(0,0,0,0),rgba(1,1,1,0.8)), url(http://"+ imgsrc + ") no-repeat center center;";
        itemimg += "background-size:cover'></div>";
                            
      } else {
        //console.log("imgsrc=",imgsrc);
        itemimg = "<div class='bb-item' id=" + this.feeds[i].idx + "><div class='simg' id=" + this.feeds[i].idx + " style='";
        //itemimg = "<div class='bb-item' id=" + i + "><div class='simg' id=" + i + " style='";
        itemimg += "background:-moz-linear-gradient(top,rgba(1,1,1,0.8),rgba(0,0,0,0.1)),url(http://"+imgsrc+") no-repeat bottom center;";
        itemimg += "background:-webkit-linear-gradient(top,rgba(1,1,1,0.8),rgba(0,0,0,0.1)),url(http://"+imgsrc+") no-repeat bottom center;";
        //itemimg += "background:-o-linear-gradient(top,rgba(1,1,1,0.8),rgba(0,0,0,0.1)),url(http://"+imgsrc+") no-repeat bottom center;";
        itemimg += "background-size:cover'></div></div>";
        
        //itemimg = "<div class='bb-item'><div class='simg' style='background: url(http://"+imgsrc+") no-repeat center center;background-size:auto'></div></div>";
        //itemimg += "<div class='bb-item'><div class='simg' style='background: url(http://"+imgsrc+") no-repeat center center;background-size:cover'></div></div>";
      }
    } else {
      //console.log("results=null",i);
      //console.log(this.feeds[i].content);
      itemimg  = "<div class='bb-item' id=" + this.feeds[i].idx + "><div class='simg' id=" + this.feeds[i].idx + " style='";
      itemimg += "background: -webkit-linear-gradient(top,rgba(1,1,1,0.9),rgba(0,0,0,0.1)) no-repeat bottom center;";
      itemimg += "background: -moz-linear-gradient(top,rgba(1,1,1,0.9),rgba(0,0,0,0.1)) no-repeat bottom center;";
      itemimg += "'></div></div>";
    }
    
    if(this.seedType=="titleList") {
      if(this.ppm>0 && i%this.ppm==0)
        itemtitle = "<div class='itemtitle1'>" + feeds[i].title + "</div>";
      else
        itemtitle = "<div class='itemtitle2'>" + feeds[i].title + "</div>";
    }
    if(this.seedType=="List")
      itemcontent = "<div class='titlefield'>" + feeds[i].ddlabel + "</div>";
    else if(this.seedType=="titleList") {
      if(this.ppm>0 && i%this.ppm==0)
        itemcontent = "<div class='contentfield1'>" + feeds[i].contentSnippet + "</div>";
      else
        itemcontent = "<div class='contentfield2'>" + feeds[i].contentSnippet + "</div>";
      //console.log(this.feeds[i].content);
    }
          
    //itemimg += "</div>";
    //var itemimg = "";
    //var img = 
    //var itemimage= "<img src="++
    var itemlabel = "";
    //var itemlabel=/label/i.test(this.showoptions)? '<div class="labelfield">'+this.feeds[i].ddlabel+'</div>' : "";
    //itemlabel =  '['+this.feeds[i].ddlabel+']';
    var itemdate = "";
    //var itemdate=gfeedfetcher._formatdate(feeds[i].publishedDate, this.showoptions);
    var itemdescription="";
    //var itemdescription=/description/i.test(this.showoptions)? feeds[i].content : /snippet/i.test(this.showoptions)? feeds[i].contentSnippet : "";
    //rssoutput+=this.itemcontainer + itemimg + " " + itemtitle + " " + itemlabel + itemdate + "\n" + itemdescription + this.itemcontainer.replace("<", "</") + "\n\n";
    rssoutput += itemimg + itemtitle + itemcontent + itemlabel + itemdate + itemdescription;
    rssoutput += "</span>";
    //console.log(rssoutput);
    pages[nowpage] += rssoutput;
  }
  //console.log(pages[0]);
  //rssoutput += "</span>";
  if(this.seedType=="Cover") {
    
    if(this.feedcontainers) {
      this.feedcontainers.each(function() {
        this.innerHTML=pages[0];
      });
    }
    
  } else {
    for(var i=0;i<pages.length;i++) {
      this.feedcontainers[i] = $(this.pageClass+(i+1));
      this.feedcontainers[i].each(function() {
        this.innerHTML=pages[i];
      });
    }
  }
  //console.log(this.feedcontainers);
  /*
  if(this.feedcontainers) {
    //var i=0;
    this.feedcontainers.each(function () {
      //console.log(this);
      //if(i==0)
      this.innerHTML=pages[0];
      //i++;
    });
  }
  */
  this.allfeedsloaded = true;
  //var $flipobject = $("#flip").FlipsInstance();
  //console.log("flipobject=",$flipobject);
  //$flipobject._testEvent();    
  //initEvent();
}