import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Calendar, Award, Target, Info, LogOut, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { logout } from '../firebase/auth';
import { getUserProgress } from '../firebase/firestore';
import { rolesData } from '../data/rolesData';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const data = await getUserProgress(currentUser.uid);
        setProgress(data);
      } else {
        const local = localStorage.getItem('roleReady_progress');
        if (local) setProgress(JSON.parse(local));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center py-20">Loading profile...</div>;

  const role = rolesData.find(r => r.id === progress?.selectedRole);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-slate-400" />
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{user?.displayName || 'Guest Student'}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm">
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> {user?.email || 'Not logged in'}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Joined April 2026
            </div>
          </div>
        </div>
        
        <div className="md:ml-auto flex gap-3">
          <Link to="/dashboard" className="secondary-btn flex items-center gap-2 py-2">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <button 
            onClick={logout}
            className="secondary-btn flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-100 dark:border-red-900/30"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" /> Current Progress
            </h3>
            
            {progress ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Target Role</div>
                    <div className="font-bold text-lg">{role?.title || 'Not selected'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Readiness</div>
                    <div className="font-bold text-2xl text-blue-600">{progress.readinessScore || 0}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Skills Selected</div>
                    <div className="font-bold">{progress.selectedSkills?.length || 0}</div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Quiz Score</div>
                    <div className="font-bold">{progress.careerFitScore || 0}%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">No progress data yet.</p>
                <Link to="/roles" className="text-blue-600 font-bold hover:underline">Start Assessment</Link>
              </div>
            )}
          </div>

          <div className="glass-card p-8 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" /> How it works
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              "Readiness score is calculated using quiz responses, selected skills, and role benchmarks"
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-600">50%</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Skills</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">30%</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Quiz</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">20%</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Industry</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" /> Achievements
            </h3>
            <div className="space-y-4">
              <AchievementItem title="First Step" description="Selected a target role" completed={!!progress?.selectedRole} />
              <AchievementItem title="Self Aware" description="Completed career fit quiz" completed={!!progress?.quizAnswers} />
              <AchievementItem title="Skill Mapper" description="Selected 5+ skills" completed={progress?.selectedSkills?.length >= 5} />
              <AchievementItem title="Ready to Go" description="Reached 70% readiness" completed={progress?.readinessScore >= 70} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementItem({ title, description, completed }: { title: string, description: string, completed: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      completed ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-50'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        completed ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
      }`}>
        <Award className="w-4 h-4" />
      </div>
      <div>
        <div className="text-sm font-bold">{title}</div>
        <div className="text-[10px] text-slate-500">{description}</div>
      </div>
    </div>
  );
}
