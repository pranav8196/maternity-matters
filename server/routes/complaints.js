// server/routes/complaints.js
const express = require('express');
const Complaint = require('../models/Complaint');
const verifyToken = require('../middleware/verifyToken');
const { body, validationResult, check } = require('express-validator');

const router = express.Router();

// Updated validation rules for creating a complaint
const createComplaintValidationRules = [
    body('complainantName').notEmpty().withMessage('Complainant name is required.').trim().escape(),
    body('complainantContact').notEmpty().withMessage('Contact number is required.').matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number.').trim(),
    body('complainantEmail').isEmail().withMessage('Valid Email ID is required.').normalizeEmail(),
    body('companyName').notEmpty().withMessage('Company name is required.').trim().escape(),
    body('companyAddress').notEmpty().withMessage('Company address is required.').trim().escape(),
    body('dateOfJoining').isISO8601().toDate().withMessage('Valid date of joining is required.'),
    // body('employmentType').optional().trim().escape(), // Add back if needed
    body('expectedDeliveryDate').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Valid expected delivery date required if provided.'),
    body('actualDeliveryDate').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Valid actual delivery date required if provided.'),
    // body('isAdoptiveOrCommissioning').optional().isIn(['yes', 'no']), // Add back if needed
    // body('adoptionDate').optional({checkFalsy: true}).isISO8601().toDate(), // Add back if needed
    body('numberOfSurvivingChildren').isInt({ min: 0 }).withMessage('Number of surviving children must be a non-negative integer.'),
    body('issuesFaced').isArray({ min: 1 }).withMessage('At least one issue faced must be selected.')
        .custom((issues) => issues.every(issue => typeof issue === 'string' && issue.trim() !== '')).withMessage('Invalid issue format.'),
    body('additionalInputs').optional().trim().escape(),
    body('supportingDocumentsInfo').optional().trim().escape(),
    body('consentToShare').isBoolean().custom(value => {
        if (value !== true) {
            throw new Error('You must consent to share your information.');
        }
        return true;
    }),
];

// POST /api/complaints/ - Create a new complaint
router.post('/', verifyToken, createComplaintValidationRules, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const complaintData = { ...req.body, userId: req.userId };
        // Ensure issuesFaced is an array even if only one is sent (though frontend sends array)
        if (complaintData.issuesFaced && !Array.isArray(complaintData.issuesFaced)) {
            complaintData.issuesFaced = [complaintData.issuesFaced];
        }
        const complaint = new Complaint(complaintData);
        await complaint.save();
        res.status(201).json({ message: 'Complaint submitted successfully!', complaintId: complaint._id, complaint });
    } catch (err) {
        next(err);
    }
});

// GET /api/complaints/ - Get all complaints for the logged-in user
router.get('/', verifyToken, async (req, res, next) => {
    try {
        const complaints = await Complaint.find({ userId: req.userId }).sort({ submittedAt: -1 });
        res.json(complaints);
    } catch (err) {
        next(err);
    }
});

// GET /api/complaints/:id - Get a specific complaint by ID
router.get('/:id', verifyToken, [
    check('id').isMongoId().withMessage('Invalid complaint ID format.')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const complaint = await Complaint.findOne({ _id: req.params.id, userId: req.userId });
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found or you do not have permission to view it.' });
        }
        res.json(complaint);
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid complaint ID format.' });
        }
        next(err);
    }
});

// PUT /api/complaints/:id - Update a specific complaint (simplified update validation here)
const updateComplaintValidationRules = [ // Define specific rules for update if different
    body('complainantName').optional().notEmpty().withMessage('Complainant name cannot be empty if provided.').trim().escape(),
    body('complainantContact').optional().notEmpty().withMessage('Contact number cannot be empty if provided.').matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number.').trim(),
    body('complainantEmail').optional().isEmail().withMessage('Valid Email ID is required if provided.').normalizeEmail(),
    // ... add optional validations for other updatable fields
    body('issuesFaced').optional().isArray({ min: 1 }).withMessage('At least one issue faced must be selected if provided.')
        .custom((issues) => issues.every(issue => typeof issue === 'string' && issue.trim() !== '')).withMessage('Invalid issue format.'),
];

router.put('/:id', verifyToken, [
    check('id').isMongoId().withMessage('Invalid complaint ID format.'),
    ...updateComplaintValidationRules
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const complaint = await Complaint.findOne({ _id: req.params.id, userId: req.userId });

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found or you do not have permission to edit it.' });
        }
        
        // Update allowed fields
        const allowedUpdates = ['complainantName', 'complainantContact', 'complainantEmail', 'companyName', 'companyAddress', 'dateOfJoining', 'expectedDeliveryDate', 'actualDeliveryDate', 'numberOfSurvivingChildren', 'issuesFaced','additionalInputs', 'supportingDocumentsInfo', 'consentToShare'];
        // Note: 'consentToShare' update might need careful consideration. Usually not changed post-submission.
        // Removed employmentType, isAdoptiveOrCommissioning, adoptionDate from allowedUpdates as they are removed from form for now

        let hasUpdates = false;
        allowedUpdates.forEach(key => {
            if (req.body[key] !== undefined ) { // Update if key exists in body, even if value is same (e.g. for array/object changes)
                complaint[key] = req.body[key];
                hasUpdates = true;
            }
        });

        if (!hasUpdates && Object.keys(req.body).length > 0) { // Check if body had keys but none were allowed/changed
             // Or if you want to allow saving even if no fields changed:
            // return res.status(200).json({ message: 'No actual changes detected to update.', complaint });
        }
        
        complaint.updatedAt = Date.now();
        const updatedComplaint = await complaint.save();
        
        res.json({ message: 'Complaint updated successfully.', complaint: updatedComplaint });
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid complaint ID format.' });
        }
        next(err);
    }
});


// DELETE /api/complaints/:id
router.delete('/:id', verifyToken, [
    check('id').isMongoId().withMessage('Invalid complaint ID format.')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const complaint = await Complaint.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found or you do not have permission to delete it.' });
        }
        res.json({ message: 'Complaint deleted successfully.' });
    } catch (err) {
        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid complaint ID format.' });
        }
        next(err);
    }
});

module.exports = router;