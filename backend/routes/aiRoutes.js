/**
 * AI ROUTES
 * All AI engine endpoints: scoring, matching, forecasting, messages
 */

const express = require('express');
const router = express.Router();

const Donor = require('../models/Donor');
const aiEngineCore = require('../services/aiEngineCore');
const emergencyMatching = require('../services/emergencyMatching');
const lifeSaverScore = require('../services/lifeSaverScore');
const bloodDemandForecast = require('../services/bloodDemandForecast');
const donorDigitalTwin = require('../services/donorDigitalTwin');
const aiMessageEngine = require('../services/aiMessageEngine');

/**
 * GET /api/ai/system-health
 * Get current system health score
 */
router.get('/system-health', async (req, res) => {
  try {
    const result = await aiEngineCore.computeSystemHealth();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/ai/donor-activity
 * Analyze donor activity patterns
 */
router.get('/donor-activity', async (req, res) => {
  try {
    const result = await aiEngineCore.analyzeDonorActivity();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/ai/emergency-readiness
 * Compute emergency readiness score
 */
router.get('/emergency-readiness', async (req, res) => {
  try {
    const result = await aiEngineCore.computeEmergencyReadiness();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/ai/comprehensive-analysis
 * Get all AI metrics at once
 */
router.get('/comprehensive-analysis', async (req, res) => {
  try {
    const result = await aiEngineCore.getComprehensiveAnalysis();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/ai/match
 * Match donors for emergency (emergency control room)
 * Body: { emergencyId }
 */
router.post('/match', async (req, res) => {
  try {
    const { emergencyId } = req.body;
    if (!emergencyId) {
      return res.status(400).json({
        status: 'error',
        data: null,
        explanation: 'emergencyId required'
      });
    }

    const result = await emergencyMatching.matchDonorsForEmergency(emergencyId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

const locationCoordinates = {
  chennai: { lat: 13.0827, lng: 80.2707 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  salem: { lat: 11.6643, lng: 78.1460 },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047 },
  tirunelveli: { lat: 8.7139, lng: 77.7560 },
  vellore: { lat: 12.9165, lng: 79.1325 },
  erode: { lat: 11.3410, lng: 77.7172 },
  thanjavur: { lat: 10.7870, lng: 79.1378 },
  kanchipuram: { lat: 12.8342, lng: 79.7036 },
  tiruppur: { lat: 11.1085, lng: 77.3411 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  default: { lat: 13.0827, lng: 80.2707 }
};

const getCoordinates = (locationOrCoords) => {
  if (!locationOrCoords) return null;
  if (typeof locationOrCoords === 'object' && locationOrCoords.lat && locationOrCoords.lng) {
    return { lat: Number(locationOrCoords.lat), lng: Number(locationOrCoords.lng) };
  }

  const normalized = locationOrCoords.toString().trim().toLowerCase();
  const key = Object.keys(locationCoordinates).find((name) => normalized.includes(name));
  return locationCoordinates[key] || locationCoordinates.default;
};

const calculateDistanceKm = (from, to) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const lat1 = from.lat;
  const lon1 = from.lng;
  const lat2 = to.lat;
  const lon2 = to.lng;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

router.post('/nearest-donor', async (req, res) => {
  try {
    const { patientLocation, bloodGroup } = req.body;
    if (!patientLocation || !bloodGroup) {
      return res.status(400).json({ status: 'error', data: null, explanation: 'patientLocation and bloodGroup are required' });
    }

    const patientCoords = getCoordinates(patientLocation);
    if (!patientCoords) {
      return res.status(400).json({ status: 'error', data: null, explanation: 'Invalid patient location' });
    }

    const donors = await Donor.find({ bloodGroup: bloodGroup.toString().trim(), status: 'active' }).lean();
    if (!donors.length) {
      return res.status(404).json({ status: 'error', data: null, explanation: 'No active donors found for this blood group' });
    }

    const prepared = donors.map((donor) => {
      const donorCoords = getCoordinates(donor.location) || locationCoordinates.default;
      const distance = calculateDistanceKm(patientCoords, donorCoords);
      return {
        donor,
        coordinates: donorCoords,
        distance,
      };
    });

    const nearest = prepared.sort((a, b) => a.distance - b.distance)[0];
    const etaMinutes = Math.max(5, Math.round((nearest.distance / 40) * 60));
    const routeUrl = `https://www.google.com/maps/dir/${patientCoords.lat},${patientCoords.lng}/${nearest.coordinates.lat},${nearest.coordinates.lng}`;

    res.json({
      status: 'success',
      data: {
        donor: {
          id: nearest.donor._id,
          name: nearest.donor.name,
          bloodGroup: nearest.donor.bloodGroup,
          location: nearest.donor.location,
          coordinates: nearest.coordinates,
        },
        distanceKm: Number(nearest.distance.toFixed(2)),
        etaMinutes,
        routeUrl,
      },
      explanation: 'Nearest donor located successfully'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', data: null, explanation: error.message });
  }
});

router.post('/check-eligibility', async (req, res) => {
  try {
    const {
      age,
      weight,
      lastDonationDate,
      healthIssues = {},
      donations = 0,
      responseRate = 60,
      fraudSuspicion = false,
    } = req.body;

    if (typeof age !== 'number' || typeof weight !== 'number' || !lastDonationDate) {
      return res.status(400).json({ status: 'error', data: null, explanation: 'age, weight, and lastDonationDate are required' });
    }

    const result = { eligible: true, reasons: [] };
    if (age < 18) result.reasons.push('Age below 18');
    if (weight < 50) result.reasons.push('Weight below 50kg');

    const lastDonation = new Date(lastDonationDate);
    if (Number.isNaN(lastDonation.getTime())) {
      return res.status(400).json({ status: 'error', data: null, explanation: 'Invalid lastDonationDate format' });
    }

    const daysSinceLastDonation = Math.floor((Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastDonation < 90) {
      result.reasons.push('Less than 90 days since last donation');
    }

    if (healthIssues.hbLow) result.reasons.push('Low hemoglobin');
    if (healthIssues.chronicIllness) result.reasons.push('Chronic illness');

    const baseScore = 50;
    let aiScore = baseScore;
    if (donations >= 10) aiScore += 10;
    if (responseRate >= 80) aiScore += 10;
    if (fraudSuspicion) aiScore -= 20;
    if (!result.reasons.length) aiScore += 5;
    aiScore = Math.max(0, Math.min(100, aiScore));

    const eligible = result.reasons.length === 0;
    res.json({
      status: 'success',
      data: {
        eligible,
        reason: eligible ? 'Eligible for donation' : result.reasons.join(', '),
        score: aiScore,
        daysSinceLastDonation,
        details: {
          age,
          weight,
          lastDonationDate,
          healthIssues,
          donations,
          responseRate,
          fraudSuspicion,
        },
      },
      explanation: eligible ? 'Eligibility check passed' : 'Eligibility check failed'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', data: null, explanation: error.message });
  }
});

/**
 * POST /api/ai/check-eligibility
 * Check donor eligibility
 * Body: { age, weight, lastDonationDate, healthIssues, donations, responseRate, fraudSuspicion }
 */
router.post('/check-eligibility', async (req, res) => {
  try {
    const {
      age,
      weight,
      lastDonationDate,
      healthIssues = {},
      donations = 0,
      responseRate = 60,
      fraudSuspicion = false,
    } = req.body;

    if (typeof age !== 'number' || typeof weight !== 'number' || !lastDonationDate) {
      return res.status(400).json({ status: 'error', data: null, explanation: 'age, weight, and lastDonationDate are required' });
    }

    const result = { eligible: true, reasons: [] };
    if (age < 18) result.reasons.push('Age below 18');
    if (weight < 50) result.reasons.push('Weight below 50kg');

    const lastDonation = new Date(lastDonationDate);
    if (Number.isNaN(lastDonation.getTime())) {
      return res.status(400).json({ status: 'error', data: null, explanation: 'Invalid lastDonationDate format' });
    }

    const daysSinceLastDonation = Math.floor((Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastDonation < 90) {
      result.reasons.push('Less than 90 days since last donation');
    }

    if (healthIssues.hbLow) result.reasons.push('Low hemoglobin');
    if (healthIssues.chronicIllness) result.reasons.push('Chronic illness');

    const baseScore = 50;
    let aiScore = baseScore;
    if (donations >= 10) aiScore += 10;
    if (responseRate >= 80) aiScore += 10;
    if (fraudSuspicion) aiScore -= 20;
    if (!result.reasons.length) aiScore += 5;
    aiScore = Math.max(0, Math.min(100, aiScore));

    const eligible = result.reasons.length === 0;
    res.json({
      status: 'success',
      data: {
        eligible,
        reason: eligible ? 'Eligible for donation' : result.reasons.join(', '),
        score: aiScore,
        daysSinceLastDonation,
        details: {
          age,
          weight,
          lastDonationDate,
          healthIssues,
          donations,
          responseRate,
          fraudSuspicion,
        },
      },
      explanation: eligible ? 'Eligibility check passed' : 'Eligibility check failed'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', data: null, explanation: error.message });
  }
});

/**
 * POST /api/ai/emergency-priority
 * Classify emergency priority level
 * Body: { bloodGroup, urgency, hospitalLoad, unitsNeeded }
 */
router.post('/emergency-priority', async (req, res) => {
  try {
    const { bloodGroup, urgency, hospitalLoad = 50, unitsNeeded = 2 } = req.body;
    if (!bloodGroup || !urgency) {
      return res.status(400).json({ status: 'error', data: null, explanation: 'bloodGroup and urgency are required' });
    }

    let priority = 'Low';
    let eta = '24 hours';
    let colorClass = 'from-green-500 to-emerald-500';
    let icon = '🟢';

    const urgencyMap = { critical: 4, high: 3, medium: 2, low: 1 };
    const urgencyScore = urgencyMap[urgency.toLowerCase()] || 1;
    const score = urgencyScore + (hospitalLoad / 30) + (unitsNeeded / 3);

    if (score >= 8) {
      priority = 'Critical';
      eta = '5 minutes';
      colorClass = 'from-red-500 to-rose-600';
      icon = '🔴';
    } else if (score >= 5.5) {
      priority = 'High';
      eta = '15 minutes';
      colorClass = 'from-orange-500 to-red-500';
      icon = '🟠';
    } else if (score >= 3.5) {
      priority = 'Medium';
      eta = '45 minutes';
      colorClass = 'from-yellow-500 to-amber-500';
      icon = '🟡';
    }

    res.json({
      status: 'success',
      data: {
        priority,
        eta,
        colorClass,
        icon,
        bloodGroup,
        urgency,
        hospitalLoad,
        unitsNeeded,
        score: Math.round(score * 10) / 10,
      },
      explanation: `Emergency classified as ${priority} priority with ETA ${eta}`
    });
  } catch (error) {
    res.status(500).json({ status: 'error', data: null, explanation: error.message });
  }
});

/**
 * POST /api/ai/predict-shortage
 * Predict blood shortages based on trends
 * Body: { recentDonations, hospitalUsage, bloodGroups }
 */
router.post('/predict-shortage', async (req, res) => {
  try {
    const { recentDonations = {}, hospitalUsage = {}, bloodGroups = ['O+', 'A+', 'B+', 'AB+'] } = req.body;

    const predictions = bloodGroups.map((bg) => {
      const donations = recentDonations[bg] || 15;
      const usage = hospitalUsage[bg] || 12;
      const trend = donations - usage;

      let status = 'Safe';
      let statusColor = 'from-green-500 to-emerald-500';
      let statusIcon = '🟢';
      let daysToShortage = 30;

      if (trend < 3) {
        status = 'Warning';
        statusColor = 'from-orange-500 to-yellow-500';
        statusIcon = '🟠';
        daysToShortage = Math.max(5, 10 - Math.abs(trend));
      }

      if (trend < -2) {
        status = 'Shortage';
        statusColor = 'from-red-500 to-rose-600';
        statusIcon = '🔴';
        daysToShortage = Math.max(1, 5 + trend);
      }

      return {
        bloodGroup: bg,
        donations,
        usage,
        trend,
        status,
        statusColor,
        statusIcon,
        daysToShortage,
      };
    });

    const criticalGroups = predictions.filter((p) => p.status === 'Shortage');
    const warningGroups = predictions.filter((p) => p.status === 'Warning');

    res.json({
      status: 'success',
      data: {
        predictions,
        criticalGroups,
        warningGroups,
        overallStatus: criticalGroups.length > 0 ? 'Critical' : warningGroups.length > 0 ? 'Warning' : 'Safe',
        timestamp: new Date().toISOString(),
      },
      explanation: `Shortage forecast: ${criticalGroups.length} critical groups, ${warningGroups.length} warning groups`
    });
  } catch (error) {
    res.status(500).json({ status: 'error', data: null, explanation: error.message });
  }
});

/**
 * POST /api/ai/swarm
 * Activate emergency swarm mode
 * Body: { emergencyId }
 */
router.post('/swarm', async (req, res) => {
  try {
    const { emergencyId } = req.body;
    if (!emergencyId) {
      return res.status(400).json({
        status: 'error',
        data: null,
        explanation: 'emergencyId required'
      });
    }

    const result = await emergencyMatching.activateSwarmMode(emergencyId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/ai/emergency-status/:emergencyId
 * Get live matching status for emergency
 */
router.get('/emergency-status/:emergencyId', async (req, res) => {
  try {
    const result = await emergencyMatching.getLiveMatchingStatus(req.params.emergencyId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/ai/score/:donorId
 * Get Life Saver Score for donor
 */
router.get('/score/:donorId', async (req, res) => {
  try {
    const result = await lifeSaverScore.getDonorScoreReport(req.params.donorId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * PUT /api/ai/score/:donorId
 * Update Life Saver Score
 */
router.put('/score/:donorId', async (req, res) => {
  try {
    const result = await lifeSaverScore.updateLifeSaverScore(req.params.donorId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/ai/leaderboard
 * Get top donors by Life Saver Score
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const result = await lifeSaverScore.getLifeSaverLeaderboard(parseInt(limit));
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/ai/update-all-scores
 * Update all donor scores (batch)
 */
router.post('/update-all-scores', async (req, res) => {
  try {
    const result = await lifeSaverScore.updateAllDonorScores();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/ai/forecast
 * Get blood demand forecast for next 7 days
 */
router.get('/forecast', async (req, res) => {
  try {
    const result = await bloodDemandForecast.forecastDemand();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/ai/shortage-risk
 * Assess shortage risk by blood type
 */
router.get('/shortage-risk', async (req, res) => {
  try {
    const result = await bloodDemandForecast.assessShortageRisk();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/ai/forecast/:region
 * Get forecast for specific region
 */
router.get('/forecast/:region', async (req, res) => {
  try {
    const result = await bloodDemandForecast.getForecastByRegion(req.params.region);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/ai/digital-twin/:donorId
 * Build digital twin for donor
 */
router.post('/digital-twin/:donorId', async (req, res) => {
  try {
    const result = await donorDigitalTwin.buildDigitalTwin(req.params.donorId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/ai/digital-twin/batch/all
 * Build digital twins for all donors
 */
router.post('/digital-twin/batch/all', async (req, res) => {
  try {
    const result = await donorDigitalTwin.buildAllDigitalTwins();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/ai/message/emergency-alert
 * Generate emergency alert message
 * Body: { bloodTypeNeeded, unitsNeeded, location, emergencyType, patientName }
 */
router.post('/message/emergency-alert', async (req, res) => {
  try {
    const result = await aiMessageEngine.generateEmergencyAlert(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/ai/message/thank-you
 * Generate thank you message
 * Body: { name, donationCount, bloodType, estimatedLivesSaved }
 */
router.post('/message/thank-you', async (req, res) => {
  try {
    const result = await aiMessageEngine.generateThankYouMessage(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/ai/message/re-engagement
 * Generate re-engagement message
 * Body: { name, lastDonation, donationCount, bloodType }
 */
router.post('/message/re-engagement', async (req, res) => {
  try {
    const result = await aiMessageEngine.generateReengagementMessage(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/ai/message/custom
 * Generate custom message
 * Body: { prompt }
 */
router.post('/message/custom', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        data: null,
        explanation: 'prompt required'
      });
    }

    const result = await aiMessageEngine.generateCustomMessage(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

module.exports = router;
