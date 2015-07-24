google.load("feeds", "1");
//google.load("search", "1");

var gFeedx = {
  searchButton: null,
  searchTxtElement: null,
  searchTxt: "",
  resultArea: null,

  init: function() {
    this.searchButton = document.getElementById('search');
    this.searchTxtElement = document.getElementById('searchTxt');
    this.resultArea = document.getElementById('resultArea');
    //console.log(this);
    this.initSearchEvent();
  },
  
  // Our callback function, for when a feed is loaded.
  feedLoaded: function(result) {
    if (!result.error) {
      // Grab the container we will put the results into
      var container = document.getElementById("container");
      container.innerHTML = '';
              
      // Loop through the feeds, putting the titles onto the page.
      // Check out the result object for a list of properties returned in each entry.
      // http://code.google.com/apis/ajaxfeeds/documentation/reference.html#JSON
      for (var i = 0; i < result.feed.entries.length; i++) {
        var entry = result.feed.entries[i];
        var div = document.createElement("div");
        div.className = "rows";
        div.appendChild(document.createTextNode(i+":"+entry.title));
        container.appendChild(div);
      }
    }
  },
  /*
  CreateDivHtmlNode: function(text) {
    var div = document.createElement("div");
    div.className = "rows";
    div.innerHTML = text;
    return div;
  },
  */
  feedSearchDone: function(result) {
    if (result.error || result.entries.length <= 0) {
      gFeedx.resultArea.innerHTML = 'No Results Found';
      return;
    }
    if(gFeedx.resultArea)
      gFeedx.resultArea.innerHTML='';
    for (var i = 0; i < result.entries.length; i++) {
      if(gFeedx.resultArea) {
        var entry = result.entries[i];
        //console.log(entry);
        var div = CreateDivHtmlNode(entry);
        gFeedx.resultArea.appendChild(div);
      }
    }
  },
  
  initSearchEvent: function() {
    //var searchControl = new google.search.SearchControl();
    //console.log(search);
    if(this.searchTxtElement!=null) {
      //console.log(search.id);
      var self = this;
      //console.log(this.searchTxtElement);
      //this.searchButton.addEventListener("click",function() {
      this.searchTxtElement.addEventListener("input",function(e) {
        //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        var query = "site:*.com ";
        //console.log(self.searchTxtElement.value);
        //if(self.searchTxtElement.value=="")
        //  return;
        query += self.searchTxtElement.value;
        // Query for president feeds on cnn.com
        //var query = 'site:cnn.com president';
        self.resultArea.innerHTML = "搜尋中...";
        //console.log(self.resultArea);
        //console.log(google.feeds);
        //google.feeds.setNumEntries(5);
        google.feeds.findFeeds(query, self.feedSearchDone);
        //var searchControl = new google.search.SearchControl();
        //searchControl.addSearcher(new google.search.BlogSearch()); 
        //searchControl.draw(self.resultArea);
      },false);
    }
  }
};

function feedLoaded(result) {
  if (!result.error) {
    // Grab the container we will put the results into
    var container = document.getElementById("containerArea");
    container.innerHTML = '';
    // Loop through the feeds, putting the titles onto the page.
    // Check out the result object for a list of properties returned in each entry.
    // http://code.google.com/apis/ajaxfeeds/documentation/reference.html#JSON
    for (var i = 0; i < result.feed.entries.length; i++) {
      var entry = result.feed.entries[i];
      var div = document.createElement("div");
      div.className = "rows";
      div.appendChild(document.createTextNode(entry.title));
      container.appendChild(div);
    }
  }
}

function CreateDivHtmlNode(obj) {
  var div = document.createElement("div");
  div.className = "rows";
  var icon = document.createElement("span");
  icon.className = "ihead";
  icon.innerHTML = '<img src="css/icons/user.png">';
  div.appendChild(icon);
  var title = document.createElement("span");
  title.className = "ititle";
  //console.log(obj);
  title.innerHTML = obj.title + "<br>"+obj.url;
  div.appendChild(title);
  var addb = document.createElement("span");
  addb.className = "iaddit"; 
  addb.innerHTML = '<img src="css/icons/Add-04.png" width=32>'; 
  console.log("hasTouch=",hasTouch);
  //addb.addEventListener("click",function(e) {
  if(hasTouch) {
    $(addb).on("touchstart",function(e) {
      //console.log(obj.title,obj.url);
      $.Storage.saveItem(obj.title, obj.url);
      addb.innerHTML = '<img src="css/icons/mark.png">';
      reloadallfeeds();
      //addb.removeEventListener("click",this,false);
    });
  } else {
    $(addb).on("mousedown",function(e) {
      //console.log(obj.title,obj.url);
      $.Storage.saveItem(obj.title, obj.url);
      addb.innerHTML = '<img src="css/icons/mark.png">';
      reloadallfeeds();
      //addb.removeEventListener("click",this,false);
    });
  }
  div.appendChild(addb);
  //div.innerHTML = text;
  return div;
}

function onReady() {
  gFeedx.init();
  // Create a feed instance that will grab Digg's feed.
  //var feed = new google.feeds.Feed("http://www.digg.com/rss/index.xml");
  //feed.setNumEntries(1);
  // Calling load sends the request off.  It requires a callback function.
  //console.log(feed);
  //feed.load(feedLoaded);
}
// Very similar to $(document).ready()
google.setOnLoadCallback(onReady, true);