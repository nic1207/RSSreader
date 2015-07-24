/*
 * 計算 pages
 */
var swipeOptions = {
  tap: tap,
  triggerOnTouchEnd: true,
  swipeStatus: swipeStatus,
  allowPageScroll: "vertical",
  threshold: 75
};

var PageManager = {
  Count: 1,
  DisplayArea: null,
  NumPerPage: 0,
  Number: 0,
  PAGE_WIDTH: 500,
  currentPage: 0,//目前所在頁面
  maxPage: 0,//最大頁面
  speed: 500,
  $flips: null,
  Pages: null,

  init: function(cnt,pp) {
    //console.log("PageManager.init()");
    if(!this.DisplayArea)
      this.DisplayArea = document.getElementById('flip');
    //console.log("total=",cnt);
    
    this.Count = Math.ceil(cnt/pp);
    this.Number = cnt;
    this.NumPerPage = pp;
    //console.log("PageManager.Count=",this.Count);
    if(this.Count<1)
      this.Count = 1;
      
    //this.resize();
    
    this.initPageNode(this.DisplayArea);
    
    this.resize();
    
    //if(!this.$flips)
    //  this.$flips = $(this.DisplayArea);
    //ww = $(document.body).outerWidth(true);
    //console.log("ww=",ww);
    //this.PAGE_WIDTH = ww;
    this.maxPages = this.Count + 1;
    //console.log("this.currentPage=",this.currentPage);
    //console.log("this.maxPages=",this.maxPages);
    if(this.currentPage>=this.maxPages) {
      this.currentPage = 1;
      this.gotoPage(this.currentPage,0);
    }
    //this.$flips.css('width',ww*(this.Count+2));
    //this.$flips.width(ww*(this.Count+2));
    //this.$flips.find('.ppage').width(ww);
    this.$flips.swipe(swipeOptions);
    this.footerDisplay();
  },
  
  resize: function() {
    if(!this.DisplayArea)
      this.DisplayArea = document.getElementById('flip');
    //if(!this.$flips)
    this.$flips = $(this.DisplayArea);
    
    //ww = window.screen.width * window.devicePixelRatio;//1920
    //ww = $(document.body).width() * window.devicePixelRatio;//1855
    ww = $(document.body).width();
    //hh = $(document.body).height();
    //ww = window.innerWidth;//1855
    //ww = $(window).width();//1855
    //ww = screen.width;
    //console.log(ww);
    //alert(ww);
    //hh = $(document.body).height() * window.devicePixelRatio;
    //console.log(window.devicePixelRatio);
    //console.log($(document.body).width());
    this.PAGE_WIDTH = ww; 
    //console.log(hh);
    this.$flips.css('width',ww*(this.Count+2));
    //this.$flips.css('height',hh);
    
    //this.$flips.height();
    this.$flips.find('.ppage').width(ww);
    //this.$flips.find('.ppage').height(hh);
    //this.$flips.find('.ppage').height(hh);
  },
  
  initPageNode: function(obj) {
    obj.innerHTML = "";
    //var begin = this.CreateBeginPage();
    var cover = this.CreateCoverPage();
    this.Pages = this.CreatePages(this.Count);
    //var end = this.CreateEndPage();
    //obj.appendChild(begin);
    obj.appendChild(cover);
    for(i=0;i<this.Pages.length;i++)
      obj.appendChild(this.Pages[i]);
    //obj.appendChild(end);
  },
  
  footerDisplay: function() {
    //console.log("footerDisplay()");
    var html = "";
    //console.log("this.maxPages=",this.maxPages);
    //console.log("this.currentPage=",this.currentPage);
    for(i=1;i<=this.maxPages;i++) {
      if(i==(this.currentPage+1)) {
        html += "<img src='css/icons/page_count-04.png' width=30 height=30>";
        //console.log("XXXXXXXXXXXXXXX");
      } else
        html += "<img src='css/icons/page_count-03.png' width=30 height=30>";
      
    }
    //console.log(this.Pages);
    $(this.Pages[this.currentPage-1]).find("footer").html(html);
           
  },
  
  CreateCoverPage: function() {
    var div0 = document.createElement("span");
    div0.className = "ppage";
    var div1 = document.createElement("div");
    div1.className = "feedScreen";
    div0.appendChild(div1);
    var div2 = document.createElement("div");
    div0.appendChild(div2);
    /*
    var div20 = document.createElement("div");
    div20.className = "logo";
    div20.innerHTML = " &nbsp;RSS Reader";
    div2.appendChild(div20);
    */
    var div21 = document.createElement("div");
    div21.className = "f-cover-story";
    div2.appendChild(div21);
    var div22 = document.createElement("div");
    div22.innerHTML = "封面故事";
    div21.appendChild(div22);
    var div23 = document.createElement("div");
    div23.className = "f-cover-story-title";
    div21.appendChild(div23);
    var div24 = document.createElement("div");
    div24.className = "f-cover-from";
    div21.appendChild(div24);
    var div3 = document.createElement("div");
    div3.className = "f-cover-flip";
    //div3.innerHTML = "&lt;&lt;&lt;";
    div0.appendChild(div3);
    return div0;
  },
  /*
  CreateBeginPage: function() {
    var div0 = document.createElement("div");
    div0.className = "ppage";
    return div0;
  },
  
  CreateEndPage: function() {
    var div0 = document.createElement("div");
    div0.className = "ppage";
    return div0;
  },
  */
  
  CreatePages: function(num) {
    var pages = [];
    
    for(i=0;i<num;i++) {
      var div0 = document.createElement("span");
      div0.className = "ppage";
      
      var header = document.createElement("header");
      var bm =  document.createElement("span");
      bm.className = "backmenu";
      header.appendChild(bm);
      var amenu = document.createElement("span");
      amenu.className = "amenu";
      header.appendChild(amenu);
      var title =  document.createElement("span");
      title.className = "headerTitle";
      title.innerHTML = "我的訂閱";
      header.appendChild(title);
      var bmenu = document.createElement("span");
      bmenu.className = "bmenu";
      header.appendChild(bmenu);
      div0.appendChild(header);
      //<header><span id="backmenu" class="backmenu"> </span>
      //        <span id="showLeft" class="amenu"> </span>
      //        <span id="headerTitle">我的訂閱</span>
      //        <span id="showRight" class="bmenu"> </span>
      //</header>
                            
      
      var div1 = document.createElement("div");
      div1.className = "rssfeed-wrap masonry-80 feedpage-"+(i+1);
      div0.appendChild(div1);
      
      //<footer id="footer"><span id="pageArea">...</span></footer>
      var footer = document.createElement("footer");
      footer.innerHTML = "...";
      footer.id = "footer_"+i;
      div0.appendChild(footer);
      pages[i] = div0;
    }
    return pages;
  },

  previousPage: function() {
    this.currentPage = Math.max(this.currentPage-1, 0);
    //console.log(this.currentPage);
    this.scrollX( this.PAGE_WIDTH * this.currentPage, this.speed);
    this.footerDisplay();
  },

  nextPage: function() {
    this.currentPage = Math.min(this.currentPage+1, this.maxPages-1);
    this.scrollX( this.PAGE_WIDTH * this.currentPage, this.speed);  
    this.footerDisplay();
  },
  
  refreshPage: function() {
    //this.currentPage = Math.min(this.currentPage+1, this.maxPages-1);
    this.scrollX( this.PAGE_WIDTH * this.currentPage, 0);   
    this.footerDisplay();
    $("body").scrollTop(0);
  },
  
  gotoPage: function(page,duration) {
    this.scrollX( this.PAGE_WIDTH * page, duration);
  },
  
  scrollPageX: function(x, duration) {
    var distance = this.PAGE_WIDTH * this.currentPage + x;
    this.scrollX(distance, duration);
  },
  
  scrollX: function(distance, duration) {
    this.$flips.css({"-webkit-transition-duration":(duration/1000).toFixed(1) + "s","-moz-transition-duration":(duration/1000).toFixed(1) + "s"});
    //inverse the number we set in the css
    var x = (distance<0 ? "" : "-") + Math.abs(distance).toString();
    this.$flips.css({"-webkit-transform":"translate3d("+x+"px,0px,0px)","-moz-transform":"translate3d("+x+"px,0px,0px)"});
  }
};

function swipeStatus(event, phase, direction, distance) {
  if( phase=="move" && (direction=="left" || direction=="right") ) {
    var duration=0; 
    if (direction == "left")
      PageManager.scrollPageX(distance, duration);
    else if (direction == "right")
      PageManager.scrollPageX(-distance, duration);
  } else if ( phase == "cancel") {
    PageManager.scrollPageX(0, duration);
  } else if ( phase =="end" ) {
    if (direction == "right") 
      PageManager.previousPage();
    else if (direction == "left") 
      PageManager.nextPage();
  } else {
    //console.log(direction);
    if(direction=="up" || direction=="down")
      event.preventDefault();
      //return false;
  }
}

function tap(event, target) {
  //console.log("tap()",target,event);
  if($(target).hasClass('box'))
    showFeedDetail(target,event);
  if($(target).hasClass('bb-item'))
    loadOneFeedPages(target.id);
  if($(target).hasClass('amenu'))
    classie.toggle( menuLeft, 'cbp-spmenu-open' );
  if($(target).hasClass('bmenu'))
    classie.toggle( menuRight, 'cbp-spmenu-open' );
  if($(target).hasClass('backmenu'))
    reloadallfeeds();    
      
}

$( window ).resize(function() {
  PageManager.resize();
  PageManager.refreshPage();
});                                                                                             