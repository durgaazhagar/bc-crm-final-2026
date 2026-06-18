const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bloodGroup: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  district: { type: String, default: 'Tamil Nadu' },
  phone: { type: String, required: true, trim: true },
  donations: { type: Number, default: 0 },
  lifetimeDonations: { type: Number, default: 0 },
  trustScore: { type: Number, default: 70 },
  relationshipScore: { type: Number, default: 0 },
  engagementLevel: { type: Number, default: 50 },
  responseRate: { type: Number, default: 60 },
  lastDonationDate: { type: Date, default: Date.now },
  lastResponseTime: { type: Number, default: null },
  status: { type: String, enum: ['active', 'inactive', 'ineligible'], default: 'active' },
  badges: {
    verified: { type: Boolean, default: false },
    emergencyHero: { type: Boolean, default: false },
    donorOfDistrict: { type: Boolean, default: false },
    loyaltyTier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
  },
  loyaltyPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Donor', donorSchema);
