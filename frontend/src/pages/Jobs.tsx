import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, DollarSign, Briefcase, ExternalLink, Filter, ChevronLeft, X, Calendar, Award, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobsData } from '../data/jobsData';

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || job.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link to="/dashboard" className="text-blue-600 flex items-center gap-1 text-sm font-medium mb-4 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-4">Opportunities</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Find internships and full-time roles that match your readiness level.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search jobs, companies, keywords..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Internship', 'Full-time'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                typeFilter === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <motion.div
            key={job.id}
            whileHover={{ x: 4 }}
            className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{job.title}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  job.type === 'Internship' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {job.type}
                </span>
                {job.matchLevel && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    job.matchLevel === 'Strong Match' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {job.matchLevel}
                  </span>
                )}
              </div>
              <p className="text-blue-600 font-semibold mb-4">{job.company}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {job.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" /> {job.salary}
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" /> {job.type}
                </div>
              </div>
            </div>
            
            <div className="flex md:flex-col gap-2 shrink-0">
              {job.link ? (
                <a 
                  href={job.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gradient-btn py-2 px-6 text-sm text-center"
                >
                  Apply Now
                </a>
              ) : (
                <span className="text-slate-400 italic text-xs text-center py-2">Application link coming soon</span>
              )}
              <button 
                onClick={() => setSelectedJob(job)}
                className="secondary-btn py-2 px-6 text-sm"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <p className="text-blue-600 font-semibold">{selectedJob.company}</p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Location</div>
                    <div className="font-semibold text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selectedJob.location}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Salary</div>
                    <div className="font-semibold text-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> {selectedJob.salary}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Deadline</div>
                    <div className="font-semibold text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {selectedJob.deadline}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Match</div>
                    <div className={`font-bold text-sm flex items-center gap-1 ${selectedJob.matchLevel === 'Strong Match' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      <Award className="w-3 h-3" /> {selectedJob.matchLevel}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" /> Job Description
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills?.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-3">Eligibility Criteria</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedJob.eligibility}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold mb-3">Company Overview</h4>
                  <p className="text-slate-600 dark:text-slate-400 italic">
                    {selectedJob.overview}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                  {selectedJob.link ? (
                    <a 
                      href={selectedJob.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="gradient-btn flex-grow py-4 text-center"
                    >
                      Apply Now
                    </a>
                  ) : (
                    <div className="flex-grow py-4 text-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      Application link coming soon
                    </div>
                  )}
                  <button 
                    onClick={() => setSelectedJob(null)}
                    className="secondary-btn px-8"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filteredJobs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500">No opportunities found matching your search.</p>
        </div>
      )}
    </div>
  );
}
