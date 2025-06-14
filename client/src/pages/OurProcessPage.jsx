import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- SVG Icons for this page ---
const IconComplaint = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconReview = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16l4-4m0 0l4-4m-4 4l-4-4m4 4l4 4m6-4a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconDraft = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconSend = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const IconFollowUp = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2m6-4H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2h-2l-4-4z" /></svg>;


const OurProcessPage = () => {
    const { currentUser } = useAuth();

    const steps = [
        { icon: <IconComplaint />, title: "Step 1: Complaint Submission", description: "You start by filling out our secure and confidential complaint form. Provide as much detail as possible, as this information forms the basis of the legal notice." },
        { icon: <IconReview />, title: "Step 2: Expert Legal Review", description: "Our team of legal professionals reviews your submission to ensure all necessary information is present and to determine the strongest legal grounds for your case. We may contact you via email if we need any clarification." },
        { icon: <IconDraft />, title: "Step 3: Legal Notice Preparation", description: "Once the review is complete, a formal legal notice is drafted by a lawyer. This document outlines your grievances, references relevant sections of the Maternity Benefit Act, and states your rightful claims." },
        { icon: <IconSend />, title: "Step 4: Legal Notice Sent", description: "The finalized legal notice is sent to your employer via registered post. The status of your complaint on your dashboard will be updated to 'Legal Notice Sent'." },
        { icon: <IconFollowUp />, title: "Step 5: Follow-Up & Next Steps", description: "After the notice is sent, there is a statutory period for your employer to respond. Our team will manage this stage and advise you on all subsequent steps based on the outcome." }
    ];

    return (
        <div className="bg-white py-12 px-4 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl font-heading font-bold text-brand-headings">Our Process: What to Expect</h1>
                    <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">
                        We believe in transparency. Here is a clear, step-by-step guide to your journey with us after you file a complaint.
                    </p>
                </div>

                <div className="mt-16 space-y-12">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">{step.icon}</div>
                            <div>
                                <h3 className="text-2xl font-heading font-semibold text-brand-headings">{step.title}</h3>
                                <p className="mt-2 text-brand-text">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-brand-secondary rounded-lg text-center">
                    <h3 className="text-2xl font-heading font-bold text-brand-headings">Important Note on Communication</h3>
                    <p className="mt-3 text-brand-text max-w-2xl mx-auto">
                        Our primary method of communication will be via the mobile number and/or the email address you used to register your account. Please monitor your inbox (and spam folder) regularly for any updates or requests for information from our legal team.
                    </p>
                    <div className="mt-6">
                        {currentUser ? (
                            <Link to="/dashboard" className="inline-block bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                View Your Dashboard
                            </Link>
                        ) : (
                            <Link to="/register" className="inline-block bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurProcessPage;