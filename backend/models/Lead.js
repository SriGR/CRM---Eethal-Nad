const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    assignedTo: { type: String, required: true },
    statusIdpk: { type: Number, required: true },
    statusName: { type: String, required: true }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
