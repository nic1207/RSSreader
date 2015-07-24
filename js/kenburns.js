/**
 * author: nic
 */
var kbObject = {
  name: "kbObject",
  $root: null,
  chkinterval: 0,
  kbinterval: 0,
  $images: null,
  Count: 0,
  i: 1,
  paused: true,
  
  init: function() {
    //console.log("kbObject.init()");
    if(this.$root==null)
      this.$root = $('.feedScreen');
    this.chkinterval = setInterval(function(self) {
      self.checkloaded();
    }, 500, this);//0.5s檢查一次
  },
  
  checkloaded: function() {
    if($.Storage.getCount()<=0)
      return;
    //console.log("kbObject.checkloaded()");
    if(!newsfeed0||!newsfeed0.allfeedsloaded) {
      //console.log("ck!allfeedsloaded");
      return;
    }
    //console.log($(".simg").get(0));
    clearInterval(this.chkinterval);
    //console.log("call kenBurns()");
    this.kenBurns();
    //this.kbi = window.setInterval(this.kenBurns(), 8000);
    this.kbinterval = setInterval(function(self) {
      self.kenBurns();
    }, 10000, this);//10s run一次
  },
  
  kenBurns: function() {
    if(this.paused) {
      //console.log("!paused");
      return;
    }
    if(!newsfeed0.allfeedsloaded) {
      //console.log("Kb!allfeedsloaded");
      return;
    }
    //console.log("kenBurns(",this.i,")");
    //console.log(this);
    var self = this;
    //console.log("this.$root=",this.$root);
    this.$root.each(function() {
      //console.log($(this).find(".simg"));
      //if(self.$images==null)
      self.$images = $(this).find(".simg");
      self.Count = self.$images.length;
      self.$images.removeClass("fx");
      /*
      //console.log(self.Count);
      self.$images.each(function() {
        //console.log($(this).get(0));
        $(this).removeClass("fx");
      });
      */
      if(self.i==self.Count)self.i = 0;
      //self.$images.eq(self.i).addClass("fx");
      //self.$images.get(self.i).addClass("fx");
      //self.$images.eq(self.i).addClass("fx");
      
      var img = self.$images.get(self.i);
      $(img).addClass("fx");
      $('.f-cover-story-title').html($(img).attr("alt"));
      $('.f-cover-from').html("出自"+$(img).attr("from"));
      
    });
    this.i++;
  },
  
  pause: function() {
    if(this.paused)return;
    //console.log("pause()");
    this.paused = true;
    clearInterval(this.kbinterval);
    //console.log("pause(",this.i,")");
    var self = this;
    this.$root.each(function() {
      self.$images = $(this).find(".simg");
      //self.Count = self.$images.length;
      self.$images.eq((self.i-1)).removeClass("fx").css("opacity",1).css("transition-duration","0s");  //addClass("fx");
    });
  },
  
  play: function() {
    if(!this.paused)return;
    //console.log("kbObject.play()");
    this.paused = false;
    this.init();
    var self = this;
    this.$root.each(function() {
      self.$images = $(this).find(".simg");
      //self.Count = self.$images.length;
      self.$images.eq((self.i-1)).css("opacity",1).css("transition-duration","10s");  //addClass("fx");
    });
  }
};