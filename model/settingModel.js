let mongoose = require("mongoose");
const settingModel = mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    description: { type: String, required: false },
    createdBy: { type: String, required: true }, // User who created the setting
    updatedBy: { type: String, required: true }, // User who last updated the setting
    updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
  },
  {
    collection: 'settings',
    _id: true,      
    timestamps: true,
    }
);
const Setting = mongoose.model("Setting", settingModel);
module.exports = Setting; // Export the Setting model