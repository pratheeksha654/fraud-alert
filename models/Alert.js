const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  txn_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
  message: String,
});

module.exports = mongoose.model("Alert", alertSchema);