/**
 * EMERGENCY ROUTES
 * Emergency management: create, list, update, track
 */

const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const emergencyMatching = require('../services/emergencyMatching');
const bloodDemandForecast = require('../services/bloodDemandForecast');

/**
 * POST /api/emergency
 * Create new emergency blood request
 */
router.post('/', async (req, res) => {
  try {
    const {
      patientName,
      bloodTypeNeeded,
      unitsNeeded,
      location,
      hospital,
      urgencyLevel,
      emergencyType,
      description
    } = req.body;

    if (!bloodTypeNeeded || !location) {
      return res.status(400).json({
        status: 'error',
        data: null,
        explanation: 'bloodTypeNeeded and location required'
      });
    }

    const emergency = new Emergency({
      patientName,
      bloodTypeNeeded,
      bloodGroup: bloodTypeNeeded, // for compatibility
      unitsNeeded: unitsNeeded || 2,
      location,
      hospital,
      urgencyLevel: urgencyLevel || 'high',
      emergencyType,
      description,
      status: 'pending'
    });

    await emergency.save();

    res.status(201).json({
      status: 'success',
      data: {
        emergencyId: emergency._id,
        bloodTypeNeeded: emergency.bloodTypeNeeded,
        unitsNeeded: emergency.unitsNeeded,
        location: emergency.location,
        status: emergency.status,
        createdAt: emergency.createdAt
      },
      explanation: 'Emergency created successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/emergency
 * Get all emergencies
 */
router.get('/', async (req, res) => {
  try {
    const status = req.query.status;
    const query = status ? { status } : {};

    const emergencies = await Emergency.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      status: 'success',
      data: {
        total: emergencies.length,
        emergencies: emergencies.map(e => ({
          id: e._id,
          bloodTypeNeeded: e.bloodTypeNeeded,
          unitsNeeded: e.unitsNeeded,
          location: e.location,
          status: e.status,
          urgencyLevel: e.urgencyLevel,
          matchedDonorsCount: e.matchedDonors?.length || 0,
          respondedDonorsCount: e.respondedDonors?.length || 0,
          confirmedDonorsCount: e.confirmedDonors?.length || 0,
          createdAt: e.createdAt
        }))
      },
      explanation: `Retrieved ${emergencies.length} emergencies`
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/emergency/:emergencyId
 * Get emergency details
 */
router.get('/:emergencyId', async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.emergencyId);

    if (!emergency) {
      return res.status(404).json({
        status: 'error',
        data: null,
        explanation: 'Emergency not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        id: emergency._id,
        patientName: emergency.patientName,
        bloodTypeNeeded: emergency.bloodTypeNeeded,
        unitsNeeded: emergency.unitsNeeded,
        location: emergency.location,
        hospital: emergency.hospital,
        status: emergency.status,
        urgencyLevel: emergency.urgencyLevel,
        description: emergency.description,
        matchedDonors: emergency.matchedDonors || [],
        respondedDonors: emergency.respondedDonors || [],
        confirmedDonors: emergency.confirmedDonors || [],
        createdAt: emergency.createdAt,
        activatedAt: emergency.activatedAt,
        fulfilledAt: emergency.fulfilledAt
      },
      explanation: 'Emergency details retrieved'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/emergency/:emergencyId/match
 * Trigger donor matching for emergency
 */
router.post('/:emergencyId/match', async (req, res) => {
  try {
    const result = await emergencyMatching.matchDonorsForEmergency(req.params.emergencyId);
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
 * POST /api/emergency/:emergencyId/swarm
 * Activate swarm mode for emergency
 */
router.post('/:emergencyId/swarm', async (req, res) => {
  try {
    const result = await emergencyMatching.activateSwarmMode(req.params.emergencyId);
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
 * POST /api/emergency/:emergencyId/respond
 * Donor responds to emergency
 */
router.post('/:emergencyId/respond', async (req, res) => {
  try {
    const { donorId, donorName } = req.body;

    if (!donorId) {
      return res.status(400).json({
        status: 'error',
        data: null,
        explanation: 'donorId required'
      });
    }

    const emergency = await Emergency.findById(req.params.emergencyId);
    if (!emergency) {
      return res.status(404).json({
        status: 'error',
        data: null,
        explanation: 'Emergency not found'
      });
    }

    // Check if donor already responded
    const alreadyResponded = emergency.respondedDonors?.some(d => d.donorId.toString() === donorId);
    if (!alreadyResponded) {
      emergency.respondedDonors = emergency.respondedDonors || [];
      emergency.respondedDonors.push({
        donorId,
        name: donorName,
        responseTime: 0,
        respondedAt: new Date()
      });
      await emergency.save();
    }

    res.json({
      status: 'success',
      data: {
        emergencyId: emergency._id,
        totalResponses: emergency.respondedDonors.length
      },
      explanation: 'Donor response recorded'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * POST /api/emergency/:emergencyId/confirm
 * Confirm donor for blood collection
 */
router.post('/:emergencyId/confirm', async (req, res) => {
  try {
    const { donorId, donorName, bloodType, unitsConfirmed } = req.body;

    if (!donorId) {
      return res.status(400).json({
        status: 'error',
        data: null,
        explanation: 'donorId required'
      });
    }

    const emergency = await Emergency.findById(req.params.emergencyId);
    if (!emergency) {
      return res.status(404).json({
        status: 'error',
        data: null,
        explanation: 'Emergency not found'
      });
    }

    emergency.confirmedDonors = emergency.confirmedDonors || [];
    emergency.confirmedDonors.push({
      donorId,
      name: donorName,
      bloodType,
      confirmedAt: new Date(),
      unitsConfirmed: unitsConfirmed || 1
    });

    // Check if fully fulfilled
    const totalUnitsConfirmed = emergency.confirmedDonors.reduce((sum, d) => sum + (d.unitsConfirmed || 1), 0);
    if (totalUnitsConfirmed >= emergency.unitsNeeded) {
      emergency.status = 'fulfilled';
      emergency.fulfilledAt = new Date();
    } else if (emergency.status === 'pending') {
      emergency.status = 'partially_fulfilled';
    }

    await emergency.save();

    res.json({
      status: 'success',
      data: {
        emergencyId: emergency._id,
        confirmedCount: emergency.confirmedDonors.length,
        totalUnitsConfirmed,
        unitsNeeded: emergency.unitsNeeded,
        status: emergency.status
      },
      explanation: 'Donor confirmed'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * PUT /api/emergency/:emergencyId/status
 * Update emergency status
 */
router.put('/:emergencyId/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        data: null,
        explanation: 'status required'
      });
    }

    const emergency = await Emergency.findByIdAndUpdate(
      req.params.emergencyId,
      { status },
      { new: true }
    );

    if (!emergency) {
      return res.status(404).json({
        status: 'error',
        data: null,
        explanation: 'Emergency not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        emergencyId: emergency._id,
        status: emergency.status
      },
      explanation: 'Emergency status updated'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

/**
 * GET /api/emergency/active/count
 * Get count of active emergencies
 */
router.get('/stats/active', async (req, res) => {
  try {
    const activeEmergencies = await Emergency.countDocuments({
      status: { $in: ['pending', 'matching', 'swarm_active', 'partially_fulfilled'] }
    });

    res.json({
      status: 'success',
      data: {
        activeEmergencies
      },
      explanation: 'Active emergency count'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message
    });
  }
});

module.exports = router;
