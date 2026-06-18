const express = require('express');
const Emergency = require('../models/Emergency');
const auth = require('../middleware/auth');
const aiService = require('../services/ai');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const list = await Emergency.find().populate('matchedDonors');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { bloodGroup, location, urgencyLevel, hospitalLoad = 50, unitsNeeded = 2, description } = req.body;
    const matched = await aiService.matchDonors({ bloodGroup, location, urgencyLevel });
    const emergency = new Emergency({
      bloodGroup,
      location,
      urgencyLevel,
      hospitalLoad,
      unitsNeeded,
      description,
      matchedDonors: matched.map((donor) => donor._id)
    });
    await emergency.save();
    res.status(201).json({ emergency, matched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/activate/:id', auth, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id).populate('matchedDonors');
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

    const notifications = emergency.matchedDonors.map((donor) => ({
      donorId: donor._id,
      message: `Emergency alert: ${emergency.bloodGroup} required in ${emergency.location}. Please respond immediately.`,
      channel: 'sms',
      status: 'sent',
    }));

    res.json({ emergency, notifications });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
