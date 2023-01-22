const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
  {
    urlCode: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    longUrl: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    shortUrl: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", UrlSchema);
