import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, ChevronRight, Info, LayoutDashboard } from 'lucide-react';
import { rolesData } from '../data/rolesData';
import { saveUserProgress, getUserProgress } from '../firebase/firestore';
import { auth } from '../firebase/firebase';

export default function Roles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProgress = async () => {
      let progress: any = null;
      if (auth.currentUser) {
        progress = await getUserProgress(auth.currentUser.uid);
      } else {
        const local = localStorage.getItem('roleReady_progress');
        if (local) progress = JSON.parse(local);
      }
      if (progress?.selectedRole) setSelectedRole(progress.selectedRole);
    };
    loadProgress();
  }, []);

  const filteredRoles = rolesData.filter(role => 
    role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRole = async (roleId: string) => {
    setSelectedRole(roleId);
    const progress = { selectedRole: roleId };
    
    if (auth.currentUser) {
      await saveUserProgress(auth.currentUser.uid, progress);
    } else {
      localStorage.setItem('roleReady_progress', JSON.stringify(progress));
    }
    
    navigate(`/quiz?role=${roleId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">Choose Your Target Role</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Select the job role you are preparing for.
          </p>
        </div>
        {selectedRole && (
          <Link to="/dashboard" className="secondary-btn flex items-center gap-2 py-2">
            <LayoutDashboard className="w-4 h-4" /> Skip to Dashboard
          </Link>
        )}
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search for roles (e.g. Frontend, Data Scientist...)"
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRoles.map((role) => (
          <motion.div
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectRole(role.id)}
            className={`glass-card p-6 cursor-pointer border-2 transition-all ${
              selectedRole === role.id ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{role.title}</h3>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              {role.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {role.skills.slice(0, 3).map(skill => (
                <span key={skill} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {skill}
                </span>
              ))}
              {role.skills.length > 3 && (
                <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                  +{role.skills.length - 3} more
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No roles found matching your search.</p>
        </div>
      )}
    </div>
  );
}
