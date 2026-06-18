const express = require('express');
const Donor = require('../models/Donor');
const Emergency = require('../models/Emergency');
const Campaign = require('../models/Campaign');
const auth = require('../middleware/auth');
const aiService = require('../services/ai');

const router = express.Router();

router.get('/overview', auth, async (req, res) => {
  // Use parallel fetches and return safe defaults if any DB/service call fails
  try {
    const results = await Promise.allSettled([
      Donor.countDocuments(),
      Donor.countDocuments({ status: 'active' }),
      Emergency.countDocuments(),
      Campaign.find().sort({ createdAt: -1 }).limit(5),
      aiService.forecastDemand(),
      aiService.retentionSuggestions(),
    ]);

    const defaults = {
      totalDonors: 0,
      activeDonors: 0,
      emergencyCount: 0,
      campaigns: [],
      forecast: null,
      retention: null,
    };

    const [rTotal, rActive, rEmergency, rCampaigns, rForecast, rRetention] = results;

    const totalDonors = rTotal.status === 'fulfilled' && typeof rTotal.value === 'number' ? rTotal.value : defaults.totalDonors;
    const activeDonors = rActive.status === 'fulfilled' && typeof rActive.value === 'number' ? rActive.value : defaults.activeDonors;
    const emergencyCount = rEmergency.status === 'fulfilled' && typeof rEmergency.value === 'number' ? rEmergency.value : defaults.emergencyCount;
    const campaigns = rCampaigns.status === 'fulfilled' && Array.isArray(rCampaigns.value) ? rCampaigns.value : defaults.campaigns;
    const forecast = rForecast.status === 'fulfilled' ? rForecast.value : defaults.forecast;
    const retention = rRetention.status === 'fulfilled' ? rRetention.value : defaults.retention;

    // If any promise was rejected, log details for diagnostics but still return HTTP 200 with defaults
    const rejected = results.filter((r) => r.status === 'rejected');
    if (rejected.length > 0) {
      console.error('analytics/overview: some fetches failed', rejected.map((r) => (r.reason && r.reason.message) || r));
    }

    return res.status(200).json({ totalDonors, activeDonors, emergencyCount, campaigns, forecast, retention });
  } catch (err) {
    // Extremely defensive: if Promise.allSettled itself fails (very unlikely), return safe defaults
    console.error('analytics/overview unexpected error', err && err.message ? err.message : err);
    return res.status(200).json({ totalDonors: 0, activeDonors: 0, emergencyCount: 0, campaigns: [], forecast: null, retention: null });
  }
});

module.exports = router;
