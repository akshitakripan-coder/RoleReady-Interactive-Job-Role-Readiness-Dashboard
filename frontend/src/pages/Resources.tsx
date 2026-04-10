import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ExternalLink, Filter, BookOpen, Video, FileText, Award, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resourcesData } from '../data/resourcesData';

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');

  const filteredResources = resourcesData.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'All' || res.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link to="/dashboard" className="text-blue-600 flex items-center gap-1 text-sm font-medium mb-4 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-4">Learning Resources</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Curated courses and certifications to help you bridge your skill gaps.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search resources..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                levelFilter === level 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <motion.div
            key={res.id}
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                res.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                res.level === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {res.level}
              </div>
              <div className="text-slate-400">
                {res.type === 'Course' ? <Video className="w-5 h-5" /> : <Award className="w-5 h-5" />}
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{res.title}</h3>
            <p className="text-slate-500 text-sm mb-6">Provided by <span className="font-semibold text-slate-700 dark:text-slate-300">{res.provider}</span></p>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <FileText className="w-3 h-3" /> {res.type}
              </span>
              {res.link ? (
                <a 
                  href={res.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline"
                >
                  Enroll Now <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-slate-400 italic text-sm">Link coming soon</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500">No resources found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
