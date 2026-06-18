const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true },
  location: { type: String, required: true },
  urgencyLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  hospitalLoad: { type: Number, default: 50 },
  unitsNeeded: { type: Number, default: 2 },
  matchedDonors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Donor' }],
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Emergency', emergencySchema);
