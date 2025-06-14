// server/models/Complaint.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    complainantName: { type: String, trim: true, required: [true, 'Complainant name is required.'] },
    complainantContact: { type: String, trim: true, required: [true, 'Contact number is required.'] },
    complainantEmail: { // New Field
        type: String, 
        trim: true, 
        required: [true, 'Complainant email is required.'],
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address.']
    },
    companyName: { type: String, trim: true, required: [true, 'Company name is required.'] },
    companyAddress: { type: String, trim: true, required: [true, 'Company address is required.'] },
    dateOfJoining: { type: Date, required: [true, 'Date of joining is required.'] },
    // employmentType: String, // Removed, add back if needed
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,
    // isAdoptiveOrCommissioning: String, // Removed, add back if needed
    // adoptionDate: Date, // Removed, add back if needed
    numberOfSurvivingChildren: { type: Number, min: 0, required: [true, 'Number of surviving children is required.'] },
    issuesFaced: [{ type: String, required: true }], // Changed from issueType to issuesFaced (array of strings)
    additionalInputs: { type: String, trim: true }, // Renamed from chronologyOfEvents, made optional
    supportingDocumentsInfo: { type: String, trim: true }, // Label changed on frontend
    consentToShare: { type: Boolean, required: [true, 'Consent to share information is required.'] },
    status: { 
        type: String, 
        default: 'submitted', 
        enum: [
            'submitted', 
            'under_review', 
            'information_requested', 
            'legal_notice_drafted', 
            'legal_notice_sent',
            'employer_responded',
            'resolved', 
            'closed'
        ] 
    },
    submittedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ComplaintSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Complaint', ComplaintSchema);