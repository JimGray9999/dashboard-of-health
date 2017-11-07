var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var GlucoseSchema = new Schema ({
  log_id: {
    type: Number,
    unique: true,
    required: true,
  },
  user_id: {
    type: String,
    required: true
  },
  logtype_id: {
    type: Number,
    required: true
  },
  other: {
    value: String,
    required: false
  },
  time: {
    type: Date,
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  updated: {
    type: Date,
    required: false
  },
  value: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: false
  }
})

var Glucose = mongoose.model("Glucose", GlucoseSchema);

module.exports = Glucose;

// see API documentation for value types
// https://www.managebgl.com/api/api-REST.html#Extract_-_Retrieve_log_data

// sugar numbers are retrieved in mmol, will need to be converted to mg/dL
// reference: http://www.joslin.org/info/conversion_table_for_blood_glucose_monitoring.html

// sample object:

// "log_id": 12345678,
// "user_id": 12345,
// "logtype_id": 1, <-- 1 indicates this is a blood glucose reading
// "other": 0,
// "time": "2013-03-31 14:22:13",
// "created": "2017-10-28 21:17:41",
// "updated": null,
// "value": 16,
// "notes": "test value"

