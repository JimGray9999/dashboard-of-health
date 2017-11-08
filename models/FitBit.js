var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var FitBitSchema = new Schema ({
  date: {
    type: Date,
    required: false
  },
  steps: {
    type: Number,
    required: false
  },
  floors: {
    type: Number,
    required: false
  },
  fairlyActiveMinutes: {
    type: Number,
    required: false
  },
  lightlyActiveMinutes: {
    type: Number,
    required: false
  },
  veryActiveMinutes: {
    type: Number,
    required: false
  }
})


var FitBit = mongoose.model("FitBit", FitBitSchema);

module.exports = FitBit;