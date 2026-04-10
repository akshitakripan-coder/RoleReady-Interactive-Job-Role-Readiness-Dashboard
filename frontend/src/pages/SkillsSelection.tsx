import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, ChevronLeft, ChevronRight, Check, LayoutDashboard } from 'lucide-react';
import { rolesData } from '../data/rolesData';
import { saveUserProgress, getUserProgress } from '../firebase/firestore';
import { auth } from '../firebase/firebase';

export default function SkillsSelection() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleSkills, setRoleSkills] = useState<string[]>([]);
  const [hasProgress, setHasProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      let progress: any = null;
      if (auth.currentUser) {
        progress = await getUserProgress(auth.currentUser.uid);
      } else {
        const local = localStorage.getItem('roleReady_progress');
        if (local) progress = JSON.parse(local);
      }

      if (progress?.selectedRole) {
        const role = rolesData.find(r => r.id === progress.selectedRole);
        if (role) setRoleSkills(role.skills);
      }
      
      if (progress?.selectedSkills) {
        setSelectedSkills(progress.selectedSkills);
      }

      if (progress?.readinessScore) setHasProgress(true);
    };
    loadData();
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleNext = async () => {
    const progress = { selectedSkills };
    
    if (auth.currentUser) {
      await saveUserProgress(auth.currentUser.uid, progress);
    } else {
      const existing = JSON.parse(localStorage.getItem('roleReady_progress') || '{}');
      localStorage.setItem('roleReady_progress', JSON.stringify({ ...existing, ...progress }));
    }
    
    navigate('/dashboard');
  };

  const filteredSkills = roleSkills.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">Select Your Skills</h1>
          <p className="text-slate-600 dark:text-slate-400">
            "This selection helps calculate your readiness score"
          </p>
        </div>
        {hasProgress && (
          <Link to="/dashboard" className="secondary-btn flex items-center gap-2 py-2 text-sm">
            <LayoutDashboard className="w-4 h-4" /> Skip to Dashboard
          </Link>
        )}
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search skills..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="glass-card p-8 mb-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
          Recommended for your role
          <span className="text-sm font-normal text-slate-500">{selectedSkills.length} selected</span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredSkills.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selectedSkills.includes(skill)
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
            >
              <span className="font-medium">{skill}</span>
              {selectedSkills.includes(skill) && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <p className="text-center text-slate-500 py-8">No matching skills found.</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/quiz')}
          className="secondary-btn flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button 
          onClick={handleNext}
          className="gradient-btn flex items-center gap-2"
        >
          Calculate Readiness <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
