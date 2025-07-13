import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* The 'prose' class from Tailwind helps style blocks of text nicely */}
        <div className="prose prose-lg text-brand-text mx-auto">
          <h1 className="font-heading text-4xl font-bold text-brand-headings">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: July 13, 2025</p>
          
          <p>
            Welcome to Maternity Matters. We are deeply committed to protecting your privacy and handling your personal and sensitive data with the utmost care, transparency, and respect. This Privacy Policy outlines how Maternity Matters ("we," "us," or "our") collects, uses, shares, and protects your personal data in full compliance with India's Digital Personal Data Protection Act, 2023 ("DPDP Act") and other laws.
          </p>
          <p>
            This policy is designed to help you, our user ("Data Principal," "you," "your"), understand your rights and our obligations as we assist you with consultation and other connected services like drafting of communications, drafting of legal notices, amongst others, regarding your maternity benefits. By using our services, you acknowledge that you have read and understood this Privacy Policy.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">1. Our Commitment to Your Privacy</h2>
          <p>
            Maternity Matters provides specialized consultation and other connected services on maternity benefits like drafting of communications, drafting of legal notices, amongst others (“Services”). We understand that the information you share with us is personal and often sensitive. This policy applies to all personal data you provide to us through our website, [www.maternitymatters.in], email, or any other mode of communication while availing our services.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">2. Key Definitions</h2>
          <p>This policy uses terms defined under the DPDP Act:</p>
          <ul>
            <li><strong>Data Principal:</strong> The individual to whom the personal data relates (you).</li>
            <li><strong>Data Fiduciary:</strong> The entity that determines the purpose and means of processing personal data. For this policy, Maternity Matters is the Data Fiduciary.</li>
            <li><strong>Personal Data:</strong> Any data about an individual who is identifiable by or in relation to such data. This includes the specific information you provide to us.</li>
            <li><strong>Processing:</strong> Any operation performed on your personal data, such as collection, storage, use, and analysis to provide you with legal consultation and other connected services like drafting of communications, drafting of legal notices, amongst others.</li>
            <li><strong>Consent:</strong> Your freely given, specific, informed, and unambiguous agreement, through a clear affirmative action, to the processing of your personal data for the purpose of receiving our consultation services.</li>
          </ul>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">3. The Personal Data We Collect and Why</h2>
          <p>
            We are committed to the principle of data minimization. We will only collect the information that is absolutely necessary to provide you with accurate and effective legal consultation regarding your maternity benefits. Here is an itemized list of the personal data we collect and the specific purpose for each:
          </p>
          <div className="border-t border-b border-gray-200 divide-y divide-gray-200 mt-4">
              <div className="py-4 grid grid-cols-3 gap-4">
                  <div className="font-bold col-span-1">Type of Personal Data</div>
                  <div className="font-bold col-span-2">Specific Purpose of Processing</div>
              </div>
              <div className="py-4 grid grid-cols-3 gap-4">
                  <div className="font-medium col-span-1">Your Full Name</div>
                  <div className="col-span-2">To identify you as our client and to address you correctly in all communications and potential legal documentation.</div>
              </div>
              <div className="py-4 grid grid-cols-3 gap-4">
                  <div className="font-medium col-span-1">Your Date of Birth</div>
                  <div className="col-span-2">To verify your eligibility for certain benefits and to understand the timeline of events relevant to your case.</div>
              </div>
              <div className="py-4 grid grid-cols-3 gap-4">
                  <div className="font-medium col-span-1">Name of Your Employer & Your Joining Date</div>
                  <div className="col-span-2">To determine the applicability of the Maternity Benefit Act, 1961, and other relevant laws to your employer, and to calculate the duration of your service, which is critical for assessing your entitlements.</div>
              </div>
              <div className="py-4 grid grid-cols-3 gap-4">
                  <div className="font-medium col-span-1">Your Salary/Income Details</div>
                  <div className="col-span-2">To accurately calculate the financial components of your maternity benefits, such as paid leave, medical bonus, and any potential claims for wrongful denial of benefits. This information is treated as highly sensitive.</div>
              </div>
              <div className="py-4 grid grid-cols-3 gap-4">
                  <div className="font-medium col-span-1">Details of Your Complaint/Case</div>
                  <div className="col-span-2">To understand the specifics of your situation, analyze the legal issues, advise you on your rights, and formulate a strategy for redressal. This includes any correspondence with your employer or details about the denial of benefits.</div>
              </div>
              <div className="py-4 grid grid-cols-3 gap-4">
                  <div className="font-medium col-span-1">Your Contact Information (Email, Phone, WhatsApp)</div>
                  <div className="col-span-2">To communicate with you regarding your case, provide updates, send documents, and schedule consultations.</div>
              </div>
              <div className="py-4 grid grid-cols-3 gap-4">
                  <div className="font-medium col-span-1">Details of pregnancy</div>
                  <div className="col-span-2">To accurately calculate the dates involved in the case, the relevant steps to be taken, and formulate a strategy for redressal. This also helps us to check applicability of relevant provisions of the Act.</div>
              </div>
          </div>
          <p className="mt-4">
            We will provide you with a clear notice at or before the time of collecting this data, restating these purposes and seeking your explicit consent.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">4. Your Consent: The Foundation of Our Processing</h2>
          <p>
            Our only lawful basis for processing your personal data is your explicit consent. When you provide us with your information, you are giving us your consent to use it solely for the purpose of providing services on your maternity benefit case.
          </p>
          <p>
            You have the right to withdraw your consent at any time with the same ease with which you gave it. You can do so by sending an email to our Grievance Officer (details below). Upon withdrawal, we will cease processing your data for our services, though we may need to retain it for a specific period to comply with our legal and professional obligations.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">5. Your Rights as a Data Principal</h2>
          <p>Under the DPDP Act, you have complete control over your personal data. You have the right to:</p>
          <ul>
            <li><strong>Access Your Data:</strong> Request a summary of the personal data we hold about you.</li>
            <li><strong>Correct and Update Your Data:</strong> Request the correction of any inaccurate or incomplete data.</li>
            <li><strong>Erase Your Data:</strong> Request the erasure of your personal data once it is no longer necessary for the purpose of our consultation or for our legal retention requirements.</li>
            <li><strong>Grievance Redressal:</strong> A readily available means to have your complaints and concerns addressed by us.</li>
            <li><strong>Nominate:</strong> Appoint another person to exercise your rights in case of your death or incapacity.</li>
          </ul>
          <p>To exercise any of these rights, please contact our Grievance Officer.</p>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">6. Data Security: Our Top Priority</h2>
          <p>
            Given the sensitivity of your employment and financial data, we have implemented robust technical, physical, and administrative security measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. This includes data encryption, secure storage, and strict access controls, ensuring that only authorized personnel involved in your consultation can access your information.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">7. Data Retention</h2>
          <p>
            We will retain your personal data only for as long as is necessary to provide you with consultation and to comply with our legal and professional responsibilities as consultants. After this period, your personal data will be securely and permanently erased from our systems.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">8. Data Breach Notification</h2>
          <p>
            In the unlikely event of a personal data breach that could affect your rights, we will promptly notify the Data Protection Board of India and you, in accordance with the provisions of the DPDP Act.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">9. Grievance Redressal</h2>
          <p>For any questions, concerns, or to exercise your rights, please do not hesitate to contact our designated Grievance Officer:</p>
          <div className="mt-2 pl-4 border-l-4 border-brand-primary">
            <p><strong>Name of Grievance Officer:</strong> Neeraj Salodkar</p>
            <p><strong>Email:</strong> pranavmaternity@gmail.com</p>
            <p><strong>Postal Address:</strong> Flat No. 1, Building 2-C, Sneh Vihar Society, Beside BSNL Telephone Exchange, Pune[Insert Full Address of Maternity Matters]</p>
          </div>
          <p className="mt-4">
            We are committed to resolving your concerns in a timely and effective manner. If you are not satisfied with our response, you have the right to file a complaint with the Data Protection Board of India.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-brand-headings mt-8">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this policy to reflect changes in the law or our services. We will notify you of any significant changes by posting the new policy on our website and, where feasible, via email.
          </p>

          <p className="mt-12 text-center">
            <Link to="/" className="text-brand-primary hover:text-brand-primary-hover font-semibold">
              &larr; Back to Home
            </Link>
          </p>
        </div>
      </div>
       <style jsx global>{`
        .prose h1 { margin-bottom: 0.5em; }
        .prose h2 { margin-top: 1.5em; margin-bottom: 0.5em; }
        .prose p, .prose ul, .prose div { margin-top: 1em; margin-bottom: 1em; }
        .prose ul { padding-left: 1.5em; }
        .prose li { margin-top: 0.5em; }
      `}</style>
    </div>
  );
};

export default PrivacyPolicyPage;