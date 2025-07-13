import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

// --- Helper Components for the Wizard ---

const ProgressBar = ({ currentStep, totalSteps }) => {
  const steps = [
      { number: 1, title: 'Personal' },
      { number: 2, title: 'Employment' },
      { number: 3, title: 'The Issue' },
      { number: 4, title: 'Submit' }
  ];
  return (
    <div className="flex items-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center text-center w-1/4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300
                ${currentStep > step.number ? 'bg-green-500 text-white border-2 border-green-500' : ''}
                ${currentStep === step.number ? 'bg-brand-primary text-white ring-4 ring-brand-primary/30 border-2 border-brand-primary' : ''}
                ${currentStep < step.number ? 'bg-white text-brand-text border-2 border-gray-300' : ''}
              `}
            >
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <p className={`mt-2 text-xs font-semibold ${currentStep >= step.number ? 'text-brand-primary' : 'text-gray-500'}`}>
              {step.title}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-auto border-t-2 transition-colors duration-300
              ${currentStep > step.number ? 'border-green-500' : 'border-gray-200'}
            `}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const FormStep = ({ children }) => {
    return <div className="animate-fade-in space-y-6">{children}</div>;
};


// --- Main Component ---

const NewComplaintPage = () => {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const initialFormData = {
    complainantName: '',
    complainantContact: '',
    complainantEmail: '',
    companyName: '',
    companyAddress: '',
    companyPincode: '',
    dateOfJoining: '',
    numberOfSurvivingChildren: '0',
    expectedDeliveryDate: '',
    actualDeliveryDate: '',
    issuesFaced: [],
    additionalInputs: '',
    supportingDocumentsInfo: '',
    consentToShare: false,
    agreedToPolicies: false, 
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const totalSteps = 4;

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
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.complainantName.trim()) errors.complainantName = "Full Name is required.";
      if (!formData.complainantContact.trim()) errors.complainantContact = "Contact Number is required.";
      else if (!/^[6-9]\d{9}$/.test(formData.complainantContact.trim())) errors.complainantContact = "Please enter a valid 10-digit Indian mobile number.";
      if (!formData.complainantEmail.trim()) errors.complainantEmail = "Email ID is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.complainantEmail.trim())) errors.complainantEmail = "Please enter a valid email address.";
    }
    if (step === 2) {
      if (!formData.companyName.trim()) errors.companyName = "Company Name is required.";
      if (!formData.companyAddress.trim()) errors.companyAddress = "Company Address is required.";
      if (!formData.companyPincode.trim()) errors.companyPincode = "Pincode is required.";
      else if (!/^\d{6}$/.test(formData.companyPincode.trim())) errors.companyPincode = "Please enter a valid 6-digit Indian Pincode.";
      if (!formData.dateOfJoining) errors.dateOfJoining = "Date of Joining is required.";
      else if (new Date(formData.dateOfJoining) > new Date()) errors.dateOfJoining = "Date of joining cannot be in the future.";
    }
    if (step === 3) {
      if (formData.numberOfSurvivingChildren === '' || parseInt(formData.numberOfSurvivingChildren) < 0) errors.numberOfSurvivingChildren = "Number of surviving children must be 0 or more.";
      if (formData.issuesFaced.length === 0) errors.issuesFaced = "Please select at least one issue faced.";
    }
    if (step === 4) {
        if (!formData.agreedToPolicies) errors.agreedToPolicies = "You must agree to the Terms of Service and Privacy Policy.";
        if (!formData.consentToShare) errors.consentToShare = "You must consent to share your information.";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) { if (currentStep < totalSteps) setCurrentStep(p => p + 1); } };
  const handlePrev = () => { if (currentStep > 1) setCurrentStep(p => p - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
        toast.error("Please correct the errors in the form.");
        for (let i = 1; i <= totalSteps; i++) { if (!validateStep(i)) { setCurrentStep(i); break; } }
        return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your complaint...');

    try {
      const payload = { ...formData, numberOfSurvivingChildren: parseInt(formData.numberOfSurvivingChildren, 10) };
      const response = await authAxios.post('/complaints', payload);
      
      toast.success(response.data.message || "Complaint submitted successfully!", { id: toastId, duration: 4000 });
      setIsSubmitted(true);
      
      setTimeout(() => {
        navigate('/complaints');
      }, 4000);
    } catch (error) {
      console.error("Error submitting complaint:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.error || error.response?.data?.errors?.map(err => err.msg).join(', ') || "Failed to submit complaint.";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonInputClass = "w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-colors";
  const errorTextClass = "text-red-600 text-xs mt-1";
  const errorBorderClass = "border-red-500 focus:ring-red-300";
  const normalBorderClass = "border-gray-300";

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-3xl mx-auto animate-fade-in">
        
        {isSubmitted ? (
            <div className="text-center py-8">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h2 className="text-2xl font-bold text-brand-headings">Thank You!</h2>
                <p className="mt-2 text-brand-text">Your complaint has been submitted successfully. Our team will review it and get back to you shortly.</p>
                <p className="mt-4 text-sm text-gray-500">You will be redirected to your complaints dashboard in a few seconds...</p>
            </div>
        ) : (
            <>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-brand-headings mb-2 text-center">File a New Complaint</h2>
                <p className="text-sm text-gray-500 mb-8 text-center">Follow the steps to complete your submission.</p>
                
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

                <form onSubmit={handleSubmit} noValidate>
                    {/* This logic now correctly shows/hides the steps */}
                    <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                        <FormStep>
                            <div>
                                <label htmlFor="complainantName" className="block text-sm font-medium text-brand-text mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input type="text" name="complainantName" id="complainantName" value={formData.complainantName} onChange={handleChange} className={`${commonInputClass} ${formErrors.complainantName ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.complainantName && <p className={errorTextClass}>{formErrors.complainantName}</p>}
                            </div>
                            <div>
                                <label htmlFor="complainantContact" className="block text-sm font-medium text-brand-text mb-1">Contact Number (10 digits) <span className="text-red-500">*</span></label>
                                <input type="tel" name="complainantContact" id="complainantContact" value={formData.complainantContact} onChange={handleChange} pattern="[6-9]\d{9}" maxLength="10" placeholder="e.g., 9876543210" className={`${commonInputClass} ${formErrors.complainantContact ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.complainantContact && <p className={errorTextClass}>{formErrors.complainantContact}</p>}
                            </div>
                            <div>
                                <label htmlFor="complainantEmail" className="block text-sm font-medium text-brand-text mb-1">Email ID <span className="text-red-500">*</span></label>
                                <input type="email" name="complainantEmail" id="complainantEmail" value={formData.complainantEmail} onChange={handleChange} placeholder="you@example.com" className={`${commonInputClass} ${formErrors.complainantEmail ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.complainantEmail && <p className={errorTextClass}>{formErrors.complainantEmail}</p>}
                            </div>
                        </FormStep>
                    </div>
                    <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                        <FormStep>
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-brand-text mb-1">Company Name <span className="text-red-500">*</span></label>
                                <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} className={`${commonInputClass} ${formErrors.companyName ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.companyName && <p className={errorTextClass}>{formErrors.companyName}</p>}
                            </div>
                            <div>
                                <label htmlFor="companyAddress" className="block text-sm font-medium text-brand-text mb-1">Company Address <span className="text-red-500">*</span></label>
                                <textarea name="companyAddress" id="companyAddress" value={formData.companyAddress} onChange={handleChange} rows="3" className={`${commonInputClass} ${formErrors.companyAddress ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.companyAddress && <p className={errorTextClass}>{formErrors.companyAddress}</p>}
                            </div>
                            <div>
                                <label htmlFor="companyPincode" className="block text-sm font-medium text-brand-text mb-1">Company Pincode <span className="text-red-500">*</span></label>
                                <input type="tel" name="companyPincode" id="companyPincode" value={formData.companyPincode} onChange={handleChange} pattern="\d{6}" maxLength="6" placeholder="e.g., 400001" className={`${commonInputClass} ${formErrors.companyPincode ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.companyPincode && <p className={errorTextClass}>{formErrors.companyPincode}</p>}
                            </div>
                            <div>
                                <label htmlFor="dateOfJoining" className="block text-sm font-medium text-brand-text mb-1">Date of Joining Company <span className="text-red-500">*</span></label>
                                <input type="date" name="dateOfJoining" id="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} className={`${commonInputClass} ${formErrors.dateOfJoining ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.dateOfJoining && <p className={errorTextClass}>{formErrors.dateOfJoining}</p>}
                            </div>
                        </FormStep>
                    </div>
                    <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
                        <FormStep>
                            <div>
                                <label htmlFor="numberOfSurvivingChildren" className="block text-sm font-medium text-brand-text mb-1">Number of Surviving Children (excluding current pregnancy) <span className="text-red-500">*</span></label>
                                <input type="number" name="numberOfSurvivingChildren" id="numberOfSurvivingChildren" value={formData.numberOfSurvivingChildren} onChange={handleChange} min="0" className={`${commonInputClass} ${formErrors.numberOfSurvivingChildren ? errorBorderClass : normalBorderClass}`} />
                                <p className="text-xs text-gray-500 mt-1">Enter 0 if this is for your first child.</p>
                                {formErrors.numberOfSurvivingChildren && <p className={errorTextClass}>{formErrors.numberOfSurvivingChildren}</p>}
                            </div>
                            <div>
                                <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-brand-text mb-1">Expected Date of Delivery (EDD)</label>
                                <input type="date" name="expectedDeliveryDate" id="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} className={`${commonInputClass} ${formErrors.expectedDeliveryDate ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.expectedDeliveryDate && <p className={errorTextClass}>{formErrors.expectedDeliveryDate}</p>}
                            </div>
                            <div>
                                <label htmlFor="actualDeliveryDate" className="block text-sm font-medium text-brand-text mb-1">Actual Date of Delivery (if occurred)</label>
                                <input type="date" name="actualDeliveryDate" id="actualDeliveryDate" value={formData.actualDeliveryDate} onChange={handleChange} className={`${commonInputClass} ${formErrors.actualDeliveryDate ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.actualDeliveryDate && <p className={errorTextClass}>{formErrors.actualDeliveryDate}</p>}
                            </div>
                            <div id="issuesFaced">
                                <label className="block text-sm font-medium text-brand-text mb-2">Issues Faced <span className="text-red-500">*</span></label>
                                <div className="space-y-2">
                                    {issueOptions.map(option => (
                                        <label key={option.value} className="flex items-center cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                                            <input type="checkbox" name="issuesFaced" value={option.value} checked={formData.issuesFaced.includes(option.value)} onChange={handleChange} className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                                            <span className="ml-2 text-sm text-brand-text">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {formErrors.issuesFaced && <p className={errorTextClass}>{formErrors.issuesFaced}</p>}
                            </div>
                        </FormStep>
                    </div>
                    <div style={{ display: currentStep === 4 ? 'block' : 'none' }}>
                        <FormStep>
                            <div>
                                <label htmlFor="additionalInputs" className="block text-sm font-medium text-brand-text mb-1">Additional Inputs (Chronology of events, Key Stakeholders, etc.)</label>
                                <textarea name="additionalInputs" id="additionalInputs" value={formData.additionalInputs} onChange={handleChange} rows="4" placeholder="E.g., Applied for leave on DD/MM/YYYY, Manager X denied it on DD/MM/YYYY..." className={`${commonInputClass} ${formErrors.additionalInputs ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.additionalInputs && <p className={errorTextClass}>{formErrors.additionalInputs}</p>}
                            </div>
                            <div>
                                <label htmlFor="supportingDocumentsInfo" className="block text-sm font-medium text-brand-text mb-1">Documents you possess (You may be asked to provide these later)</label>
                                <textarea name="supportingDocumentsInfo" id="supportingDocumentsInfo" value={formData.supportingDocumentsInfo} onChange={handleChange} rows="3" placeholder="List documents like employment contract, leave application copy, emails, medical certificates..." className={`${commonInputClass} ${formErrors.supportingDocumentsInfo ? errorBorderClass : normalBorderClass}`} />
                                {formErrors.supportingDocumentsInfo && <p className={errorTextClass}>{formErrors.supportingDocumentsInfo}</p>}
                            </div>
                            <div className="pt-4 space-y-4">
                                <label htmlFor="agreedToPolicies" className="flex items-start cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <input type="checkbox" id="agreedToPolicies" name="agreedToPolicies" checked={formData.agreedToPolicies} onChange={handleChange} className="h-5 w-5 text-brand-primary border-gray-300 rounded focus:ring-brand-primary mt-0.5 shrink-0" />
                                    <span className="ml-3 text-sm text-brand-text">
                                        I have read and agree to the{' '}
                                        <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">Terms of Service</Link>
                                        {' '}and{' '}
                                        <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline">Privacy Policy</Link>.
                                        <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                {formErrors.agreedToPolicies && <p className={`${errorTextClass} ml-8`}>{formErrors.agreedToPolicies}</p>}

                                <label htmlFor="consentToShare" className="flex items-start cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors">
                                    <input type="checkbox" id="consentToShare" name="consentToShare" checked={formData.consentToShare} onChange={handleChange} className="h-5 w-5 text-brand-primary border-gray-300 rounded focus:ring-brand-primary mt-0.5 shrink-0" />
                                    <span className="ml-3 text-sm text-brand-text">
                                        I hereby consent to share the information provided in this form with empaneled legal professionals for the sole purpose of preparing a legal notice and assisting with my maternity benefit claim. <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                {formErrors.consentToShare && <p className={`${errorTextClass} ml-8`}>{formErrors.consentToShare}</p>}
                            </div>
                        </FormStep>
                    </div>

                    <div className="flex justify-between items-center pt-6">
                        <div>
                        {currentStep > 1 && (
                            <button type="button" onClick={handlePrev} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">Back</button>
                        )}
                        </div>
                        <div>
                        {currentStep < totalSteps && (
                            <button type="button" onClick={handleNext} className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg shadow-md">Next</button>
                        )}
                        {currentStep === totalSteps && (
                            <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? <><Spinner /> <span>Submitting...</span></> : 'Submit Complaint'}
                            </button>
                        )}
                        </div>
                    </div>
                </form>
            </>
        )}
      </div>
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </>
  );
};

export default NewComplaintPage;