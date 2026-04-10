import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { quizData } from '../data/quizData';
import { saveUserProgress, getUserProgress } from '../firebase/firestore';
import { auth } from '../firebase/firebase';

export default function CareerQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // Stores questionId -> optionIndex
  const [hasRole, setHasRole] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleId = searchParams.get('role');

  const filteredQuizData = useMemo(() => {
    if (!roleId) return quizData.filter(q => q.roleId === 'general');
    return quizData.filter(q => q.roleId === 'general' || q.roleId === roleId);
  }, [roleId]);

  useEffect(() => {
    const loadProgress = async () => {
      let progress: any = null;
      if (auth.currentUser) {
        progress = await getUserProgress(auth.currentUser.uid);
      } else {
        const local = localStorage.getItem('roleReady_progress');
        if (local) progress = JSON.parse(local);
      }
      
      if (progress?.quizAnswers) {
        setAnswers(progress.quizAnswers);
      }
      if (progress?.selectedRole) setHasRole(true);
    };
    loadProgress();
  }, []);

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = async () => {
    if (currentStep < filteredQuizData.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate career fit score
      const totalScore = Object.entries(answers).reduce((acc, [qId, optIdx]) => {
        const question = quizData.find(q => q.id === Number(qId));
        return acc + (question?.options[optIdx].score || 0);
      }, 0);
      
      const maxPossibleScore = filteredQuizData.length * 10;
      const careerFitScore = Math.round((totalScore / maxPossibleScore) * 100);

      const progress = { 
        quizAnswers: answers,
        careerFitScore: careerFitScore
      };

      if (auth.currentUser) {
        await saveUserProgress(auth.currentUser.uid, progress);
      } else {
        const existing = JSON.parse(localStorage.getItem('roleReady_progress') || '{}');
        localStorage.setItem('roleReady_progress', JSON.stringify({ ...existing, ...progress }));
      }
      
      navigate('/skills');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/roles');
    }
  };

  const currentQuestion = filteredQuizData[currentStep];
  const progressPercentage = ((currentStep + 1) / filteredQuizData.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Let's check your interests and strengths</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Step {currentStep + 1} of {filteredQuizData.length}
          </p>
        </div>
        {hasRole && (
          <Link to="/skills" className="secondary-btn flex items-center gap-2 py-2 text-sm">
            Skip to Skills <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(currentQuestion.id, idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  answers[currentQuestion.id] === idx
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <span className="font-medium">{option.text}</span>
                {answers[currentQuestion.id] === idx && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <button 
          onClick={handleBack}
          className="secondary-btn flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button 
          onClick={handleNext}
          disabled={answers[currentQuestion.id] === undefined}
          className={`gradient-btn flex items-center gap-2 ${
            answers[currentQuestion.id] === undefined ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {currentStep === filteredQuizData.length - 1 ? 'Finish Quiz' : 'Next Question'} 
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
