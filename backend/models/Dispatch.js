const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  dispatchId: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  hospital: { type: String, required: true },
  district: { type: String },
  bloodGroup: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['Pending', 'Dispatched', 'Completed'], default: 'Pending' },
  assignedAmbulance: {
    id: { type: String },
    driver: { type: String },
    phone: { type: String },
    location: {
      lat: Number,
      lng: Number,
    },
  },
  etaMinutes: { type: Number },
  patientContact: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

dispatchSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Dispatch', dispatchSchema);
