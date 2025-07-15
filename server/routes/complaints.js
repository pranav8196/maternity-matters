// server/routes/complaints.js
const express = require('express');
const Complaint = require('../models/Complaint');
const verifyToken = require('../middleware/verifyToken');
const { body, validationResult, check } = require('express-validator');
const sendEmail = require('../utils/mailer'); // <<< 1. IMPORT THE EMAIL UTILITY

const router = express.Router();

// Validation rules (no changes needed here)
const createComplaintValidationRules = [
    body('complainantName').notEmpty().withMessage('Complainant name is required.').trim().escape(),
    body('complainantContact').notEmpty().withMessage('Contact number is required.').matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number.').trim(),
    body('complainantEmail').isEmail().withMessage('Valid Email ID is required.').normalizeEmail(),
    body('companyName').notEmpty().withMessage('Company name is required.').trim().escape(),
    body('companyAddress').notEmpty().withMessage('Company address is required.').trim().escape(),
    body('companyPincode').notEmpty().withMessage('Pincode is required.').isPostalCode('IN').withMessage('Please enter a valid 6-digit Indian Pincode.'),
    body('dateOfJoining').isISO8601().toDate().withMessage('Valid date of joining is required.'),
    body('expectedDeliveryDate').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Valid expected delivery date required if provided.'),
    body('actualDeliveryDate').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Valid actual delivery date required if provided.'),
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
        if (complaintData.issuesFaced && !Array.isArray(complaintData.issuesFaced)) {
            complaintData.issuesFaced = [complaintData.issuesFaced];
        }
        const complaint = new Complaint(complaintData);
        await complaint.save();

        // --- 2. ADDED LOGIC TO SEND CONFIRMATION EMAIL ---
        try {
            await sendEmail({
                to: complaint.complainantEmail,
                subject: `Complaint Received | Maternity Matters (Ref: #${complaint._id.toString().slice(-6)})`,
                text: `Dear ${complaint.complainantName},\n\nThank you for submitting your complaint. We have successfully received it and assigned it the reference number #${complaint._id.toString().slice(-6)}.\n\nOur legal team will review your submission, and we will provide you with an update within 48 business hours.\n\nYou can view the status of your complaint at any time on your dashboard.\n\nSincerely,\nThe Team at Maternity Matters`,
                html: `
                    <p>Dear ${complaint.complainantName},</p>
                    <p>Thank you for submitting your complaint. We have successfully received it and assigned it the reference number <strong>#${complaint._id.toString().slice(-6)}</strong>.</p>
                    <p>Our legal team will review your submission, and we will provide you with an update within <strong>48 business hours</strong>.</p>
                    <p>You can view the status of your complaint at any time on your dashboard.</p>
                    <p>Sincerely,<br>The Team at Maternity Matters</p>
                `
            });
        } catch (emailError) {
            // Log the email error but don't fail the entire request,
            // as the complaint has already been saved successfully.
            console.error("Failed to send confirmation email, but complaint was saved:", emailError);
        }
        // --- End of new logic ---

        res.status(201).json({ message: 'Complaint submitted successfully!', complaintId: complaint._id, complaint });
    } catch (err) {
        next(err);
    }
});

// --- NO CHANGES to GET, PUT, or DELETE routes below this line ---

// GET /api/complaints/
router.get('/', verifyToken, async (req, res, next) => {
    try {
        const complaints = await Complaint.find({ userId: req.userId }).sort({ submittedAt: -1 });
        res.json(complaints);
    } catch (err) {
        next(err);
    }
});

// GET /api/complaints/:id
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

// PUT /api/complaints/:id
const updateComplaintValidationRules = [ 
    body('complainantName').optional().notEmpty().withMessage('Complainant name cannot be empty if provided.').trim().escape(),
    body('complainantContact').optional().notEmpty().withMessage('Contact number cannot be empty if provided.').matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian mobile number.').trim(),
    body('complainantEmail').optional().isEmail().withMessage('Valid Email ID is required if provided.').normalizeEmail(),
    body('companyPincode').optional().notEmpty().withMessage('Pincode cannot be empty if provided.').isPostalCode('IN').withMessage('Please enter a valid 6-digit Indian Pincode.'),
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
        
        const allowedUpdates = ['complainantName', 'complainantContact', 'complainantEmail', 'companyName', 'companyAddress', 'companyPincode', 'dateOfJoining', 'expectedDeliveryDate', 'actualDeliveryDate', 'numberOfSurvivingChildren', 'issuesFaced','additionalInputs', 'supportingDocumentsInfo', 'consentToShare'];
        
        let hasUpdates = false;
        allowedUpdates.forEach(key => {
            if (req.body[key] !== undefined ) {
                complaint[key] = req.body[key];
                hasUpdates = true;
            }
        });
        
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