const mongoose = require("mongoose");

const csv_schema = new mongoose.Schema({
    original_name: String,
    stored_name: String,
    filepath: String,
    when: String
},{ timestamps: true }, { strict: false });
module.exports.CSV = mongoose.model("CSV_DETAILS", csv_schema);
