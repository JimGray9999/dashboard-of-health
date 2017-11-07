$("#api-button").on("click", function() {    
  $.getJSON("/api", function(data) {
    console.log(data.logs);
    var table = "<table>";
    
    for (i = 0 ; i < data.logs.length ; i++) {
      if(data.logs[i].logtype_id === 1){
        $(".sugars").append((data.logs[i].value * 18) + " mg/dL");
        $(".sugars").append("<br>");
      }
    }
  });
});