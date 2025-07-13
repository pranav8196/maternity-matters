// server/models/Complaint.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    complainantName: { type: String, trim: true, required: true },
    complainantContact: { type: String, trim: true, required: true },
    complainantEmail: { type: String, trim: true, required: true, lowercase: true },
    companyName: { type: String, trim: true, required: true },
    companyAddress: { type: String, trim: true, required: true },
    companyPincode: { type: String, trim: true, required: true }, // <<< NEW FIELD
    dateOfJoining: { type: Date, required: true },
    numberOfSurvivingChildren: { type: Number, min: 0, required: true },
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,
    issuesFaced: [{ type: String, required: true }],
    additionalInputs: { type: String, trim: true },
    supportingDocumentsInfo: { type: String, trim: true },
    consentToShare: { type: Boolean, required: true },
    status: { 
        type: String, 
        default: 'submitted', 
        enum: ['submitted', 'under_review', 'information_requested', 'legal_notice_drafted', 'legal_notice_sent', 'employer_responded', 'resolved', 'closed'] 
    },
    submittedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ComplaintSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Complaint', ComplaintSchema);