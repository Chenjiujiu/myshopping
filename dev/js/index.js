~function (w) {
  var uid=window.C.getCookie("uid");
  ~function () {
    var uid=C.getCookie("uid");
    if(uid!==undefined){
      console.log("ok");
    }else{
      console.log("no");
    }
  }()
}(window);
