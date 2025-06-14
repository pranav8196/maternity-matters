import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner'; // <<< 1. IMPORT THE SPINNER COMPONENT

const NewComplaintPage = () => {
  const { authAxios } = useAuth();
  const navigate = useNavigate();

  const initialFormData = {
    complainantName: '',
    complainantContact: '',
    complainantEmail: '',
    companyName: '',
    companyAddress: '',
    dateOfJoining: '',
    expectedDeliveryDate: '',
    actualDeliveryDate: '',
    numberOfSurvivingChildren: '0',
    issuesFaced: [],
    additionalInputs: '',
    supportingDocumentsInfo: '',
    consentToShare: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');
  const [formErrors, setFormErrors] = useState({});

  const issueOptions = [
    { value: "non_payment_salary", label: "Non-payment or Partial payment of Salary during Leave" },
    { value: "partial_leave_granted", label: "Partial Leave Granted (Less than Entitled)" },
    { value: "denial_of_leave", label: "Complete Denial of Maternity Leave" },
    { value: "termination_dismissal", label: "Termination or Dismissal due to Pregnancy/Maternity" },
    { value: "forceful_resignation", label: "Forceful Resignation due to Maternity/Pregnancy" },
    { value: "unfavorable_treatment_post_resuming", label: "Unfavourable Treatment post resuming work" },
    { value: "other_issue", label: "Other (Please specify in additional inputs)" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "issuesFaced") {
      setFormData(prev => {
        const currentIssues = prev.issuesFaced || [];
        if (checked) {
          return { ...prev, issuesFaced: [...currentIssues, value] };
        } else {
          return { ...prev, issuesFaced: currentIssues.filter(issue => issue !== value) };
        }
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.complainantName.trim()) errors.complainantName = "Full Name is required.";
    if (!formData.complainantContact.trim()) errors.complainantContact = "Contact Number is required.";
    else if (!/^[6-9]\d{9}$/.test(formData.complainantContact.trim())) errors.complainantContact = "Please enter a valid 10-digit Indian mobile number.";
    if (!formData.complainantEmail.trim()) errors.complainantEmail = "Email ID is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.complainantEmail.trim())) errors.complainantEmail = "Please enter a valid email address.";
    if (!formData.companyName.trim()) errors.companyName = "Company Name is required.";
    if (!formData.companyAddress.trim()) errors.companyAddress = "Company Address is required.";
    if (!formData.dateOfJoining) errors.dateOfJoining = "Date of Joining is required.";
    else if (new Date(formData.dateOfJoining) > new Date()) errors.dateOfJoining = "Date of joining cannot be in the future.";
    if (formData.numberOfSurvivingChildren === '' || parseInt(formData.numberOfSurvivingChildren) < 0) errors.numberOfSurvivingChildren = "Number of surviving children must be 0 or more.";
    if (formData.issuesFaced.length === 0) errors.issuesFaced = "Please select at least one issue faced.";
    // additionalInputs and supportingDocumentsInfo are optional by design here
    if (!formData.consentToShare) errors.consentToShare = "You must consent to share your information.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage('');
    setModalType('');

    if (!validateForm()) {
        setModalMessage("Please correct the errors highlighted in the form.");
        setModalType('error');
        const firstErrorFieldKey = Object.keys(formErrors).find(key => formErrors[key]);
        if (firstErrorFieldKey) {
            const firstErrorField = document.getElementsByName(firstErrorFieldKey)[0] || document.getElementById(firstErrorFieldKey); // Try getElementById for checkbox group
            firstErrorField?.focus();
        }
        return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      // Ensure number field is sent as number
      payload.numberOfSurvivingChildren = parseInt(payload.numberOfSurvivingChildren, 10);

      const response = await authAxios.post('/complaints', payload);
      setModalMessage(response.data.message || "Complaint submitted successfully!");
      setModalType('success');
      setFormData(initialFormData); // Reset form
      setFormErrors({});
      setTimeout(() => {
        setModalMessage('');
        navigate('/complaints');
      }, 2500);
    } catch (error) {
      console.error("Error submitting complaint:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.response?.data?.errors?.map(err => err.msg).join(', ') || "Failed to submit complaint. Please try again.";
      setModalMessage(errorMsg);
      setModalType('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const closeModal = () => {
    setModalMessage('');
    setModalType('');
  };

  const commonInputClass = "w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-colors";
  const errorTextClass = "text-red-600 text-xs mt-1";
  const errorBorderClass = "border-red-500 focus:ring-red-300";
  const normalBorderClass = "border-gray-300";

  return (
    <>
      <Modal message={modalMessage} type={modalType} onClose={closeModal} title={modalType === 'error' ? "Form Submission Error" : "Success"}/>
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-3xl mx-auto animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 text-center">File a New Complaint</h2>
        <p className="text-sm text-gray-600 mb-8 text-center">Please fill out this form with as much detail as possible. All information will be kept confidential.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Full Name */}
          <div>
            <label htmlFor="complainantName" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="complainantName" id="complainantName" value={formData.complainantName} onChange={handleChange} className={`${commonInputClass} ${formErrors.complainantName ? errorBorderClass : normalBorderClass}`} />
            {formErrors.complainantName && <p className={errorTextClass}>{formErrors.complainantName}</p>}
          </div>

          {/* ... (All your other form fields go here, no changes needed to them) ... */}
           {/* Contact Number */}
          <div>
            <label htmlFor="complainantContact" className="block text-sm font-medium text-gray-700 mb-1">Contact Number (10 digits) <span className="text-red-500">*</span></label>
            <input type="tel" name="complainantContact" id="complainantContact" value={formData.complainantContact} onChange={handleChange} pattern="[6-9]\d{9}" maxLength="10" placeholder="e.g., 9876543210" className={`${commonInputClass} ${formErrors.complainantContact ? errorBorderClass : normalBorderClass}`} />
            {formErrors.complainantContact && <p className={errorTextClass}>{formErrors.complainantContact}</p>}
          </div>

          {/* Email ID */}
          <div>
            <label htmlFor="complainantEmail" className="block text-sm font-medium text-gray-700 mb-1">Email ID <span className="text-red-500">*</span></label>
            <input type="email" name="complainantEmail" id="complainantEmail" value={formData.complainantEmail} onChange={handleChange} placeholder="you@example.com" className={`${commonInputClass} ${formErrors.complainantEmail ? errorBorderClass : normalBorderClass}`} />
            {formErrors.complainantEmail && <p className={errorTextClass}>{formErrors.complainantEmail}</p>}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
            <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} className={`${commonInputClass} ${formErrors.companyName ? errorBorderClass : normalBorderClass}`} />
            {formErrors.companyName && <p className={errorTextClass}>{formErrors.companyName}</p>}
          </div>

          {/* Company Address */}
          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">Company Address <span className="text-red-500">*</span></label>
            <textarea name="companyAddress" id="companyAddress" value={formData.companyAddress} onChange={handleChange} rows="3" className={`${commonInputClass} ${formErrors.companyAddress ? errorBorderClass : normalBorderClass}`} />
            {formErrors.companyAddress && <p className={errorTextClass}>{formErrors.companyAddress}</p>}
          </div>

          {/* Date of Joining */}
          <div>
            <label htmlFor="dateOfJoining" className="block text-sm font-medium text-gray-700 mb-1">Date of Joining Company <span className="text-red-500">*</span></label>
            <input type="date" name="dateOfJoining" id="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} className={`${commonInputClass} ${formErrors.dateOfJoining ? errorBorderClass : normalBorderClass}`} />
            {formErrors.dateOfJoining && <p className={errorTextClass}>{formErrors.dateOfJoining}</p>}
          </div>
          
          {/* Number of Surviving Children */}
          <div>
            <label htmlFor="numberOfSurvivingChildren" className="block text-sm font-medium text-gray-700 mb-1">Number of Surviving Children (excluding current pregnancy) <span className="text-red-500">*</span></label>
            <input type="number" name="numberOfSurvivingChildren" id="numberOfSurvivingChildren" value={formData.numberOfSurvivingChildren} onChange={handleChange} min="0" className={`${commonInputClass} ${formErrors.numberOfSurvivingChildren ? errorBorderClass : normalBorderClass}`} />
            <p className="text-xs text-gray-500 mt-1">Enter 0 if this is for your first child.</p>
            {formErrors.numberOfSurvivingChildren && <p className={errorTextClass}>{formErrors.numberOfSurvivingChildren}</p>}
          </div>

          {/* Expected Date of Delivery */}
          <div>
            <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700 mb-1">Expected Date of Delivery (EDD)</label>
            <input type="date" name="expectedDeliveryDate" id="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} className={`${commonInputClass} ${formErrors.expectedDeliveryDate ? errorBorderClass : normalBorderClass}`} />
            {formErrors.expectedDeliveryDate && <p className={errorTextClass}>{formErrors.expectedDeliveryDate}</p>}
          </div>

          {/* Actual Date of Delivery */}
          <div>
            <label htmlFor="actualDeliveryDate" className="block text-sm font-medium text-gray-700 mb-1">Actual Date of Delivery (if occurred)</label>
            <input type="date" name="actualDeliveryDate" id="actualDeliveryDate" value={formData.actualDeliveryDate} onChange={handleChange} className={`${commonInputClass} ${formErrors.actualDeliveryDate ? errorBorderClass : normalBorderClass}`} />
            {formErrors.actualDeliveryDate && <p className={errorTextClass}>{formErrors.actualDeliveryDate}</p>}
          </div>

          {/* Issues Faced (Checkboxes) */}
          <div id="issuesFaced">
            <label className="block text-sm font-medium text-gray-700 mb-2">Issues Faced <span className="text-red-500">*</span></label>
            <div className="space-y-2">
              {issueOptions.map(option => (
                <label key={option.value} className="flex items-center cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name="issuesFaced" value={option.value} checked={formData.issuesFaced.includes(option.value)} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {formErrors.issuesFaced && <p className={errorTextClass}>{formErrors.issuesFaced}</p>}
          </div>
          
          {/* Additional Inputs */}
          <div>
            <label htmlFor="additionalInputs" className="block text-sm font-medium text-gray-700 mb-1">Additional Inputs (Chronology of events, Key Stakeholders, etc.)</label>
            <textarea name="additionalInputs" id="additionalInputs" value={formData.additionalInputs} onChange={handleChange} rows="4" placeholder="E.g., Applied for leave on DD/MM/YYYY, Manager X denied it on DD/MM/YYYY..." className={`${commonInputClass} ${formErrors.additionalInputs ? errorBorderClass : normalBorderClass}`} />
            {formErrors.additionalInputs && <p className={errorTextClass}>{formErrors.additionalInputs}</p>}
          </div>

          {/* Documents Possessed Info */}
          <div>
            <label htmlFor="supportingDocumentsInfo" className="block text-sm font-medium text-gray-700 mb-1">Documents you possess (You may be asked to provide these later)</label>
            <textarea name="supportingDocumentsInfo" id="supportingDocumentsInfo" value={formData.supportingDocumentsInfo} onChange={handleChange} rows="3" placeholder="List documents like employment contract, leave application copy, emails, medical certificates..." className={`${commonInputClass} ${formErrors.supportingDocumentsInfo ? errorBorderClass : normalBorderClass}`} />
            {formErrors.supportingDocumentsInfo && <p className={errorTextClass}>{formErrors.supportingDocumentsInfo}</p>}
          </div>

          {/* Consent */}
          <div className="pt-4">
            <label htmlFor="consentToShare" className="flex items-start cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
              <input type="checkbox" id="consentToShare" name="consentToShare" checked={formData.consentToShare} onChange={handleChange} className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5 shrink-0" />
              <span className="ml-3 text-sm text-gray-700">
                I hereby consent to share the information provided in this form with empaneled legal professionals associated with Maternity Matters for the sole purpose of preparing a legal notice and assisting with my maternity benefit claim. I understand this information will be handled with strict confidentiality. <span className="text-red-500">*</span>
              </span>
            </label>
            {formErrors.consentToShare && <p className={`${errorTextClass} ml-8`}>{formErrors.consentToShare}</p>}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
            <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
              Cancel
            </button>
            {/* --- 2. UPDATED BUTTON WITH SPINNER LOGIC --- */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Submitting...</span>
                </>
              ) : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default NewComplaintPage;