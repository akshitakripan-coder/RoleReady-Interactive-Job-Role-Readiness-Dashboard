import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Target, TrendingUp, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl py-12 md:py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Are You Ready for Your <br /> <span className="text-blue-600">Dream Job?</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            RoleReady helps students bridge the gap between education and employment. 
            Calculate your readiness score, find missing skills, and get a personalized roadmap.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/roles" className="px-6 py-3 rounded-xl font-semibold text-white bg-[#60A5FA] hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-400/30">
              Explore Roles
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Target className="w-6 h-6 text-blue-600" />}
          title="Target Roles"
          description="Choose from a curated list of industry-standard job roles and see what it takes to get hired."
        />
        <FeatureCard 
          icon={<Zap className="w-6 h-6 text-amber-500" />}
          title="Readiness Score"
          description="Get a real-time score based on your skills, quiz responses, and industry benchmarks."
        />
        <FeatureCard 
          icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
          title="Learning Roadmaps"
          description="Identify your skill gaps and get a personalized roadmap with recommended resources."
        />
      </section>

      {/* Stats Section */}
      <section className="w-full bg-slate-100 dark:bg-slate-900 rounded-3xl p-12 my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-slate-600 dark:text-slate-400">Job Roles</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-slate-600 dark:text-slate-400">Learning Resources</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-slate-600 dark:text-slate-400">Student Satisfaction</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-8"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
