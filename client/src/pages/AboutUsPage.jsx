import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ value, label }) => (
  <div className="bg-brand-secondary p-6 rounded-lg text-center shadow-md transform hover:scale-105 transition-transform duration-300">
    <p className="text-4xl font-heading font-bold text-brand-primary">{value}</p>
    <p className="mt-2 text-brand-text">{label}</p>
  </div>
);

const AboutUsPage = () => {
  return (
    <div className="bg-brand-background animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 bg-white">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-headings">
          Empowering Mothers, Ensuring Justice
        </h1>
        <p className="mt-4 text-lg text-brand-text max-w-3xl mx-auto">
          At Maternity Matters, we are driven by a single, powerful belief: every expecting and new mother deserves her full maternity benefits, free from stress and financial burden.
        </p>
      </div>

      {/* The Problem with Stats Section */}
      <section className="py-16 bg-brand-secondary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-headings">The Reality for Working Women</h2>
          <p className="mt-4 text-lg text-brand-text max-w-3xl mx-auto">
            While the law provides strong protections, the reality on the ground is often different, even for women in formal employment who are legally entitled to these benefits.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard value="75%" label="of professional women have experienced a career setback after returning from maternity leave." />
            <StatCard value="40%" label="reported that taking maternity leave negatively impacted their pay upon their return." />
            <StatCard value="Hiring Bias" label="exists, with some studies showing women became less likely to receive interview calls after the leave was extended." />
          </div>
           <p className="mt-8 text-xs text-gray-500">Khetarpal, Sonal, "Did better maternity leave disadvantage Indian women in jobs? Study says…", India Today, Feb 11, 2025, https://www.indiatoday.in/india-today-insight/story/did-better-maternity-leave-disadvantage-indian-women-in-jobs-study-says-2678224-2025-02-11 </p>
           <p className="mt-8 text-xs text-gray-500">Kumar, Abhijeet, "Bias, maternity leave setbacks stall women's growth at workplace: Report", Business Standard, Aug 08, 2024, https://www.business-standard.com/india-news/bias-maternity-leave-setbacks-stall-women-s-growth-at-workplace-report-124080801011_1.html </p>
           <p className="mt-8 text-xs text-gray-500">Aon. (2024). Voice of Women: The Largest Pan-India Study of Working Women. Retrieved from https://www.aon.com/apac/asia/voice-of-women-2024-25#dl_form </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl font-bold text-brand-headings mb-4">Our Story</h2>
            <div className="space-y-4 text-brand-text">
              <p>
                Maternity Matters was born from a simple conversation between a passionate lawyer and a tech expert. We saw a recurring problem: countless women, despite having legal rights, were struggling to secure them due to lack of awareness, fear of confrontation, and complex procedures.
              </p>
              <p>
                We realized that technology could be a powerful equalizer. By creating a simple, secure, and supportive online platform, we could demystify the legal process and provide the crucial first step—a formal legal notice—to women who might otherwise feel powerless. Our goal is to bridge the gap between rights on paper and justice in reality.
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Team collaborating" className="rounded-lg shadow-xl" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/E9E7F4/334155?text=Our+Mission'; }}/>
          </div>
        </div>
      </section>

      {/* Final CTA */}
       <section className="py-20 bg-brand-background">
            <div className="container mx-auto px-6 text-center">
                <h2 className="font-heading text-3xl font-bold text-brand-headings">Let Us Help You Secure Your Rights</h2>
                <p className="mt-4 text-lg text-brand-text max-w-2xl mx-auto">If you are facing issues with your maternity benefits, you are not alone. Take the first step today.</p>
                <Link
                    to="/register"
                    className="mt-8 inline-block bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-10 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
                >
                    File a Complaint
                </Link>
            </div>
        </section>
    </div>
  );
};

export default AboutUsPage;