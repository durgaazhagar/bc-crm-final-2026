const Dispatch = require('../models/Dispatch');
const { v4: uuidv4 } = require('uuid');

exports.listDispatches = async (req, res) => {
  try {
    const { q, status, hospital, district, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { patientName: { $regex: q, $options: 'i' } },
        { hospital: { $regex: q, $options: 'i' } },
        { bloodGroup: { $regex: q, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;
    if (hospital) filter.hospital = hospital;
    if (district) filter.district = district;

    const total = await Dispatch.countDocuments(filter);
    const items = await Dispatch.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .lean();

    // Summary counts
    const totalAll = await Dispatch.countDocuments();
    const pending = await Dispatch.countDocuments({ status: 'Pending' });
    const dispatched = await Dispatch.countDocuments({ status: 'Dispatched' });
    const completed = await Dispatch.countDocuments({ status: 'Completed' });

    res.json({ total, items, summary: { totalAll, pending, dispatched, completed } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list dispatches' });
  }
};

exports.getDispatch = async (req, res) => {
  try {
    const d = await Dispatch.findById(req.params.id).lean();
    if (!d) return res.status(404).json({ error: 'Not found' });
    res.json(d);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get dispatch' });
  }
};

exports.createDispatch = async (req, res) => {
  try {
    const payload = req.body;
    const dispatch = new Dispatch({
      dispatchId: `D-${uuidv4().slice(0, 8)}`,
      patientName: payload.patientName,
      hospital: payload.hospital,
      district: payload.district,
      bloodGroup: payload.bloodGroup,
      quantity: payload.quantity || 1,
      patientContact: payload.patientContact,
      notes: payload.notes,
    });
    await dispatch.save();
    res.status(201).json(dispatch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create dispatch' });
  }
};

exports.assignAmbulance = async (req, res) => {
  try {
    const { id } = req.params;
    const { ambulanceId, driver, phone, etaMinutes, location } = req.body;
    const d = await Dispatch.findById(id);
    if (!d) return res.status(404).json({ error: 'Not found' });
    d.assignedAmbulance = { id: ambulanceId, driver, phone, location };
    d.etaMinutes = etaMinutes;
    d.status = 'Dispatched';
    await d.save();
    res.json(d);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign ambulance' });
  }
};

exports.notifyDonors = async (req, res) => {
  try {
    const { id } = req.params;
    // For now, stubbed notify logic; future: call AI matching service
    console.log(`Notify donors for dispatch ${id}`);
    res.json({ ok: true, message: 'Donors notified (stub)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to notify donors' });
  }
};
