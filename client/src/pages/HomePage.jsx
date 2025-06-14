import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import landingPic from '../assets/landingpiccover.jpg'; // Using your local image

// --- SVG Icons for the page sections (Updated with new brand color) ---
const IconAwareness = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-brand-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;
const IconEmployer = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-brand-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6M4.5 21V3m0 18h15" /></svg>;
const IconLegal = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-brand-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const IconCosts = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-brand-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChevronDown = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

// --- Page Section Components ---

const HeroSection = () => {
    return (
        <section className="bg-brand-background pt-10 pb-16 md:pt-16 md:pb-24">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left animate-fade-in-up">
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-headings leading-tight">
                        Maternity Benefits:
                        <br />
                        <span className="text-brand-primary">Your Right, Not a Privilege.</span>
                    </h1>
                    <p className="mt-6 text-lg text-brand-text max-w-lg mx-auto md:mx-0">
                        At Maternity Matters, we believe every new mother deserves her full benefits without stress. Our mission is to provide accessible, expert legal assistance to ensure you get what is rightfully yours.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link to="/register" className="w-full sm:w-auto inline-block bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
                            File a Complaint
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto inline-block bg-slate-200 hover:bg-slate-300 text-brand-headings font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
                            Login to Account
                        </Link>
                    </div>
                </div>
                <div className="hidden md:block animate-fade-in">
                    <img
                        src={landingPic}
                        alt="Empowered professional woman"
                        className="rounded-xl shadow-2xl object-cover w-full h-full"
                    />
                </div>
            </div>
        </section>
    );
};

const ChallengesSection = () => {
    const challenges = [
        { icon: <IconAwareness />, title: "Lack of Awareness", description: "Uncertainty about your specific rights and entitlements under the law." },
        { icon: <IconEmployer />, title: "Employer Non-Compliance", description: "Facing unfair practices or denial of benefits from your employer." },
        { icon: <IconLegal />, title: "Complex Legal Procedures", description: "Feeling overwhelmed by the legal steps required to file a formal complaint." },
        { icon: <IconCosts />, title: "Fear of High Legal Costs", description: "Hesitating to seek justice due to the potential financial burden." },
    ];

    return (
        <section className="py-16 bg-brand-secondary">
            <div className="container mx-auto px-6 text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-headings">Are You Facing These Challenges?</h2>
                <p className="mt-4 text-lg text-brand-text max-w-3xl mx-auto">
                    In India, the Maternity Benefit Act empowers women, but many still struggle. We understand these struggles and are here to help.
                </p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {challenges.map((challenge, index) => (
                        <div key={index} className="bg-brand-background p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                            <div className="flex justify-center mb-4">{challenge.icon}</div>
                            <h3 className="text-xl font-semibold text-brand-headings">{challenge.title}</h3>
                            <p className="mt-2 text-brand-text text-sm">{challenge.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HowItWorksSection = () => {
    const steps = [
        { number: "01", title: "Register & File Complaint", description: "Create a secure account and fill out our simple, guided form with the details of your issue." },
        { number: "02", title: "Expert Legal Review", description: "Your complaint is reviewed by our team of legal professionals to determine the strongest course of action." },
        { number: "03", title: "Legal Notice Sent", description: "We draft and send a formal legal notice to your employer on your behalf, clearly stating your claim." },
        { number: "04", title: "Track Your Status", description: "Follow the progress of your complaint through your personal dashboard and receive updates from our team." },
    ];
    return (
        <section className="py-16 bg-brand-background">
            <div className="container mx-auto px-6 text-center">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-headings">A Clear Path to Justice</h2>
                <p className="mt-4 text-lg text-brand-text max-w-3xl mx-auto">Our process is designed to be simple, transparent, and effective.</p>
                <div className="relative mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* --- THIS IS THE CORRECTED CODE FOR THE LINE --- */}
                    <div className="hidden md:block absolute top-6 left-0 w-full border-t-2 border-dashed border-slate-300 -z-10"></div>
                    
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative z-10 text-center md:text-left p-6">
                            <div className="flex justify-center md:justify-start mb-4">
                                <div className="bg-brand-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">{step.number}</div>
                            </div>
                            <h3 className="text-xl font-semibold text-brand-headings">{step.title}</h3>
                            <p className="mt-2 text-brand-text">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FaqItem = ({ faq, index, openIndex, setOpenIndex }) => {
  const isOpen = index === openIndex;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="w-full flex justify-between items-center p-5 text-left text-lg font-semibold text-brand-headings hover:bg-gray-50 focus:outline-none"
      >
        <span>{faq.q}</span>
        <ChevronDown className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary' : 'text-gray-400'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="p-5 pt-0 text-brand-text">{faq.a}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const faqs = [
        { q: "Is my information kept confidential?", a: "Absolutely. All information you provide is stored securely and is shared only with our verified legal professionals for the purpose of handling your complaint. We adhere to strict privacy standards." },
        { q: "What happens after the legal notice is sent?", a: "After the notice is sent, your employer has a specific period to respond. We will manage this communication and advise you on the next steps based on their response, or lack thereof. You can track the status in your dashboard." },
        { q: "Will I have to go to court?", a: "The primary goal of the legal notice is to resolve the issue without going to court. Many employers comply after receiving a formal notice. If the issue is not resolved, our legal team will guide you on potential next steps, which may or may not involve further legal proceedings." }
    ];

    return (
        <section className="py-16 bg-brand-secondary">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-headings text-center">Frequently Asked Questions</h2>
                <div className="mt-8 space-y-4">
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} faq={faq} index={index} openIndex={openIndex} setOpenIndex={setOpenIndex} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection = () => {
    return (
        <section className="py-20 bg-brand-primary">
            <div className="container mx-auto px-6 text-center">
                <h2 className="font-heading text-3xl font-bold text-white">Ready to Secure Your Rights?</h2>
                <p className="mt-4 text-lg text-rose-100 max-w-2xl mx-auto">Don't let uncertainty or fear stop you. Take the first step towards justice today. Our team is here to support you.</p>
                <Link
                    to="/register"
                    className="mt-8 inline-block bg-white hover:bg-gray-100 text-brand-primary font-bold py-3 px-10 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
                >
                    File Your Complaint Now
                </Link>
            </div>
        </section>
    );
}

const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="bg-brand-background">
        <HeroSection />
        <ChallengesSection />
        <HowItWorksSection />
        <FAQSection />
        {!currentUser && <CTASection />}

        {/* CSS for animations */}
        <style jsx global>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            
            .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
            .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default HomePage;