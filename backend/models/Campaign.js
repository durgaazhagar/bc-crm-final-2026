const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  targetAudience: { type: String, required: true },
  performance: {
    engagement: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
  },
  status: { type: String, enum: ['draft', 'running', 'completed'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Campaign', campaignSchema);
