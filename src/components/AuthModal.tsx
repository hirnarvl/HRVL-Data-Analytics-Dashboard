import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, UserCircle2, Phone, Check } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
import { useAuth } from '../contexts/AuthContext';
import { soundEngine } from '../utils/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInAsGuest } = useAuth();
  
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (isOpen && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    soundEngine.playClick();

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      soundEngine.playSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      soundEngine.playAlert();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    soundEngine.playClick();
    try {
      await signInWithGoogle();
      soundEngine.playSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      soundEngine.playAlert();
    }
  };

  const handleGuestSignIn = () => {
    setError('');
    soundEngine.playClick();
    try {
      signInAsGuest();
      soundEngine.playSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Guest sign-in failed');
      soundEngine.playAlert();
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    soundEngine.playClick();
    try {
      if (!confirmationResult) {
        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setConfirmationResult(result);
        soundEngine.playSuccess();
      } else {
        await confirmationResult.confirm(verificationCode);
        soundEngine.playSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      soundEngine.playAlert();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div id="recaptcha-container"></div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/d/1LzxKTsj6b4TO1aIyI-tAddDsR5QMYYom" 
                alt="HRVL Emblem" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain  filter drop-shadow-sm" 
              />
            </div>
            {isLogin ? 'Sign In to Dashboard' : 'Create an Account'}
          </h2>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {error && (
            <div className="p-3 text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 dark:border-slate-600 shadow-sm rounded-xl bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGuestSignIn}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-indigo-300 dark:border-indigo-700 shadow-sm rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
            title="Skip Firebase authentication and explore the dashboard as a guest. Useful on preview domains that are not yet authorized in the Firebase Console."
          >
            <UserCircle2 className="w-5 h-5" />
            Continue as Guest
          </button>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500 -mt-2">
            Guest mode bypasses Firebase login — perfect for preview/staging domains.
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${authMode === 'email' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Email & Password
            </button>
            <button
              onClick={() => setAuthMode('phone')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${authMode === 'phone' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Phone Number
            </button>
          </div>

          {authMode === 'email' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {!confirmationResult ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      placeholder="+251911000000"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Verification Code
                  </label>
                  <div className="relative">
                    <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      placeholder="123456"
                      required
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Processing...' : (!confirmationResult ? 'Send Code' : 'Verify Code')}
              </button>
            </form>
          )}

          {authMode === 'email' && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 cursor-pointer"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
