import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import landingPic from '../assets/landingpiccover.jpg'; // <<< --- 1. IMPORT YOUR IMAGE HERE

// --- SVG Icons for the page sections ---
const IconAwareness = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;
const IconEmployer = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6M9 15.75h6M4.5 21V3m0 18h15" /></svg>;
const IconLegal = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const IconCosts = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-indigo-500"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChevronDown = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

// --- Page Section Components ---

const HeroSection = () => {
    return (
        <section className="pt-6 pb-12 md:pt-10 md:pb-20">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight">
                        Maternity Benefits:
                        <br />
                        <span className="text-indigo-600">Your Right, Not a Privilege.</span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                        At Maternity Matters, we believe every new mother deserves her full benefits without stress. Our mission is to provide accessible, expert legal assistance to ensure you get what is rightfully yours.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link to="/register" className="w-full sm:w-auto inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
                            File a Complaint
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
                            Login to Account
                        </Link>
                    </div>
                </div>
                <div className="hidden md:block animate-fade-in">
                    <img
                        src={landingPic} // <<< --- 2. USE THE IMPORTED IMAGE VARIABLE HERE
                        alt="Empowered professional woman"
                        className="rounded-xl shadow-2xl object-cover w-full h-full"
                        // onError is no longer needed as the image is now local
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
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Are You Facing These Challenges?</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    In India, the Maternity Benefit Act empowers women, but many still struggle. We understand these struggles and are here to help.
                </p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {challenges.map((challenge, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                            <div className="flex justify-center mb-4">{challenge.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800">{challenge.title}</h3>
                            <p className="mt-2 text-gray-600 text-sm">{challenge.description}</p>
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
        <section className="py-16">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">A Clear Path to Justice</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Our process is designed to be simple, transparent, and effective.</p>
                <div className="relative mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Dashed line for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
                            <line x1="0" y1="0.5" x2="100" y2="0.5" strokeDasharray="5, 5" stroke="#cbd5e1" strokeWidth="2" />
                        </svg>
                    </div>
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative z-10 text-center md:text-left p-6">
                            <div className="flex justify-center md:justify-start mb-4">
                                <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">{step.number}</div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                            <p className="mt-2 text-gray-600">{step.description}</p>
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
        className="w-full flex justify-between items-center p-5 text-left text-lg font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none"
      >
        <span>{faq.q}</span>
        <ChevronDown className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : 'text-gray-400'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="p-5 pt-0 text-gray-600">{faq.a}</p>
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
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">Frequently Asked Questions</h2>
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
        <section className="py-20 bg-indigo-600">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-white">Ready to Secure Your Rights?</h2>
                <p className="mt-4 text-lg text-indigo-200 max-w-2xl mx-auto">Don't let uncertainty or fear stop you. Take the first step towards justice today. Our team is here to support you.</p>
                <Link
                    to="/register"
                    className="mt-8 inline-block bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-10 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
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
    <div className="bg-white">
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