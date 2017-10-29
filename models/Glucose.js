var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var GlucoseSchema = new Schema ({
  log_type: {
    type: Number,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  time: {
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

// see website documentation for value types
// https://www.managebgl.com/api/api-REST.html#Extract_-_Retrieve_log_data

// sugar numbers are retrieved in mmol, will need to be converted for mg/dL
// reference: http://www.joslin.org/info/conversion_table_for_blood_glucose_monitoring.html

