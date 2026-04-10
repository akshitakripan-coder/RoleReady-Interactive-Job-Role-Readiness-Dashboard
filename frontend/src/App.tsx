import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/firebase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Roles from './pages/Roles';
import CareerQuiz from './pages/CareerQuiz';
import SkillsSelection from './pages/SkillsSelection';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import { getUserProgress } from './firebase/firestore';

// Theme Context
const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [userProgress, setUserProgress] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const progress = await getUserProgress(currentUser.uid);
        setUserProgress(progress);
      } else {
        // Fallback to localStorage if not logged in
        const localProgress = localStorage.getItem('roleReady_progress');
        if (localProgress) {
          setUserProgress(JSON.parse(localProgress));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar user={user} />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/quiz" element={<CareerQuiz />} />
              <Route path="/skills" element={<SkillsSelection />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800">
            &copy; {new Date().getFullYear()} RoleReady. All rights reserved.
          </footer>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}
