import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

// Helper object for status explanations
const statusExplanations = {
  submitted: {
    title: "Complaint Submitted",
    description: "Your complaint has been successfully received. It is now in our queue and will be assigned to a legal professional for review shortly.",
    color: "bg-blue-100 text-blue-800 border-blue-300"
  },
  under_review: {
    title: "Under Review",
    description: "A lawyer is currently reviewing the details of your complaint. They will assess the information and determine the best course of action. They may contact you if further information is required.",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300"
  },
  information_requested: {
    title: "Information Requested",
    description: "Our legal team requires more information or clarification from you to proceed. Please check your registered email for details or await contact from our team.",
    color: "bg-orange-100 text-orange-800 border-orange-300"
  },
  legal_notice_drafted: {
    title: "Legal Notice Drafted",
    description: "A legal notice based on your complaint has been prepared and is pending final review before being sent.",
    color: "bg-indigo-100 text-indigo-800 border-indigo-300"
  },
  legal_notice_sent: {
    title: "Legal Notice Sent",
    description: "The legal notice has been sent to your employer. We will update you as soon as we receive a response or after the notice period has elapsed.",
    color: "bg-teal-100 text-teal-800 border-teal-300"
  },
  employer_responded: {
    title: "Employer Responded",
    description: "We have received a response from your employer regarding the legal notice. Our legal team is reviewing it and will advise on the next steps.",
    color: "bg-purple-100 text-purple-800 border-purple-300"
  },
  resolved: {
    title: "Resolved",
    description: "Congratulations! Your issue has been marked as resolved. Please check your email for final details. Contact us if you have any questions.",
    color: "bg-green-100 text-green-800 border-green-300"
  },
  closed: {
    title: "Closed",
    description: "This complaint case is now closed. If you have further questions or a new issue, please feel free to contact us or file a new complaint.",
    color: "bg-gray-200 text-gray-800 border-gray-300"
  },
};

const ViewComplaintsPage = () => {
  const { authAxios, currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = useCallback(async () => {
    if (!currentUser) {
        setIsLoading(false);
        setError("Please log in to view complaints.");
        return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await authAxios.get('/complaints');
      setComplaints(response.data);
    } catch (err) {
      console.error("Error fetching complaints:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to fetch your complaints. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [authAxios, currentUser]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
  };

  // New helper to format status text for display
  const formatStatusText = (status) => {
      if (!status) return 'N/A';
      return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    return statusExplanations[s]?.color || 'bg-gray-100 text-gray-600 border-gray-300';
  };
  
  const renderComplaintDetailsInModal = () => {
    if (!selectedComplaint) return null;
    const currentStatusInfo = statusExplanations[selectedComplaint.status] || { title: "Unknown Status", description: "The status of this complaint is not defined.", color: "bg-gray-100" };

    const detailsToShow = [
        { label: 'Complaint ID', value: selectedComplaint._id?.slice(-8) || 'N/A' },
        { label: 'Submitted On', value: formatDate(selectedComplaint.submittedAt) },
        // ... (other fields) ...
        { label: 'Complainant Name', value: selectedComplaint.complainantName },
        { label: 'Contact', value: selectedComplaint.complainantContact },
        { label: 'Email', value: selectedComplaint.complainantEmail },
        { label: 'Company Name', value: selectedComplaint.companyName },
        { label: 'Company Address', value: selectedComplaint.companyAddress },
        { label: 'Date of Joining', value: formatDate(selectedComplaint.dateOfJoining) },
        { label: 'Surviving Children', value: selectedComplaint.numberOfSurvivingChildren },
        { label: 'Issues Faced', value: selectedComplaint.issuesFaced?.map(formatStatusText).join(', ') },
        { label: 'Additional Inputs', value: selectedComplaint.additionalInputs, pre: true },
        { label: 'Supporting Documents Info', value: selectedComplaint.supportingDocumentsInfo || 'N/A', pre: true },
        { label: 'Consent to Share', value: selectedComplaint.consentToShare ? 'Yes' : 'No' },
    ];

    return (
        <>
            {/* Status Explanation Box */}
            <div className={`p-4 rounded-lg border ${currentStatusInfo.color} mb-6`}>
                <h4 className="font-bold text-lg">{currentStatusInfo.title}</h4>
                <p className="text-sm mt-1">{currentStatusInfo.description}</p>
            </div>
        
            {detailsToShow.map(item => item.value || item.value === 0 || typeof item.value === 'boolean' ? (
                <div key={item.label} className="grid grid-cols-3 gap-2 border-b border-gray-100 py-2.5 last:border-b-0">
                    <p className="text-sm font-semibold text-gray-700 col-span-1">{item.label}:</p>
                    <p className={`text-sm text-gray-800 col-span-2 ${item.pre ? 'whitespace-pre-wrap break-words' : 'break-words'}`}>{String(item.value)}</p>
                </div>
            ) : null)}
        </>
    );
  };

  if (isLoading) {
    return <div className="text-center py-10 text-indigo-600 font-semibold animate-pulse">Loading your complaints...</div>;
  }

  return (
    <>
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-8 text-center">My Submitted Complaints</h2>
      
      {error && <Modal message={error} type="error" onClose={() => setError('')} title="Error Fetching Complaints"/>}

      {!isLoading && !error && complaints.length === 0 && (
        <div className="text-center py-8">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No complaints filed yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by filing your first complaint.</p>
            <div className="mt-6">
                <Link to="/new-complaint" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    File New Complaint
                </Link>
            </div>
        </div>
      )}

      {complaints.length > 0 && (
        <div className="space-y-6">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2 sm:mb-0">
                  Complaint against: <span className="font-bold">{complaint.companyName || 'N/A'}</span>
                </h3>
                <span className={`text-xs font-semibold mr-2 px-3 py-1 rounded-full border ${getStatusClass(complaint.status)}`}>
                  {formatStatusText(complaint.status)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1"><strong>Submitted:</strong> {formatDate(complaint.submittedAt)}</p>
              <p className="text-sm text-gray-700 mb-3 truncate"><strong>Issues:</strong> {complaint.issuesFaced?.map(formatStatusText).join(', ') || 'N/A'}</p>
              <button 
                onClick={() => {
                  console.log("Button clicked. Complaint object:", complaint); // <-- ADD THIS DEBUG LINE
                  setSelectedComplaint(complaint);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors focus:outline-none hover:underline"
>
                View Full Details & Status
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    
    {selectedComplaint && (
      <Modal title={`Complaint Details`} onClose={() => setSelectedComplaint(null)}>
        {renderComplaintDetailsInModal()}
      </Modal>
    )}
    </>
  );
};

export default ViewComplaintsPage;