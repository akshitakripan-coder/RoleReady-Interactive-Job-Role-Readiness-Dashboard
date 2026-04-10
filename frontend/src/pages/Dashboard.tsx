import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { 
  Award, Target, Zap, AlertCircle, 
  CheckCircle2, ArrowRight, BookOpen, Briefcase, ChevronLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { rolesData } from '../data/rolesData';
import { getUserProgress, saveUserProgress } from '../firebase/firestore';
import { auth } from '../firebase/firebase';

export default function Dashboard() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      let data: any = null;
      if (auth.currentUser) {
        data = await getUserProgress(auth.currentUser.uid);
      } else {
        const local = localStorage.getItem('roleReady_progress');
        if (local) data = JSON.parse(local);
      }
      
      if (data) {
        // Calculate scores if not already present
        const role = rolesData.find(r => r.id === data.selectedRole);
        if (role) {
          const skillMatch = (data.selectedSkills?.length || 0) / role.skills.length;
          const skillScore = Math.round(skillMatch * 100);
          
          const quizScore = data.careerFitScore || 0;
          
          // Industry Mapping (Simulated for demo)
          const industryScore = 85; 

          // Overall Readiness = 50% Skill + 30% Quiz + 20% Industry
          const readinessScore = Math.round(
            (skillScore * 0.5) + (quizScore * 0.3) + (industryScore * 0.2)
          );

          const updatedData = {
            ...data,
            readinessScore,
            industryRelevanceScore: industryScore
          };
          
          setProgress(updatedData);
          
          // Sync back to storage
          if (auth.currentUser) {
            await saveUserProgress(auth.currentUser.uid, updatedData);
          } else {
            localStorage.setItem('roleReady_progress', JSON.stringify(updatedData));
          }
        }
      }
      setLoading(false);
    };
    loadProgress();
  }, []);

  if (loading) return <div className="text-center py-20">Loading your dashboard...</div>;
  if (!progress) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">No progress found</h2>
      <Link to="/roles" className="gradient-btn">Start Assessment</Link>
    </div>
  );

  const role = rolesData.find(r => r.id === progress.selectedRole);
  const missingSkills = role?.skills.filter(s => !progress.selectedSkills?.includes(s)) || [];

  const chartData = [
    { name: 'Skill Match', value: (progress.selectedSkills?.length || 0) / (role?.skills.length || 1) * 100, fill: '#3b82f6' },
    { name: 'Career Fit', value: progress.careerFitScore || 0, fill: '#f59e0b' },
    { name: 'Industry Relevance', value: progress.industryRelevanceScore || 0, fill: '#10b981' },
  ];

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link to="/skills" className="text-blue-600 flex items-center gap-1 text-sm font-medium mb-2 hover:underline">
            <ChevronLeft className="w-4 h-4" /> Back to Skills
          </Link>
          <h1 className="text-3xl font-bold">Readiness Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Target Role: <span className="font-semibold text-blue-600">{role?.title}</span></p>
        </div>
        <div className="flex gap-3">
          <Link to="/resources" className="secondary-btn flex items-center gap-2 py-2">
            <BookOpen className="w-4 h-4" /> Resources
          </Link>
          <Link to="/jobs" className="gradient-btn flex items-center gap-2 py-2">
            <Briefcase className="w-4 h-4" /> Find Jobs
          </Link>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ScoreCard 
          title="Overall Readiness" 
          score={progress.readinessScore} 
          icon={<Award className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        <ScoreCard 
          title="Career Fit" 
          score={progress.careerFitScore} 
          icon={<Target className="w-6 h-6 text-amber-500" />}
          color="amber"
        />
        <ScoreCard 
          title="Industry Relevance" 
          score={progress.industryRelevanceScore} 
          icon={<Zap className="w-6 h-6 text-emerald-500" />}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6">Readiness Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="text-xl font-bold mb-6">Skill Gap Analysis</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Acquired Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {progress.selectedSkills?.map((skill: string) => (
                    <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Missing Skills (Priority)</h4>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill: string) => (
                    <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                      <AlertCircle className="w-4 h-4" /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-8">
          <div className="glass-card p-6 bg-blue-600 text-white border-none">
            <h3 className="text-xl font-bold mb-4">Next Steps</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">1</div>
                <p className="text-sm">Complete "React Advanced" certification to boost skill score by 15%.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">2</div>
                <p className="text-sm">Apply for 3 internship roles matching your current skill set.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">3</div>
                <p className="text-sm">Update your portfolio with a new project using {missingSkills[0] || 'new skills'}.</p>
              </li>
            </ul>
            <Link to="/resources" className="mt-6 w-full py-3 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
              Get Roadmap <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Recommended Certs</h3>
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-sm">Google UX Design</div>
                <div className="text-xs text-slate-500">Coursera • Professional Cert</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-sm">AWS Cloud Practitioner</div>
                <div className="text-xs text-slate-500">Amazon • Foundational</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ title, score, icon, color }: { title: string, score: number, icon: React.ReactNode, color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex items-center gap-6"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-slate-500 mb-1">{title}</div>
        <div className="text-3xl font-bold">{score}%</div>
      </div>
    </motion.div>
  );
}
