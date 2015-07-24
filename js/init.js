var newsfeed0 = null;
var newsfeed1 = null;
var newsfeed2 = null;
var $header = null;
var menuLeft = null;
var $showLeft = null;
var body = null;
var menuRight = null;
var $showRight = null;

var $myorder = null;
var $myorder_list = null;

var $goedit = null;
var mode = "normal";

var $delbuttons = null;
var StorageFeeds = null;
var nowfeed = null;
//var ww = $(document.body).width();
var ww = $(window).width();
var hh = $(window).height();  
var hasTouch = 'ontouchstart' in window;

function resetMenu() {
  classie.removeClass( menuLeft, 'cbp-spmenu-open' );
  classie.removeClass( menuRight, 'cbp-spmenu-open' );
  classie.removeClass( body, 'cbp-spmenu-toleft' );
  classie.removeClass( body, 'cbp-spmenu-toright' );
}
function checkPage(nowpage,allpage) {
  //console.log("!!!!!!!!!!!!!!!!!!! page=",page,header);
  /*
  if($header==null)
    $header = $('header');//document.getElementById('header-nav');
  if(menuLeft==null)
    menuLeft = document.getElementById( 'cbp-spmenu-s1' );
  if(body==null)
    body = document.body;
  if(menuRight==null)
    menuRight = document.getElementById( 'cbp-spmenu-s2' );
            
  if($header!=null) {
    if(nowpage==1)
      $header.className = 'cbp-spmenu-header-hidden';
    else {
      header.className = 'cbp-spmenu-header-show';
      
      $("footer").html((nowpage-1) +"/"+(allpage-3));
    }
    resetMenu();
  }
  */
}

//載入某個主題
function loadOneFeedPages(feedidx) {
  //console.log("XXX",feedidx);
  var nowfeed = $.Storage.loadItem(feedidx);
  //nowfeed.index = feedidx;
  //console.log("nowfeed=",nowfeed);
  //PageManager.init(30,3);
  //ww = $(document).width();
  //console.log("ww1=",ww1);
  //alert("ww="+ww);
  if(ww>=768)
    PageManager.init(30,3);
  else
    PageManager.init(30,1);
  
  newsfeed1 = new gfeedfetcher(".rssfeed-wrap",'titleList',".feedpage-");
  //console.log(feed);
  newsfeed1.addFeed(nowfeed.title,nowfeed.link,nowfeed.index);
  //newsfeed1.displayoptions("label");
  newsfeed1.filterfeed(30, "date");
  newsfeed1.init(PageManager.NumPerPage);
  //console.log(newsfeed1);
  
  $(".headerTitle").html(nowfeed.title);
  $(".backmenu").show();
  $(".amenu").hide();
  resetMenu();
}

//去除前後(左右)空白
String.prototype.trim = function() {
  //alert(this);
  return this.replace(/(^[\s]*)|([\s]*$)/g, "");
}

function showFeedDetail(ob,e) {
  resetMenu();
  var $box = $(ob),
    $boxClose = $( '<span class="box-close"></span>' ),
    transitionProp = {
      speed   : 550,
      timingfunction  : 'linear'
    },
    $overlay = $( '<div class="flipdetail"> </div>' ).css({
      'z-index': 9998,
      '-webkit-transition': 'opacity ' + transitionProp.speed + 'ms ' + transitionProp.timingfunction,
      '-moz-transition': 'opacity ' + transitionProp.speed + 'ms ' + transitionProp.timingfunction,  
      'transition': 'opacity ' + transitionProp.speed + 'ms ' + transitionProp.timingfunction
    }).prependTo( $( 'body' ) ),
    prop = {
      width: $box.outerWidth(true),
      height: $box.outerHeight(true),
      left: $box.offset().left,
      top: $box.offset().top
    },
    $placeholder  = $box.clone();
    $placeholder.html("");
    loadOneFeed($placeholder,$placeholder.attr("id"));
    $placeholder.css({
      'position': 'absolute',
      'width': prop.width,
      'height': prop.height,
      'left': prop.left,  
      'top': prop.top,   
      'zIndex': 9999,
      'overflow-y': 'auto',
      '-webkit-transition': 'all ' + transitionProp.speed + 'ms ' + transitionProp.timingfunction,
      '-moz-transition': 'all ' + transitionProp.speed + 'ms ' + transitionProp.timingfunction,   
      'transition': 'all ' + transitionProp.speed + 'ms ' + transitionProp.timingfunction
    }) 
    .insertAfter( $overlay ).end()
    .append( $boxClose.on('mousedown touchstart', function(e) {
      //console.log("YYYYY");
      $overlay.css( 'opacity', 0);
      $placeholder.children().hide().end().removeClass( 'box-expanded' ).css({
        width: ww,
        height: hh,
        'overflow-y': 'hidden'
      });
      setTimeout(function() {
        $placeholder.css({
          left: prop.left,
          top: prop.top,  
          width: prop.width,
          height: prop.height,
          '-webkit-transition': 'all ' + transitionProp.speed + 'ms ' + transitionProp.timingfunction,
          '-moz-transition': 'all ' + transitionProp.speed + 'ms ' + transitionProp.timingfunction,   
          'transition': 'all ' + transitionProp.speed + 'ms ' + transitionProp.timingfunction
        });
      }, 0);
    }))
    .children()
    .hide()
    .end() 
    .on( 'webkitTransitionEnd.flips transitionend.flips OTransitionEnd.flips', function( event ) {
      //console.log("DDDDDDDD");
      if( $( event.target ).hasClass( 'box-expanded' ) ) { // expanding
        $(this).css({
          width: '100%',
          height: '100%',
          '-webkit-transition': 'none',
          '-moz-transition': 'none',   
          'transition': 'none'
        }).children().fadeIn();
      } else { // collapsing   
        $overlay.remove();     
        $(this).remove();      
      }
    });
  setTimeout(function() {
    $overlay.css({
      opacity : 1 
    });
    $placeholder.addClass( 'box-expanded' ).css({
      left: 0,
      top: 0, 
      width: ww,
      height: hh
    });
  }, 0);
}
function loadOneFeed($el,index) {
  //console.log(index);
  newsfeed1.DisplayDetail($el,index);
}

function reloadallfeeds() {
  var cnt = $.Storage.getCount();
  PageManager.init(cnt,12);
  
  /*
  $flips = $("#flip");
  ww = $(document.body).outerWidth(true);
  console.log("ww=",ww);
  FLIP_WIDTH = ww;
  maxflips = PageManager.Count+1;
  $flips.css('width',ww*(PageManager.Count+2));
  //$imgs.width(ww*(PageManager.Count+2));
  $flips.find('.ppage').width(ww);
  $flips.swipe( swipeOptions );
  */
  
  $("#backmenu").hide();
  $("#showLeft").show();
  $("#headerTitle").html("我的訂閱");
     
  StorageFeeds = $.Storage.loadAllItem();
  
  //newsfeed0 封面故事用
  //newsfeed0 = new gfeedfetcher(".feedScreen",'Cover');
  if(StorageFeeds.length>0) {
    newsfeed0 = new gfeedfetcher(".feedScreen",'Cover');
    //console.log(" StorageFeeds=",StorageFeeds);
    //newsfeed0 = new gfeedfetcher(".feedScreen",'Cover');
    for(var i=0;i<StorageFeeds.length;i++) {
      //console.log(StorageFeeds[i]);
      newsfeed0.addFeed(StorageFeeds[i].title,StorageFeeds[0].link,StorageFeeds[0].index);
    }
    newsfeed0.filterfeed(10, "date");
    newsfeed0.init();
  }
  //newsfeed0.displayoptions("label");
  //newsfeed0.filterfeed(10, "date");
  //newsfeed0.init();
  
  //newsfeed1 清單
  //newsfeed1 = new gfeedfetcher(".rssfeed-wrap",'List');
  //newsfeed1 = new gfeedfetcher(".feedpage-",'List');
  if(StorageFeeds.length>0) {
    newsfeed1 = new gfeedfetcher(".rssfeed-wrap",'List',".feedpage-");
    //console.log(newsfeed1);
  
    for(var key in StorageFeeds) {
      //console.log("StorageFeeds[",key,"].index=",StorageFeeds[key].index);
      newsfeed1.addFeed(StorageFeeds[key].title,StorageFeeds[key].link,StorageFeeds[key].index);
      //newsfeed1.addFeed("Engadget 中文版", "http://chinese.engadget.com/rss.xml");
      //newsfeed1.addFeed("nicchu", "http://friendfeed.com/nicjue?format=atom");   
      //newsfeed1.addFeed("chihchun","http://friendfeed.com/chihchun?format=atom");
      //newsfeed1.addFeed("JQUERY BLOG", "http://jquery4u.com/rss/");
      //newsfeed.addFeed("BLOGOOLA's Blog", "http://blogoola.com/blog/feed/");
    }
  
    newsfeed1.displayoptions("label");
    newsfeed1.filterfeed(1, "date");
    newsfeed1.init();
  }
  
  $myorder_list.get(0).innerHTML = '';
  for(var key in StorageFeeds) {
    var deldiv = document.createElement("span");
    deldiv.id = StorageFeeds[key].index;
    deldiv.className = "deletebutton";
    deldiv.innerHTML = "<img src='css/icons/clear.png' id=delimg>";
    $myorder_list.get(0).appendChild(deldiv);
    if(mode=="edit")
      deldiv.style.display = 'block';
    else
      deldiv.style.display = 'none';
    
    var div = document.createElement("div");
    div.id = StorageFeeds[key].index;
    div.className = "menurows";
    div.innerHTML = StorageFeeds[key].title;
    $myorder_list.get(0).appendChild(div);
  }                                                      
  //$myorder_list.toggle();
  $delbuttons = $(".deletebutton");
  $feedmenus = $(".menurows");
  if(hasTouch) {
    //刪除
    $delbuttons.on("touchstart",function(e) {
      //console.log("delclick()!!!!",this.id);
      $.Storage.deleteItem(this.id);
      reloadallfeeds();
    });
  
    //點擊
    $feedmenus.on("touchstart",function(e) {
      //console.log("feedmenu touchstart()!!!!id=",this.id);
      loadOneFeedPages(this.id);
      //$.Storage.deleteItem(this.id);
      //reloadallfeeds();
    });
  } else {
    //刪除
    $delbuttons.on("mousedown",function(e) {
      //console.log("delclick()!!!!",this.id);
      $.Storage.deleteItem(this.id);
      reloadallfeeds();
    });
    
    //點擊
    $feedmenus.on("mousedown",function(e) {
      //console.log("feedmenu mousedown()!!!!id=",this.id);
      loadOneFeedPages(this.id);
      //$.Storage.deleteItem(this.id);
      //reloadallfeeds();
    });
    
  }
  kbObject.play();
}
                                                     
$(document).ready(function() {
  //var cnt = $.Storage.getCount();
  //PageManager.init(cnt,12);
  //newsfeed1.addFeed("Engadget 中文版", "http://chinese.engadget.com/rss.xml");
  //newsfeed1.addFeed("nicchu", "http://friendfeed.com/nicjue?format=atom");
  //newsfeed1.addFeed("chihchun","http://friendfeed.com/chihchun?format=atom");
  //newsfeed1.addFeed("JQUERY BLOG", "http://jquery4u.com/rss/");
  //newsfeed.addFeed("BLOGOOLA's Blog", "http://blogoola.com/blog/feed/");
  $myorder_list = $('#myorder_list');
  reloadallfeeds();
  $myorder_list.toggle();
  initMenuEvent();
});
function initMenuEvent() {
  //console.log("initEvent()");
  menuLeft = document.getElementById('cbp-spmenu-s1');
  $showLeft = $('.amenu');
  menuRight = document.getElementById('cbp-spmenu-s2');
  $showRight = $('.bmenu' );
  body = document.body;
  $header = $('header');//document.getElementById('header-nav');
  $footer = $('footer');//document.getElementById('footer');
  
  $myorder = $('#myorder');
  $goedit = $("#goedit");
  $gocloseleft = $(".aamenu");
  $gocloseright = $(".bbmenu");

  if(hasTouch) {
    $gocloseleft.on("touchstart",function(e) {
      //console.log("close left");
      classie.toggle( menuLeft, 'cbp-spmenu-open' );
      e.stopPropagation();
    });
    $gocloseright.on("touchstart",function(e) {
      //console.log("close right");
      classie.toggle( menuRight, 'cbp-spmenu-open' );
      e.stopPropagation();
    });
    
    $goedit.on("touchstart",function(e) {
      $delbuttons.toggle();
      if(mode=="normal") { 
        this.innerHTML = "完成";
        mode = "edit";
      } else {
        this.innerHTML = "編輯";
        mode = "normal";
      }
      e.stopPropagation();
    });
    $myorder.on("touchstart",function() {   
      $myorder_list.toggle();
      $goedit.toggle();
    });
  } else {
    $gocloseleft.on("mousedown",function(e) {
      //console.log("close left");
      classie.toggle( menuLeft, 'cbp-spmenu-open' );
      e.stopPropagation();
    });
    $gocloseright.on("mousedown",function(e) {
      //console.log("close right");
      classie.toggle( menuRight, 'cbp-spmenu-open' );
      e.stopPropagation();
    });
    $goedit.on("mousedown",function(e) {
      $delbuttons.toggle();
      if(mode=="normal") {
        this.innerHTML = "完成";
        mode = "edit";
      } else {
        this.innerHTML = "編輯";
        mode = "normal";
      }
      e.stopPropagation();
    });
    
    $myorder.on("mousedown",function() {
      $myorder_list.toggle();
      $goedit.toggle();
    });
  }
}
