var unirest = require('unirest');


module.exports = function(app) {
    // ManageBGL //
  app.get("/api", function(req, res) {
    // These code snippets use an open-source library. http://unirest.io/nodejs
    unirest.get("https://managebgl-managebgl.p.mashape.com/extract?end_date=2017-11-05+11%3A59%3A59&start_date=2017-10-25+14%3A03%3A00&token=14784-aeb0a9a6fd2d05f9213c5c49f3c74c6e")
    .header("X-Mashape-Key", "6jSePifxX0mshxd2XWBWPbHlepblp1Xtffhjsnsd7sZZyeYkRa")
    .header("Accept", "application/json")
    .end(function (result) {
      
      var testResults = {};
      
      // loop thru all results
      // add only the glucose readings (logtype_id 1)
      for (i = 0 ; i < result.body.logs.length ; i++) {
        if(result.body.logs[i].logtype_id === 1) {
          testResults.log_id     = result.body.logs[i].log_id;
          testResults.user_id    = result.body.logs[i].user_id;
          testResults.logtype_id = result.body.logs[i].logtype_id;
          testResults.other      = result.body.logs[i].other;
          testResults.time       = result.body.logs[i].time;
          testResults.created    = result.body.logs[i].created;
          testResults.updated    = result.body.logs[i].updated;
          testResults.value      = Math.round((result.body.logs[i].value * 18)); // reading conversion - mmol * 18 = mg/dL
          testResults.notes      = result.body.logs[i].notes;
        }

        var newGlucose = new Glucose(testResults);
    
        // save new data to mlab/mongoDB
        newGlucose.save(function(err, doc) {
          if(err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        });
      }
      console.log(result.body.logs);
      return res.json(result.body);

    });
  })
};

