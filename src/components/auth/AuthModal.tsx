import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';
import type { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, onLogin, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when opening/closing
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && (name.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(name))) {
      setError('Please enter a valid name (letters and spaces only, min 3 chars).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address (e.g., user@example.com).');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setSuccess('');

    // Simulate API delay
    setTimeout(() => {
      // Mock Auth logic using a persistent "database" in localStorage
      const usersJson = localStorage.getItem('icollabhub_users');
      interface DBUser extends User { password?: string }
      const users: DBUser[] = usersJson ? JSON.parse(usersJson) : [];

      if (mode === 'signup') {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          setError('Email already exists. Please login instead.');
          setIsLoading(false);
          return;
        }

        const newUser: DBUser = {
          id: Date.now().toString(),
          name,
          email,
          password // In a real app, this would be hashed on the server
        };
        
        users.push(newUser);
        localStorage.setItem('icollabhub_users', JSON.stringify(users));
        
        setSuccess('Registration successful! Please sign in with your credentials.');
        setMode('login');
        setPassword('');
        setIsLoading(false);
        return;
      } else {
        const existingUser = users.find(u => u.email === email);
        
        if (!existingUser || existingUser.password !== password) {
          setError('Invalid email or password. Please verify your credentials.');
          setIsLoading(false);
          return;
        }

        const { password: _, ...safeUser } = existingUser;
        onLogin(safeUser as User);
        setIsLoading(false);
        onClose();
      }
    }, 1200);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl border border-slate-100"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-10"
          >
             <X size={18} />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                 <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                {mode === 'login' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                {mode === 'login' 
                  ? 'Enter your details to access your chats.' 
                  : 'Start automating your workflows today.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <span>{success}</span>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl shadow-md shadow-primary-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  mode === 'login' ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={switchMode}
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                disabled={isLoading}
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
