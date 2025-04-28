const express = require('express');
const Lead = require('../models/Lead');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find();
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/save', async (req, res) => {
    const { name, email, phone, company, assignedTo, statusIdpk, statusName } = req.body;

    const newLead = new Lead({
        name,
        email,
        phone,
        company,
        assignedTo,
        statusIdpk,
        statusName
    });

    try {
        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/update/:id', async (req, res) => {
    const { name, email, phone, company, assignedTo, statusIdpk, statusName } = req.body;

    try {
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, company, assignedTo, statusIdpk, statusName },
            { new: true }
        );
        res.json(updatedLead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
